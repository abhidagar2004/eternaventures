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

const BlockWrapper = ({ block, children, className = "" }: any) => {
  const hasBgImage = !!block.bgImage;
  
  return (
    <section 
      style={{
        backgroundColor: block.bgColor || '#000000',
        color: block.textColor || '#ffffff',
        backgroundImage: hasBgImage ? `url(${block.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={`${block.paddingTop || 'py-24'} ${block.paddingBottom || ''} relative overflow-hidden ${className}`}
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
    <BlockWrapper block={block} className="flex min-h-[60vh] items-center">
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
            className={`${block.subtextSize || 'text-lg md:text-2xl'} md:leading-relaxed font-medium`}
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

const WhoWeAreBlock = ({ block }: any) => {
  const isImageLeft = block.imageOrder !== 'right';
  
  return (
    <BlockWrapper block={block}>
      <div className={`grid grid-cols-1 lg:grid-cols-${block.columns || '2'} gap-16 items-center`}>
        <motion.div
           initial={{ opacity: 0, x: isImageLeft ? -30 : 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className={isImageLeft ? "order-1" : "order-1 lg:order-2"}
        >
          {block.imageUrl ? (
             <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                <img src={block.imageUrl} className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" alt="Who We Are" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
             </div>
          ) : (
            <div className="aspect-[4/5] rounded-[2.5rem] bg-gray-900 border border-white/10"></div>
          )}
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: isImageLeft ? 30 : -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className={isImageLeft ? "order-2" : "order-2 lg:order-1"}
        >
           {block.tag && (
             <h3 className="font-bold tracking-widest uppercase text-sm mb-6" style={getFontStyle(block, 'tag')}>
               {block.tag}
             </h3>
           )}
           <h2 className={`${block.headingSize || 'text-4xl md:text-5xl lg:text-6xl'} font-display font-black uppercase tracking-tight mb-10 leading-[1.1]`} style={getFontStyle(block, 'heading')}>
             {block.heading}
           </h2>
           {block.highlightText && (
             <div className="p-8 mb-10 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: block.accentColor || '#D6FF00' }}></div>
               <p className={`${block.highlightSize || 'text-xl md:text-2xl'} font-bold leading-snug`} style={{ color: block.highlightColor || '#ffffff' }}>{block.highlightText}</p>
             </div>
           )}
           <div className={`space-y-6 ${block.paragraphSize || 'text-xl'}`} style={getFontStyle(block, 'paragraph')}>
             {block.paragraphs?.split('\n').filter(Boolean).map((p: string, i: number) => (
                <p key={i}>{p}</p>
             ))}
           </div>
        </motion.div>
      </div>
    </BlockWrapper>
  );
}

const GenericTextBlock = ({ block }: any) => {
  return (
    <BlockWrapper block={block}>
      <div className={`text-${block.alignment || 'left'} max-w-5xl`}>
        {block.tag && (
          <h3 className="font-bold tracking-widest uppercase text-sm mb-6" style={getFontStyle(block, 'tag')}>
            {block.tag}
          </h3>
        )}
        <h2 className={`${block.headingSize || 'text-4xl md:text-6xl'} font-display font-black uppercase mb-10 tracking-tighter`} style={getFontStyle(block, 'heading')}>
          {block.heading}
        </h2>
        <div className={`space-y-6 ${block.paragraphSize || 'text-xl'}`} style={getFontStyle(block, 'paragraph')}>
           {block.paragraphs?.split('\n').filter(Boolean).map((p: string, i: number) => (
              <p key={i}>{p}</p>
           ))}
        </div>
        {block.items && block.items.length > 0 && (
          <div className="mt-10 space-y-4">
            {block.items.map((item: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-2 h-2 rounded-full mt-3 flex-shrink-0" style={{ backgroundColor: block.accentColor || '#D6FF00' }} />
                <p className={`${block.itemSize || 'text-xl md:text-2xl'} font-bold uppercase tracking-tight`} style={{ color: block.itemColor || '#ffffff' }}>{item.text || item.title}</p>
              </motion.div>
            ))}
          </div>
        )}
        {block.closingText && (
          <p className={`${block.closingSize || 'text-lg md:text-xl'} mt-12 font-medium opacity-80`} style={{ color: block.paragraphColor }}>
            {block.closingText}
          </p>
        )}
      </div>
    </BlockWrapper>
  );
}

const OurApproachBlock = ({ block }: any) => {
  // Use generic for simplicity if not complex layout, but original request wanted horizontal flow
  return (
    <BlockWrapper block={block}>
       {block.heading && (
          <h2 className={`${block.headingSize || 'text-4xl md:text-6xl'} font-display font-black text-center uppercase mb-24 tracking-tighter`} style={getFontStyle(block, 'heading')}>
            {block.heading}
          </h2>
       )}
       <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between relative max-w-6xl mx-auto">
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-[2px] bg-white/10 z-0"></div>
          
          {block.items?.map((item: any, i: number) => (
            <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="relative z-10 w-full lg:w-48 flex flex-col mb-16 lg:mb-0"
            >
               <div className="flex items-center lg:flex-col lg:items-center gap-8 lg:gap-0">
                  <div className="flex-shrink-0 w-24 h-24 rounded-full border-4 flex items-center justify-center font-display font-black text-3xl mb-0 lg:mb-8 transition-transform hover:scale-110 shadow-2xl" style={{ borderColor: block.accentColor || '#D6FF00', backgroundColor: '#000', color: block.accentColor || '#D6FF00' }}>
                    0{i+1}
                  </div>
                  <div className="lg:text-center">
                    <h4 className="text-2xl font-bold uppercase tracking-tight mb-2 text-white" style={getFontStyle(block, 'paragraph')}>{item.title}</h4>
                    {item.desc && <p className="text-base" style={{ color: block.textColor || '#a1a1aa' }}>{item.desc}</p>}
                  </div>
               </div>
            </motion.div>
          ))}
       </div>
    </BlockWrapper>
  );
}

const WhyUsBlock = ({ block }: any) => {
  return (
    <BlockWrapper block={block}>
       <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
         <div className="lg:w-1/3 sticky top-32">
           {block.tag && (
             <h3 className="font-bold tracking-widest uppercase text-sm mb-6" style={getFontStyle(block, 'tag')}>
               {block.tag}
             </h3>
           )}
           <h2 className={`${block.headingSize || 'text-5xl md:text-6xl'} font-display font-black uppercase tracking-tight leading-[1.1]`} style={getFontStyle(block, 'heading')}>
             {block.heading}
           </h2>
         </div>
         <div className="lg:w-2/3 w-full">
            <div className={`grid grid-cols-1 md:grid-cols-${block.columns === '3' || !block.columns ? '1' : block.columns} gap-6`}>
              {block.items?.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 border border-white/10 rounded-[2rem] bg-white/5 hover:bg-white/10 transition-colors flex flex-col md:flex-row gap-8 items-start"
                >
                   <CheckCircle2 className="w-10 h-10 flex-shrink-0" style={{ color: block.accentColor || '#D6FF00' }} />
                   <div>
                     <h4 className="text-2xl font-display font-bold uppercase tracking-tight mb-3 text-white" style={getFontStyle(block, 'paragraph')}>{item.title}</h4>
                     <p className="text-lg" style={{ color: block.textColor || '#d1d5db' }}>{item.desc}</p>
                   </div>
                </motion.div>
              ))}
            </div>
         </div>
       </div>
    </BlockWrapper>
  );
}

const OurRoleBlock = ({ block }: any) => {
  return (
    <BlockWrapper block={block}>
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-6 py-12">
        {block.lines?.map((line: any, i: number) => (
          <motion.h2 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`${block.headingSize || 'text-5xl md:text-7xl lg:text-8xl'} font-display font-black tracking-tighter uppercase leading-none`}
            style={{ 
              color: i === 0 ? (block.accentColor || '#D6FF00') : 'transparent', 
              WebkitTextStroke: i === 0 ? 'none' : `2px ${block.lineStrokeColor || 'rgba(255,255,255,0.5)'}`,
              opacity: i === 0 ? 1 : 1 - (i * 0.1),
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
    <BlockWrapper block={block}>
       <div className="max-w-5xl mx-auto text-center border p-12 md:p-24 rounded-[3rem] relative overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: block.accentColor || '#D6FF00' }} />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${block.headingSize || 'text-4xl md:text-5xl lg:text-7xl'} font-display font-black tracking-tight mb-12 uppercase leading-[1.1] relative z-10`}
            style={getFontStyle(block, 'heading')}
          >
            {block.heading}
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10"
          >
            <a 
              href={block.btnLink || '/contact'}
              className="group flex items-center justify-center gap-3 px-12 py-6 font-bold text-lg uppercase tracking-wider rounded-full transition-all hover:scale-105 shadow-xl disabled:opacity-50"
              style={{ backgroundColor: block.accentColor || '#D6FF00', color: '#000000', boxShadow: `0 10px 40px -10px ${block.accentColor}80` }}
            >
               {block.btnText || 'Contact Us'}
               <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            {block.email && (
              <a href={`mailto:${block.email}`} className="text-white hover:text-white/70 transition-colors uppercase font-bold tracking-widest flex items-center gap-3 text-lg">
                <Mail className="w-6 h-6" />
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
    case 'who_we_are': return <WhoWeAreBlock key={block.id} block={block} />;
    case 'what_we_believe': 
    case 'why_us':
    case 'who_we_work_with':
      return <GenericTextBlock key={block.id} block={block} />;
    case 'our_approach': return <OurApproachBlock key={block.id} block={block} />;
    case 'our_role': return <OurRoleBlock key={block.id} block={block} />;
    case 'cta': return <CTABlock key={block.id} block={block} />;
    default: return null;
  }
}
