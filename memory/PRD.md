# Shíntergy — PRD

## Original Problem Statement
El usuario subió una página existente de Shíntergy (renta de maquinaria pesada) y pidió:
1. Mejorar la página con animaciones y efectos 3D inspirados en ui-ux-pro-max-skill (GitHub).
2. Mover toda la sección de venta de terrenos a una **subpágina** dedicada (no en la landing) con un botón desde el inicio.
3. Dejar **solamente la Retroexcavadora Caterpillar 420F2 IT** (eliminar volteo, nivelación, apertura, acarreos).
4. Actualizar info: tel 228 120 0243, horario 8-6 pm, precios día/semana/mes 5800/31320/120000, incluye operador (30+ años exp), combustible y traslado, anticipo 50%, mínimo 1 día (jornada 7-4pm con 1h comida), cobertura en Coatepec/Xalapa/San Marcos/Pacho/La Orduña/Briones/La Pitaya/El Grande/Puerto Rico/Las Lomas/Mundo Nuevo/Zimphizagua, requisitos: ID, comprobante de domicilio, anticipo, contrato.
5. Agregar terrenos de ejemplo cerca de Xalapa (no tienen reales aún).

## Tech Stack
- Frontend: React 19 + react-router-dom + Tailwind CSS + shadcn/ui + framer-motion
- Backend: FastAPI + MongoDB + reportlab (PDFs) + resend (email)
- Routing: `/` (Home) y `/terrenos` (subpágina)

## What's been implemented (Apr 2026)

### Landing page (`/`)
- **Header** sticky con blur, navegación: Maquinaria, Ventajas, Proceso, Galería, **Terrenos** (link a subpágina), Contacto, teléfono 228 120 0243, CTA "Cotizar Ahora".
- **HeroSection** con parallax 3D mouse-tracked, perspectiva, glows flotantes, chip lateral con teléfono y horarios. Botón "Ver maquinaria y precios" + "Solicitar información" (WhatsApp). Link adicional a /terrenos.
- **MaquinariaSection** dedicada solo a la Caterpillar 420F2 IT:
  - Carrusel de 2 fotos reales subidas por el usuario
  - Specs: Marca, Modelo, Año 2016, Tipo
  - Precios card con badge "Mejor precio" en mensual ($5,800 / $31,320 / $120,000)
  - "¿Qué incluye?" (operador 30+ años, combustible, traslado, seguro)
  - 3 cards: Condiciones de renta, Requisitos del cliente, Zonas de cobertura (12 chips)
  - 3D tilt en imagen + scroll reveal
- **AdvantagesSection** actualizada con 6 ventajas reales (operador, combustible, traslado, renta directa, disponibilidad 6 días, cotización inmediata).
- **ProcessSection** simplificado (solicita / aparta 50% / llegamos a obra).
- **TerrenosCTA** banner con CTA "Ver terrenos disponibles" → `/terrenos`.
- **GallerySection** con fotos reales de la máquina + obras.
- **PresenceSection** con redes sociales.
- **Footer** con teléfono, email, horarios, lista de zonas, links.
- **WhatsApp button** flotante con mensaje prellenado.
- **ChatWidget** simplificado (solo 1 máquina, sin selector de servicio).

### Subpágina `/terrenos`
- **Hero** propio con botón "Volver al inicio", chip flotante "Plusvalía +9%".
- **TerrenosSection** con 6 terrenos cerca de Xalapa (Coatepec, Xico, Banderilla, Naolinco, Tlalnelhuayocan, Emiliano Zapata). Filtros (Todos/Destacados/Campestres/Habitacional). 3D tilt + reveal.
- **TerrenoDetailModal**: galería con carrusel (4 imgs), info completa (precio, superficie, frente×fondo, uso de suelo), descripción, servicios disponibles, mapa Google embed, puntos cercanos, **simulador de pago en vivo** (sliders enganche 10-70%, plazo 6-60 meses), formulario de leads con WhatsApp, CTA WhatsApp.
- **TrustSection** con escrituras, beneficios y stats (15+ años, 500+ familias, 9% plusvalía).
- **TestimonialsSection** con 3 testimonios.
- **LeadFormSection** con formulario de captura (nombre, teléfono, WhatsApp).

### Animaciones / 3D Effects implementados
- Parallax mouse-tracked en hero (background, glows, perspective tilt)
- 3D tilt cards (mouse-tracked perspective) en cards de terrenos, maquinaria, testimonios y banner CTA
- Scroll-triggered reveals con framer-motion (whileInView)
- Shine sweep en cards al hover
- Floating chip animation
- Glassmorphism (backdrop-blur) en header, badges y modales
- Smooth carousel con fade transitions

### SEO
- Meta description, keywords, OG tags, Twitter cards, geo tags México-Veracruz
- Title actualizado: "Shíntergy | Terrenos con escrituras en Xalapa, Veracruz desde $180,000"
- Subpágina `/terrenos` actualiza title dinámicamente

### Backend
- PRICING dict actualizado: `{'retroexcavadora': {'day': 5800, 'week': 31320, 'month': 120000}}`
- Cotizaciones en MongoDB, PDFs y email vía Resend (si key disponible)

## Test results (iteration 3)
- Backend: 7/7 (100%)
- Frontend: todas las pruebas críticas pasan en desktop y mobile (390px)
- Sin issues críticos ni menores

## Backlog / P1
- Reemplazar imágenes de Unsplash de los terrenos con fotos reales cuando el usuario las tenga
- Agregar URLs reales de redes sociales (actualmente placeholders)
- Configurar API key de Resend para email funcional
- Considerar agregar tracking de eventos en clics WhatsApp para medir conversión

## P2 / Future
- Página de detalle de terreno con URL propia (`/terrenos/:slug`) para SEO directo
- Dashboard admin para crear/editar terrenos
- Integración de pagos (Stripe/MercadoPago) para apartado online
