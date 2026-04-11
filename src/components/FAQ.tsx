import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FAQProps {
  sectionBgColor?: string;
  sectionBorderColor?: string;
  tagColor?: string;
  headingColor?: string;
  itemBgColor?: string;
  itemBorderColor?: string;
  questionColor?: string;
  answerColor?: string;
  iconColor?: string;
  hoverColor?: string;
}

export default function FAQ(props: FAQProps) {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFaqs() {
      const { data } = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
      if (data && data.length > 0) setFaqs(data);
    }
    fetchFaqs();
  }, []);

  const p = props;

  if (faqs.length === 0) return null;

  return (
    <section 
      className="py-32 border-t" 
      style={{ backgroundColor: p.sectionBgColor || '#000000', borderColor: p.sectionBorderColor || '#111827' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20 text-balance">
          <h2 className="font-display font-black tracking-widest uppercase text-sm mb-6" style={{ color: p.tagColor || '#2596be' }}>FAQ</h2>
          <h3 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter" style={{ color: p.headingColor || '#ffffff' }}>Common Questions</h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, p }: { faq: any; p: FAQProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const hoverColor = p.hoverColor || '#2596be';

  return (
    <div 
      className="border rounded-[2rem] overflow-hidden transition-all duration-300"
      style={{ 
        backgroundColor: p.itemBgColor || '#111', 
        borderColor: isOpen ? `${hoverColor}33` : (p.itemBorderColor || 'rgba(255,255,255,0.05)')
      }}
      onMouseEnter={(e) => {
        if (!isOpen) e.currentTarget.style.borderColor = `${hoverColor}33`;
      }}
      onMouseLeave={(e) => {
        if (!isOpen) e.currentTarget.style.borderColor = p.itemBorderColor || 'rgba(255,255,255,0.05)';
      }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
      >
        <span className="font-bold text-xl md:text-2xl tracking-tight" style={{ color: p.questionColor || '#ffffff' }}>{faq.question}</span>
        <div 
          className="p-2 rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: isOpen ? hoverColor : 'rgba(255,255,255,0.05)',
            color: isOpen ? '#000000' : (p.iconColor || '#ffffff')
          }}
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden"
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            <div 
              className="px-8 pb-8 text-xl leading-relaxed font-medium"
              style={{ color: p.answerColor || '#9ca3af' }}
            >
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
