import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

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

const DEFAULT_FOOTER: FooterConfig = {
  styling: { bg_color: '#000000', text_color: '#ffffff', border_color: '#555555', accent_color: '#d4ff00', link_color: '#ffffff', link_hover_color: '#d4ff00' },
  branding: { logo_type: 'text', text1: 'ETERNA', color1: '#ffffff', text2: 'VENTURES', color2: '#d4ff00', logo_url: '', logo_height: 40, description: 'Premium Digital Media Agency specialized in social media strategy, branding, and performance marketing.' },
  socials: [],
  columns: [
    { id: 'explore', title: 'Explore', links: [{ id: 'services', label: 'Services', href: '/services' }, { id: 'insights', label: 'Insights', href: '/blogs' }, { id: 'cases', label: 'Case Studies', href: '/projects' }] },
    { id: 'legal', title: 'Legal', links: [{ id: 'terms', label: 'Terms & Conditions', href: '/legal/terms' }, { id: 'privacy', label: 'Privacy Policy', href: '/legal/privacy' }, { id: 'copyright', label: 'Copyright Policy', href: '/legal/copyright' }] },
    { id: 'company', title: 'Company', links: [{ id: 'about', label: 'About Us', href: '/about' }, { id: 'contact', label: 'Contact', href: '/contact' }] },
  ],
  cta: { text: 'Connect With Us', href: '/contact', active: true, bg_color: '#ffffff', text_color: '#000000', hover_bg_color: '#d4ff00', hover_text_color: '#000000', border_color: '#ffffff', border_radius: 'rounded-full' },
  bottom_text: `© ${new Date().getFullYear()} ETERNAVENTURES LLC, ALL RIGHTS RESERVED GLOBALLY.`,
};
const socialIcons: Record<string, typeof Twitter> = { twitter: Twitter, instagram: Instagram, facebook: Facebook, youtube: Youtube, linkedin: Linkedin, music: Music };
export default function Footer() {
  const [config, setConfig] = useState(DEFAULT_FOOTER);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase.from('site_settings').select('setting_value').eq('setting_key', 'footer_config').single();
      if (!cancelled && data?.setting_value) {
        const value = data.setting_value as Partial<FooterConfig>;
        setConfig({ ...DEFAULT_FOOTER, ...value, styling: { ...DEFAULT_FOOTER.styling, ...value.styling }, branding: { ...DEFAULT_FOOTER.branding, ...value.branding }, cta: { ...DEFAULT_FOOTER.cta, ...value.cta }, columns: value.columns?.length ? value.columns : DEFAULT_FOOTER.columns, socials: value.socials || [], bottom_text: value.bottom_text || DEFAULT_FOOTER.bottom_text });
      }
    }
    load().catch(error => console.error('Unable to load footer', error));
    return () => { cancelled = true; };
  }, []);
  return <footer className="site-footer"><div className="site-footer-container">
    <div className="site-footer-top"><div className="site-footer-brand"><Link className="site-footer-logo" to="/" aria-label="EternaVentures home">{config.branding.logo_type === 'image' && config.branding.logo_url ? <img src={config.branding.logo_url} alt="EternaVentures" style={{ height: config.branding.logo_height }} /> : <><span>{config.branding.text1 || 'ETERNA'}</span><span>{config.branding.text2 || 'VENTURES'}</span></>}</Link><p>{config.branding.description || DEFAULT_FOOTER.branding.description}</p><div className="site-footer-socials">{config.socials.filter(social => social.active && social.url).map(social => { const Icon = socialIcons[social.platform]; return Icon ? <a href={social.url} key={social.platform} target="_blank" rel="noopener noreferrer" aria-label={`EternaVentures on ${social.platform}`}><Icon size={17} /></a> : null; })}</div></div><div className="site-footer-connect">{config.cta.active && <Link className="site-footer-cta" to={config.cta.href || '/contact'}>{config.cta.text || 'Connect With Us'} <ArrowRight size={22} aria-hidden="true" /></Link>}<p>READY TO START YOUR NEXT PROJECT?<br />CONNECT WITH OUR EXPERTS TODAY.</p></div></div>
    <div className="site-footer-columns">{config.columns.map(column => <div key={column.id}><h2>{column.title}</h2><ul>{column.links.filter(link => link.label && link.href).map(link => <li key={link.id}><Link to={link.href}>{link.label}</Link></li>)}</ul></div>)}<div><h2>Settings</h2><Link className="site-footer-cookies" to="/legal/privacy">COOKIES POLICY</Link></div></div>
    <div className="site-footer-bottom"><p>{config.bottom_text.replace(/^Â©/, '©')}</p><div><span>DESIGN BY EV</span><span>© {new Date().getFullYear()}</span></div></div>
  </div></footer>;
}
