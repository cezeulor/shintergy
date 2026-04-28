import React from 'react';
import { MessageSquare, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const iconMap = {
  MessageSquare,
  CalendarCheck,
  CheckCircle2
};

export const ProcessSection = () => {
  const { content } = useContent();
  const workProcess = content.workProcess || [];
  return (
    <section id="proceso" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a5336] mb-4">
            ¿Cómo Trabajamos?
          </h2>
          <p className="text-lg text-gray-600">
            Un proceso simple y transparente en solo 3 pasos
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines (Desktop) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a961]/0 via-[#c9a961]/50 to-[#c9a961]/0"></div>

            {workProcess.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <div
                  key={step.id}
                  className="relative text-center group animate-in fade-in slide-in-from-bottom-6"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Step Number Badge */}
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1a5336] to-[#1a5336]/80 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
                      {step.step}
                    </div>
                    <div className="absolute inset-0 bg-[#c9a961] rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c9a961]/10 rounded-lg group-hover:bg-[#c9a961]/20 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-[#c9a961]" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-[#1a5336] mb-3 group-hover:text-[#c9a961] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>

                  {/* Connector Arrow (Mobile) */}
                  {index < workProcess.length - 1 && (
                    <div className="md:hidden flex justify-center my-6">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-[#c9a961] to-[#c9a961]/20"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-br from-[#1a5336]/5 to-[#c9a961]/5 border-2 border-[#c9a961]/20 rounded-2xl p-8">
              <CheckCircle2 className="h-12 w-12 text-[#1a5336]" />
              <h4 className="text-2xl font-bold text-[#1a5336]">
                ¡Es así de fácil!
              </h4>
              <p className="text-gray-600 max-w-md">
                Nuestro equipo experto te acompañará en cada paso del proceso
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
