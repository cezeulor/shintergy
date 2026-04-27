// Datos de ejemplo de terrenos cerca de Xalapa, Veracruz
// Imagen base: panorámicas/drones de terrenos rurales y fraccionamientos

export const terrenos = [
  {
    id: "t1",
    slug: "coatepec-valle-niebla",
    nombre: "Valle de Niebla",
    ubicacion: "Coatepec, Veracruz",
    distanciaXalapa: "18 km de Xalapa",
    precio: 385000,
    precioFormateado: "$385,000 MXN",
    superficie: 250,
    frente: 10,
    fondo: 25,
    usoSuelo: "Habitacional / Campestre",
    escrituras: true,
    destacado: true,
    etiqueta: "Más vendido",
    descripcionCorta:
      "Terreno con vista a la montaña rodeado de cafetales. Clima fresco todo el año a 15 minutos de Xalapa.",
    descripcionLarga:
      "Un espacio único para construir la casa de tus sueños entre bosques de niebla y cafetales centenarios. Acceso pavimentado hasta el fraccionamiento, escrituración inmediata y vigilancia 24/7. Ideal para vivir, rentar o invertir.",
    servicios: ["agua", "luz", "escrituras", "caminos-pavimentados", "vigilancia"],
    imagenes: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600",
    ],
    mapaEmbed:
      "https://www.google.com/maps?q=Coatepec,Veracruz&output=embed",
    coordenadas: { lat: 19.4524, lng: -96.9613 },
    puntosCercanos: [
      { nombre: "Centro de Coatepec", distancia: "5 min" },
      { nombre: "Parque Nacional Cofre de Perote", distancia: "35 min" },
      { nombre: "Xalapa (centro)", distancia: "25 min" },
      { nombre: "Hospital Ángeles", distancia: "20 min" },
    ],
  },
  {
    id: "t2",
    slug: "xico-mirador-cascada",
    nombre: "Mirador La Cascada",
    ubicacion: "Xico, Veracruz",
    distanciaXalapa: "24 km de Xalapa",
    precio: 520000,
    precioFormateado: "$520,000 MXN",
    superficie: 400,
    frente: 16,
    fondo: 25,
    usoSuelo: "Habitacional / Turístico",
    escrituras: true,
    destacado: false,
    etiqueta: "Vista panorámica",
    descripcionCorta:
      "Lote con vista directa a la cascada de Texolo, en uno de los Pueblos Mágicos más bellos de Veracruz.",
    descripcionLarga:
      "Terreno con vista privilegiada a la cascada de Texolo, ideal para cabaña, Airbnb o residencia de descanso. Zona consolidada con alta demanda turística y plusvalía anual del 9%.",
    servicios: ["agua", "luz", "escrituras", "drenaje"],
    imagenes: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600",
    ],
    mapaEmbed: "https://www.google.com/maps?q=Xico,Veracruz&output=embed",
    coordenadas: { lat: 19.4234, lng: -97.0031 },
    puntosCercanos: [
      { nombre: "Cascada de Texolo", distancia: "3 min" },
      { nombre: "Centro de Xico", distancia: "10 min" },
      { nombre: "Xalapa (centro)", distancia: "30 min" },
      { nombre: "Autopista Xalapa-Veracruz", distancia: "20 min" },
    ],
  },
  {
    id: "t3",
    slug: "banderilla-altavista",
    nombre: "Altavista Residencial",
    ubicacion: "Banderilla, Veracruz",
    distanciaXalapa: "7 km de Xalapa",
    precio: 295000,
    precioFormateado: "$295,000 MXN",
    superficie: 180,
    frente: 9,
    fondo: 20,
    usoSuelo: "Habitacional",
    escrituras: true,
    destacado: true,
    etiqueta: "Oferta",
    descripcionCorta:
      "Fraccionamiento nuevo con todos los servicios, a 10 minutos del centro de Xalapa.",
    descripcionLarga:
      "Lote en fraccionamiento privado con caseta de vigilancia, calles pavimentadas y áreas verdes. Perfecto para familias jóvenes que buscan tranquilidad cerca de la ciudad.",
    servicios: ["agua", "luz", "escrituras", "drenaje", "caminos-pavimentados", "vigilancia"],
    imagenes: [
      "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=1600",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1600",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1600",
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1600",
    ],
    mapaEmbed: "https://www.google.com/maps?q=Banderilla,Veracruz&output=embed",
    coordenadas: { lat: 19.5917, lng: -96.9317 },
    puntosCercanos: [
      { nombre: "Plaza Crystal", distancia: "8 min" },
      { nombre: "UV Xalapa", distancia: "12 min" },
      { nombre: "Hospital Regional", distancia: "15 min" },
      { nombre: "Autopista México-Veracruz", distancia: "5 min" },
    ],
  },
  {
    id: "t4",
    slug: "naolinco-bosques",
    nombre: "Bosques de Naolinco",
    ubicacion: "Naolinco, Veracruz",
    distanciaXalapa: "32 km de Xalapa",
    precio: 220000,
    precioFormateado: "$220,000 MXN",
    superficie: 500,
    frente: 20,
    fondo: 25,
    usoSuelo: "Campestre",
    escrituras: true,
    destacado: false,
    etiqueta: "Gran superficie",
    descripcionCorta:
      "Terreno amplio rodeado de naturaleza en el Pueblo Mágico de Naolinco. Ideal para casa de campo.",
    descripcionLarga:
      "Medio lote de hectárea con árboles frutales, ojo de agua natural y vistas espectaculares. La zona cuenta con clima templado y alta plusvalía turística.",
    servicios: ["agua", "luz", "escrituras"],
    imagenes: [
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600",
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=1600",
    ],
    mapaEmbed: "https://www.google.com/maps?q=Naolinco,Veracruz&output=embed",
    coordenadas: { lat: 19.6583, lng: -96.8683 },
    puntosCercanos: [
      { nombre: "Centro de Naolinco", distancia: "8 min" },
      { nombre: "Cascada de Naolinco", distancia: "15 min" },
      { nombre: "Xalapa (centro)", distancia: "40 min" },
    ],
  },
  {
    id: "t5",
    slug: "tlalnelhuayocan-mirador",
    nombre: "Mirador del Bosque",
    ubicacion: "Tlalnelhuayocan, Veracruz",
    distanciaXalapa: "9 km de Xalapa",
    precio: 450000,
    precioFormateado: "$450,000 MXN",
    superficie: 300,
    frente: 12,
    fondo: 25,
    usoSuelo: "Habitacional / Ecológico",
    escrituras: true,
    destacado: true,
    etiqueta: "Premium",
    descripcionCorta:
      "Lote premium en zona residencial ecológica con bosque mesófilo y aire más puro de la región.",
    descripcionLarga:
      "Fraccionamiento ecológico con densidad baja de construcción, áreas comunes y senderos. A pocos minutos del centro universitario y rodeado de reservas naturales.",
    servicios: ["agua", "luz", "escrituras", "caminos-pavimentados", "vigilancia", "internet"],
    imagenes: [
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600",
      "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=1600",
    ],
    mapaEmbed:
      "https://www.google.com/maps?q=Tlalnelhuayocan,Veracruz&output=embed",
    coordenadas: { lat: 19.5236, lng: -96.9836 },
    puntosCercanos: [
      { nombre: "USBI UV", distancia: "10 min" },
      { nombre: "Macuiltépetl", distancia: "15 min" },
      { nombre: "Xalapa (centro)", distancia: "15 min" },
      { nombre: "Santuario del Bosque de Niebla", distancia: "5 min" },
    ],
  },
  {
    id: "t6",
    slug: "emiliano-zapata-lomas",
    nombre: "Lomas de Emiliano Zapata",
    ubicacion: "Emiliano Zapata, Veracruz",
    distanciaXalapa: "15 km de Xalapa",
    precio: 180000,
    precioFormateado: "$180,000 MXN",
    superficie: 200,
    frente: 10,
    fondo: 20,
    usoSuelo: "Habitacional",
    escrituras: true,
    destacado: false,
    etiqueta: "Accesible",
    descripcionCorta:
      "Terreno económico con excelente conectividad a Xalapa por la carretera federal.",
    descripcionLarga:
      "Una gran oportunidad de inversión. Lote plano, listo para construir, con documentos en regla y pagos accesibles desde $1,500 al mes.",
    servicios: ["agua", "luz", "escrituras"],
    imagenes: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1600",
    ],
    mapaEmbed:
      "https://www.google.com/maps?q=Emiliano+Zapata,Veracruz&output=embed",
    coordenadas: { lat: 19.4383, lng: -96.7833 },
    puntosCercanos: [
      { nombre: "Plaza Américas", distancia: "15 min" },
      { nombre: "Xalapa (centro)", distancia: "20 min" },
      { nombre: "Autopista Xalapa-Veracruz", distancia: "5 min" },
    ],
  },
];

