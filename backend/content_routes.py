"""Site content CRUD (single document for all editable texts, prices, etc.)."""
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from auth import get_current_admin

router = APIRouter(prefix="/api/content", tags=["content"])

CONTENT_KEY = "site_content_v1"


# Default seed content that mirrors /app/frontend/src/data/mock.js
DEFAULT_CONTENT: Dict[str, Any] = {
    "company": {
        "name": "Shíntergy",
        "tagline": "Renta de retroexcavadora Caterpillar con operador",
        "subtitle": "Más de 30 años de experiencia. Cobertura en Xalapa, Coatepec y zona conurbada.",
        "whatsapp": "+52 228 120 0243",
        "whatsappDigits": "522281200243",
        "email": "contacto@shintergy.com",
        "phone": "228 120 0243",
        "phoneDigits": "2281200243",
        "horarios": "Lun a Sáb · 8:00 am – 6:00 pm",
        "jornadaLaboral": "Jornada de 8 horas (7am – 4pm) con 1 hora de comida",
        "logo": "https://customer-assets.emergentagent.com/job_d72245cc-7a3d-410f-adc3-9ed7b232f5dd/artifacts/uukp3i9r_logo.jpg",
    },
    "social": {
        "instagram": "https://instagram.com/shintergy",
        "facebook": "https://facebook.com/shintergy",
        "tiktok": "https://tiktok.com/@shintergy",
    },
    "hero": {
        "badge": "Renta de retroexcavadora Caterpillar 420F2 IT",
        "titleStart": "Soluciones en",
        "titleHighlight": "construcción",
        "titleEnd": "con respaldo profesional",
        "subtitle": "Más de 30 años de experiencia rentando maquinaria pesada en Xalapa, Coatepec y zona conurbada. Operador, combustible y traslado incluidos.",
        "pills": ["Operador certificado", "Combustible incluido", "Traslado sin costo"],
        "stats": [
            {"number": "30+", "label": "Años del operador"},
            {"number": "500+", "label": "Obras completadas"},
            {"number": "12", "label": "Zonas de cobertura"},
        ],
    },
    "maquina": {
        "nombre": "Retroexcavadora Caterpillar 420F2 IT",
        "tipo": "Retroexcavadora 4x4",
        "marca": "Caterpillar",
        "modelo": "420F2 IT",
        "anio": 2016,
        "descripcionCorta": "Retroexcavadora 4x4 con operador certificado. Combustible y traslado incluidos. Lista para trabajar en Xalapa y la región.",
        "descripcionLarga": "Caterpillar 420F2 IT modelo 2016, ideal para excavación, carga, nivelación, apertura de caminos y demoliciones ligeras. Llega lista a tu obra: incluye operador con más de 30 años de experiencia, combustible y costo de traslado dentro de la zona de cobertura. Renta directa, sin intermediarios.",
        "imagenes": [
            "https://customer-assets.emergentagent.com/job_land-sales-pro/artifacts/asg9kro5_image.png",
            "https://customer-assets.emergentagent.com/job_land-sales-pro/artifacts/wa569y0r_image.png",
        ],
        "features": [
            "4x4 todo terreno",
            "Operador con 30+ años de experiencia",
            "Combustible incluido",
            "Traslado (flete) incluido",
            "Mantenimiento al día",
        ],
        "precios": {"dia": 5800, "semana": 31320, "mes": 120000},
        "preciosMostrar": {
            "dia": "$5,800",
            "semana": "$31,320",
            "mes": "$120,000",
        },
        "incluye": {
            "operador": "Sí · Más de 30 años de experiencia",
            "combustible": "Sí",
            "traslado": "Incluido (dentro de zona de cobertura)",
            "seguro": "Cobertura básica incluida",
        },
        "condiciones": {
            "deposito": "Anticipo del 50% para apartar fecha",
            "minimo": "1 día (8 horas)",
            "jornada": "7:00 am – 4:00 pm con 1 hora de comida",
            "reserva": "Reserva sujeta a disponibilidad. Confirmamos en el momento por WhatsApp.",
            "tarifaEspecial": "Tarifa preferencial para rentas de semana y mes completo (consulta).",
        },
        "requisitos": [
            "Identificación oficial vigente (INE / Pasaporte)",
            "Comprobante de domicilio reciente",
            "Anticipo del 50% al confirmar reserva",
            "Firma de contrato de renta",
        ],
    },
    "zonasCobertura": [
        "Xalapa", "Coatepec", "San Marcos", "Pacho", "La Orduña", "Briones",
        "La Pitaya", "El Grande", "Puerto Rico", "Las Lomas", "Mundo Nuevo", "Zimphizagua",
    ],
    "advantages": [
        {"id": 1, "title": "Operador certificado", "description": "Más de 30 años de experiencia al volante", "icon": "ShieldCheck"},
        {"id": 2, "title": "Combustible incluido", "description": "Sin sorpresas, todo en una sola cotización", "icon": "Zap"},
        {"id": 3, "title": "Traslado sin costo", "description": "Llevamos la máquina a tu obra sin cargo extra", "icon": "Route"},
        {"id": 4, "title": "Renta directa", "description": "Sin intermediarios, trato directo con el dueño", "icon": "FileCheck"},
        {"id": 5, "title": "Disponible 6 días", "description": "De lunes a sábado de 8 am a 6 pm", "icon": "CalendarClock"},
        {"id": 6, "title": "Cotización inmediata", "description": "Te respondemos en minutos por WhatsApp", "icon": "MessageSquare"},
    ],
    "workProcess": [
        {"id": 1, "step": "01", "title": "Solicita tu Cotización", "description": "Contáctanos por WhatsApp o llena el formulario", "icon": "MessageSquare"},
        {"id": 2, "step": "02", "title": "Apartas con 50%", "description": "Confirmamos disponibilidad y agendamos fecha", "icon": "CalendarCheck"},
        {"id": 3, "step": "03", "title": "Llegamos a tu obra", "description": "Nuestro operador realiza el trabajo profesionalmente", "icon": "CheckCircle2"},
    ],
    "galleryImages": [
        {"id": 1, "url": "https://customer-assets.emergentagent.com/job_land-sales-pro/artifacts/asg9kro5_image.png", "title": "Retroexcavadora 420F2 IT", "category": "Caterpillar"},
        {"id": 2, "url": "https://customer-assets.emergentagent.com/job_land-sales-pro/artifacts/wa569y0r_image.png", "title": "Vista frontal", "category": "Caterpillar"},
        {"id": 3, "url": "https://images.unsplash.com/photo-1628645419184-26a1f2757340", "title": "Excavación profesional", "category": "Trabajos"},
        {"id": 4, "url": "https://images.unsplash.com/photo-1649807533255-bbc9c9fb7d77", "title": "Nivelación de terreno", "category": "Trabajos"},
        {"id": 5, "url": "https://images.pexels.com/photos/4523602/pexels-photo-4523602.jpeg", "title": "Apertura de caminos", "category": "Trabajos"},
        {"id": 6, "url": "https://images.unsplash.com/photo-1630288214173-a119cf823388", "title": "En obra", "category": "Trabajos"},
    ],
}


