import React, { useState } from "react";
import {
  MapPin,
  Maximize2,
  Tag,
  ArrowRight,
  Trees,
  Sparkles,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { terrenos } from "../data/terrenos";
import { MotionReveal, TiltCard } from "./MotionReveal";

export const TerrenosSection = ({ onOpenTerreno }) => {
  const [filter, setFilter] = useState("all");

  const filtros = [
    { id: "all", label: "Todos" },
    { id: "destacados", label: "Destacados" },
    { id: "campestre", label: "Campestres" },
    { id: "habitacional", label: "Habitacional" },
  ];

  const filtered = terrenos.filter((t) => {
    if (filter === "all") return true;
    if (filter === "destacados") return t.destacado;
    if (filter === "campestre")
      return t.usoSuelo.toLowerCase().includes("campestre");
    if (filter === "habitacional")
      return t.usoSuelo.toLowerCase().includes("habitacional");
    return true;
  });

  return (
    <section
      id="terrenos"
      className="relative py-24 bg-gradient-to-b from-white via-[#fbf8f1] to-white overflow-hidden"
    >
      {/* Subtle grain / glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#c9a961]/15 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#1a5336]/10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <MotionReveal className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-[#1a5336] text-white mb-4" data-testid="terrenos-badge">
            <Trees className="h-3.5 w-3.5 mr-1.5" />
            Terrenos disponibles en Veracruz
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a5336] mb-4 tracking-tight">
            Invierte en tu futuro,{" "}
            <span className="relative inline-block text-[#c9a961]">
              adquiere tu terreno
              <span className="absolute left-0 right-0 bottom-1 h-2 bg-[#c9a961]/20 -z-0"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Lotes con escrituras en Xalapa, Coatepec, Xico y Pueblos Mágicos cercanos.
            Plusvalía anual garantizada, pagos flexibles y proceso 100% transparente.
          </p>
        </MotionReveal>

        {/* Filter chips */}
        <MotionReveal delay={0.1} className="flex flex-wrap justify-center gap-2 mb-12">
          {filtros.map((f) => (
            <button
              key={f.id}
              data-testid={`filter-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                filter === f.id
                  ? "bg-[#1a5336] text-white border-[#1a5336] shadow-md shadow-[#1a5336]/30"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#1a5336]/40 hover:text-[#1a5336]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </MotionReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((t, index) => (
            <MotionReveal
              key={t.id}
              delay={index * 0.08}
              className="h-full"
            >
              <TiltCard className="h-full" intensity={6}>
                <article
                  data-testid={`terreno-card-${t.slug}`}
                  className="group relative h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-[#1a5336]/10 transition-shadow duration-500 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={t.imagenes[0]}
                      alt={t.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                    {/* Price chip */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <div className="text-xs text-gray-500 leading-none">Desde</div>
                      <div className="text-lg font-bold text-[#1a5336] leading-tight">
                        {t.precioFormateado}
                      </div>
                    </div>

                    {/* Tag */}
                    {t.etiqueta && (
                      <Badge className="absolute top-4 right-4 bg-[#c9a961] text-white border-0 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {t.etiqueta}
                      </Badge>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold leading-tight drop-shadow-md">
                        {t.nombre}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-100 mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {t.ubicacion}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {t.descripcionCorta}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                      <div className="rounded-lg bg-gray-50 py-2">
                        <div className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                          <Maximize2 className="h-3 w-3" />
                          Superficie
                        </div>
                        <div className="text-sm font-bold text-[#1a5336]">
                          {t.superficie} m²
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 py-2">
                        <div className="text-[11px] text-gray-500">Frente</div>
                        <div className="text-sm font-bold text-[#1a5336]">
                          {t.frente} m
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 py-2">
                        <div className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                          <Tag className="h-3 w-3" />
                          Uso
                        </div>
                        <div className="text-[11px] font-bold text-[#1a5336] leading-tight pt-0.5">
                          {t.usoSuelo.split(" / ")[0]}
                        </div>
                      </div>
                    </div>

                    <Button
                      data-testid={`btn-ver-detalles-${t.slug}`}
                      onClick={() => onOpenTerreno(t)}
                      className="mt-auto w-full bg-[#1a5336] hover:bg-[#143f28] text-white group/btn"
                    >
                      Ver detalles
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>

                  {/* shine on hover */}
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></span>
                  </span>
                </article>
              </TiltCard>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
