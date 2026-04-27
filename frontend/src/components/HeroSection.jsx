import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Wrench, Phone, Trees } from 'lucide-react';
import { Button } from './ui/button';
import { companyInfo } from '../data/mock';

export const HeroSection = ({ onOpenChat }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x, y });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const whatsappClick = () => {
    const wa = companyInfo.whatsappDigits;
    const msg = encodeURIComponent(
      'Hola, me interesa rentar la retroexcavadora Caterpillar 420F2 IT. ¿Me puedes dar más información?'
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Parallax background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translate3d(${mouse.x * 12}px, ${
            mouse.y * 8 + scrollY * 0.3
          }px, 0) scale(1.08)`,
          transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1628645419184-26a1f2757340?w=2000"
          alt="Retroexcavadora Caterpillar trabajando en obra"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30"></div>
        <div className="absolute inset-0 bg-[#0f1f18]/30 mix-blend-multiply"></div>
      </div>

      {/* Floating glows */}
      <div
        className="pointer-events-none absolute top-28 right-10 w-64 h-64 bg-[#c9a961]/30 rounded-full blur-3xl"
        style={{
          transform: `translate3d(${mouse.x * -25}px, ${mouse.y * -20}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none absolute bottom-24 left-10 w-72 h-72 bg-[#1a5336]/40 rounded-full blur-3xl"
        style={{
          transform: `translate3d(${mouse.x * 25}px, ${mouse.y * 20}px, 0)`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div
          className="max-w-3xl"
          style={{
            transform: `perspective(1200px) rotateY(${mouse.x * 3}deg) rotateX(${
              -mouse.y * 2
            }deg)`,
            transition: 'transform 350ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div className="inline-flex items-center gap-2 bg-[#c9a961]/20 backdrop-blur-md border border-[#c9a961]/40 text-white px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Wrench className="h-3.5 w-3.5 text-[#c9a961]" />
            <span className="text-xs md:text-sm font-medium">
              Renta de retroexcavadora Caterpillar 420F2 IT
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Soluciones en{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#c9a961]">construcción</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-[#c9a961]/20 -skew-y-1 z-0"></span>
            </span>{' '}
            con respaldo profesional
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Más de 30 años de experiencia rentando maquinaria pesada en Xalapa,
            Coatepec y zona conurbada. Operador, combustible y traslado{' '}
            <strong>incluidos</strong>.
          </p>

          <div className="flex flex-wrap gap-2 mb-9 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            {[
              'Operador certificado',
              'Combustible incluido',
              'Traslado sin costo',
            ].map((f) => (
              <div
                key={f}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs md:text-sm"
              >
                ✓ {f}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
            <Button
              size="lg"
              data-testid="hero-cta-cotizar"
              onClick={() => scrollTo('servicios')}
              className="bg-[#c9a961] hover:bg-[#b99747] text-[#0f1f18] font-semibold px-8 py-6 text-base md:text-lg group shadow-xl shadow-[#c9a961]/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Ver maquinaria y precios
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              data-testid="hero-cta-whatsapp"
              onClick={whatsappClick}
              className="bg-white/10 backdrop-blur-md border-2 border-white/60 text-white hover:bg-white hover:text-[#1a5336] px-8 py-6 text-base md:text-lg group transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar información
            </Button>
          </div>

          {/* Subpage link */}
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
            <Link
              to="/terrenos"
              data-testid="hero-link-terrenos"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-[#c9a961] underline-offset-4 hover:underline transition-colors duration-200"
            >
              <Trees className="h-4 w-4 text-[#c9a961]" />
              ¿Buscas terrenos en Xalapa? Conoce nuestros lotes con escrituras →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-14 max-w-xl animate-in fade-in slide-in-from-bottom-14 duration-700 delay-700">
            {[
              { number: '30+', label: 'Años del operador' },
              { number: '500+', label: 'Obras completadas' },
              { number: '12', label: 'Zonas de cobertura' },
            ].map((s) => (
              <div
                key={s.label}
                className="text-left border-l-2 border-[#c9a961]/60 pl-4"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#c9a961] mb-0.5 leading-none">
                  {s.number}
                </div>
                <div className="text-[11px] md:text-xs text-gray-300 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phone floating chip */}
      <div
        className="hidden lg:flex absolute right-10 top-1/3 z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 items-center gap-3 floaty"
        style={{
          transform: `translate3d(${mouse.x * -10}px, ${mouse.y * -10}px, 0)`,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-[#1a5336]/10 flex items-center justify-center">
          <Phone className="h-5 w-5 text-[#1a5336]" />
        </div>
        <div>
          <div className="text-xs text-gray-500">Llámanos</div>
          <a
            href={`tel:${companyInfo.phoneDigits}`}
            className="text-lg font-bold text-[#1a5336] hover:text-[#c9a961] transition-colors"
          >
            {companyInfo.phone}
          </a>
          <div className="text-[10px] text-gray-500">{companyInfo.horarios}</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
