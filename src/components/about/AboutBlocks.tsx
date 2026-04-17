import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Search, Zap, Target, Users, Layout, ShieldCheck } from 'lucide-react';

interface BlockProps {
  data: any;
}

const HeroBlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#000000',
        paddingTop: data.paddingTop || '160px',
        paddingBottom: data.paddingBottom || '100px',
        textAlign: data.alignment || 'center'
      }}
      className="relative overflow-hidden"
    >
      {/* Subtle Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl blur-[120px] opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[data.accentColor]/30 rounded-full" style={{ backgroundColor: `${data.accentColor}4D` }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ 
            color: data.headingColor || '#ffffff',
            fontSize: data.headingSize || 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: data.fontWeight || 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}
          className="max-w-5xl mx-auto uppercase mb-8"
        >
          {data.heading || 'WE DESIGN HOW BRANDS ARE UNDERSTOOD'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ 
            color: data.subtextColor || '#ffffff',
            opacity: 0.8,
            fontSize: data.subtextSize || '1.25rem'
          }}
          className="max-w-2xl mx-auto font-medium"
        >
          {data.subtext || 'EternaVentures is a growth media company based in Jaipur — built for brands that want to lead their category, not just participate in it.'}
        </motion.p>
      </div>
    </section>
  );
};

const WhoWeAreBlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#050505',
        paddingTop: data.paddingTop || '120px',
        paddingBottom: data.paddingBottom || '120px'
      }}
      className="relative"
    >
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${data.imageOrder === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}>
          <motion.div 
            initial={{ opacity: 0, x: data.imageOrder === 'right' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[data.accentColor] to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" style={{ backgroundImage: `linear-gradient(to right, ${data.accentColor}, #3b82f6)` }}></div>
              <img 
                src={data.imageUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000'} 
                alt="Who We Are"
                className="relative rounded-2xl w-full h-[500px] object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-6" style={{ color: data.accentColor }}>Who We Are</h2>
            <h3 
              style={{ color: data.headingColor || '#ffffff', fontSize: data.headingSize || 'clamp(2rem, 4vw, 3.5rem)' }}
              className="font-extrabold leading-tight mb-8"
            >
              {data.heading || 'ETERNA VENTURES WAS BUILT ON A SIMPLE OBSERVATION:'}
            </h3>
            
            <div 
              className="p-8 border-l-4 bg-white/5 backdrop-blur-sm rounded-r-xl mb-10"
              style={{ borderLeftColor: data.accentColor }}
            >
              <p className="text-xl md:text-2xl font-bold text-white italic leading-relaxed">
                “Most brands are not limited by resources. They are limited by how they are perceived.”
              </p>
            </div>

            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              {data.paragraphs ? data.paragraphs.split('\n\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              )) : (
                <>
                  <p>They invest in marketing, content, and campaigns — but without a clear position, everything becomes fragmented. The result is inconsistent growth and unclear messaging.</p>
                  <p>We exist to bring structure to that chaos. We work with founders to define, build, and scale brands with clarity — so every action contributes to long-term market authority.</p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhatWeBelieveBlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#000000',
        paddingTop: data.paddingTop || '120px',
        paddingBottom: data.paddingBottom || '120px'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-4" style={{ color: data.accentColor }}>Our Philosophy</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white">What We Believe</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Perception drives attention', desc: 'How you are seen determines if you are noticed.', icon: Search },
            { title: 'Attention drives trust', desc: 'Consistent visibility builds institutional credibility.', icon: ShieldCheck },
            { title: 'Trust drives growth', desc: 'Users choose what they trust. Growth is the byproduct.', icon: Zap }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-10 rounded-2xl bg-[#0A0A0A] border border-white/10 transition-all duration-500 group"
              style={{ borderColor: `${data.accentColor}1A` }}
              onMouseEnter={(e: any) => e.currentTarget.style.borderColor = data.accentColor}
              onMouseLeave={(e: any) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <item.icon className="w-8 h-8" style={{ color: data.accentColor }} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
              <p className="text-white/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OurApproachBlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  const steps = data.items || [
    { title: 'Positioning', desc: 'Defining the category you lead.' },
    { title: 'Communication', desc: 'Building the visual and verbal voice.' },
    { title: 'Audience', desc: 'Finding where your market lives.' },
    { title: 'Performance', desc: 'Scaling what works ruthlessly.' },
    { title: 'Strategy', desc: 'Compounding growth year over year.' }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#050505',
        paddingTop: data.paddingTop || '120px',
        paddingBottom: data.paddingBottom || '120px'
      }}
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-12" style={{ color: data.accentColor }}>Our Approach</h2>
        
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2" style={{ background: `linear-gradient(to right, transparent, ${data.accentColor}33, transparent)` }}></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10"
              >
                <div className="w-12 h-12 rounded-full text-black mx-auto flex items-center justify-center font-black text-xl mb-6 shadow-lg" style={{ backgroundColor: data.accentColor, boxShadow: `0 0 20px ${data.accentColor}66` }}>
                  {i + 1}
                </div>
                <h4 className="text-xl font-extrabold text-white mb-3 uppercase tracking-wider">{step.title}</h4>
                <p className="text-sm text-white/50 px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyUsBlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  const cards = data.items || [
    { title: 'Clarity before execution', desc: 'We don’t run ads until your brand makes sense.' },
    { title: 'Direction before scale', desc: 'Scaling a mess only creates a bigger mess. We fix the map first.' },
    { title: 'Systems over scattered efforts', desc: 'We build growth engines, not one-off campaigns.' }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#000000',
        paddingTop: data.paddingTop || '120px',
        paddingBottom: data.paddingBottom || '120px'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-4" style={{ color: data.accentColor }}>Why EternaVentures</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white">Built for brands that want to lead.</h3>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${data.gridColumns || 3} gap-8`}>
          {cards.map((card: any, i: number) => (
            <div className="p-1 w-full rounded-2xl bg-gradient-to-b from-white/10 to-transparent transition-all duration-500" onMouseEnter={(e) => e.currentTarget.style.backgroundImage = `linear-gradient(to bottom, ${data.accentColor}66, transparent)`} onMouseLeave={(e) => e.currentTarget.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)`}>
              <div className="h-full bg-[#050505] rounded-2xl p-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-white/5 border flex items-center justify-center mb-8" style={{ borderColor: data.accentColor + '33' }}>
                  <Target className="w-6 h-6" style={{ color: data.accentColor }} />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{card.title}</h4>
                <p className="text-white/60 leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhoWeWorkWithBlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  const items = data.items || [
    'D2C & Consumer Brands',
    'Startup Founders & Venture Teams',
    'Growth Stage Challenger Brands',
    'Professional Service Firms',
    'Experience & Cultural Brands'
  ];

  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#050505',
        paddingTop: data.paddingTop || '100px',
        paddingBottom: data.padding00 || '100px'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
             <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-6" style={{ color: data.accentColor }}>Partnership</h2>
             <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Who We Work With</h3>
             <p className="text-white/50 text-lg mb-8">We partner with brands that understand that perception is the ultimate currency of the digital age.</p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className={`grid grid-cols-1 sm:grid-cols-${data.gridColumns || 2} gap-4`}>
              {items.map((item: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: data.accentColor }} />
                  <span className="font-medium text-white">{typeof item === 'string' ? item : item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OurRoleBlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  const lines = data.lines || [
    { text: 'CLARITY WHERE THERE IS CONFUSION' },
    { text: 'STRUCTURE WHERE THERE IS INCONSISTENCY' },
    { text: 'DIRECTION WHERE THERE IS NOISE' }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#000000',
        paddingTop: data.paddingTop || '120px',
        paddingBottom: data.paddingBottom || '120px'
      }}
      className="border-y border-white/5"
    >
      <div className="container mx-auto px-6 flex flex-col items-center">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-16" style={{ color: data.accentColor }}>Our Role</h2>
        <div className="space-y-12 w-full max-w-5xl">
          {lines.map((line: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-center group"
            >
              <h3 className="text-3xl md:text-5xl lg:text-7xl font-black text-white/20 group-hover:text-white transition-colors duration-700 cursor-default">
                {line.text}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTABlock = ({ data }: BlockProps) => {
  if (!data?.isVisible) return null;
  return (
    <section 
      style={{ 
        backgroundColor: data.bgColor || '#050505',
        paddingTop: data.paddingTop || '160px',
        paddingBottom: data.paddingBottom || '160px'
      }}
      className="relative overflow-hidden"
    >
       {/* Background Accent */}
       <div className="absolute bottom-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" style={{ backgroundColor: `${data.accentColor}1A` }}></div>

       <div className="container mx-auto px-6 relative z-10 text-center">
         <motion.h3 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-4xl md:text-6xl font-black text-white max-w-4xl mx-auto leading-tight mb-12 uppercase"
         >
           {data.heading || 'If you’re building a brand that deserves to lead — we should talk.'}
         </motion.h3>

         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="flex flex-col items-center gap-8"
         >
            <a 
              href={data.btnLink || '/contact'}
              className="inline-flex items-center gap-3 px-10 py-5 text-black font-black uppercase text-lg rounded-full hover:scale-105 transition-transform"
              style={{ backgroundColor: data.accentColor, boxShadow: `0 10px 40px ${data.accentColor}4D` }}
            >
              {data.btnText || 'Contact Us'}
              <ArrowRight className="w-5 h-5" />
            </a>

            <div className="flex flex-col items-center gap-1">
               <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Email Us</span>
               <a href={`mailto:${data.email || 'hello@eternaventures.in'}`} className="text-2xl font-bold text-white transition-colors underline underline-offset-8 decoration-white/20" onMouseEnter={(e) => e.currentTarget.style.color = data.accentColor} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                 {data.email || 'hello@eternaventures.in'}
               </a>
            </div>
         </motion.div>
       </div>
    </section>
  );
};

export const AboutBlocks = ({ blocks, config = {} }: { blocks: any[], config?: any }) => {
  const accentColor = config.accent_color || '#D6FF00';
  
  return (
    <div className="w-full">
      {blocks.map((block) => {
        // Inject global accent color into block data if not override
        const data = { ...block, accentColor: block.accentColor || accentColor };
        
        switch (block.type) {
          case 'hero': return <HeroBlock key={block.id} data={data} />;
          case 'who_we_are': return <WhoWeAreBlock key={block.id} data={data} />;
          case 'what_we_believe': return <WhatWeBelieveBlock key={block.id} data={data} />;
          case 'our_approach': return <OurApproachBlock key={block.id} data={data} />;
          case 'why_us': return <WhyUsBlock key={block.id} data={data} />;
          case 'who_we_work_with': return <WhoWeWorkWithBlock key={block.id} data={data} />;
          case 'our_role': return <OurRoleBlock key={block.id} data={data} />;
          case 'cta': return <CTABlock key={block.id} data={data} />;
          default: return null;
        }
      })}
    </div>
  );
};

