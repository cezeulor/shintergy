import React from "react";
import { Megaphone, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { useContent } from "../context/ContentContext";
import { MotionReveal, TiltCard } from "./MotionReveal";

export const PromotionsSection = () => {
  const { content } = useContent();
  const all = content.promotions || [];
  const promotions = all.filter((p) => p.active !== false);
  if (promotions.length === 0) return null;

  return (
    <section
      id="promociones"
      className="relative py-20 bg-[#0a0a0a] text-white overflow-hidden"
    >
      {/* decorative yellow "caution" stripes */}
      <div className="absolute inset-x-0 top-0 h-3 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #F5C518 0 20px, #0a0a0a 20px 40px)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-3 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #F5C518 0 20px, #0a0a0a 20px 40px)",
        }}
      />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#F5C518]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <MotionReveal className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            className="mb-4 border-0 text-black"
            style={{ backgroundColor: "#F5C518" }}
            data-testid="promotions-badge"
          >
            <Megaphone className="h-3.5 w-3.5 mr-1.5" />
            Promociones activas
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Aprovecha nuestras{" "}
            <span className="text-[#F5C518]">ofertas del mes</span>
          </h2>
          <p className="text-lg text-gray-300 mt-3">
            Descuentos, paquetes y servicios con condiciones especiales.
          </p>
        </MotionReveal>

        <div
          className={`grid gap-6 ${
            promotions.length === 1
              ? "max-w-3xl mx-auto"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {promotions.map((p, i) => {
            const CardBody = (
              <div
                data-testid={`promo-card-${p.id}`}
                className="group relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-[#F5C518]/20 hover:border-[#F5C518]/70 shadow-2xl hover:shadow-[#F5C518]/20 transition-all duration-500 h-full"
              >
                <div className="aspect-[4/5] md:aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-1.5">
                    {p.title}
                  </h3>
                  {p.subtitle && (
                    <p className="text-sm text-gray-300 mb-4">{p.subtitle}</p>
                  )}
                  {p.cta_label && (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5C518] group-hover:gap-3 transition-all">
                      <Sparkles className="h-4 w-4" />
                      {p.cta_label}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            );

            return (
              <MotionReveal key={p.id} delay={i * 0.1}>
                <TiltCard intensity={5}>
                  {p.cta_link ? (
                    <a
                      href={p.cta_link}
                      target={p.cta_link.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {CardBody}
                    </a>
                  ) : (
                    CardBody
                  )}
                </TiltCard>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
