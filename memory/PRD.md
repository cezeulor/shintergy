# PRD - Shíntergy Landing Page

## Problema Original
Diseñar una landing page moderna, minimalista y elegante para Shíntergy, empresa de construcción y bienes raíces enfocada en renta de maquinaria pesada y servicios de obra, con sistema de cotización automatizado.

## Arquitectura
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + Python
- **Base de datos**: MongoDB
- **Integraciones**: Resend (email) + ReportLab (PDF generation)

## User Personas
1. **Contratistas/Constructores**: Necesitan rentar maquinaria pesada para proyectos
2. **Desarrolladores inmobiliarios**: Requieren servicios de nivelación y apertura de caminos
3. **Empresas de construcción**: Buscan soluciones integrales con maquinaria equipada

## Features Implementados (Fecha: 2025-12-XX)

### ✅ Frontend Completo
- Header con logo, navegación smooth scroll, responsive mobile
- Hero Section con imagen dramática, CTAs, estadísticas
- 5 Servicios con imágenes profesionales
- Opciones de Renta (día/semana/mes)
- Ventajas (GPS, seguro, cotización segura)
- Proceso de trabajo en 3 pasos
- Presencia en redes sociales
- Galería con lightbox (6 imágenes)
- **Chat Widget interactivo tipo WhatsApp**
- Footer completo
- Botón flotante de WhatsApp

### ✅ Backend Completo (NUEVO)
- **MongoDB Models**: Quote model con toda la información
- **API Endpoints**:
  - `POST /api/quotes/create` - Crea cotización, genera PDF, envía email
  - `GET /api/quotes/{quote_id}` - Obtiene cotización por ID
  - `GET /api/quotes` - Lista cotizaciones con paginación

### ✅ Integración Resend (Email)
- Servicio de email configurado
- Email HTML profesional con diseño de marca
- Adjuntos de PDF automáticos
- Notificaciones internas al admin
- Templates responsive

### ✅ Generación de PDF
- PDFs profesionales con ReportLab
- Incluye logo de Shíntergy
- Desglose detallado de precios
- Términos y condiciones
- Información de contacto
- Formato profesional con colores de marca

### ✅ Chat Widget → PDF → Email (Flow Completo)
1. Usuario completa chat interactivo
2. Backend calcula precios automáticamente
3. Genera PDF profesional
4. Envía email con PDF adjunto
5. Guarda cotización en MongoDB
6. Notifica al admin

## Sistema de Precios Configurado

```python
PRICING = {
    'volteo': {'day': 2500, 'week': 15000, 'month': 50000},
    'retroexcavadora': {'day': 3500, 'week': 21000, 'month': 70000},
    'nivelacion': {'day': 3000, 'week': 18000, 'month': 60000},
    'apertura': {'day': 4000, 'week': 24000, 'month': 80000},
    'acarreos': {'day': 2000, 'week': 12000, 'month': 40000},
    'gps': 400,  # mensual
    'airtag': 200,  # mensual
    'seguro_extra': 500  # mensual
}
```

Cálculo automático: Subtotal + IVA (16%) = Total

## Archivos Clave

### Backend
- `/app/backend/server.py` - Servidor principal con endpoints
- `/app/backend/models/quote.py` - Modelos Pydantic
- `/app/backend/services/pdf_generator.py` - Generación de PDFs
- `/app/backend/services/email_service.py` - Servicio Resend
- `/app/backend/generated_pdfs/` - PDFs generados

### Frontend
- `/app/frontend/src/components/ChatWidget.jsx` - Chat interactivo (integrado con backend)
- `/app/frontend/src/data/mock.js` - Datos de servicios e imágenes

## Variables de Entorno Requeridas

### Backend `.env`
```
RESEND_API_KEY="re_..." # Usuario debe proporcionar
SENDER_EMAIL="onboarding@resend.dev"
ADMIN_EMAIL="contacto@shintergy.com"
```

## Configuración Pendiente

1. **API Key de Resend**: Usuario debe obtener de https://resend.com
2. **Información de Contacto**: Actualizar en `/app/frontend/src/data/mock.js`:
   - WhatsApp
   - Email
   - Enlaces de redes sociales

## Testing Requerido

- ✅ Frontend visual
- ⏳ Chat widget end-to-end
- ⏳ Generación de PDF
- ⏳ Envío de emails
- ⏳ Guardado en MongoDB

## Next Steps

1. 🔄 Usuario proporciona API Key de Resend
2. ⏳ Testing completo con testing_agent_v3
3. ⏳ Actualizar información de contacto
4. ⏳ Verificar recepción de emails
5. ⏳ Deploy

## Mejoras Futuras (P2)
- Panel admin para ver cotizaciones
- Dashboard con analytics
- Sistema de seguimiento de leads
- Integración con CRM
- Calculadora de costos en tiempo real
- Chat en vivo
