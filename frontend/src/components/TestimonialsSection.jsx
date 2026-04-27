import React from "react";
import { Star, Quote } from "lucide-react";
import { testimoniosTerrenos } from "../data/terrenos";
import { MotionReveal, TiltCard } from "./MotionReveal";
import { Badge } from "./ui/badge";

export const TestimonialsSection = () => {
  return (
    <section id="testimonios" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <MotionReveal className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="bg-[#c9a961] text-white mb-4">Lo que dicen nuestros clientes</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a5336] mb-4">
            Historias reales, terrenos reales
          </h2>
          <p className="text-lg text-gray-600">
            Cientos de familias ya invierten con nosotros en la región de Xalapa.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimoniosTerrenos.map((t, i) => (
            <MotionReveal key={t.id} delay={i * 0.1}>
              <TiltCard intensity={5}>
                <div
                  data-testid={`testimonial-${t.id}`}
                  className="relative bg-gradient-to-br from-white to-[#fbf8f1] rounded-2xl p-7 border border-[#c9a961]/20 shadow-md hover:shadow-2xl hover:shadow-[#c9a961]/20 transition-shadow duration-500 h-full flex flex-col"
                >
                  <Quote className="absolute top-4 right-4 h-10 w-10 text-[#c9a961]/15" />
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={t.avatar}
                      alt={t.nombre}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#c9a961]/40"
                    />
                    <div>
                      <div className="font-bold text-[#1a5336]">{t.nombre}</div>
                      <div className="text-xs text-gray-500">{t.ubicacion}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-[#c9a961] text-[#c9a961]" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm flex-1">
                    "{t.texto}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    Proyecto: <span className="font-semibold text-[#1a5336]">{t.proyecto}</span>
                  </div>
                </div>
              </TiltCard>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
