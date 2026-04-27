from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
import os

from models.quote import QuoteRequest, Quote, QuoteResponse
from services.pdf_generator import PDFGenerator
from services.email_service import EmailService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/quotes", tags=["quotes"])

# Servicios
pdf_generator = PDFGenerator()
email_service = EmailService()

# Precios base - Usuario debe configurar
PRICING = {
    'volteo': {'day': 2500, 'week': 15000, 'month': 50000},
    'retroexcavadora': {'day': 3500, 'week': 21000, 'month': 70000},
    'nivelacion': {'day': 3000, 'week': 18000, 'month': 60000},
    'apertura': {'day': 4000, 'week': 24000, 'month': 80000},
    'acarreos': {'day': 2000, 'week': 12000, 'month': 40000},
    'gps': 400,  # por mes
    'airtag': 200,  # por mes
    'seguro_extra': 500  # por mes
}


def calculate_pricing(service_type: str, duration: str, additional_services: list) -> dict:
    """Calcula los precios de la cotización"""
    
    # Precio base del servicio
    base_price = PRICING.get(service_type, {}).get(duration, 0)
    
    # Precios de servicios adicionales
    gps_price = PRICING['gps'] if 'gps' in additional_services else 0
    airtag_price = PRICING['airtag'] if 'airtag' in additional_services else 0
    insurance_price = PRICING['seguro_extra'] if 'seguro_extra' in additional_services else 0
    
    # Total
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


@router.post("/create", response_model=QuoteResponse)
async def create_quote(quote_request: QuoteRequest, db: AsyncIOMotorDatabase):
    """
    Crea una nueva cotización, genera PDF y envía email
    """
    try:
        logger.info(f"Creating quote for {quote_request.contact_info.name}")
        
        # Calcular precios
        pricing = calculate_pricing(
            quote_request.service_type,
            quote_request.rental_duration,
            quote_request.additional_services
        )
        
        # Crear objeto Quote
        quote = Quote(
            service_type=quote_request.service_type,
            rental_duration=quote_request.rental_duration,
            additional_services=quote_request.additional_services,
            location=quote_request.location,
            contact_info=quote_request.contact_info,
            **pricing
        )
        
        # Guardar en MongoDB
        quote_dict = quote.dict()
        await db.quotes.insert_one(quote_dict)
        logger.info(f"Quote saved to database: {quote.id}")
        
        # Generar PDF
        try:
            pdf_path = pdf_generator.generate_quote_pdf(quote_dict)
            quote_dict['pdf_generated'] = True
            logger.info(f"PDF generated: {pdf_path}")
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            pdf_path = None
        
        # Enviar email al cliente
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
        else:
            logger.warning(f"Email failed: {email_result.get('error')}")
        
        # Enviar notificación interna
        await email_service.send_notification_email(quote_dict)
        
        # Actualizar en DB
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
        raise HTTPException(status_code=500, detail=f"Error al crear cotización: {str(e)}")


@router.get("/{quote_id}")
async def get_quote(quote_id: str, db: AsyncIOMotorDatabase):
    """Obtiene una cotización por ID"""
    quote = await db.quotes.find_one({'id': quote_id}, {'_id': 0})
    
    if not quote:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    
    return quote


@router.get("/")
async def list_quotes(db: AsyncIOMotorDatabase, limit: int = 50, skip: int = 0):
    """Lista todas las cotizaciones con paginación"""
    quotes = await db.quotes.find({}, {'_id': 0}).sort('created_at', -1).skip(skip).limit(limit).to_list(None)
    total = await db.quotes.count_documents({})
    
    return {
        'quotes': quotes,
        'total': total,
        'limit': limit,
        'skip': skip
    }
