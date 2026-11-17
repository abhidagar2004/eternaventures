import { STUDIO_FONTS } from './fonts';
export { STUDIO_FONTS } from './fonts';

export const DEVICES = ['Desktop', 'Tablet', 'Mobile'] as const;
export type ThemeDevice = typeof DEVICES[number];
export const COMPONENTS = [
  { id: 'primary', name: 'Primary Button' }, { id: 'secondary', name: 'Secondary Button' },
  { id: 'link', name: 'Link' }, { id: 'card', name: 'Card' }, { id: 'badge', name: 'Badge' },
  { id: 'field', name: 'Form Field' }, { id: 'nav', name: 'Nav Link' },
] as const;
export type ComponentId = typeof COMPONENTS[number]['id'];
export const COMPONENT_STATES = ['default', 'hover', 'focus', 'pressed', 'disabled'] as const;
export type ComponentState = typeof COMPONENT_STATES[number];
export const TYPE_ROWS = [
  { id: 'h1', label: 'H1', desktop: '72', tablet: '56', mobile: '40', weight: '800' },
  { id: 'h2', label: 'H2', desktop: '56', tablet: '44', mobile: '32', weight: '800' },
  { id: 'h3', label: 'H3', desktop: '44', tablet: '36', mobile: '28', weight: '700' },
  { id: 'h4', label: 'H4', desktop: '32', tablet: '28', mobile: '24', weight: '700' },
  { id: 'paragraph', label: 'Paragraph', desktop: '18', tablet: '17', mobile: '16', weight: '400' },
  { id: 'small', label: 'Small Text', desktop: '14', tablet: '13', mobile: '12', weight: '400' },
];

export const THEME_DEFAULTS: Record<string, string> = {
  accent: '#d4ff00', textAccent: '#101010', dark: '#080808', surface: '#f8f5f0', textDark: '#ffffff', textLight: '#101010',
  highlightUseAccent: 'true', highlightBackground: '#d4ff00', highlightText: '#101010', linkColor: '#101010', linkHover: '#728900', mutedText: '#6b7280', divider: '#d8dbe1',
  headingFont: 'Barlow Condensed', bodyFont: 'Inter', headingWeight: '800', headingStyle: 'normal', bodyStyle: 'normal', headingLineHeight: '1.05', lineHeight: '1.5', headingTracking: '0', bodyTracking: '0', headingCase: 'uppercase', bodyCase: 'none',
  bodySize: '16', ...Object.fromEntries(TYPE_ROWS.flatMap(row => [[`${row.id}Desktop`, row.desktop], [`${row.id}Tablet`, row.tablet], [`${row.id}Mobile`, row.mobile], [`${row.id}Weight`, row.weight]])),
  buttonBackground: '#d4ff00', buttonText: '#000000', buttonHover: '#e3ff57', buttonHoverText: '#000000', buttonRadius: '0', buttonPadding: '14', transition: '200', cardRadius: '14',
  respectReducedMotion: 'true', containerWidth: '1280', sectionPadding: '64', gridGap: '24', headerPosition: 'fixed',
  gutterDesktop: '48', gutterTablet: '24', gutterMobile: '20',
  paddingTopDesktop: '64', paddingBottomDesktop: '64', paddingTopTablet: '48', paddingBottomTablet: '48', paddingTopMobile: '40', paddingBottomMobile: '40',
  columnsDesktop: '3', columnsTablet: '2', columnsMobile: '1', columnGapDesktop: '24', rowGapDesktop: '24', columnGapTablet: '20', rowGapTablet: '20', columnGapMobile: '16', rowGapMobile: '16',
  headerHeightDesktop: '80', headerHeightTablet: '64', headerHeightMobile: '64', footerColumnsDesktop: '4', footerColumnsTablet: '4', footerColumnsMobile: '2',
  showHeaderDesktop: 'true', showHeaderTablet: 'true', showHeaderMobile: 'true', showFooterDesktop: 'true', showFooterTablet: 'true', showFooterMobile: 'true',
  useDesktopTablet: 'false', useDesktopMobile: 'false', mobileMenu: 'dropdown',
};

