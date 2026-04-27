import React from 'react';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import { socialMedia } from '../data/mock';
import { Badge } from './ui/badge';

export const PresenceSection = () => {
  const platforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: socialMedia.instagram,
      color: 'from-purple-600 to-pink-600',
      followers: '5K+'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: socialMedia.facebook,
      color: 'from-blue-600 to-blue-700',
      followers: '3K+'
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      url: socialMedia.tiktok,
      color: 'from-gray-800 to-gray-900',
      followers: '2K+'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: socialMedia.whatsapp,
      color: 'from-green-500 to-green-600',
      followers: 'Directo'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#c9a961] text-white mb-4">Nuestra Presencia</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a5336] mb-4">
            Encuéntranos en Todas Partes
          </h2>
          <p className="text-lg text-gray-600">
            Estamos activos en redes sociales y directamente en obras
          </p>
        </div>

        {/* Social Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background (shown on hover) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-gray-100 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Icon className="text-gray-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Platform Name */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">
                    {platform.name}
                  </h3>

                  {/* Followers */}
                  <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                    {platform.followers}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-4 text-sm font-medium text-[#1a5336] group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Visitar →
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Additional Presence Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Publicidad en Lonas',
              description: 'Anuncios visibles en zonas estratégicas',
              icon: '📢'
            },
            {
              title: 'Presencia en Obras',
              description: 'Visítanos directamente en proyectos activos',
              icon: '🏗️'
            },
            {
              title: 'Referencias',
              description: 'Recomendados por clientes satisfechos',
              icon: '⭐'
            }
          ].map((method, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-3">{method.icon}</div>
              <h4 className="text-lg font-bold text-[#1a5336] mb-2">
                {method.title}
              </h4>
              <p className="text-sm text-gray-600">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
