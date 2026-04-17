import React from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

const getFontStyle = (block: any, type: 'heading' | 'subtext' | 'paragraph' | 'tag') => {
  const style: React.CSSProperties = {};
  
  if (type === 'heading') {
    if (block.headingColor) style.color = block.headingColor;
    if (block.headingFontFamily) style.fontFamily = block.headingFontFamily;
  } else if (type === 'subtext') {
    if (block.subtextColor) style.color = block.subtextColor;
    if (block.subtextFontFamily) style.fontFamily = block.subtextFontFamily;
  } else if (type === 'paragraph') {
    if (block.paragraphColor) style.color = block.paragraphColor;
    if (block.paragraphFontFamily) style.fontFamily = block.paragraphFontFamily;
  } else if (type === 'tag') {
    if (block.tagColor) style.color = block.tagColor;
    if (block.tagFontFamily) style.fontFamily = block.tagFontFamily;
  }

  return style;
};

const BlockWrapper = ({ block, children, className = "", isHero = false }: any) => {
  const hasBgImage = isHero && !!block.bgImage;
  
  return (
    <section 
      style={{
        backgroundColor: block.bgColor || '#000000',
        color: block.textColor || '#ffffff',
        backgroundImage: hasBgImage ? `url(${block.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={`${block.paddingTop || 'py-32'} ${block.paddingBottom || ''} relative overflow-hidden ${className}`}
    >
      {hasBgImage && (
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundColor: block.overlayColor || '#000000', 
            opacity: block.overlayOpacity ?? 0.6 
          }} 
        />
      )}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {children}
      </div>
    </section>
  );
};

const HeroBlock = ({ block }: any) => {
  return (
    <BlockWrapper block={block} isHero={true} className="flex min-h-[70vh] items-center">
      <div className={`text-${block.alignment || 'center'} max-w-5xl mx-auto`}>
        <motion.h1 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
           className={`${block.headingSize || 'text-5xl md:text-7xl lg:text-8xl'} font-display font-black tracking-tighter uppercase mb-6 leading-[1.0]`}
           style={getFontStyle(block, 'heading')}
        >
          {block.heading}
        </motion.h1>
        {block.subtext && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className={`${block.subtextSize || 'text-lg md:text-2xl'} md:leading-relaxed font-medium opacity-80`}
            style={getFontStyle(block, 'subtext')}
          >
             {block.subtext}
          </motion.p>
        )}
      </div>
      {!block.bgImage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none opacity-20" style={{ backgroundColor: block.accentColor || '#D6FF00' }} />
      )}
    </BlockWrapper>
  );
}

const SideImageSection = ({ block }: any) => {
  const isImageLeft = block.imageOrder !== 'right';
  
  return (
    <BlockWrapper block={block}>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center`}>
         {/* Image Column */}
         <motion.div
           initial={{ opacity: 0, x: isImageLeft ? -30 : 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className={isImageLeft ? "order-1" : "order-1 lg:order-2"}
        >
          {block.imageUrl ? (
             <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 group">
                <img src={block.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Section Branding" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
          ) : (
            <div className="aspect-[4/5] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
               <span className="text-gray-600 font-black tracking-widest text-xs uppercase italic opacity-20">Eterna Brand Asset</span>
            </div>
          )}
        </motion.div>

        {/* Content Column */}
        <motion.div
           initial={{ opacity: 0, x: isImageLeft ? 30 : -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className={isImageLeft ? "order-2" : "order-2 lg:order-1"}
        >
           {block.tag && (
             <h3 className="font-bold tracking-widest uppercase text-sm mb-6 flex items-center gap-3" style={getFontStyle(block, 'tag')}>
               <span className="w-8 h-[1px]" style={{ backgroundColor: block.tagColor || block.accentColor }} />
               {block.tag}
             </h3>
           )}
           <h2 className={`${block.headingSize || 'text-4xl md:text-6xl'} font-display font-black uppercase tracking-tight mb-10 leading-[1.1]`} style={getFontStyle(block, 'heading')}>
             {block.heading}
           </h2>
           
           <div className={`space-y-6 ${block.paragraphSize || 'text-xl md:text-2xl'} font-medium leading-relaxed`} style={getFontStyle(block, 'paragraph')}>
             {block.paragraphs?.split('\n').filter(Boolean).map((p: string, i: number) => (
                <p key={i}>{p}</p>
             ))}
           </div>

           {block.items && block.items.length > 0 && (
              <div className="mt-12 grid grid-cols-1 gap-4">
                 {block.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-150" style={{ backgroundColor: block.accentColor || '#D6FF00' }} />
                       <span className="text-lg md:text-xl font-bold uppercase tracking-tight" style={{ color: block.itemColor || '#ffffff' }}>{item.text || item.title}</span>
                    </div>
                 ))}
              </div>
           )}

           {block.closingText && (
             <p className="mt-16 text-xl font-display font-black uppercase tracking-tight" style={{ color: block.accentColor || '#ffffff' }}>
               {block.closingText}
             </p>
           )}
        </motion.div>
      </div>
    </BlockWrapper>
  );
}

const OurApproachBlock = ({ block }: any) => {
  return (
    <BlockWrapper block={block}>
       {block.heading && (
          <h2 className={`${block.headingSize || 'text-4xl md:text-6xl'} font-display font-black text-center uppercase mb-24 tracking-tighter`} style={getFontStyle(block, 'heading')}>
            {block.heading}
          </h2>
       )}
       <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between relative max-w-6xl mx-auto gap-12">
          {block.items?.map((item: any, i: number) => (
            <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="relative z-10 w-full flex flex-col items-center text-center"
            >
               <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center font-display font-black text-xl mb-6 shadow-2xl transition-all hover:scale-110" style={{ borderColor: block.accentColor || '#D6FF00', color: block.accentColor || '#D6FF00' }}>
                 0{i+1}
               </div>
               <h4 className="text-xl font-black uppercase tracking-tight mb-3 text-white" style={getFontStyle(block, 'paragraph')}>{item.title}</h4>
               {item.desc && <p className="text-sm opacity-60 leading-relaxed max-w-[200px]" style={{ color: block.textColor || '#a1a1aa' }}>{item.desc}</p>}
            </motion.div>
          ))}
       </div>
    </BlockWrapper>
  );
}

const OurRoleBlock = ({ block }: any) => {
  return (
    <BlockWrapper block={block}>
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-12 py-12">
        {block.lines?.map((line: any, i: number) => (
          <motion.h2 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`${block.headingSize || 'text-5xl md:text-7xl lg:text-8xl'} font-display font-black tracking-tighter uppercase leading-none`}
            style={{ 
              color: i === 0 ? (block.accentColor || '#D6FF00') : 'transparent', 
              WebkitTextStroke: i === 0 ? 'none' : `1px ${block.lineStrokeColor || 'rgba(255,255,255,0.2)'}`,
              ...getFontStyle(block, 'heading')
            }}
          >
            {line.text}
          </motion.h2>
        ))}
      </div>
    </BlockWrapper>
  );
}

const CTABlock = ({ block }: any) => {
  return (
    <BlockWrapper block={block} className="py-24">
       <div className="max-w-5xl mx-auto text-center p-16 md:p-32 rounded-[4rem] relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-10 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: block.accentColor || '#D6FF00' }} />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${block.headingSize || 'text-4xl md:text-5xl lg:text-7xl'} font-display font-black tracking-tight mb-16 uppercase leading-[1.0] relative z-10`}
            style={getFontStyle(block, 'heading')}
          >
            {block.heading}
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-12 relative z-10"
          >
            <a 
              href={block.btnLink || '/contact'}
              className="group flex items-center justify-center gap-4 px-14 py-6 font-black text-xl uppercase tracking-tighter rounded-full transition-all hover:scale-105 shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)] active:scale-95"
              style={{ backgroundColor:'#ffffff', color: '#000000' }}
            >
               {block.btnText || 'Contact Us'}
               <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            </a>
            {block.email && (
              <a href={`mailto:${block.email}`} className="text-white hover:opacity-100 opacity-60 transition-opacity uppercase font-black tracking-widest flex items-center gap-4 text-xl">
                <Mail className="w-7 h-7" />
                {block.email}
              </a>
            )}
          </motion.div>
       </div>
    </BlockWrapper>
  );
}

export const renderBlock = (block: any) => {
  if (!block.isVisible) return null;
  switch (block.type) {
    case 'hero': return <HeroBlock key={block.id} block={block} />;
    case 'who_we_are': 
    case 'what_we_believe': 
    case 'why_us':
    case 'who_we_work_with':
      return <SideImageSection key={block.id} block={block} />;
    case 'our_approach': return <OurApproachBlock key={block.id} block={block} />;
    case 'our_role': return <OurRoleBlock key={block.id} block={block} />;
    case 'cta': return <CTABlock key={block.id} block={block} />;
    default: return null;
  }
}
