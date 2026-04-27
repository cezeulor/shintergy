import React from 'react';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const whatsappNumber = companyInfo.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent('Hola, me gustaría solicitar información sobre sus servicios.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse Animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
      
      {/* Icon */}
      <MessageCircle className="h-7 w-7 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        ¡Chatea con nosotros!
        <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </button>
  );
};
