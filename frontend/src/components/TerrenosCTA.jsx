import React from "react";
import { Link } from "react-router-dom";
import { Trees, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MotionReveal, TiltCard } from "./MotionReveal";

// Banner CTA en la landing page que lleva a la subpágina de terrenos
export const TerrenosCTA = () => {
  return (
    <section
      id="terrenos-cta"
      className="relative py-20 overflow-hidden bg-[#0f1f18]"
    >
      {/* Parallax background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800"
          alt="Terreno cerca de Xalapa, Veracruz"
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f18] via-[#0f1f18]/80 to-transparent"></div>
      </div>

      {/* glow */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#c9a961]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <MotionReveal>
            <Badge className="bg-[#c9a961] text-[#0f1f18] mb-4 border-0">
              <Trees className="h-3.5 w-3.5 mr-1.5" />
              Inversión inmobiliaria
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              ¿Buscas{" "}
              <span className="text-[#c9a961]">terrenos en Xalapa</span> y la
              región?
            </h2>
            <p className="text-lg text-gray-300 mb-7 max-w-xl">
              Tenemos lotes con escrituras en Coatepec, Xico, Banderilla y más.
              Plusvalía garantizada y financiamiento directo, sin bancos.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {["Desde $180,000 MXN", "Escrituras incluidas", "Pagos a meses"].map(
                (f) => (
                  <span
                    key={f}
                    className="text-xs bg-white/10 backdrop-blur-sm border border-white/15 text-white px-3 py-1.5 rounded-full"
                  >
                    {f}
                  </span>
                )
              )}
            </div>

            <Link to="/terrenos" data-testid="btn-ver-terrenos-subpagina">
              <Button
                size="lg"
                className="bg-[#c9a961] hover:bg-[#b99747] text-[#0f1f18] font-semibold px-8 py-6 text-base group shadow-2xl shadow-[#c9a961]/30 hover:shadow-[#c9a961]/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Ver terrenos disponibles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </MotionReveal>

          <MotionReveal delay={0.15}>
            <TiltCard intensity={8}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#c9a961] to-[#1a5336] rounded-3xl blur opacity-40"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 text-white">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { n: "12", l: "Terrenos disponibles" },
                      { n: "9%", l: "Plusvalía anual" },
                      { n: "100%", l: "Escriturados" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <div className="text-3xl font-bold text-[#c9a961]">
                          {s.n}
                        </div>
                        <div className="text-[11px] text-gray-300">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    {[
                      "Coatepec — Valle de Niebla",
                      "Xico — Mirador La Cascada",
                      "Banderilla — Altavista Residencial",
                      "Tlalnelhuayocan — Mirador del Bosque",
                    ].map((u) => (
                      <div
                        key={u}
                        className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                      >
                        <MapPin className="h-4 w-4 text-[#c9a961]" />
                        {u}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 text-[11px] text-gray-400 text-center">
                    Y muchos más en la subpágina de terrenos →
                  </div>
                </div>
              </div>
            </TiltCard>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
};
