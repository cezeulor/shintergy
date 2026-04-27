from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
import uuid


class ContactInfo(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: str


class QuoteRequest(BaseModel):
    service_type: str
    rental_duration: str
    additional_services: List[str] = []
    location: str
    contact_info: ContactInfo


class Quote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_type: str
    rental_duration: str
    additional_services: List[str]
    location: str
    contact_info: ContactInfo
    base_price: float = 0.0
    gps_price: float = 0.0
    airtag_price: float = 0.0
    extra_insurance_price: float = 0.0
    total_price: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    pdf_generated: bool = False
    email_sent: bool = False


class QuoteResponse(BaseModel):
    success: bool
    quote_id: str
    total_price: float
    pdf_url: Optional[str] = None
    email_sent: bool
    message: str
