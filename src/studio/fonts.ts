export interface StudioFont {
  name: string;
  category: 'Sans Serif' | 'Serif' | 'Display' | 'Monospace';
  weights: number[];
}

const variableWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const fontGroup = (names: string[], category: StudioFont['category'], weights = variableWeights): StudioFont[] => names.map(name => ({ name, category, weights }));

export const FONT_CATALOG: StudioFont[] = [
  ...fontGroup(['Inter', 'DM Sans', 'Roboto', 'Work Sans', 'Mulish', 'Nunito', 'Rubik', 'Lexend', 'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed', 'Archivo', 'Archivo Narrow', 'Source Sans 3', 'Public Sans', 'Manrope', 'Outfit', 'Plus Jakarta Sans', 'Figtree', 'Urbanist', 'Red Hat Display', 'Sora', 'Overpass'], 'Sans Serif'),
  ...fontGroup(['Space Grotesk', 'Instrument Sans', 'Rethink Sans', 'Chivo', 'Karla'], 'Sans Serif', [400, 500, 600, 700]),
  ...fontGroup(['Atkinson Hyperlegible Next', 'National Park', 'Quicksand'], 'Sans Serif', [400, 500, 600, 700]),
  ...fontGroup(['Playfair Display', 'Crimson Pro', 'Cormorant Garamond', 'Spectral', 'Lora', 'Libre Baskerville', 'Baskervville', 'Newsreader', 'Fraunces', 'Literata', 'Noto Serif', 'STIX Two Text'], 'Serif', [400, 500, 600, 700]),
  ...fontGroup(['DM Serif Text', 'Instrument Serif', 'Young Serif', 'Gloock', 'Castoro', 'Radley', 'Xanh Mono'], 'Serif', [400]),
  ...fontGroup(['Crimson Text', 'Old Standard TT', 'PT Serif'], 'Serif', [400, 700]),
  ...fontGroup(['Montagu Slab', 'Cinzel'], 'Serif'),
  ...fontGroup(['Archivo Black', 'Bebas Neue', 'Anton', 'Climate Crisis', 'UnifrakturMaguntia', 'Germania One', 'Jacquard 12', 'Manufacturing Consent'], 'Display', [400]),
  ...fontGroup(['Bricolage Grotesque'], 'Display', [400, 500, 600, 700, 800]),
  ...fontGroup(['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'Roboto Mono', 'Martian Mono'], 'Monospace', [400, 500, 600, 700]),
  ...fontGroup(['Space Mono', 'Courier Prime'], 'Monospace', [400, 700]),
  ...fontGroup(['Cutive Mono'], 'Monospace', [400]),
  { name: 'Arial', category: 'Sans Serif', weights: [400, 700] },
  { name: 'Georgia', category: 'Serif', weights: [400, 700] },
];

export const STUDIO_FONTS = FONT_CATALOG.map(font => font.name);
const italicFonts = new Set(['Inter', 'DM Sans', 'Roboto', 'Work Sans', 'Mulish', 'Nunito', 'Rubik', 'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed', 'Archivo', 'Archivo Narrow', 'Source Sans 3', 'Public Sans', 'Overpass', 'Plus Jakarta Sans', 'Figtree', 'Urbanist', 'Red Hat Display', 'Instrument Sans', 'Chivo', 'Karla', 'Playfair Display', 'Crimson Pro', 'Cormorant Garamond', 'Spectral', 'Lora', 'Libre Baskerville', 'Baskervville', 'Newsreader', 'Fraunces', 'Literata', 'Noto Serif', 'STIX Two Text', 'DM Serif Text', 'Instrument Serif', 'Castoro', 'Radley', 'Xanh Mono', 'Crimson Text', 'Old Standard TT', 'PT Serif', 'IBM Plex Mono', 'JetBrains Mono', 'Roboto Mono', 'Space Mono', 'Courier Prime']);

export function ensureStudioFont(name: string, italic = false) {
  const family = name.split(',')[0].replace(/["']/g, '').trim();
  const font = FONT_CATALOG.find(item => item.name === family);
  if (!font || ['Arial', 'Georgia'].includes(family)) return;
  const style = italic && italicFonts.has(family) ? 'italic' : 'normal';
  if (Array.from(document.querySelectorAll<HTMLLinkElement>('link[data-studio-font]')).some(link => link.dataset.studioFont === family && (link.dataset.studioFontStyle || 'normal') === style)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.dataset.studioFont = family;
  link.dataset.studioFontStyle = style;
  const axes = style === 'italic' ? `ital,wght@${font.weights.map(weight => `1,${weight}`).join(';')}` : `wght@${font.weights.join(';')}`;
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:${axes}&display=swap`;
  document.head.append(link);
}
