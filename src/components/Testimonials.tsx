import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
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
  tag = "Client Love",
  tagColor = "#ceff00",
  tagSize = "text-sm",
  title = "Results that speak for themselves.",
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
      if (data) setReviews(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section style={{ backgroundColor: bgColor }} className="py-24 relative overflow-hidden flex justify-center">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: tagColor }} />
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24 relative overflow-hidden border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="font-bold tracking-widest uppercase mb-3" style={{ color: tagColor, fontFamily: `'${headingFont}', sans-serif`, fontSize: getFontStyle(tagSize, '0.75rem', '0.875rem') }}>
              {tag}
            </p>
            <h3 style={{ color: titleColor, fontFamily: `'${headingFont}', sans-serif`, fontSize: getFontStyle(titleSize, '2rem', '4rem'), fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '0.9', textTransform: 'uppercase', whiteSpace: 'pre-line' }}>
              {title}
            </h3>
          </div>
          <div className="flex gap-4">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-white hover:bg-white/10 transition-all" aria-label="Previous"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-white hover:bg-white/10 transition-all" aria-label="Next"><ChevronRight size={24} /></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {reviews.map((review, index) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 relative w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-none snap-start flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating || 5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />))}
              </div>
              <p className="text-gray-700 text-lg mb-8 italic flex-1" style={{ fontFamily: `'${bodyFont}', sans-serif` }}>"{review.content}"</p>
              <div className="flex items-center gap-4">
                {review.image_url && <img src={review.image_url} alt={review.name} className="w-12 h-12 rounded-full object-cover" />}
                <div>
                  <p className="text-black font-bold uppercase tracking-wide" style={{ fontFamily: `'${headingFont}', sans-serif` }}>{review.name}</p>
                  <p className="text-gray-500 text-sm uppercase tracking-widest" style={{ fontFamily: `'${bodyFont}', sans-serif` }}>{review.role}</p>
                </div>
              </div>
              <div className="absolute top-6 right-6 text-6xl text-gray-200 font-black opacity-50 leading-none pointer-events-none" style={{ fontFamily: `'${headingFont}', sans-serif` }}>"</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