export function resolveTheme(values: Record<string, string>) {
  const theme = { ...THEME_DEFAULTS, ...values };
  for (const row of TYPE_ROWS) {
    if (!values[`${row.id}Weight`] && ['h1', 'h2'].includes(row.id)) theme[`${row.id}Weight`] = values.headingWeight || row.weight;
  }
  for (const device of DEVICES) {
    if (!values[`paragraph${device}`] && values.bodySize) theme[`paragraph${device}`] = values.bodySize;
    if (!values[`paddingTop${device}`] && values.sectionPadding) theme[`paddingTop${device}`] = values.sectionPadding;
    if (!values[`paddingBottom${device}`] && values.sectionPadding) theme[`paddingBottom${device}`] = values.sectionPadding;
    if (!values[`columnGap${device}`] && values.gridGap) theme[`columnGap${device}`] = values.gridGap;
    if (!values[`rowGap${device}`] && values.gridGap) theme[`rowGap${device}`] = values.gridGap;
  }
  return theme;
}

export const numeric = (value: string, fallback: number, min = 0, max = 2000) => Math.min(max, Math.max(min, value.trim() && Number.isFinite(Number(value)) ? Number(value) : fallback));
export const themeColor = (value: string, fallback: string) => /^(#[0-9a-f]{6}|transparent)$/i.test(value) ? value : fallback;
const shadows: Record<string, string> = { None: 'none', Soft: '0 4px 12px #00000014', Medium: '0 8px 22px #00000024', Strong: '0 14px 35px #00000040' };
const easings = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];

export function componentSettings(values: Record<string, string>, component: ComponentId, state: ComponentState) {
  const t = resolveTheme(values);
  const button = ['primary', 'secondary'].includes(component);
  const base: Record<string, string> = {
    fill: component === 'primary' ? t.buttonBackground : component === 'card' ? t.surface : component === 'badge' ? t.accent : component === 'field' ? '#ffffff' : 'transparent',
    text: component === 'primary' ? t.buttonText : component === 'secondary' || component === 'nav' ? t.textDark : t.textLight,
    border: component === 'secondary' ? '#ffffff' : t.divider, borderWidth: ['card', 'field', 'secondary'].includes(component) ? '1' : '0',
    icon: component === 'primary' ? t.buttonText : component === 'secondary' ? t.textDark : t.textLight,
    radius: component === 'card' ? t.cardRadius : button ? t.buttonRadius : component === 'field' ? '6' : '0',
    paddingX: button ? '24' : component === 'field' ? '12' : component === 'badge' ? '10' : '0',
    paddingY: button ? t.buttonPadding : component === 'field' ? '9' : component === 'badge' ? '6' : '0',
    weight: button ? '700' : '500', gap: '8', shadow: 'None', duration: t.transition, easing: 'ease-out',
    underline: component === 'link' ? 'true' : 'false', focusColor: '#1264ff', focusWidth: '2', opacity: state === 'disabled' ? '0.5' : '1', useAccent: 'false',
  };
  const customLegacyFill = values.buttonBackground && values.buttonBackground !== THEME_DEFAULTS.buttonBackground && values.buttonBackground !== t.accent;
  const customLegacyText = values.buttonText && !['#000000', '#101010'].includes(values.buttonText.toLowerCase());
  if (component === 'primary' && !customLegacyFill && !customLegacyText) base.useAccent = 'true';
  if (component === 'link') { base.text = t.linkColor; base.icon = t.linkColor; }
  const defaultPrefix = `component.${component}.default.`;
  Object.keys(base).forEach(property => { if (values[defaultPrefix + property] !== undefined) base[property] = values[defaultPrefix + property]; });
  if (state === 'hover' && component === 'primary') { base.fill = t.buttonHover; base.text = t.buttonHoverText; base.icon = t.buttonHoverText; base.useAccent = 'false'; }
  if (state === 'hover' && ['link', 'nav'].includes(component)) { base.text = component === 'nav' ? t.accent : t.linkHover; base.icon = base.text; }
  if (state === 'focus' && component === 'field') base.border = t.accent;
  const statePrefix = `component.${component}.${state}.`;
  Object.keys(base).forEach(property => { if (values[statePrefix + property] !== undefined) base[property] = values[statePrefix + property]; });
  if (base.useAccent === 'true') { base.fill = t.accent; base.text = t.textAccent; base.icon = t.textAccent; }
  return base;
}

