export interface NavItem { id: string; name: string; href: string; visible?: boolean }
export interface NavAction extends NavItem { bgColor: string; textColor: string; useGlobal?: boolean; mobileVisible?: boolean }
export interface NavbarConfig {
  logo: { type: 'text' | 'image'; text1?: string; text2?: string; color1?: string; color2?: string; imageUrl?: string; height?: number; width?: number; desktopSize?: number; mobileSize?: number };
  styling: { navbar_bg: string; link_color: string; link_hover_color: string; link_active_color: string; opacity?: number; showBorder?: boolean; borderWidth?: number };
  links: NavItem[]; buttons: NavAction[];
  mobile?: { style: 'drawer' | 'dropdown'; position: 'left' | 'right' };
}
export interface FooterColumn { id: string; title: string; visible?: boolean; links: { id: string; label: string; href: string }[] }
export interface FooterConfig {
  styling: { bg_color: string; text_color: string; border_color: string; accent_color: string; link_color: string; link_hover_color: string; useGlobal?: boolean; padding?: number; mobileBehavior?: 'stack' | 'accordion'; mobileColumns?: number; mobileAlign?: 'left' | 'center'; mobileSocials?: boolean };
  branding: { logo_type: 'text' | 'image'; text1: string; color1: string; text2: string; color2: string; logo_url: string; logo_height: number; description: string };
  socials: { platform: string; url: string; active: boolean }[];
  columns: FooterColumn[];
  cta: { text: string; href: string; active: boolean; bg_color: string; text_color: string; hover_bg_color: string; hover_text_color: string; border_color: string; border_radius: string };
  bottom_text: string; design_text?: string; year?: number; cookies?: { visible: boolean; title: string; label: string; href: string };
}
export const DEFAULT_NAVBAR: NavbarConfig = {
  logo: { type: 'text', text1: 'Eterna', text2: 'Ventures', color1: '#ffffff', color2: '#d4ff00', height: 40, width: 150, desktopSize: 28, mobileSize: 24 },
  styling: { navbar_bg: '#000000', link_color: '#d1d5db', link_hover_color: '#ffffff', link_active_color: '#d4ff00', opacity: 100, showBorder: true, borderWidth: 1 },
  links: ['Services', 'Courses', 'Projects', 'About', 'Blogs'].map(name => ({ id: name.toLowerCase(), name, href: '/' + name.toLowerCase(), visible: true })),
  buttons: [{ id: 'book', name: 'Book a Call', href: '/contact', bgColor: '#ffffff', textColor: '#000000', mobileVisible: true, useGlobal: false }],
  mobile: { style: 'dropdown', position: 'right' },
};
export const DEFAULT_FOOTER: FooterConfig = {
  styling: { bg_color: '#000000', text_color: '#ffffff', border_color: '#555555', accent_color: '#d4ff00', link_color: '#ffffff', link_hover_color: '#d4ff00', useGlobal: true, padding: 36, mobileBehavior: 'stack', mobileColumns: 2, mobileAlign: 'left', mobileSocials: true },
  branding: { logo_type: 'text', text1: 'ETERNA', color1: '#ffffff', text2: 'VENTURES', color2: '#d4ff00', logo_url: '', logo_height: 40, description: 'Premium Digital Media Agency specialized in social media strategy, branding, and performance marketing.' },
  socials: ['twitter', 'instagram', 'facebook', 'youtube', 'linkedin'].map(platform => ({ platform, url: '', active: true })),
  columns: [
    { id: 'explore', title: 'Explore', links: [{ id: 'services', label: 'Services', href: '/services' }, { id: 'insights', label: 'Insights', href: '/blogs' }, { id: 'cases', label: 'Case Studies', href: '/projects' }] },
    { id: 'legal', title: 'Legal', links: [{ id: 'terms', label: 'Terms & Conditions', href: '/legal/terms' }, { id: 'privacy', label: 'Privacy Policy', href: '/legal/privacy' }, { id: 'copyright', label: 'Copyright Policy', href: '/legal/copyright' }] },
    { id: 'company', title: 'Company', links: [{ id: 'about', label: 'About Us', href: '/about' }, { id: 'contact', label: 'Contact', href: '/contact' }] },
  ],
  cta: { text: 'Connect With Us', href: '/contact', active: true, bg_color: '#ffffff', text_color: '#000000', hover_bg_color: '#d4ff00', hover_text_color: '#000000', border_color: '#ffffff', border_radius: 'rounded-full' },
  bottom_text: `© ${new Date().getFullYear()} ETERNAVENTURES LLC, ALL RIGHTS RESERVED GLOBALLY.`, design_text: 'DESIGN BY EV', year: new Date().getFullYear(),
  cookies: { visible: true, title: 'Settings', label: 'COOKIES POLICY', href: '/legal/privacy' },
};
export function mergeNavbar(value?: Partial<NavbarConfig>): NavbarConfig {
  return { ...DEFAULT_NAVBAR, ...value, logo: { ...DEFAULT_NAVBAR.logo, ...value?.logo }, styling: { ...DEFAULT_NAVBAR.styling, ...value?.styling }, mobile: { ...DEFAULT_NAVBAR.mobile, ...value?.mobile }, links: value?.links ?? DEFAULT_NAVBAR.links, buttons: value?.buttons ?? DEFAULT_NAVBAR.buttons };
}
export function mergeFooter(value?: Partial<FooterConfig>): FooterConfig {
  return { ...DEFAULT_FOOTER, ...value, styling: { ...DEFAULT_FOOTER.styling, ...value?.styling }, branding: { ...DEFAULT_FOOTER.branding, ...value?.branding }, cta: { ...DEFAULT_FOOTER.cta, ...value?.cta }, cookies: { ...DEFAULT_FOOTER.cookies, ...value?.cookies }, columns: value?.columns ?? DEFAULT_FOOTER.columns, socials: value?.socials ?? DEFAULT_FOOTER.socials };
}
// Accept both stored legacy Tailwind color values and new color-picker values.
export function settingColor(value: string | undefined, fallback = '#000000'): string {
  if (!value) return fallback;
  if (/^#[\da-f]{3,8}$/i.test(value) || /^(rgb|hsl)a?\([\d\s.,%/]+\)$/.test(value) || value === 'transparent') return value;
  const bracket = value.match(/^(?:bg|text)-\[(#[\da-f]{3,8})\]$/i);
  if (bracket) return bracket[1];
  const legacy = value.match(/^(?:bg|text)-(black|white)(?:\/(\d+))?$/);
  if (legacy) { const n = legacy[1] === 'black' ? 0 : 255; return legacy[2] ? `rgba(${n},${n},${n},${Number(legacy[2]) / 100})` : legacy[1] === 'black' ? '#000000' : '#ffffff'; }
  return fallback;
}
export function safeSettingHref(value: string): string {
  return /^(?:\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(value.trim()) ? value.trim() : '/';
}
export function moveSettingItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const result = [...items]; const [item] = result.splice(from, 1); result.splice(to, 0, item); return result;
}
