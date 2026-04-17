import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Testimonials from '../Testimonials';

interface BlockProps {
  block: any;
  index: number;
  data?: any; // Additional data like services, projects, blogs
}

export const BlockRenderer: React.FC<BlockProps> = ({ block, index, data }) => {
  if (!block.isVisible && block.isVisible !== undefined) return null;

  const styleHeading = (size: string, color: string, family?: string) => ({
    color: color || 'inherit',
    fontFamily: family || 'inherit'
  });

  const getHeadingSize = (size: string, defaultSize: string) => size || defaultSize;

  switch (block.type) {
    case 'hero':
      return (
        <section 
          key={block.id} 
          style={{ backgroundColor: block.bgColor || '#000000' }} 
          className={`relative h-screen flex items-center justify-center overflow-hidden ${block.paddingTop} ${block.paddingBottom}`}
        >
          <div className="absolute inset-0 z-0">
            {block.hero_video_url ? (
              <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
                <source src={block.hero_video_url} type="video/mp4" />
              </video>
            ) : block.bgImage ? (
              <img src={block.bgImage} className="w-full h-full object-cover opacity-60" alt="Hero Background" />
            ) : null}
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundColor: block.overlayColor || 'rgba(0,0,0,0.5)',
                opacity: block.overlayOpacity ?? 0.6 
              }}
            ></div>
          </div>
          <div className={`relative z-10 w-full px-6 max-w-7xl mx-auto mt-20 text-${block.alignment || 'center'}`}>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={styleHeading(block.headingSize, block.headingColor, block.headingFontFamily)}
              className={`${getHeadingSize(block.headingSize, 'text-6xl md:text-8xl')} font-display font-black uppercase tracking-tighter leading-[0.85] whitespace-pre-line`}
            >
              {block.heading}
            </motion.h1>
            {block.subtext && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ color: block.subtextColor || '#ffffff', fontFamily: block.subtextFontFamily || 'inherit' }}
                className={`${block.subtextSize || 'text-xl'} mt-8 max-w-3xl ${block.alignment === 'center' ? 'mx-auto' : ''} opacity-80`}
              >
                {block.subtext}
              </motion.p>
            )}
          </div>
        </section>
      );

    case 'marquee':
      return (
        <div 
          key={block.id} 
          style={{ backgroundColor: block.bgColor || '#2596be', color: block.textColor || '#ffffff' }} 
          className="py-6 overflow-hidden flex whitespace-nowrap relative"
        >
          <div className="flex w-max animate-[marquee_20s_linear_infinite]">
            {[1, 2, 3, 4].map(i => (
              <span key={i} style={{ fontFamily: block.fontFamily || 'inherit' }} className={`${block.fontSize || 'text-2xl md:text-4xl'} font-display font-black uppercase tracking-tighter mx-4`}>
                {block.text}
              </span>
            ))}
          </div>
        </div>
      );

    case 'side_image':
    case 'philosophy':
    case 'what_we_believe':
      const isRight = block.imageOrder === 'right';
      return (
        <section 
          key={block.id} 
          style={{ backgroundColor: block.bgColor || '#000000' }} 
          className={`py-24 md:py-32 px-6 md:px-12 relative overflow-hidden`}
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
             <div className={`w-full lg:w-1/2 ${isRight ? 'lg:order-1' : 'lg:order-2'}`}>
                {block.tag && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{ color: block.tagColor || block.accentColor || '#2596be', fontFamily: block.tagFontFamily || 'inherit' }}
                    className="inline-block text-sm font-black uppercase tracking-[0.3em] mb-8"
                  >
                    {block.tag}
                  </motion.span>
                )}
                <motion.h2 
                  initial={{ opacity: 0, x: isRight ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  style={styleHeading(block.headingSize, block.headingColor, block.headingFontFamily)}
                  className={`${getHeadingSize(block.headingSize, 'text-4xl md:text-6xl')} font-display font-black uppercase tracking-tighter leading-[0.9] mb-8`}
                >
                  {block.heading}
                </motion.h2>
                <div 
                  style={{ color: block.paragraphColor || '#9ca3af', fontFamily: block.paragraphFontFamily || 'inherit' }}
                  className={`${block.paragraphSize || 'text-lg'} space-y-6 leading-relaxed opacity-90`}
                >
                   {block.paragraphs?.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
                {block.btnText && (
                  <Link 
                    to={block.btnLink || '/'} 
                    style={{ backgroundColor: block.accentColor || '#2596be', color: block.btnTextColor || '#ffffff' }}
                    className="inline-flex items-center gap-2 mt-10 px-8 py-4 font-bold uppercase tracking-wider rounded-lg"
                  >
                    {block.btnText} <ArrowRight size={18} />
                  </Link>
                )}
             </div>
             <div className={`w-full lg:w-1/2 ${isRight ? 'lg:order-2' : 'lg:order-1'}`}>
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   className="relative aspect-square overflow-hidden rounded-2xl group"
                >
                   <img src={block.imageUrl || 'https://picsum.photos/seed/agency/1000/1000'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={block.heading} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </motion.div>
             </div>
          </div>
        </section>
      );

    case 'services_grid':
      return (
        <section key={block.id} style={{ backgroundColor: block.bgColor || '#ffffff', color: block.textColor || '#000000' }} className="py-24 md:py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center mb-20">
            {block.tag && <span style={{ color: block.accentColor || '#2596be' }} className="inline-block text-sm font-bold uppercase tracking-[0.3em] mb-8">{block.tag}</span>}
            <h2 style={styleHeading(block.headingSize, block.headingColor, block.headingFontFamily)} className={`${getHeadingSize(block.headingSize, 'text-5xl md:text-7xl')} font-display font-black uppercase tracking-tighter leading-none`}>
              {block.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data?.services?.slice(0, 6).map((service: any, i: number) => (
              <Link to={`/services/${service.slug}`} key={i} className="group">
                <div className="overflow-hidden mb-6 rounded-xl bg-gray-100 aspect-square">
                  <img src={service.image_url} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-display font-black uppercase tracking-tighter text-3xl group-hover:text-[#2596be] transition-colors">{service.title}</h3>
                <p className="mt-4 opacity-70 line-clamp-3">{service.description}</p>
              </Link>
            ))}
          </div>
        </section>
      );

    case 'method_grid':
      return (
        <section key={block.id} style={{ backgroundColor: block.bgColor || '#000000' }} className="py-24 md:py-32 px-6 md:px-12 text-white">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
                <div className="lg:w-1/2">
                   <span style={{ color: block.accentColor || '#2596be' }} className="inline-block text-sm font-bold uppercase tracking-[0.3em] mb-8">{block.tag || 'Our Method'}</span>
                   <h2 style={styleHeading(block.headingSize, block.headingColor, block.headingFontFamily)} className={`${getHeadingSize(block.headingSize, 'text-5xl md:text-7xl')} font-display font-black uppercase tracking-tighter leading-[0.85]`}>
                     {block.heading}
                   </h2>
                </div>
                <div className="lg:w-1/2 flex items-center">
                   <p className="text-2xl md:text-4xl font-display font-black uppercase italic text-[#c2ff00]">{block.quote}</p>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {block.items?.map((item: any, i: number) => (
                  <div key={i} className="group">
                    <span className="text-6xl font-display font-black opacity-10 group-hover:opacity-100 group-hover:text-[#2596be] transition-all duration-500">
                      0{i+1}
                    </span>
                    <h3 className="text-2xl font-display font-black uppercase mt-4 mb-4">{item.title}</h3>
                    <p className="text-gray-400 group-hover:text-white transition-colors">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>
      );

    case 'projects_slider':
      return (
        <section key={block.id} style={{ backgroundColor: block.bgColor || '#ffffff', color: block.textColor || '#000000' }} className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <h2 style={styleHeading(block.headingSize, block.headingColor, block.headingFontFamily)} className={`${getHeadingSize(block.headingSize, 'text-5xl md:text-7xl')} font-display font-black uppercase tracking-tighter`}>{block.heading}</h2>
          </div>
          <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
             {data?.projects?.map((p: any, i: number) => (
               <div key={i} className="w-[30vw] px-4 shrink-0">
                  <img src={p.image_url} className="w-full aspect-[4/5] object-cover rounded-2xl shadow-xl" alt={p.title} />
                  <h3 className="mt-6 text-xl font-black uppercase">{p.title}</h3>
               </div>
             ))}
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <Testimonials 
          key={block.id}
          tag={block.tag}
          title={block.heading}
          bgColor={block.bgColor}
        />
      );

    case 'cta':
      return (
        <section key={block.id} style={{ backgroundColor: block.bgColor || '#2596be', color: block.textColor || '#ffffff' }} className="py-24 md:py-32 px-6 text-center">
           <div className="max-w-4xl mx-auto">
              <h2 style={styleHeading(block.headingSize, block.headingColor, block.headingFontFamily)} className={`${getHeadingSize(block.headingSize, 'text-5xl md:text-7xl')} font-display font-black uppercase tracking-tighter mb-8`}>{block.heading}</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-10">{block.subtext}</p>
              <Link to={block.btnLink || '/contact'} className="inline-block bg-white text-black font-black uppercase px-10 py-5 rounded-full hover:scale-105 transition-transform">
                {block.btnText || 'Get in Touch'}
              </Link>
           </div>
        </section>
      );

    case 'latest_blogs':
      return (
        <section key={block.id} style={{ backgroundColor: block.bgColor || '#000000' }} className="py-24 px-6 md:px-12 border-t border-white/10">
           <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
                 <h2 style={styleHeading(block.headingSize, block.headingColor, block.headingFontFamily)} className={`${getHeadingSize(block.headingSize, 'text-5xl md:text-7xl')} font-display font-black uppercase tracking-tighter`}>{block.heading}</h2>
                 <Link to="/blogs" className="text-[#2596be] font-bold uppercase tracking-widest flex items-center gap-2">ALL BLOGS <ArrowRight size={18} /></Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {data?.blogs?.slice(0, 3).map((blog: any, i: number) => (
                  <Link to={`/blogs/${blog.slug}`} key={i} className="bg-white text-black p-6 rounded-2xl">
                    <img src={blog.thumbnail_url} className="w-full aspect-video object-cover rounded-xl mb-6" alt={blog.title} />
                    <span className="text-xs font-bold text-gray-400 uppercase">{format(new Date(blog.created_at), 'MMM d, yyyy')}</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight mt-2">{blog.title}</h3>
                  </Link>
                ))}
              </div>
           </div>
        </section>
      );

    default:
      return null;
  }
};
