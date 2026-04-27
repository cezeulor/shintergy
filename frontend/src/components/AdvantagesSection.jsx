import React from 'react';
import { ShieldCheck, MapPin, FileCheck, Zap, Radar, Smartphone, Route, CalendarClock, MessageSquare } from 'lucide-react';
import { advantages } from '../data/mock';

const iconMap = {
  ShieldCheck,
  MapPin,
  FileCheck,
  Zap,
  Radar,
  Smartphone,
  Route,
  CalendarClock,
  MessageSquare
};

export const AdvantagesSection = () => {
  return (
    <section id="ventajas" className="py-24 bg-[#1a5336] text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a961]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Por Qué Elegirnos?
          </h2>
          <p className="text-lg text-gray-200">
            Compromiso con la calidad, seguridad y satisfacción de nuestros clientes
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => {
            const Icon = iconMap[advantage.icon];
            return (
              <div
                key={advantage.id}
                className="group flex gap-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#c9a961]/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-[#c9a961]/20 rounded-lg flex items-center justify-center group-hover:bg-[#c9a961]/30 transition-colors duration-300">
                    <Icon className="h-7 w-7 text-[#c9a961]" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#c9a961] transition-colors duration-300">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {advantage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-full">
            <ShieldCheck className="h-6 w-6 text-[#c9a961]" />
            <span className="text-lg font-semibold">
              Cotización 100% Segura y Confidencial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
