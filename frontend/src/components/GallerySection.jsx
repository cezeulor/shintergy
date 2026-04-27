import React, { useState } from 'react';
import { galleryImages } from '../data/mock';
import { Badge } from './ui/badge';

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="galeria" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#1a5336] text-white mb-4">Nuestro Trabajo</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a5336] mb-4">
            Galería de Proyectos
          </h2>
          <p className="text-lg text-gray-600">
            Descubre la calidad de nuestro trabajo en cada proyecto
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative overflow-hidden rounded-xl cursor-pointer aspect-[4/3] animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Badge className="bg-[#c9a961] text-white w-fit mb-2">
                  {image.category}
                </Badge>
                <h3 className="text-xl font-bold text-white">
                  {image.title}
                </h3>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl max-h-[90vh]">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <Badge className="bg-[#c9a961] text-white mb-2">
                  {selectedImage.category}
                </Badge>
                <h3 className="text-2xl font-bold text-white">
                  {selectedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            ¿Quieres que tu proyecto sea el próximo en nuestra galería?
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-[#1a5336] font-semibold hover:text-[#c9a961] transition-colors duration-300"
          >
            Solicita tu cotización
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
