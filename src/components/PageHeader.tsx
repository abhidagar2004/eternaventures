import { motion } from 'motion/react';

const TW_SIZE_MAP: Record<string, string> = {
  'text-xs': '0.75rem', 'text-sm': '0.875rem', 'text-base': '1rem',
  'text-lg': '1.125rem', 'text-xl': '1.25rem', 'text-2xl': '1.5rem',
  'text-3xl': '1.875rem', 'text-4xl': '2.25rem', 'text-5xl': '3rem',
  'text-6xl': '3.75rem', 'text-7xl': '4.5rem', 'text-8xl': '6rem', 'text-9xl': '8rem',
};

const getFontStyle = (sizeStr?: string, defaultMob = '2rem', defaultDesk = '4rem') => {
  if (!sizeStr) return `clamp(${defaultMob}, 4vw, ${defaultDesk})`;
  if (/^\d/.test(sizeStr) || sizeStr.includes('px') || sizeStr.includes('rem')) return sizeStr;
  const parts = sizeStr.split(/\s+/);
  const mobile = TW_SIZE_MAP[parts[0]] || defaultMob;
  let desktop = mobile;
  parts.forEach(p => {
    if (p.startsWith('lg:')) desktop = TW_SIZE_MAP[p.replace('lg:', '')] || desktop;
    else if (p.startsWith('md:')) desktop = TW_SIZE_MAP[p.replace('md:', '')] || desktop;
  });
  return mobile !== desktop ? `clamp(${mobile}, 4vw, ${desktop})` : mobile;
};

export default function PageHeader({ 
  title, 
  description, 
  badge,
  bgImage,
  overlayColor = "#000000",
  overlayOpacity = 0.5,
  titleColor = "#ffffff",
  titleSize = "text-4xl md:text-6xl",
  descColor = "#9ca3af",
  descSize = "text-lg md:text-xl",
  bgColor,
  textColor,
  paddingTop = "160",
  paddingBottom = "100",
  badgeColor,
  bannerBgColor,
}: { 
  title?: string | null, 
  description?: string | null, 
  badge?: string | null,
  bgImage?: string | null,
  overlayColor?: string | null,
  overlayOpacity?: number | string | null,
  titleColor?: string,
  titleSize?: string,
  descColor?: string,
  descSize?: string,
  bgColor?: string,
  textColor?: string,
  paddingTop?: string,
  paddingBottom?: string,
  badgeColor?: string,
  bannerBgColor?: string,
}) {
  if (!title && !description && !badge) return null;

  const finalTitleColor = textColor || titleColor;
  const finalDescColor = textColor || descColor;

  // Parse padding: supports plain numbers (px), "px" suffix, "pt-*" Tailwind class
  const parsePad = (val?: string, fallback = '120px') => {
    if (!val) return fallback;
    if (val.startsWith('pt-') || val.startsWith('pb-')) {
      // Convert Tailwind spacing class to px (1 unit = 4px)
      const num = parseInt(val.replace(/[a-z-]/g, ''));
      return isNaN(num) ? fallback : `${num * 4}px`;
    }
    if (val.includes('px') || val.includes('rem') || val.includes('em')) return val;
    const n = parseInt(val);
    return isNaN(n) ? fallback : `${n}px`;
  };

  const ptVal = parsePad(paddingTop, '160px');
  const pbVal = parsePad(paddingBottom, '100px');

  // Only show background image if one is explicitly provided
  const hasImage = bgImage && bgImage.trim() !== '';

  return (
    <section 
      className="border-b border-gray-800 relative overflow-hidden"
      style={{ 
        backgroundColor: bannerBgColor || bgColor || '#0a0a0a',
        paddingTop: ptVal,
        paddingBottom: pbVal,
        minHeight: 'fit-content',
      }}
    >
      {/* BG Image — only shown if URL is provided */}
      {hasImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              backgroundColor: overlayColor || '#000000', 
              opacity: overlayOpacity !== null && overlayOpacity !== undefined ? Number(overlayOpacity) : 0.5 
            }} 
          />
        </>
      )}

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {badge && badge.trim() !== "" && (
          <span className="font-bold tracking-widest uppercase text-sm mb-6 block" style={{ color: badgeColor || '#2596be' }}>
            {badge}
          </span>
        )}
        {title && title.trim() !== "" && (
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              color: finalTitleColor,
              fontSize: getFontStyle(titleSize, '2rem', '4rem'),
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: '1',
              textTransform: 'uppercase',
            }}
            className="mb-8 font-display"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {description && description.trim() !== "" && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              color: finalDescColor,
              fontSize: getFontStyle(descSize, '1rem', '1.25rem'),
            }}
            className="leading-relaxed font-medium max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
