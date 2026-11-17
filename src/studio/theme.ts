export const THEME_DEFAULTS: Record<string, string> = {
  accent: '#d4ff00', dark: '#080808', surface: '#f8f5f0', textDark: '#ffffff', textLight: '#101010',
  headingFont: 'Barlow Condensed', bodyFont: 'Inter', headingWeight: '800',
  h1Desktop: '72', h1Tablet: '56', h1Mobile: '40', h2Desktop: '56', h2Tablet: '44', h2Mobile: '32', bodySize: '16', lineHeight: '1.5',
  buttonBackground: '#d4ff00', buttonText: '#000000', buttonHover: '#e3ff57', buttonHoverText: '#000000', buttonRadius: '0', buttonPadding: '14', transition: '200',
  cardRadius: '14', containerWidth: '1280', sectionPadding: '64', gridGap: '24', headerPosition: 'fixed',
};
export const STUDIO_FONTS = ['Inter', 'Barlow Condensed', 'Space Grotesk', 'Arial', 'Georgia'];

const buttons = '.home-pill,.hero-banner-button,.academy-button-neon,.contact-submit,.service-pill,.project-modal-button';
const headings = 'main h1,main h2,main h3,main h4';
const containers = '.home-container,.practice-container,.project-container,.about-container,.academy-container,.service-container,.contact-container,.insights-container';
const number = (value: string, fallback: number, min: number, max: number) => Math.min(max, Math.max(min, value.trim() && Number.isFinite(Number(value)) ? Number(value) : fallback));
const color = (value: string, fallback: string) => /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;

export function studioThemeCss(values: Record<string, string>) {
  if (!Object.keys(values).length) return '';
  const t = { ...THEME_DEFAULTS, ...values };
  const accent = color(t.accent, '#d4ff00');
  const heading = STUDIO_FONTS.includes(t.headingFont) ? t.headingFont : 'Barlow Condensed';
  const body = STUDIO_FONTS.includes(t.bodyFont) ? t.bodyFont : 'Inter';
  return `
    body { font-family: '${body}', sans-serif !important; }
    main { font-family: '${body}', sans-serif; }
    .home-reference { --home-acid:${accent}; }
    .practices-page { --practice-acid:${accent}; }
    .projects-page { --project-acid:${accent}; }
    .service-detail { --service-acid:${accent}; }
    .academy { --acid:${accent}; }
    .insights-page { --insights-acid:${accent}; }
    ${headings} { font-family:'${heading}',sans-serif !important; font-weight:${number(t.headingWeight,800,400,900)} !important; }
    main h1 { font-size:${number(t.h1Desktop,72,24,140)}px !important; }
    main h2 { font-size:${number(t.h2Desktop,56,20,100)}px !important; }
    main p { font-size:${number(t.bodySize,16,12,28)}px; line-height:${number(t.lineHeight,1.5,1,2.5)}; }
    .home-highlight,.practice-highlight,.project-highlight,.service-highlight,.contact-highlight,.academy-highlight,.about-studio-highlight { background:${accent}; }
    .home-highlight-inverse,.practice-highlight-inverse,.project-highlight-inverse,.service-highlight-inverse,.contact-highlight-dark { background:#000; color:${accent}; }
    .home-reference,.home-hero,.service-hero,.practices-hero,.projects-hero,.about-studio-hero,.contact-hero,.insights-hero,.academy-hero,.practice-method,.projects-reviews,.service-deliverables,.contact-faq { background:${color(t.dark,'#080808')}; color:${color(t.textDark,'#ffffff')}; }
    .home-practices,.home-projects,.home-blogs,.projects-catalog,.academy-catalog,.insights-page,.service-capabilities,.service-process,.contact-project,.contact-next,.about-disciplines-section,.about-studio-clarity { background:${color(t.surface,'#f8f5f0')}; color:${color(t.textLight,'#101010')}; }
    ${buttons} { background:${color(t.buttonBackground,accent)} !important; color:${color(t.buttonText,'#000000')} !important; border-radius:${number(t.buttonRadius,0,0,100)}px !important; padding-top:${number(t.buttonPadding,14,4,40)}px !important; padding-bottom:${number(t.buttonPadding,14,4,40)}px !important; transition-duration:${number(t.transition,200,0,2000)}ms; }
    ${buttons.split(',').map(selector => selector + ':hover').join(',')} { background:${color(t.buttonHover,'#e3ff57')} !important; color:${color(t.buttonHoverText,'#000000')} !important; }
    .home-practice-card,.project-card,.home-review,.service-feature { border-radius:${number(t.cardRadius,14,0,60)}px !important; }
    ${containers} { max-width:${number(t.containerWidth,1280,800,1920)}px !important; }
    .home-practice-grid,.projects-grid,.service-feature-grid,.about-discipline-grid { gap:${number(t.gridGap,24,0,80)}px !important; }
    .home-practices,.home-blogs,.service-capabilities { padding-top:${number(t.sectionPadding,64,0,180)}px; padding-bottom:${number(t.sectionPadding,64,0,180)}px; }
    nav.fixed { position:${t.headerPosition === 'absolute' ? 'absolute' : 'fixed'}; }
    @media(max-width:1000px) { main h1 { font-size:${number(t.h1Tablet,56,24,100)}px !important; } main h2 { font-size:${number(t.h2Tablet,44,20,80)}px !important; } }
    @media(max-width:600px) { main h1 { font-size:${number(t.h1Mobile,40,22,72)}px !important; } main h2 { font-size:${number(t.h2Mobile,32,20,60)}px !important; } }
  `;
}
