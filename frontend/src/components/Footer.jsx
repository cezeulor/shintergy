import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Trees, Wrench } from 'lucide-react';
import { companyInfo, socialMedia } from '../data/mock';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1f18] text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#c9a961]/8 rounded-full blur-3xl pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={companyInfo.logo}
                alt={companyInfo.name}
                className="h-14 w-auto"
              />
              <h3 className="text-2xl font-bold">{companyInfo.name}</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Renta de retroexcavadora Caterpillar 420F2 IT con operador
              certificado en Xalapa, Coatepec y zona conurbada.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#c9a961]">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#servicios" className="text-gray-300 hover:text-[#c9a961] transition-colors duration-200 flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5" /> Maquinaria
                </a>
              </li>
              <li>
                <a href="#ventajas" className="text-gray-300 hover:text-[#c9a961] transition-colors duration-200">Ventajas</a>
              </li>
              <li>
                <a href="#proceso" className="text-gray-300 hover:text-[#c9a961] transition-colors duration-200">Proceso</a>
              </li>
              <li>
                <a href="#galeria" className="text-gray-300 hover:text-[#c9a961] transition-colors duration-200">Galería</a>
              </li>
              <li>
                <Link to="/terrenos" className="text-gray-300 hover:text-[#c9a961] transition-colors duration-200 flex items-center gap-2">
                  <Trees className="h-3.5 w-3.5" /> Terrenos disponibles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#c9a961]">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#c9a961] flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${companyInfo.phoneDigits}`} className="text-sm text-gray-300 hover:text-[#c9a961] transition-colors">
                    {companyInfo.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#c9a961] flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`mailto:${companyInfo.email}`} className="text-sm text-gray-300 hover:text-[#c9a961] transition-colors">
                    {companyInfo.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#c9a961] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">{companyInfo.horarios}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#c9a961] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">Xalapa, Veracruz, México</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Coverage */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#c9a961]">Cobertura</h4>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>• Xalapa</li>
              <li>• Coatepec</li>
              <li>• San Marcos · Pacho</li>
              <li>• La Orduña · Briones</li>
              <li>• La Pitaya · El Grande</li>
              <li>• Puerto Rico · Las Lomas</li>
              <li>• Mundo Nuevo · Zimphizagua</li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Síguenos:</span>
              <a
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-white/10 hover:bg-[#c9a961] hover:text-[#0f1f18] p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-white/10 hover:bg-[#c9a961] hover:text-[#0f1f18] p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="bg-white/10 hover:bg-[#c9a961] hover:text-[#0f1f18] p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>

            <div className="text-sm text-gray-400 text-center md:text-right">
              © {currentYear} {companyInfo.name}. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
