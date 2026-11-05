import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  if (mobile !== desktop) return `clamp(${mobile}, 4vw, ${desktop})`;
  return mobile;
};

interface TestimonialsProps {
  tag?: string;
  tagColor?: string;
  tagSize?: string;
  title?: string;
  titleColor?: string;
  titleSize?: string;
  bgColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

export default function Testimonials({
  tag = "TESTIMONIALS",
  tagColor = "#d4ff00",
  tagSize = "text-xs",
  title = "EXPERIENCES THAT\nSPEAK FOR THEMSELVES.",
  titleColor = "#ffffff",
  titleSize = "text-3xl md:text-5xl",
  bgColor = "#000000",
  headingFont = "Space Grotesk",
  bodyFont = "Inter",
}: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        // Fallback default high-end testimonials if empty
        setReviews([
          {
            id: '1',
            name: 'Nadia Premnawari',
            role: 'Co-Founder, Véra',
            content: 'EternaVentures helped us sharpen our brand, tell a clearer story, and drive real business growth across every channel.',
            image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            rating: 5,
          },
          {
            id: '2',
            name: 'Rishy Aditya',
            role: 'CEO, Rooted',
            content: "A rare partner that combines big-picture strategy with flawless execution. They've had a huge impact on our growth.",
            image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            rating: 5,
          },
          {
            id: '3',
            name: 'Daniel Hartono',
            role: 'Founder, The Disco Room',
            content: 'Strategic, creative, and performance-obsessed. The team at EternaVentures really understands how to build brands that last.',
            image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            rating: 5,
          }
        ]);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section style={{ backgroundColor: bgColor }} className="py-24 relative overflow-hidden flex justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#d4ff00]" />
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section style={{ backgroundColor: bgColor || '#000000' }} className="py-20 md:py-28 relative overflow-hidden text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header: Tag + Heading with slanted badge + Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-8">
          <div className="max-w-3xl">
            {/* Tag with Neon Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-4"
            >
              <span className="w-8 h-[3px] bg-[#d4ff00] rounded-full inline-block"></span>
              <span
                className="text-xs font-black tracking-widest uppercase text-white"
                style={{ fontFamily: `'${headingFont}', sans-serif` }}
              >
                {tag || 'TESTIMONIALS'}
              </span>
            </motion.div>

            {/* Heading with THEMSELVES badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {(() => {
                const rawTitle = (title || "EXPERIENCES THAT\nSPEAK FOR THEMSELVES.").replace(/\\n/g, '\n');
                const themselvesRegex = /THEMSELVES\.?/i;

                if (themselvesRegex.test(rawTitle)) {
                  const before = rawTitle.replace(themselvesRegex, '').trim();
                  let beforeLines = before.split('\n').map((l: string) => l.trim()).filter(Boolean);

                  if (beforeLines.length === 1 && /EXPERIENCES\s+THAT\s+SPEAK\s+FOR/i.test(beforeLines[0])) {
                    beforeLines = ["EXPERIENCES THAT", "SPEAK FOR"];
                  }

                  return (
                    <h2
                      className="font-black uppercase tracking-tighter text-white leading-[1.05]"
                      style={{ fontFamily: `'${headingFont}', sans-serif`, fontSize: getFontStyle(titleSize, '2.25rem', '4rem') }}
                    >
                      {beforeLines.map((line, idx) => {
                        if (idx === beforeLines.length - 1) {
                          return (
                            <div key={idx} className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 sm:mt-1.5">
                              <span className="whitespace-nowrap">{line}</span>
                              <div className="inline-block bg-[#d4ff00] px-3.5 sm:px-4 py-0.5 sm:py-1 -skew-x-12 shadow-lg">
                                <span className="inline-block skew-x-12 text-black font-black italic tracking-tight uppercase">
                                  THEMSELVES.
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return <div key={idx}>{line}</div>;
                      })}
                    </h2>
                  );
                }

                return (
                  <h2
                    className="font-black uppercase tracking-tighter text-white leading-[1.05]"
                    style={{ fontFamily: `'${headingFont}', sans-serif`, fontSize: getFontStyle(titleSize, '2.25rem', '4rem') }}
                  >
                    {rawTitle.split('\n').map((l: string, i: number) => <div key={i}>{l}</div>)}
                  </h2>
                );
              })()}
            </motion.div>
          </div>

          {/* Navigation Controls: Prev (Bordered) & Next (Solid Neon Yellow) */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all shadow-sm active:scale-95"
              aria-label="Previous Testimonial"
            >
              <ArrowLeft size={18} strokeWidth={2.4} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-[#d4ff00] flex items-center justify-center text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,255,0,0.35)] active:scale-95"
              aria-label="Next Testimonial"
            >
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* 3-Cards Slider Row */}
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => {
            const cleanContent = (review.content || "").replace(/^[“"']+|[”"']+$/g, '').trim();

            return (
              <motion.div
                key={review.id || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group bg-[#0e0e0e]/95 border border-white/10 hover:border-[#d4ff00]/40 rounded-[26px] p-7 sm:p-8 relative overflow-hidden w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-none snap-start flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Subtle Neon Ambient Glow in bottom-right corner */}
                <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#d4ff00]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#d4ff00]/10 transition-all"></div>

                <div>
                  {/* Neon Rating Stars */}
                  <div className="flex gap-1.5 mb-5 text-[#d4ff00]">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#d4ff00] text-[#d4ff00]" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p
                    className="text-gray-200 text-sm sm:text-[15px] leading-relaxed mb-8 font-normal"
                    style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                  >
                    “{cleanContent}”
                  </p>
                </div>

                {/* Author Info with Avatar and vertical divider */}
                <div className="flex items-center gap-4 pt-2 relative z-10 border-t border-white/5">
                  {review.image_url ? (
                    <img
                      src={review.image_url}
                      alt={review.name}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover border border-white/20 p-0.5 bg-black flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white flex-shrink-0">
                      {review.name?.charAt(0)}
                    </div>
                  )}
                  <div className="border-l-2 border-white/15 pl-3.5">
                    <p
                      className="text-white font-bold text-sm sm:text-base leading-snug tracking-tight"
                      style={{ fontFamily: `'${headingFont}', sans-serif` }}
                    >
                      {review.name}
                    </p>
                    <p
                      className="text-gray-400 text-xs sm:text-[13px] leading-snug mt-0.5 font-normal"
                      style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                    >
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Subtle Neon Ambient Glow Ribbon */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-gradient-to-t from-[#d4ff00]/15 via-[#d4ff00]/5 to-transparent blur-2xl"></div>
        <svg className="absolute bottom-0 left-0 w-full h-12 text-[#d4ff00]/30" viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
          <path d="M0 24C240 44 480 4 720 24C960 44 1200 4 1440 24" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      </div>
    </section>
  );
}