export const testimoniosTerrenos = [
  {
    id: 1,
    nombre: "María Fernanda Hernández",
    ubicacion: "Coatepec, Veracruz",
    texto:
      "Compré mi terreno en Valle de Niebla hace 8 meses y ya vi subir su valor. Todo el proceso fue transparente y las escrituras llegaron a tiempo.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=47",
    proyecto: "Valle de Niebla",
  },
  {
    id: 2,
    nombre: "Roberto Castillo",
    ubicacion: "Xalapa, Veracruz",
    texto:
      "Excelente atención. Me apoyaron con financiamiento sin intereses y me acompañaron a recorrer cada lote antes de decidir.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
    proyecto: "Altavista Residencial",
  },
  {
    id: 3,
    nombre: "Lucía Ramírez",
    ubicacion: "Ciudad de México",
    texto:
      "Invertí desde CDMX con total tranquilidad. Las videollamadas y la entrega de escrituras fueron impecables. Ya recomendé a 3 amigos.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=32",
    proyecto: "Mirador La Cascada",
  },
];

export const beneficiosCompra = [
  {
    titulo: "Escrituras garantizadas",
    descripcion:
      "Entregamos escrituración individual notariada. Sin letras chiquitas.",
    icon: "FileCheck2",
  },
  {
    titulo: "Proceso transparente",
    descripcion:
      "Visita el terreno antes de comprar. Cotización clara, sin comisiones ocultas.",
    icon: "Eye",
  },
  {
    titulo: "Financiamiento propio",
    descripcion:
      "Enganche flexible y mensualidades a tu medida, sin bancos ni intereses excesivos.",
    icon: "HandCoins",
  },
  {
    titulo: "Respaldo legal",
    descripcion:
      "Revisión jurídica en cada operación. 15+ años respaldando a nuestros clientes.",
    icon: "ShieldCheck",
  },
];

export const serviciosTerreno = {
  agua: { label: "Agua potable", icon: "Droplets" },
  luz: { label: "Luz eléctrica", icon: "Zap" },
  drenaje: { label: "Drenaje", icon: "PipetteIcon" },
  escrituras: { label: "Escrituras", icon: "FileCheck2" },
  "caminos-pavimentados": { label: "Caminos pavimentados", icon: "Route" },
  vigilancia: { label: "Vigilancia 24/7", icon: "ShieldCheck" },
  internet: { label: "Fibra óptica", icon: "Wifi" },
};
