import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterConfig {
  styling: {
    bg_color: string;
    text_color: string;
    border_color: string;
    accent_color: string;
    link_color: string;
    link_hover_color: string;
  };
  branding: {
    logo_type: 'text' | 'image';
    text1: string;
    color1: string;
    text2: string;
    color2: string;
    logo_url: string;
    logo_height: number;
    description: string;
  };
  socials: Array<{ platform: string; url: string; active: boolean }>;
  columns: Array<{
    id: string;
    title: string;
    links: Array<{ id: string; label: string; href: string }>;
  }>;
  cta: {
    text: string;
    href: string;
    active: boolean;
    bg_color: string;
    text_color: string;
    hover_bg_color: string;
    hover_text_color: string;
    border_color: string;
    border_radius: string;
  };
  bottom_text: string;
}

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'footer_config')
        .single();
      
      if (data?.setting_value) {
        const val = data.setting_value as Partial<FooterConfig>;
        setConfig({
          ...val,
          styling: {
            bg_color: '#111111', text_color: '#ffffff', border_color: '#1f2937', accent_color: '#2596be',
            link_color: '#9ca3af', link_hover_color: '#ffffff',
            ...(val.styling || {})
          },
          branding: {
            logo_type: 'text', text1: 'Eterna', color1: '#ffffff', text2: 'Ventures', color2: '#2596be',
            logo_url: '', logo_height: 40, description: '',
            ...(val.branding || {})
          },
          cta: {
            text: 'Connect With Us', href: '/contact', active: true,
            bg_color: '#ffffff', text_color: '#000000', hover_bg_color: 'transparent', hover_text_color: '#ffffff',
            border_color: '#ffffff', border_radius: 'rounded-none',
            ...(val.cta || {})
          },
          socials: val.socials || [],
          columns: val.columns || [],
          bottom_text: val.bottom_text || ''
        } as FooterConfig);
      }
    } catch (err) {
      console.error('Error loading footer config', err);
    }
  };

  if (!config) return null;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'youtube': return <Youtube size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'music': return <Music size={18} />;
      default: return null;
    }
  };

  const styling = {
    backgroundColor: config.styling.bg_color,
    color: config.styling.text_color,
    borderColor: config.styling.border_color
  };

  return (
    <footer style={styling} className="py-20 border-t relative">
      <style>{`
        .custom-footer-link {
          color: ${config.styling.link_color};
          transition: color 0.2s ease;
        }
        .custom-footer-link:hover {
          color: ${config.styling.link_hover_color};
        }
        .custom-footer-cta {
          background-color: ${config.cta.bg_color};
          color: ${config.cta.text_color};
          border-color: ${config.cta.border_color};
        }
        .custom-footer-cta:hover {
          background-color: ${config.cta.hover_bg_color};
          color: ${config.cta.hover_text_color};
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-md">
            <Link to="/" className="inline-block mb-8">
              {config.branding.logo_type === 'text' ? (
                <div className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">
                  {config.branding.text1 && <span style={{ color: config.branding.color1 }}>{config.branding.text1}</span>}
                  {config.branding.text2 && <span style={{ color: config.branding.color2 }}>{config.branding.text2}</span>}
                </div>
              ) : (
                <img 
                  src={config.branding.logo_url} 
                  alt="Logo" 
                  style={{ height: `${config.branding.logo_height}px` }} 
                  className="object-contain"
                />
              )}
            </Link>
            {config.branding.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                {config.branding.description}
              </p>
            )}
            <div className="flex gap-4">
              {config.socials.filter(s => s.active).map(social => (
                <a 
                  key={social.platform}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all border border-gray-800 hover:scale-110"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.styling.accent_color}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-left lg:text-right flex flex-col items-start lg:items-end">
            {config.cta.active && config.cta.text && (
              <Link 
                to={config.cta.href} 
                className={`group inline-flex items-center gap-3 px-10 py-4 font-bold uppercase tracking-wider transition-all border-2 mb-8 custom-footer-cta ${config.cta.border_radius}`}
              >
                {config.cta.text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <div className="hidden lg:block text-xs uppercase tracking-widest text-gray-500 font-medium">
              Ready to start your next project?<br />
              Connect with our experts today.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t pt-20" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {config.columns.map(column => (
            <div key={column.id}>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-500">{column.title}</h4>
              <div className="flex flex-col gap-4">
                {column.links.map(link => (
                  <Link 
                    key={link.id} 
                    to={link.href} 
                    className="text-sm font-medium custom-footer-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex flex-col items-start md:items-end col-span-2 md:col-span-1">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Settings</h4>
             <button 
                className="text-xs font-bold uppercase tracking-widest px-6 py-3 border border-gray-800 hover:border-white transition-all rounded-sm"
                style={{ color: config.styling.text_color }}
             >
               Cookies Policy
             </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest text-center md:text-left leading-loose max-w-2xl">
            {config.bottom_text}
          </div>
          <div className="flex gap-8 text-[10px] text-gray-600 uppercase tracking-widest font-bold whitespace-nowrap">
             <span>Design by EV</span>
             <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
