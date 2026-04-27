import React from "react";
import {
  FileCheck2,
  Eye,
  HandCoins,
  ShieldCheck,
  ScrollText,
  CheckCircle2,
} from "lucide-react";
import { beneficiosCompra } from "../data/terrenos";
import { MotionReveal } from "./MotionReveal";

const iconMap = { FileCheck2, Eye, HandCoins, ShieldCheck };

export const TrustSection = () => {
  return (
    <section
      id="confianza"
      className="relative py-24 bg-[#0f1f18] text-white overflow-hidden"
    >
      {/* decorative glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#c9a961]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#1a5336]/40 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <MotionReveal>
            <div className="inline-flex items-center gap-2 bg-[#c9a961]/15 border border-[#c9a961]/30 text-[#c9a961] px-4 py-1.5 rounded-full text-xs font-semibold mb-5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Compra con respaldo legal
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Tu terreno, escriturado y 100%{" "}
              <span className="text-[#c9a961]">transparente</span>.
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Cada uno de nuestros lotes cuenta con escrituración individual,
              revisión notarial y plano topográfico. Te acompañamos desde la
              visita al terreno hasta que las llaves de tu escritura estén en tu
              mano.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Escrituras entregadas ante notario público",
                "Planos topográficos actualizados",
                "Libre de gravámenes y litigios",
                "Asesoría jurídica gratuita",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#c9a961] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.15}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#c9a961] to-[#1a5336] rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-[#0c1813] rounded-3xl border border-white/10 p-8">
                <ScrollText className="h-12 w-12 text-[#c9a961] mb-4" />
                <div className="text-3xl font-bold mb-2">15+ años</div>
                <div className="text-gray-300 mb-6">
                  de experiencia vendiendo terrenos en la zona centro de Veracruz.
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  {[
                    { n: "500+", l: "Familias" },
                    { n: "100%", l: "Escriturados" },
                    { n: "9%", l: "Plusvalía anual" },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <div className="text-2xl font-bold text-[#c9a961]">
                        {s.n}
                      </div>
                      <div className="text-[11px] text-gray-400">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {beneficiosCompra.map((b, i) => {
            const Icon = iconMap[b.icon] || ShieldCheck;
            return (
              <MotionReveal key={b.titulo} delay={i * 0.08}>
                <div
                  data-testid={`beneficio-${i}`}
                  className="group bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 hover:border-[#c9a961]/40 transition-all duration-300 h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#c9a961]/20 flex items-center justify-center mb-4 group-hover:bg-[#c9a961]/30 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 w-6 text-[#c9a961]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[#c9a961] transition-colors">
                    {b.titulo}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {b.descripcion}
                  </p>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
