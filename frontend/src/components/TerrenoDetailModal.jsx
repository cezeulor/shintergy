import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
  Tag,
  Droplets,
  Zap,
  Route,
  ShieldCheck,
  FileCheck2,
  Wifi,
  Calculator,
  MessageCircle,
  Send,
  Trees,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import { companyInfo } from "../data/mock";
import { serviciosTerreno } from "../data/terrenos";

const serviceIconMap = {
  Droplets,
  Zap,
  Route,
  ShieldCheck,
  FileCheck2,
  Wifi,
  PipetteIcon: Droplets,
};

const currency = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

export const TerrenoDetailModal = ({ terreno, onClose }) => {
  const [idx, setIdx] = useState(0);
  const [enganchePct, setEnganchePct] = useState(30);
  const [plazoMeses, setPlazoMeses] = useState(24);
  const [lead, setLead] = useState({ nombre: "", telefono: "", whatsapp: "" });

  useEffect(() => {
    if (!terreno) return;
    document.body.style.overflow = "hidden";
    setIdx(0);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setIdx((v) => (v + 1) % terreno.imagenes.length);
      if (e.key === "ArrowLeft")
        setIdx((v) => (v - 1 + terreno.imagenes.length) % terreno.imagenes.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [terreno, onClose]);

  const calc = useMemo(() => {
    if (!terreno) return null;
    const enganche = Math.round((terreno.precio * enganchePct) / 100);
    const resto = terreno.precio - enganche;
    const mensualidad = Math.round(resto / plazoMeses);
    return { enganche, resto, mensualidad };
  }, [terreno, enganchePct, plazoMeses]);

  if (!terreno) return null;

  const waNumber = companyInfo.whatsapp.replace(/[^0-9]/g, "");

  const openWhatsApp = (custom) => {
    const msg = encodeURIComponent(
      custom ||
        `Hola, me interesa el terreno "${terreno.nombre}" en ${terreno.ubicacion} (${terreno.precioFormateado}). ¿Me puedes dar más información?`
    );
    window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
  };

  const handleLead = (e) => {
    e.preventDefault();
    if (!lead.nombre || !lead.telefono) {
      toast.error("Por favor completa al menos nombre y teléfono");
      return;
    }
    toast.success("¡Listo! Te enviaremos ubicación exacta y precios actualizados.");
    openWhatsApp(
      `Hola, soy ${lead.nombre}. Mi tel/WhatsApp es ${
        lead.whatsapp || lead.telefono
      }. Me interesa el terreno "${terreno.nombre}". ¿Me envían la información?`
    );
    setLead({ nombre: "", telefono: "", whatsapp: "" });
  };

  const next = () => setIdx((i) => (i + 1) % terreno.imagenes.length);
  const prev = () =>
    setIdx((i) => (i - 1 + terreno.imagenes.length) % terreno.imagenes.length);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch md:items-center md:justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      data-testid="terreno-detail-modal"
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      />

      {/* panel */}
      <div className="relative bg-white md:rounded-3xl w-full md:max-w-6xl max-h-screen md:max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500">
        {/* Close */}
        <button
          onClick={onClose}
          data-testid="close-detail-modal"
          className="absolute top-3 right-3 z-20 bg-white/95 hover:bg-white p-2 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>

        {/* Gallery carousel */}
        <div className="relative h-[300px] md:h-[440px] bg-gray-900 overflow-hidden md:rounded-t-3xl">
          {terreno.imagenes.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${terreno.nombre} ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full p-2 shadow-lg transition-transform hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full p-2 shadow-lg transition-transform hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {terreno.imagenes.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-8 bg-white" : "w-2 bg-white/60"
                }`}
                aria-label={`Imagen ${i + 1}`}
              />
            ))}
          </div>

          {/* Header on image */}
          <div className="absolute bottom-5 left-5 right-14 text-white">
            {terreno.etiqueta && (
              <Badge className="bg-[#c9a961] mb-2 border-0">{terreno.etiqueta}</Badge>
            )}
            <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
              {terreno.nombre}
            </h2>
            <div className="flex items-center gap-1 text-sm md:text-base mt-1 text-gray-100">
              <MapPin className="h-4 w-4" />
              {terreno.ubicacion} · {terreno.distanciaXalapa}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-10 grid lg:grid-cols-5 gap-8">
          {/* LEFT column: info */}
          <div className="lg:col-span-3 space-y-8">
            {/* Price & summary */}
            <div className="bg-gradient-to-br from-[#1a5336] to-[#14432c] text-white rounded-2xl p-6 md:p-7 shadow-xl">
              <div className="flex flex-wrap items-baseline gap-3">
                <div className="text-xs uppercase tracking-wider text-[#c9a961]">
                  Precio contado
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold mt-1">
                {terreno.precioFormateado}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-[11px] text-gray-300 flex items-center gap-1">
                    <Maximize2 className="h-3 w-3" /> Superficie
                  </div>
                  <div className="text-lg font-semibold">{terreno.superficie} m²</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-[11px] text-gray-300">Frente × Fondo</div>
                  <div className="text-lg font-semibold">
                    {terreno.frente} × {terreno.fondo} m
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-[11px] text-gray-300 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Uso de suelo
                  </div>
                  <div className="text-sm font-semibold leading-tight">
                    {terreno.usoSuelo}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-[#1a5336] mb-3 flex items-center gap-2">
                <Trees className="h-6 w-6 text-[#c9a961]" />
                Sobre este terreno
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {terreno.descripcionLarga}
              </p>
            </div>

            {/* Services available */}
            <div>
              <h3 className="text-xl font-bold text-[#1a5336] mb-4">
                Servicios disponibles
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {terreno.servicios.map((s) => {
                  const meta = serviciosTerreno[s];
                  const Icon = serviceIconMap[meta?.icon] || CheckCircle2;
                  return (
                    <div
                      key={s}
                      className="flex items-center gap-2 bg-[#1a5336]/5 border border-[#1a5336]/10 rounded-lg px-3 py-2.5"
                    >
                      <div className="w-8 h-8 rounded-md bg-[#c9a961]/20 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-[#1a5336]" />
                      </div>
                      <span className="text-sm text-gray-800 font-medium">
                        {meta?.label || s}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-xl font-bold text-[#1a5336] mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#c9a961]" />
                Ubicación y puntos cercanos
              </h3>
              <div className="rounded-2xl overflow-hidden border-2 border-[#1a5336]/10 shadow-lg">
                <iframe
                  title={`Mapa ${terreno.nombre}`}
                  src={terreno.mapaEmbed}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {terreno.puntosCercanos.map((p) => (
                  <div
                    key={p.nombre}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                  >
                    <span className="text-gray-700">{p.nombre}</span>
                    <span className="text-[#1a5336] font-semibold">{p.distancia}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <Button
              data-testid="btn-whatsapp-detalle"
              onClick={() => openWhatsApp()}
              size="lg"
              className="w-full bg-[#25D366] hover:bg-[#1fb358] text-white text-base group"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar por WhatsApp sobre este terreno
            </Button>
          </div>

          {/* RIGHT column: simulator + lead */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment simulator */}
            <div
              data-testid="payment-simulator"
              className="sticky top-4 bg-white rounded-2xl border-2 border-[#c9a961]/30 shadow-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#c9a961]/20 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-[#c9a961]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a5336]">
                    Simulador de pago
                  </h3>
                  <p className="text-xs text-gray-500">Sin intereses. Trato directo.</p>
                </div>
              </div>

              {/* Enganche */}
              <div className="mb-5">
                <div className="flex justify-between items-baseline mb-2">
                  <Label className="text-sm">Enganche</Label>
                  <span className="text-sm font-bold text-[#1a5336]">
                    {enganchePct}% · {currency(calc.enganche)}
                  </span>
                </div>
                <Slider
                  data-testid="slider-enganche"
                  value={[enganchePct]}
                  min={10}
                  max={70}
                  step={5}
                  onValueChange={(v) => setEnganchePct(v[0])}
                />
              </div>

              {/* Plazo */}
              <div className="mb-5">
                <div className="flex justify-between items-baseline mb-2">
                  <Label className="text-sm">Plazo</Label>
                  <span className="text-sm font-bold text-[#1a5336]">
                    {plazoMeses} meses
                  </span>
                </div>
                <Slider
                  data-testid="slider-plazo"
                  value={[plazoMeses]}
                  min={6}
                  max={60}
                  step={6}
                  onValueChange={(v) => setPlazoMeses(v[0])}
                />
              </div>

              {/* Result */}
              <div className="bg-gradient-to-br from-[#1a5336] to-[#14432c] text-white rounded-xl p-5 text-center">
                <div className="text-xs uppercase tracking-wider text-[#c9a961] mb-1">
                  Mensualidad estimada
                </div>
                <div
                  data-testid="mensualidad-estimada"
                  className="text-3xl font-bold"
                >
                  {currency(calc.mensualidad)}
                </div>
                <div className="text-xs text-gray-200 mt-2">
                  Financiar: {currency(calc.resto)} en {plazoMeses} meses
                </div>
              </div>
            </div>

            {/* Lead form */}
            <form
              onSubmit={handleLead}
              data-testid="lead-form-detalle"
              className="bg-[#fbf8f1] rounded-2xl border border-[#c9a961]/30 p-6 shadow-md"
            >
              <h3 className="text-lg font-bold text-[#1a5336] mb-1">
                Recibir información
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Te enviamos ubicación exacta y precios actualizados.
              </p>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Nombre completo</Label>
                  <Input
                    required
                    data-testid="lead-nombre"
                    value={lead.nombre}
                    onChange={(e) => setLead({ ...lead, nombre: e.target.value })}
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <Label className="text-xs">Teléfono</Label>
                  <Input
                    required
                    data-testid="lead-telefono"
                    type="tel"
                    value={lead.telefono}
                    onChange={(e) => setLead({ ...lead, telefono: e.target.value })}
                    placeholder="228 123 4567"
                  />
                </div>
                <div>
                  <Label className="text-xs">WhatsApp (opcional)</Label>
                  <Input
                    data-testid="lead-whatsapp"
                    type="tel"
                    value={lead.whatsapp}
                    onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
                    placeholder="WhatsApp con LADA"
                  />
                </div>
                <Button
                  type="submit"
                  data-testid="btn-recibir-info"
                  className="w-full bg-[#1a5336] hover:bg-[#143f28] text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Recibir información
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