export function componentCssProperties(settings: Record<string, string>, state: ComponentState) {
  const css: Record<string, string> = {
    'background-color': themeColor(settings.fill, 'transparent'), color: themeColor(settings.text, '#101010'),
    'border-color': themeColor(settings.border, '#d8dbe1'), 'border-width': `${numeric(settings.borderWidth, 0, 0, 12)}px`, 'border-style': 'solid',
    'border-radius': `${numeric(settings.radius, 0, 0, 100)}px`, 'padding-left': `${numeric(settings.paddingX, 24, 0, 80)}px`, 'padding-right': `${numeric(settings.paddingX, 24, 0, 80)}px`,
    'padding-top': `${numeric(settings.paddingY, 14, 0, 80)}px`, 'padding-bottom': `${numeric(settings.paddingY, 14, 0, 80)}px`,
    'font-weight': String(numeric(settings.weight, 700, 100, 900)), gap: `${numeric(settings.gap, 8, 0, 40)}px`, 'box-shadow': shadows[settings.shadow] || 'none',
    'transition-duration': `${numeric(settings.duration, 200, 0, 3000)}ms`, 'transition-timing-function': easings.includes(settings.easing) ? settings.easing : 'ease-out',
    'text-decoration-line': settings.underline === 'true' ? 'underline' : 'none', opacity: String(numeric(settings.opacity, 1, 0, 1)),
  };
  if (state === 'focus') { css.outline = `${numeric(settings.focusWidth, 2, 1, 8)}px solid ${themeColor(settings.focusColor, '#1264ff')}`; css['outline-offset'] = '3px'; }
  return css;
}

