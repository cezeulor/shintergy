import React from 'react';
import { Truck, Construction, Layers, Route, Package, Calendar, CalendarRange, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { services, rentalOptions } from '../data/mock';

const iconMap = {
  Truck,
  Construction,
  Layers,
  Route,
  Package,
  Calendar,
  CalendarRange,
  CalendarClock
};

export const ServicesSection = () => {
  return (
    <section id="servicios" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a5336] mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-600">
            Ofrecemos soluciones integrales en renta de maquinaria pesada y servicios de construcción
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <Card
                key={service.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#1a5336]/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-[#1a5336] text-white p-3 rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-[#1a5336] group-hover:text-[#c9a961] transition-colors duration-300">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-[#c9a961] rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Rental Options */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-[#1a5336] mb-10">
            Opciones de Renta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rentalOptions.map((option, index) => {
              const Icon = iconMap[option.icon];
              return (
                <Card
                  key={option.id}
                  className={`relative hover:shadow-lg transition-all duration-300 ${
                    option.badge ? 'border-2 border-[#c9a961]' : 'border'
                  }`}
                >
                  {option.badge && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c9a961] text-white">
                      {option.badge}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 bg-[#1a5336]/10 p-4 rounded-full w-fit">
                      <Icon className="h-8 w-8 text-[#1a5336]" />
                    </div>
                    <CardTitle className="text-2xl text-[#1a5336]">
                      {option.period}
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-sm text-gray-500 mb-2">Desde</div>
                    <div className="text-3xl font-bold text-[#1a5336]">
                      {option.price === 0 ? 'Consultar' : `$${option.price.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">+ IVA</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-center text-gray-500 mt-8 text-sm">
            * Los precios varían según el tipo de maquinaria y servicios adicionales
          </p>
        </div>
      </div>
    </section>
  );
};
