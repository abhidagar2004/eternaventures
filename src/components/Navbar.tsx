import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthPopup from './AuthPopup';

import { mergeNavbar, settingColor, safeSettingHref, type NavbarConfig } from '../studio/sharedSettings';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<NavbarConfig>(() => mergeNavbar());
  useEffect(() => { setIsOpen(false); setIsProfileOpen(false); }, [location.pathname]);
  useEffect(() => { function escape(event: KeyboardEvent) { if (event.key === 'Escape') { setIsOpen(false); setIsProfileOpen(false); } } document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape); }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'navbar_config')
        .single();
      
      if (data?.setting_value) {
        setConfig(mergeNavbar(data.setting_value));
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

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const effectiveLinks = config.links.filter(link => link.visible !== false);
  const visibleButtons = config.buttons.filter(button => button.visible !== false);

  return (
    <nav data-theme-navbar className="site-navbar fixed w-full z-50 transition-all duration-300 backdrop-blur-md" style={{ "--nav-background": settingColor(config.styling.navbar_bg), "--nav-link": config.styling.link_color, "--nav-hover": config.styling.link_hover_color, "--nav-active": config.styling.link_active_color, "--nav-opacity": (config.styling.opacity ?? 100) / 100, "--nav-logo-desktop": `${config.logo.desktopSize}px`, "--nav-logo-mobile": `${config.logo.mobileSize}px`, borderBottom: config.styling.showBorder === false ? "none" : `${config.styling.borderWidth ?? 1}px solid #ffffff16` } as React.CSSProperties}>
      <div data-theme-header-container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-theme-header-row className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="site-navbar-logo flex items-center group">
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
                <span className="text-xl md:text-2xl font-bold tracking-tight transition-transform group-hover:scale-105" style={{ color: config.logo.color2 || '#d4ff00' }}>
                  {config.logo.text2}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-8 mr-4">
              {effectiveLinks.map((link) => {
                if (!link.name || !link.href) return null;
                return (
                  <Link
                    key={link.id} data-theme-component="nav-link"
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    to={safeSettingHref(link.href)}
                    className="text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                    style={{ 
                      color: isActive(link.href) ? (config.styling.link_active_color || '#d4ff00') : config.styling.link_color 
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
              {visibleButtons.map((btn) => {
                if (!btn.name || !btn.href) return null;
                const isHexBg = btn.bgColor.startsWith('#') || (btn.bgColor.startsWith('bg-[') && btn.bgColor.endsWith(']'));
                const isHexText = btn.textColor.startsWith('#') || (btn.textColor.startsWith('text-[') && btn.textColor.endsWith(']'));

                return (
                  <Link
                    key={btn.id}
                    data-navbar-cta={btn.useGlobal ? "global" : "custom"} to={safeSettingHref(btn.href)}
                    style={{ 
                      backgroundColor: btn.useGlobal ? 'var(--studio-accent, #d4ff00)' : settingColor(btn.bgColor, '#ffffff'),
                      color: btn.useGlobal ? 'var(--studio-text-accent, #101010)' : settingColor(btn.textColor)
                    }}
                    className={`${!isHexBg ? btn.bgColor : ''} ${!isHexText ? btn.textColor : ''} px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5 hover:shadow-white/10 whitespace-nowrap`}
                  >
                    {btn.name}
                  </Link>
                );
              })}

              {/* Profile Icon & Popup */}
              <div className="relative" ref={desktopProfileRef}>
                <button
                  aria-label="Account menu" onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                aria-label="Account menu" onClick={() => setIsProfileOpen(!isProfileOpen)}
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
              aria-label="Toggle navigation" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-[#d4ff00] transition-colors bg-white/5 rounded-full border border-white/10 active:scale-90"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div data-theme-mobile-menu data-menu-style={config.mobile?.style} data-menu-position={config.mobile?.position} inert={!isOpen} aria-hidden={!isOpen} className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-black/95 border-t border-white/5">
          {effectiveLinks.map((link) => (
            <Link
              key={link.id} data-theme-component="nav-link"
              aria-current={isActive(link.href) ? 'page' : undefined}
              to={safeSettingHref(link.href)}
              className="block px-3 py-4 text-base font-semibold"
              style={{ 
                color: isActive(link.href) ? (config.styling.link_active_color || '#d4ff00') : config.styling.link_color 
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            {visibleButtons.filter(btn => btn.mobileVisible !== false).map((btn) => {
              const isHexBg = btn.bgColor.startsWith('#') || (btn.bgColor.startsWith('bg-[') && btn.bgColor.endsWith(']'));
              const isHexText = btn.textColor.startsWith('#') || (btn.textColor.startsWith('text-[') && btn.textColor.endsWith(']'));
              return (
                <Link
                  key={btn.id}
                  data-navbar-cta={btn.useGlobal ? "global" : "custom"} to={safeSettingHref(btn.href)}
                  className={`block w-full text-center ${!isHexBg ? btn.bgColor : ''} ${!isHexText ? btn.textColor : ''} px-6 py-3 rounded-xl text-base font-bold`}
                  style={{ 
                    backgroundColor: btn.useGlobal ? 'var(--studio-accent, #d4ff00)' : settingColor(btn.bgColor, '#ffffff'),
                    color: btn.useGlobal ? 'var(--studio-text-accent, #101010)' : settingColor(btn.textColor)
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {btn.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