const componentSelectors: Record<ComponentId, string> = {
  primary: '.home-pill:not(.home-pill-outline),.hero-banner-button,.academy-button-neon,.contact-submit,.service-pill,.project-modal-button,.insights-growth-cta > a,[data-navbar-cta="global"]',
  secondary: '.home-pill-outline,.practice-button-outline,.insights-explore',
  link: '.home-text-link,.practice-card-link,.project-card-action,.insight-read,.project-detail-download',
  card: '.home-practice-card,.project-card,.home-review,.service-feature,.project-review,.home-blog-grid article',
  badge: '.project-category,.academy-category,.service-feature-number,.about-discipline-number',
  field: '.contact-form input,.contact-form textarea,.project-brochure-form input,.project-brochure-form select,.project-brochure-form textarea,.academy-search input,.insights-search input',
  nav: '[data-theme-component="nav-link"]',
};
const stateSuffix: Record<ComponentState, string> = { default: '', hover: ':hover', focus: ':focus-visible', pressed: ':active', disabled: ':disabled' };
const containers = '.home-container,.practice-container,.project-container,.about-container,.academy-container,.service-container,.contact-container,.insights-container,.site-footer-container,[data-theme-header-container]';
const heroSections = '.home-hero,.practices-hero,.projects-hero,.academy-hero,.about-studio-hero,.service-hero,.contact-hero,.insights-hero';
const lightSections = '.home-practices,.home-projects,.home-blogs,.projects-catalog,.academy-catalog,.insights-page,.service-capabilities,.service-process,.contact-project,.contact-next,.about-disciplines-section,.about-studio-clarity';
const darkSections = '.home-reference,.home-hero,.service-hero,.practices-hero,.projects-hero,.about-studio-hero,.contact-hero,.insights-hero,.academy-hero,.practice-method,.projects-reviews,.service-deliverables,.contact-faq';
const highlightSelectors = '.home-highlight,.practice-highlight,.project-highlight,.service-highlight,.contact-highlight,.academy-highlight,.about-studio-highlight,.insights-highlight';
const inverseHighlights = '.home-highlight-inverse,.practice-highlight-inverse,.project-highlight-inverse,.service-highlight-inverse,.contact-highlight-dark,.insights-highlight-inverse';
const typeSelector: Record<string, string> = { h1: 'main h1', h2: 'main h2', h3: 'main h3', h4: 'main h4', paragraph: 'main p', small: 'main small,main .home-eyebrow,main .practice-eyebrow,main .insight-meta' };
const declarations = (properties: Record<string, string>) => Object.entries(properties).map(([key, value]) => `${key}:${value} !important;`).join('');
const componentProperties: Record<string, string[]> = {
  fill: ['background-color'], text: ['color'], border: ['border-color'], borderWidth: ['border-width','border-style'], radius: ['border-radius'], paddingX: ['padding-left','padding-right'], paddingY: ['padding-top','padding-bottom'],
  weight: ['font-weight'], gap: ['gap'], shadow: ['box-shadow'], duration: ['transition-duration'], easing: ['transition-timing-function'], underline: ['text-decoration-line'], opacity: ['opacity'], focusColor: ['outline','outline-offset'], focusWidth: ['outline','outline-offset'], useAccent: ['background-color','color'],
};

function configuredProperties(values: Record<string, string>, component: ComponentId, state: ComponentState) {
  const properties = new Set<string>();
  const prefix = `component.${component}.${state}.`;
  Object.keys(values).filter(key => key.startsWith(prefix)).forEach(key => (componentProperties[key.slice(prefix.length)] || []).forEach(property => properties.add(property)));
  // Preserve published settings from the first Studio theme editor.
  if (component === 'primary') {
    if (state === 'default') ['background-color','color','border-radius','padding-top','padding-bottom','transition-duration'].forEach(property => properties.add(property));
    if (state === 'hover') { properties.add('background-color'); properties.add('color'); }
  }
  if (component === 'secondary' && state === 'default' && 'buttonRadius' in values) properties.add('border-radius');
  if (component === 'card' && state === 'default' && 'cardRadius' in values) properties.add('border-radius');
  if (component === 'link' && ((state === 'default' && 'linkColor' in values) || (state === 'hover' && 'linkHover' in values))) properties.add('color');
  return properties;
}

export function layoutSettings(values: Record<string, string>, device: ThemeDevice) {
  const t = resolveTheme(values);
  const source = device !== 'Desktop' && t[`useDesktop${device}`] === 'true' ? 'Desktop' : device;
  return { gutter: t[`gutter${source}`], top: t[`paddingTop${source}`], bottom: t[`paddingBottom${source}`], columns: t[`columns${source}`], columnGap: t[`columnGap${source}`], rowGap: t[`rowGap${source}`], header: t[`headerHeight${source}`], footerColumns: t[`footerColumns${source}`], showHeader: t[`showHeader${source}`], showFooter: t[`showFooter${source}`] };
}

