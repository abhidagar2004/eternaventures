import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthPopup from './AuthPopup';

interface NavLink {
  id: string;
  name: string;
  href: string;
}

interface NavButton {
  id: string;
  name: string;
  href: string;
  bgColor: string;
  textColor: string;
}

interface LogoConfig {
  type: 'text' | 'image';
  text1?: string;
  color1?: string;
  text2?: string;
  color2?: string;
  imageUrl?: string;
  height?: number;
  width?: number;
}

interface StylingConfig {
  navbar_bg: string;
  link_color: string;
  link_hover_color: string;
  link_active_color: string;
}

interface NavbarConfig {
  logo: LogoConfig;
  styling: StylingConfig;
  links: NavLink[];
  buttons: NavButton[];
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<NavbarConfig>({
    logo: {
      type: 'text',
      text1: '',
      color1: '#ffffff',
      text2: '',
      color2: '#2596be',
      height: 40,
      width: 150
    },
    styling: {
      navbar_bg: 'bg-black/95',
      link_color: '#d1d5db',
      link_hover_color: '#ffffff',
      link_active_color: '#2596be'
    },
    links: [],
    buttons: []
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'navbar_config')
        .single();
      
      if (data?.setting_value) {
        setConfig(data.setting_value as NavbarConfig);
      }
    };
    fetchConfig();
  }, []);

  // Close profile popup on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isOutsideDesktop = desktopProfileRef.current && !desktopProfileRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileProfileRef.current && !mobileProfileRef.current.contains(event.target as Node);
      
      // If both are true (or one is true and the other doesn't exist), close it
      if (isOutsideDesktop && isOutsideMobile) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${config.styling.navbar_bg} backdrop-blur-md border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            {config.logo.type === 'image' ? (
              <img 
                src={config.logo.imageUrl || 'https://via.placeholder.com/150x40?text=Logo'} 
                alt="Logo" 
                style={{ 
                  height: config.logo.height ? `${config.logo.height}px` : 'auto',
                  width: config.logo.width ? `${config.logo.width}px` : 'auto',
                  objectFit: 'contain'
                }}
                className="transition-transform group-hover:scale-105"
              />
            ) : (
              <>
                <span className="text-xl md:text-2xl font-bold tracking-tight transition-transform group-hover:scale-105" style={{ color: config.logo.color1 }}>
                  {config.logo.text1}
                </span>
                <span className="text-xl md:text-2xl font-bold tracking-tight transition-transform group-hover:scale-105" style={{ color: config.logo.color2 }}>
                  {config.logo.text2}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-8 mr-4">
              {config.links.map((link) => {
                if (!link.name || !link.href) return null;
                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    className="text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                    style={{ 
                      color: isActive(link.href) ? config.styling.link_active_color : config.styling.link_color 
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(link.href)) e.currentTarget.style.color = config.styling.link_hover_color;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(link.href)) e.currentTarget.style.color = config.styling.link_color;
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-4">
              {config.buttons.map((btn) => {
                if (!btn.name || !btn.href) return null;
                return (
                  <Link
                    key={btn.id}
                    to={btn.href}
                    className={`${btn.bgColor} ${btn.textColor} px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5 hover:shadow-white/10 whitespace-nowrap`}
                  >
                    {btn.name}
                  </Link>
                );
              })}

              {/* Profile Icon & Popup */}
              <div className="relative" ref={desktopProfileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all active:scale-90"
                  style={{ color: config.styling.link_color }}
                >
                  <User size={20} />
                </button>
                <AuthPopup 
                  isOpen={isProfileOpen} 
                  onClose={() => setIsProfileOpen(false)} 
                  styling={config.styling}
                />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative" ref={mobileProfileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 active:scale-90 transition-all"
              >
                <User size={18} />
              </button>
              <AuthPopup 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                styling={config.styling}
              />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-[#2596be] transition-colors bg-white/5 rounded-full border border-white/10 active:scale-90"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-black/95 border-t border-white/5">
          {config.links.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className="block px-3 py-4 text-base font-semibold"
              style={{ 
                color: isActive(link.href) ? config.styling.link_active_color : config.styling.link_color 
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            {config.buttons.map((btn) => (
              <Link
                key={btn.id}
                to={btn.href}
                className={`block w-full text-center ${btn.bgColor} ${btn.textColor} px-6 py-3 rounded-xl text-base font-bold`}
                onClick={() => setIsOpen(false)}
              >
                {btn.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
