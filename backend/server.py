from fastapi import FastAPI, APIRouter, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Dependency to inject database into routes
@app.middleware("http")
async def add_db_to_request(request: Request, call_next):
    request.state.db = db
    response = await call_next(request)
    return response


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).sort("timestamp", -1).limit(50).to_list(None)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Import and setup quote routes
from models.quote import QuoteRequest, QuoteResponse
from services.pdf_generator import PDFGenerator
from services.email_service import EmailService

pdf_generator = PDFGenerator()
email_service = EmailService()

# Precios base - Usuario debe configurar
PRICING = {
    'retroexcavadora': {'day': 5800, 'week': 31320, 'month': 120000},
    'gps': 0,
    'airtag': 0,
    'seguro_extra': 0
}

def calculate_pricing(service_type: str, duration: str, additional_services: list) -> dict:
    base_price = PRICING.get(service_type, {}).get(duration, 0)
    gps_price = PRICING['gps'] if 'gps' in additional_services else 0
    airtag_price = PRICING['airtag'] if 'airtag' in additional_services else 0
    insurance_price = PRICING['seguro_extra'] if 'seguro_extra' in additional_services else 0
    
    subtotal = base_price + gps_price + airtag_price + insurance_price
    iva = subtotal * 0.16
    total = subtotal + iva
    
    return {
        'base_price': base_price,
        'gps_price': gps_price,
        'airtag_price': airtag_price,
        'extra_insurance_price': insurance_price,
        'total_price': round(total, 2)
    }

@api_router.post("/quotes/create", response_model=QuoteResponse)
async def create_quote(quote_request: QuoteRequest):
    from models.quote import Quote
    try:
        logger.info(f"Creating quote for {quote_request.contact_info.name}")
        
        pricing = calculate_pricing(
            quote_request.service_type,
            quote_request.rental_duration,
            quote_request.additional_services
        )
        
        quote = Quote(
            service_type=quote_request.service_type,
            rental_duration=quote_request.rental_duration,
            additional_services=quote_request.additional_services,
            location=quote_request.location,
            contact_info=quote_request.contact_info,
            **pricing
        )
        
        quote_dict = quote.dict()
        await db.quotes.insert_one(quote_dict)
        logger.info(f"Quote saved to database: {quote.id}")
        
        try:
            pdf_path = pdf_generator.generate_quote_pdf(quote_dict)
            quote_dict['pdf_generated'] = True
            logger.info(f"PDF generated: {pdf_path}")
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            pdf_path = None
        
        email_result = await email_service.send_quote_email(
            recipient_email=quote.contact_info.email,
            recipient_name=quote.contact_info.name,
            quote_id=quote.id,
            service_type=quote.service_type,
            total_price=quote.total_price,
            pdf_path=pdf_path
        )
        
        if email_result.get('success'):
            quote_dict['email_sent'] = True
            logger.info(f"Email sent successfully to {quote.contact_info.email}")
        
        await email_service.send_notification_email(quote_dict)
        
        await db.quotes.update_one(
            {'id': quote.id},
            {'$set': {
                'pdf_generated': quote_dict.get('pdf_generated', False),
                'email_sent': quote_dict.get('email_sent', False)
            }}
        )
        
        return QuoteResponse(
            success=True,
            quote_id=quote.id,
            total_price=quote.total_price,
            pdf_url=f"/api/quotes/{quote.id}/pdf" if pdf_path else None,
            email_sent=email_result.get('success', False),
            message="Cotización creada y enviada exitosamente" if email_result.get('success') else "Cotización creada pero el email falló"
        )
        
    except Exception as e:
        logger.error(f"Error creating quote: {str(e)}")
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Error al crear cotización: {str(e)}")

@api_router.get("/quotes/{quote_id}")
async def get_quote(quote_id: str):
    quote = await db.quotes.find_one({'id': quote_id}, {'_id': 0})
    if not quote:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    return quote

@api_router.get("/quotes")
async def list_quotes(limit: int = 50, skip: int = 0):
    quotes = await db.quotes.find({}, {'_id': 0}).sort('created_at', -1).skip(skip).limit(limit).to_list(None)
    total = await db.quotes.count_documents({})
    return {'quotes': quotes, 'total': total, 'limit': limit, 'skip': skip}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()