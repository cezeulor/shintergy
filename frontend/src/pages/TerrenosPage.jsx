import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, TrendingUp } from "lucide-react";
import { Header } from "../components/Header";
import { TerrenosSection } from "../components/TerrenosSection";
import { TerrenoDetailModal } from "../components/TerrenoDetailModal";
import { TrustSection } from "../components/TrustSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { LeadFormSection } from "../components/LeadFormSection";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";

export const TerrenosPage = () => {
  const [activeTerreno, setActiveTerreno] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      "Terrenos en Xalapa, Veracruz | Lotes con escrituras desde $180,000 MXN";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenChat={() => {}} />

      {/* Hero subpage */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-[#0f1f18] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000"
            alt="Terreno con vista en Xalapa, Veracruz"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f18] via-[#0f1f18]/85 to-[#0f1f18]/40"></div>
        </div>
        <div className="absolute -top-20 right-1/3 w-[500px] h-[500px] bg-[#c9a961]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" data-testid="btn-volver-inicio">
            <Button
              variant="outline"
              className="mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-[#1a5336]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#c9a961]/20 border border-[#c9a961]/40 text-white px-3 py-1.5 rounded-full text-xs font-medium mb-5">
              <MapPin className="h-3.5 w-3.5 text-[#c9a961]" />
              Xalapa · Coatepec · Xico · Banderilla · Naolinco
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-5">
              Terrenos con escrituras{" "}
              <span className="text-[#c9a961]">en Xalapa</span> y región
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-7">
              Lotes con plusvalía garantizada, pagos flexibles y proceso 100%
              transparente. Desde $180,000 MXN.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: "12+", l: "Terrenos disponibles" },
                { n: "100%", l: "Escriturados" },
                { n: "9%", l: "Plusvalía anual" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="border-l-2 border-[#c9a961]/60 pl-3"
                >
                  <div className="text-2xl md:text-3xl font-bold text-[#c9a961] leading-none">
                    {s.n}
                  </div>
                  <div className="text-[11px] text-gray-300 uppercase tracking-wider mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating chip */}
          <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 items-center gap-3 floaty">
            <div className="w-10 h-10 rounded-xl bg-[#1a5336]/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#1a5336]" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Plusvalía promedio</div>
              <div className="text-lg font-bold text-[#1a5336]">+9% en Xalapa</div>
            </div>
          </div>
        </div>
      </section>

      <TerrenosSection onOpenTerreno={setActiveTerreno} />
      <TrustSection />
      <TestimonialsSection />
      <LeadFormSection />
      <Footer />
      <WhatsAppButton />
      {activeTerreno && (
        <TerrenoDetailModal
          terreno={activeTerreno}
          onClose={() => setActiveTerreno(null)}
        />
      )}
    </div>
  );
};
