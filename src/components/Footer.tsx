import { useState, useEffect, type CSSProperties } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DEFAULT_FOOTER, mergeFooter, safeSettingHref, settingColor, type FooterConfig } from '../studio/sharedSettings';
import './Footer.css';

const socialIcons: Record<string, typeof Twitter> = { twitter: Twitter, x: Twitter, instagram: Instagram, facebook: Facebook, youtube: Youtube, linkedin: Linkedin, music: Music };
export function FooterView({ config, previewMobile = false, preview = false }: { config: FooterConfig; previewMobile?: boolean; preview?: boolean }) {
  const { styling, branding, cta } = config;
  const style = {
    '--footer-bg': settingColor(styling.bg_color), '--footer-text': settingColor(styling.text_color, '#ffffff'), '--footer-border': settingColor(styling.border_color, '#555555'), '--footer-link': settingColor(styling.link_color, '#ffffff'), '--footer-hover': settingColor(styling.link_hover_color, '#d4ff00'),
    '--footer-cta-bg': settingColor(cta.bg_color, '#ffffff'), '--footer-cta-text': settingColor(cta.text_color), '--footer-cta-hover': settingColor(cta.hover_bg_color, '#d4ff00'), '--footer-cta-hover-text': settingColor(cta.hover_text_color), '--footer-cta-border': settingColor(cta.border_color, '#ffffff'), '--footer-cta-radius': cta.border_radius === 'rounded-none' ? '0px' : cta.border_radius === 'rounded-full' ? '99px' : /^\d+(px|rem|%)$/.test(cta.border_radius) ? cta.border_radius : '8px',
    '--footer-padding': `${Math.max(0, Math.min(160, styling.padding ?? 36))}px`, '--footer-mobile-columns': styling.mobileColumns || 2,
  } as CSSProperties;
  const link = (href: string, label: React.ReactNode, props: Record<string, unknown> = {}) => <Link to={safeSettingHref(href)} {...props} onClick={preview ? e => e.preventDefault() : undefined}>{label}</Link>;
  return <footer className={`site-footer${previewMobile ? ' footer-preview-mobile' : preview ? ' footer-preview-desktop' : ''}${preview ? ' footer-admin-preview' : ''}`} style={style} data-footer-style={styling.useGlobal === false ? 'custom' : 'global'} data-mobile-behavior={styling.mobileBehavior} data-mobile-align={styling.mobileAlign} data-mobile-socials={styling.mobileSocials !== false}>
    <div className="site-footer-container"><div className="site-footer-top"><div className="site-footer-brand">{link('/', branding.logo_type === 'image' && branding.logo_url ? <img src={branding.logo_url} alt="Brand logo" style={{ height: branding.logo_height }} /> : <><span style={{ color: branding.color1 }}>{branding.text1}</span><span style={{ color: branding.color2 }}>{branding.text2}</span></>, { className: 'site-footer-logo', 'aria-label': 'EternaVentures home' })}<p>{branding.description}</p><div className="site-footer-socials">{config.socials.filter(social => social.active && social.url).map(social => { const Icon = socialIcons[social.platform]; return Icon ? <a href={safeSettingHref(social.url)} key={social.platform} target="_blank" rel="noopener noreferrer" onClick={preview ? e => e.preventDefault() : undefined} aria-label={`EternaVentures on ${social.platform}`}><Icon size={17} /></a> : null; })}</div></div><div className="site-footer-connect">{cta.active && link(cta.href, <>{cta.text}<ArrowRight size={22} aria-hidden="true" /></>, { className: 'site-footer-cta' })}<p>READY TO START YOUR NEXT PROJECT?<br />CONNECT WITH OUR EXPERTS TODAY.</p></div></div>
      <div className="site-footer-columns">{config.columns.filter(column => column.visible !== false).map(column => <div className="site-footer-column" key={column.id}><div className="footer-static-links"><h2>{column.title}</h2><ul>{column.links.filter(item => item.label && item.href).map(item => <li key={item.id}>{link(item.href, item.label)}</li>)}</ul></div><details className="footer-accordion-links" open><summary>{column.title}</summary><ul>{column.links.filter(item => item.label && item.href).map(item => <li key={item.id}>{link(item.href, item.label)}</li>)}</ul></details></div>)}{config.cookies?.visible !== false && <div className="site-footer-settings-column"><h2>{config.cookies?.title}</h2>{link(config.cookies?.href || '/legal/privacy', config.cookies?.label, { className: 'site-footer-cookies' })}</div>}</div>
      <div className="site-footer-bottom"><p>{config.bottom_text.replace(/^Ã‚Â©|^Â©/, '©')}</p><div><span>{config.design_text}</span><span>© {config.year}</span></div></div>
    </div>
  </footer>;
}
export default function Footer() {
  const [config, setConfig] = useState(DEFAULT_FOOTER);
  useEffect(() => { let active = true; Promise.resolve(supabase.from('site_settings').select('setting_value').eq('setting_key', 'footer_config').maybeSingle()).then(({ data }) => { if (active && data?.setting_value) setConfig(mergeFooter(data.setting_value)); }).catch(error => console.error('Unable to load footer', error)); return () => { active = false; }; }, []);
  return <FooterView config={config} />;
}
