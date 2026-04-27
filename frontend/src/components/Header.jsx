import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { companyInfo } from '../data/mock';
import { Button } from './ui/button';

export const Header = ({ onOpenChat }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Maquinaria', id: 'servicios', isLink: false },
    { label: 'Ventajas', id: 'ventajas', isLink: false },
    { label: 'Proceso', id: 'proceso', isLink: false },
    { label: 'Galería', id: 'galeria', isLink: false },
    { label: 'Contacto', id: 'contacto', isLink: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-md py-3'
          : 'bg-white/70 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            data-testid="header-logo"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]"
            />
            <span className="text-2xl font-bold text-[#1a5336] tracking-tight">
              {companyInfo.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.isLink ? (
                <Link
                  key={item.id}
                  to={item.to}
                  data-testid={`nav-${item.id}`}
                  className={`font-medium transition-colors duration-200 relative group text-sm flex items-center gap-1 ${
                    location.pathname === item.to
                      ? 'text-[#c9a961]'
                      : 'text-gray-700 hover:text-[#1a5336]'
                  }`}
                >
                  <Trees className="h-3.5 w-3.5" />
                  {item.label}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#c9a961] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  data-testid={`nav-${item.id}`}
                  className="text-gray-700 hover:text-[#1a5336] font-medium transition-colors duration-200 relative group text-sm"
                >
                  {item.label}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#c9a961] group-hover:w-full transition-all duration-300"></span>
                </button>
              )
            )}

            <a
              href={`tel:${companyInfo.phoneDigits}`}
              data-testid="header-phone"
              className="hidden xl:flex items-center gap-2 text-sm font-semibold text-[#1a5336] hover:text-[#c9a961] transition-colors"
            >
              <Phone className="h-4 w-4" />
              {companyInfo.phone}
            </a>

            <Button
              onClick={onOpenChat}
              data-testid="header-cta"
              className="bg-[#1a5336] hover:bg-[#143f28] text-white px-5 shadow-md hover:shadow-lg hover:shadow-[#1a5336]/30 transition-all"
            >
              Cotizar Ahora
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1a5336]"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) =>
                item.isLink ? (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${item.id}`}
                    className="text-left py-3 px-4 text-gray-700 hover:bg-[#1a5336]/5 hover:text-[#1a5336] rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <Trees className="h-4 w-4 text-[#c9a961]" />
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    data-testid={`mobile-nav-${item.id}`}
                    className="text-left py-3 px-4 text-gray-700 hover:bg-[#1a5336]/5 hover:text-[#1a5336] rounded-lg transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                )
              )}
              <a
                href={`tel:${companyInfo.phoneDigits}`}
                className="text-left py-3 px-4 text-[#1a5336] font-semibold flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                {companyInfo.phone}
              </a>
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="bg-[#1a5336] hover:bg-[#143f28] text-white w-full mt-2"
              >
                Cotizar Ahora
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
