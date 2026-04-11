import { motion } from 'motion/react';

export default function PageHeader({ 
  title, 
  description, 
  badge,
  bgImage,
  overlayColor = "#000000",
  overlayOpacity = 0.5,
  titleColor = "#ffffff",
  titleSize = "text-6xl md:text-8xl",
  descColor = "#9ca3af",
  descSize = "text-xl md:text-2xl",
  bgColor,
  textColor,
  paddingTop = "200",
  paddingBottom = "100",
  badgeColor
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
  badgeColor?: string
}) {
  if (!title && !description && !badge) return null;

  const finalTitleColor = textColor || titleColor;
  const finalDescColor = textColor || descColor;

  // Smart padding logic: if it's a number (e.g. "160"), use it as px. If it's a class (e.g. "pt-40"), use it as a class.
  const isPtClass = paddingTop && paddingTop.startsWith('pt-');
  const isPbClass = paddingBottom && paddingBottom.startsWith('pb-');
  
  const ptVal = (!isPtClass && paddingTop) ? (paddingTop.includes('px') || paddingTop.includes('rem') ? paddingTop : `${paddingTop}px`) : undefined;
  const pbVal = (!isPbClass && paddingBottom) ? (paddingBottom.includes('px') || paddingBottom.includes('rem') ? paddingBottom : `${paddingBottom}px`) : undefined;

  const defaultBgImage = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";

  return (
    <section 
      className={`${isPtClass ? paddingTop : ''} ${isPbClass ? paddingBottom : ''} border-b border-gray-800 relative overflow-hidden`} 
      style={{ 
        backgroundColor: bgColor || '#000000',
        paddingTop: ptVal,
        paddingBottom: pbVal
      }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url('${bgImage || defaultBgImage}')` }}
      />
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundColor: overlayColor || '#000000', 
          opacity: overlayOpacity !== null && overlayOpacity !== undefined ? Number(overlayOpacity) : 0.5 
        }} 
      />
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
            style={{ color: finalTitleColor }}
            className={`${titleSize} font-display font-black uppercase tracking-tighter mb-8 leading-none`}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {description && description.trim() !== "" && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: finalDescColor }}
            className={`${descSize} leading-relaxed font-medium max-w-3xl mx-auto`}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}

