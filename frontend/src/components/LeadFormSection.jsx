import React, { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { MotionReveal } from "./MotionReveal";
import { companyInfo } from "../data/mock";

export const LeadFormSection = () => {
  const [form, setForm] = useState({ nombre: "", telefono: "", whatsapp: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono) {
      toast.error("Por favor completa tu nombre y teléfono");
      return;
    }
    const wa = companyInfo.whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hola, soy ${form.nombre}. Mi teléfono es ${form.telefono}${
        form.whatsapp ? ` y mi WhatsApp ${form.whatsapp}` : ""
      }. Me gustaría recibir información sobre sus terrenos disponibles.`
    );
    toast.success("¡Listo! Te enviaremos ubicación exacta y precios actualizados.");
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
    setForm({ nombre: "", telefono: "", whatsapp: "" });
  };

  return (
    <section
      id="contacto-leads"
      className="relative py-24 bg-gradient-to-b from-[#fbf8f1] to-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <MotionReveal>
            <div className="inline-flex items-center gap-2 bg-[#1a5336]/10 text-[#1a5336] px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Asesoría sin compromiso
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a5336] leading-tight mb-4">
              Déjanos tus datos y te enviamos{" "}
              <span className="text-[#c9a961]">ubicación exacta</span> y precios
              actualizados
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Te contactaremos por WhatsApp en menos de 24 horas. Sin spam, sin
              costo y sin compromiso.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex gap-2">
                <span className="text-[#c9a961]">✓</span>
                Mapa con ubicación exacta del terreno
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a961]">✓</span>
                Lista de precios y promociones vigentes
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a961]">✓</span>
                Planes de financiamiento personalizados
              </li>
            </ul>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#1a5336]/30 via-[#c9a961]/30 to-[#1a5336]/10 rounded-3xl blur-2xl opacity-70"></div>
              <form
                onSubmit={handleSubmit}
                data-testid="lead-form-home"
                className="relative bg-white rounded-3xl shadow-2xl border border-[#c9a961]/20 p-8 space-y-4"
              >
                <h3 className="text-xl font-bold text-[#1a5336]">
                  Recibir información
                </h3>

                <div>
                  <Label className="text-sm">Nombre completo</Label>
                  <Input
                    required
                    data-testid="home-lead-nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label className="text-sm">Teléfono</Label>
                  <Input
                    required
                    data-testid="home-lead-telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="228 123 4567"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label className="text-sm">WhatsApp (opcional)</Label>
                  <Input
                    data-testid="home-lead-whatsapp"
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="WhatsApp con LADA (opcional)"
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  data-testid="btn-home-recibir-info"
                  size="lg"
                  className="w-full bg-[#1a5336] hover:bg-[#143f28] text-white text-base group"
                >
                  <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  Recibir información
                </Button>

                <p className="text-[11px] text-gray-500 text-center">
                  Tu información es confidencial. No compartimos datos con terceros.
                </p>
              </form>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
};
