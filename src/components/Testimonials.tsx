import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TestimonialsProps {
  tag?: string;
  tagColor?: string;
  tagSize?: string;
  title?: string;
  titleColor?: string;
  titleSize?: string;
  bgColor?: string;
}

export default function Testimonials({
  tag = "Client Love",
  tagColor = "#2596be",
  tagSize = "text-sm",
  title = "Don't just take our word for it.",
  titleColor = "#ffffff",
  titleSize = "text-5xl md:text-7xl",
  bgColor = "#000000"
}: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setReviews(data);
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section style={{ backgroundColor: bgColor }} className="py-24 relative overflow-hidden flex justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#2596be]" />
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24 relative overflow-hidden border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 style={{ color: tagColor }} className={`${tagSize} font-bold tracking-widest uppercase mb-3`}>{tag}</h2>
            <h3 style={{ color: titleColor }} className={`${titleSize} font-display font-black uppercase tracking-tighter leading-none whitespace-pre-line`}>
              {title}
            </h3>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-white hover:bg-[#2596be] hover:border-[#2596be] transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-white hover:bg-[#2596be] hover:border-[#2596be] transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 relative w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-none snap-start flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-8 italic flex-1">"{review.content}"</p>
              <div className="flex items-center gap-4">
                {review.image_url ? (
                  <img src={review.image_url} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                ) : null}
                <div>
                  <p className="text-black font-bold uppercase tracking-wide">{review.name}</p>
                  <p className="text-gray-500 text-sm uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
              
              {/* Decorative Quote Mark */}
              <div className="absolute top-6 right-6 text-6xl text-gray-200 font-display font-black opacity-50 leading-none pointer-events-none">
                "
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
