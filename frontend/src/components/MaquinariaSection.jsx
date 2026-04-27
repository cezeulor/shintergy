import React, { useState } from "react";
import {
  CheckCircle2,
  Truck,
  Wrench,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Fuel,
  User,
  ShieldCheck,
  CalendarCheck,
  FileText,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { maquina, companyInfo, zonasCobertura } from "../data/mock";
import { MotionReveal, TiltCard } from "./MotionReveal";

export const MaquinariaSection = ({ onOpenChat }) => {
  const [imgIdx, setImgIdx] = useState(0);

  const wa = companyInfo.whatsappDigits;
  const next = () => setImgIdx((i) => (i + 1) % maquina.imagenes.length);
  const prev = () =>
    setImgIdx((i) => (i - 1 + maquina.imagenes.length) % maquina.imagenes.length);

  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hola, me interesa rentar la ${maquina.nombre}. ¿Me puedes dar más información y disponibilidad?`
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  return (
    <section
      id="servicios"
      className="relative py-24 bg-gradient-to-b from-white via-[#fbf8f1] to-white overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] bg-[#c9a961]/10 rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 left-0 w-[500px] h-[500px] bg-[#1a5336]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <MotionReveal className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="bg-[#1a5336] text-white mb-4">
            <Wrench className="h-3.5 w-3.5 mr-1.5" />
            Nuestra maquinaria
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a5336] mb-4 tracking-tight">
            Renta de{" "}
            <span className="relative inline-block text-[#c9a961]">
              Retroexcavadora Caterpillar
              <span className="absolute left-0 right-0 bottom-1 h-2 bg-[#c9a961]/20"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Caterpillar 420F2 IT modelo 2016 con operador certificado, combustible
            y traslado <strong>incluidos</strong>. Cotización directa, sin intermediarios.
          </p>
        </MotionReveal>

        <div className="grid lg:grid-cols-5 gap-10 max-w-7xl mx-auto">
          {/* Carrusel de imágenes */}
          <MotionReveal className="lg:col-span-3">
            <TiltCard intensity={4}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#1a5336]/10 bg-gray-900 aspect-[4/3]">
                {maquina.imagenes.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${maquina.nombre} ${i + 1}`}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      i === imgIdx ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

                <button
                  onClick={prev}
                  data-testid="machine-prev"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5 text-[#1a5336]" />
                </button>
                <button
                  onClick={next}
                  data-testid="machine-next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-5 w-5 text-[#1a5336]" />
                </button>

                <Badge className="absolute top-4 left-4 bg-[#c9a961] text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Disponible
                </Badge>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {maquina.imagenes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === imgIdx ? "w-8 bg-white" : "w-2 bg-white/60"
                      }`}
                      aria-label={`Imagen ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Specs grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {[
                { label: "Marca", value: maquina.marca },
                { label: "Modelo", value: maquina.modelo },
                { label: "Año", value: maquina.anio },
                { label: "Tipo", value: maquina.tipo },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-[#c9a961] transition-colors duration-300"
                >
                  <div className="text-[11px] uppercase tracking-wider text-gray-500">
                    {s.label}
                  </div>
                  <div className="text-sm font-bold text-[#1a5336] mt-1 leading-tight">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </MotionReveal>

          {/* Pricing & info */}
          <MotionReveal delay={0.15} className="lg:col-span-2 space-y-5">
            {/* Pricing card */}
            <div className="bg-gradient-to-br from-[#1a5336] to-[#14432c] text-white rounded-2xl p-7 shadow-2xl">
              <h3 className="text-2xl font-bold mb-1">{maquina.nombre}</h3>
              <p className="text-sm text-gray-200 mb-5">
                {maquina.descripcionCorta}
              </p>

              <div className="space-y-2.5 mb-5">
                <div
                  data-testid="precio-dia"
                  className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#c9a961]" />
                    Por Día
                  </span>
                  <span className="text-lg font-bold text-[#c9a961]">
                    {maquina.preciosMostrar.dia}
                  </span>
                </div>
                <div
                  data-testid="precio-semana"
                  className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#c9a961]" />
                    Por Semana
                  </span>
                  <span className="text-lg font-bold text-[#c9a961]">
                    {maquina.preciosMostrar.semana}
                  </span>
                </div>
                <div
                  data-testid="precio-mes"
                  className="flex items-center justify-between bg-[#c9a961]/20 rounded-xl p-3 border border-[#c9a961]/40 hover:bg-[#c9a961]/30 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-[#c9a961]" />
                    Por Mes <Badge className="bg-[#c9a961] text-[#0f1f18] text-[10px]">Mejor precio</Badge>
                  </span>
                  <span className="text-lg font-bold text-[#c9a961]">
                    {maquina.preciosMostrar.mes}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-300 mb-4">
                Precios + IVA. Anticipo 50% para apartar fecha.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={openWhatsApp}
                  data-testid="machine-whatsapp"
                  className="bg-[#25D366] hover:bg-[#1fb358] text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  onClick={onOpenChat}
                  data-testid="machine-cotizar"
                  className="bg-white text-[#1a5336] hover:bg-gray-100"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Cotizar
                </Button>
              </div>
            </div>

            {/* Includes list */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
              <h4 className="font-bold text-[#1a5336] mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#c9a961]" />
                ¿Qué incluye?
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-[#1a5336] mt-0.5 flex-shrink-0" />
                  <span><strong>Operador:</strong> {maquina.incluye.operador}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Fuel className="h-4 w-4 text-[#1a5336] mt-0.5 flex-shrink-0" />
                  <span><strong>Combustible:</strong> {maquina.incluye.combustible}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Truck className="h-4 w-4 text-[#1a5336] mt-0.5 flex-shrink-0" />
                  <span><strong>Traslado:</strong> {maquina.incluye.traslado}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#1a5336] mt-0.5 flex-shrink-0" />
                  <span><strong>Seguro:</strong> {maquina.incluye.seguro}</span>
                </li>
              </ul>
            </div>
          </MotionReveal>
        </div>

        {/* Conditions, requirements, coverage */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mt-16">
          <MotionReveal delay={0.05}>
            <div
              data-testid="condiciones-card"
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full"
            >
              <div className="w-11 h-11 rounded-lg bg-[#1a5336]/10 flex items-center justify-center mb-4">
                <CalendarCheck className="h-5 w-5 text-[#1a5336]" />
              </div>
              <h4 className="font-bold text-[#1a5336] mb-3">Condiciones de renta</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Mínimo:</strong> {maquina.condiciones.minimo}</li>
                <li>• <strong>Jornada:</strong> {maquina.condiciones.jornada}</li>
                <li>• <strong>Anticipo:</strong> {maquina.condiciones.deposito}</li>
                <li>• <strong>Reserva:</strong> {maquina.condiciones.reserva}</li>
                <li className="text-[#1a5336] font-semibold">
                  ✓ {maquina.condiciones.tarifaEspecial}
                </li>
              </ul>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.15}>
            <div
              data-testid="requisitos-card"
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full"
            >
              <div className="w-11 h-11 rounded-lg bg-[#c9a961]/15 flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-[#c9a961]" />
              </div>
              <h4 className="font-bold text-[#1a5336] mb-3">Requisitos del cliente</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {maquina.requisitos.map((r) => (
                  <li key={r} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#c9a961] flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.25}>
            <div
              data-testid="cobertura-card"
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full"
            >
              <div className="w-11 h-11 rounded-lg bg-[#1a5336]/10 flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5 text-[#1a5336]" />
              </div>
              <h4 className="font-bold text-[#1a5336] mb-3">Zonas de cobertura</h4>
              <p className="text-xs text-gray-500 mb-3">
                Trabajamos en Xalapa y poblados cercanos sin cobro de traslado.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {zonasCobertura.map((z) => (
                  <span
                    key={z}
                    className="text-[11px] bg-[#1a5336]/8 text-[#1a5336] border border-[#1a5336]/15 px-2.5 py-1 rounded-full"
                  >
                    {z}
                  </span>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
};
