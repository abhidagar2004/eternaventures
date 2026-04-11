import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

interface ProcessProps {
  bgColor?: string;
  textColor?: string;
  heading?: string;
  tag?: string;
  tagColor?: string;
  circleBgColor?: string;
  circleBorderColor?: string;
  circleTextColor?: string;
}

export default function Process({ 
  bgColor, 
  textColor,
  heading,
  tag,
  tagColor = '#2596be',
  circleBgColor,
  circleBorderColor = '#2596be',
  circleTextColor = '#2596be'
}: ProcessProps) {
  const [steps, setSteps] = useState<any[]>([
    {
      step_num: "01",
      title: "Research & Strategy",
      description: "We deep-dive into your brand, competitors, and audience to craft a bulletproof growth roadmap."
    },
    {
      step_num: "02",
      title: "Content & Creative",
      description: "Our creative team produces high-converting assets tailored for native platform consumption."
    },
    {
      step_num: "03",
      title: "Launch & Ads",
      description: "We deploy campaigns across Meta, Google, or TikTok with precise targeting and tracking."
    },
    {
      step_num: "04",
      title: "Scale & Optimize",
      description: "We analyze the data daily, killing losers and scaling winners to maximize your ROI."
    }
  ]);

  useEffect(() => {
    async function fetchSteps() {
      const { data } = await supabase.from('process_steps').select('*').order('order_index', { ascending: true });
      if (data && data.length > 0) setSteps(data);
    }
    fetchSteps();
  }, []);

  const defaultCircleBg = bgColor === '#000000' || bgColor === '#111111' ? '#1f2937' : '#f9fafb';

  if (!heading && !tag && steps.length === 0) return null;

  return (
    <section id="process" className="py-24 relative overflow-hidden" style={{ backgroundColor: bgColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-bold tracking-widest uppercase text-sm mb-3" style={{ color: tagColor }}>{tag}</h2>
          <h3 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none" style={{ color: textColor || '#111827' }}>
            {heading}
          </h3>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div 
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center font-display font-black text-xl mb-6 shadow-lg" 
                  style={{ 
                    backgroundColor: circleBgColor || defaultCircleBg,
                    borderColor: circleBorderColor,
                    color: circleTextColor,
                    boxShadow: `0 0 30px ${circleBorderColor}30`
                  }}
                >
                  {step.step_num}
                </div>
                <h4 className="text-xl font-bold mb-3" style={{ color: textColor || '#111827' }}>{step.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: textColor ? textColor : '#4b5563', opacity: textColor ? 0.8 : 1 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