export function studioThemeCss(values: Record<string, string>) {
  if (!Object.keys(values).length) return '';
  const t = resolveTheme(values);
  const accent = themeColor(t.accent, '#d4ff00');
  const heading = STUDIO_FONTS.includes(t.headingFont) ? t.headingFont : 'Barlow Condensed';
  const body = STUDIO_FONTS.includes(t.bodyFont) ? t.bodyFont : 'Inter';
  const highlightBg = t.highlightUseAccent === 'true' ? accent : themeColor(t.highlightBackground, accent);
  const highlightFg = themeColor(t.highlightUseAccent === 'true' ? t.textAccent : t.highlightText, '#101010');
  let css = `
    :root { --studio-accent:${accent}; --studio-text-accent:${themeColor(t.textAccent,'#101010')}; --studio-highlight-background:${highlightBg}; --studio-highlight-text:${highlightFg}; --studio-footer-bg:${themeColor(t.dark,'#080808')}; --studio-footer-text:${themeColor(t.textDark,'#ffffff')}; }
    body { font-family:'${body}',sans-serif !important; }
    #root > div,main > div,.site-footer { font-family:'${body}',sans-serif !important; }
    [data-theme-header-container] { padding-left:0 !important;padding-right:0 !important; }
    .home-reference { --home-acid:${accent}; } .practices-page { --practice-acid:${accent}; } .projects-page { --project-acid:${accent}; }
    .service-detail { --service-acid:${accent}; } .academy { --acid:${accent}; } .insights-page { --insights-acid:${accent}; }
    main :is(h1,h2,h3,h4) { font-family:'${heading}',sans-serif !important; font-style:${t.headingStyle === 'italic' ? 'italic' : 'normal'} !important; line-height:${numeric(t.headingLineHeight,1.05,.8,2)} !important; letter-spacing:${numeric(t.headingTracking,0,-8,20)}px !important; text-transform:${['none','uppercase','lowercase','capitalize'].includes(t.headingCase) ? t.headingCase : 'uppercase'} !important; }
    main p,main small { font-family:'${body}',sans-serif !important; font-style:${t.bodyStyle === 'italic' ? 'italic' : 'normal'} !important; line-height:${numeric(t.lineHeight,1.5,1,2.5)} !important; letter-spacing:${numeric(t.bodyTracking,0,-3,12)}px !important; text-transform:${['none','uppercase','lowercase','capitalize'].includes(t.bodyCase) ? t.bodyCase : 'none'} !important; }
    ${highlightSelectors} { background:${highlightBg} !important; color:${highlightFg} !important; }
    ${inverseHighlights} { background:${themeColor(t.dark,'#080808')} !important; color:${highlightBg} !important; }
    ${darkSections} { background-color:${themeColor(t.dark,'#080808')}; color:${themeColor(t.textDark,'#ffffff')}; }
    ${lightSections} { background-color:${themeColor(t.surface,'#f8f5f0')}; color:${themeColor(t.textLight,'#101010')}; }
    .insight-meta,.home-practice-number { color:${themeColor(t.mutedText,'#6b7280')} !important; }
    .projects-section-heading,.insights-filters,.contact-faq-item { border-color:${themeColor(t.divider,'#d8dbe1')}; }
    ${containers} { max-width:${numeric(t.containerWidth,1280,600,1920)}px !important; }
    [data-theme-navbar] { position:${t.headerPosition === 'absolute' ? 'absolute' : 'fixed'} !important; }
  `;
  COMPONENTS.forEach(({ id }) => COMPONENT_STATES.forEach(state => {
    const settings = componentSettings(values, id, state);
    const properties = configuredProperties(values,id,state);
    const resolved = Object.fromEntries(Object.entries(componentCssProperties(settings,state)).filter(([property]) => properties.has(property)));
    const suffix = state === 'focus' && id === 'card' ? ':focus-within' : stateSuffix[state];
    const selectors = componentSelectors[id].split(',').flatMap(selector => state === 'disabled' ? [selector + suffix, selector + '[aria-disabled="true"]'] : [selector + suffix]).join(',');
    if (Object.keys(resolved).length) css += `${selectors}{${declarations(resolved)}}`;
    if (`component.${id}.${state}.icon` in values || values[`component.${id}.${state}.useAccent`] === 'true') css += `${selectors.split(',').map(selector => selector + ' svg').join(',')}{color:${themeColor(settings.icon,'#101010')} !important;}`;
  }));
  css += `[data-theme-component="nav-link"][aria-current="page"]{color:${accent} !important;}`;
  DEVICES.forEach(device => {
    const layout = layoutSettings(values, device);
    let rules = TYPE_ROWS.map(row => `${typeSelector[row.id]}{font-size:${numeric(t[`${row.id}${device}`],Number(row.desktop),10,160)}px !important;font-weight:${numeric(t[`${row.id}Weight`],Number(row.weight),100,900)} !important;}`).join('');
    rules += `${containers}{width:calc(100% - ${numeric(layout.gutter,20,0,200) * 2}px) !important;}`;
    rules += `.home-practices,.home-blogs,.service-capabilities{padding-top:${numeric(layout.top,64,0,240)}px !important;padding-bottom:${numeric(layout.bottom,64,0,240)}px !important;}`;
    rules += `.home-practice-grid,.practice-grid,.projects-grid,.service-feature-grid,.about-discipline-grid{column-gap:${numeric(layout.columnGap,24,0,100)}px !important;row-gap:${numeric(layout.rowGap,24,0,100)}px !important;}`;
    if (`columns${device}` in values || (device !== 'Desktop' && t[`useDesktop${device}`] === 'true')) rules += `.home-practice-grid,.practice-grid{grid-template-columns:repeat(${numeric(layout.columns,3,1,6)},minmax(0,1fr)) !important;}`;
    if (`footerColumns${device}` in values || (device !== 'Desktop' && t[`useDesktop${device}`] === 'true')) rules += `.site-footer-columns{grid-template-columns:repeat(${numeric(layout.footerColumns,4,1,6)},minmax(0,1fr)) !important;}`;
    const header = layout.showHeader === 'false' ? 0 : numeric(layout.header,80,40,160);
    rules += `:root{--studio-header-height:${header}px;}[data-theme-header-row]{height:${header}px !important;}[data-theme-navbar]{display:${layout.showHeader === 'false' ? 'none' : 'block'} !important;}.site-footer{display:${layout.showFooter === 'false' ? 'none' : 'block'} !important;}${heroSections}{padding-top:${header}px !important;}`;
    if (device !== 'Mobile') rules += `.home-hero-media,.practices-banner,.projects-banner,.academy-hero-art,.about-studio-art,.service-hero-art,.contact-hero-art,.insights-hero-art{top:${header}px !important;height:calc(100% - ${header}px) !important;}`;
    if (`paddingTop${device}` in values || `paddingBottom${device}` in values) rules += `.home-hero-copy,.service-hero-content,.contact-hero-content,.practices-hero-content,.projects-hero-content,.about-studio-intro,.academy-hero-inner{padding-top:${numeric(layout.top,64,0,240)}px !important;padding-bottom:${numeric(layout.bottom,64,0,240)}px !important;}`;
    css += device === 'Desktop' ? `@media(min-width:1001px){${rules}}` : device === 'Tablet' ? `@media(min-width:601px) and (max-width:1000px){${rules}}` : `@media(max-width:600px){${rules}}`;
  });
  if (t.mobileMenu === 'drawer') css += '@media(max-width:767px){[data-theme-mobile-menu]{position:fixed !important;top:var(--studio-header-height,64px);right:0;width:min(340px,90vw);height:calc(100dvh - var(--studio-header-height,64px));overflow:auto;box-shadow:-20px 0 60px #0006;}}';
  if (t.respectReducedMotion === 'true') css += `@media(prefers-reduced-motion:reduce){${Object.values(componentSelectors).join(',')}{transition-duration:0ms !important;}}`;
  return css;
}

// WCAG relative-luminance contrast, https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
export function contrastRatio(background: string, foreground: string) {
  if (![background, foreground].every(value => /^#[0-9a-f]{6}$/i.test(value))) return 0;
  function luminance(hex: string) {
    const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
  }
  const values = [luminance(background), luminance(foreground)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}