async def seed_content(db) -> None:
    existing = await db.site_content.find_one({"key": CONTENT_KEY})
    if not existing:
        await db.site_content.insert_one(
            {
                "key": CONTENT_KEY,
                "data": DEFAULT_CONTENT,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        )


@router.get("")
async def get_content(request: Request):
    db = request.state.db
    doc = await db.site_content.find_one({"key": CONTENT_KEY}, {"_id": 0})
    if not doc:
        await seed_content(db)
        doc = await db.site_content.find_one({"key": CONTENT_KEY}, {"_id": 0})
    return doc.get("data", DEFAULT_CONTENT)


class ContentUpdate(BaseModel):
    data: Dict[str, Any]


@router.put("")
async def update_content(
    request: Request,
    body: ContentUpdate,
    admin: dict = Depends(get_current_admin),
):
    db = request.state.db
    if not isinstance(body.data, dict):
        raise HTTPException(status_code=400, detail="Invalid payload")
    await db.site_content.update_one(
        {"key": CONTENT_KEY},
        {
            "$set": {
                "data": body.data,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": admin["username"],
            }
        },
        upsert=True,
    )
    return {"success": True}


@router.post("/reset")
async def reset_content(
    request: Request, admin: dict = Depends(get_current_admin)
):
    db = request.state.db
    await db.site_content.update_one(
        {"key": CONTENT_KEY},
        {"$set": {"data": DEFAULT_CONTENT, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"success": True, "data": DEFAULT_CONTENT}
