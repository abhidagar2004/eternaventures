import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Shield, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';

import * as Icons from 'lucide-react';

interface WhyUsProps {
  bgColor?: string;
  textColor?: string;
  heading?: string;
  headingColor?: string;
  tag?: string;
  tagColor?: string;
  cardBgColor?: string;
  iconColor?: string;
}

export default function WhyUs({ 
  bgColor, 
  textColor,
  heading,
  headingColor,
  tag,
  tagColor = "#2596be",
  cardBgColor,
  iconColor = "#2596be"
}: WhyUsProps) {
  const [features, setFeatures] = useState<any[]>([
    {
      title: "Data-Driven Decisions",
      description: "We don't guess. Every campaign, creative, and strategy is backed by hard data and rigorous testing protocols across thousands of data points daily."
    },
    {
      title: "Elite Team Execution",
      description: "No juniors learning on your dime. Your account is managed by senior strategists, media buyers, and creatives who have scaled multi-million dollar brands."
    },
    {
      title: "Transparent Reporting",
      description: "Zero fluff metrics. You get real-time dashboards tracking exactly what matters to your bottom line: CPA, ROAS, LTV, and net profit margins."
    },
    {
      title: "Agile Creative Engine",
      description: "Ad fatigue kills campaigns. Our in-house creative factory produces a high volume of native, platform-specific variations to continuously beat control."
    }
  ]);

  useEffect(() => {
    async function fetchFeatures() {
      const { data } = await supabase.from('why_us_items').select('*').order('order_index', { ascending: true });
      if (data && data.length > 0) {
        setFeatures(data);
      }
    }
    fetchFeatures();
  }, []);

  const defaultCardBg = '#ffffff';

  if (!heading && !tag && features.length === 0) return null;

  return (
    <section className="py-24 border-t border-gray-200" style={{ backgroundColor: bgColor || '#f9fafb' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-bold tracking-widest uppercase text-sm mb-3" style={{ color: tagColor }}>{tag}</h2>
          <h3 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none" style={{ color: headingColor || textColor || '#111827' }}>
            {heading}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            // @ts-ignore
            const Icon = Icons[feature.icon_name] || Icons.HelpCircle;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300"
                style={{ backgroundColor: cardBgColor || defaultCardBg }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: bgColor === '#000000' || bgColor === '#111111' ? '#1f2937' : '#eff6ff', color: iconColor }}>
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-display font-black uppercase tracking-tighter mb-4" style={{ color: textColor || '#111827' }}>{feature.title}</h4>
                <p className="leading-relaxed text-lg" style={{ color: textColor ? textColor : '#4b5563', opacity: textColor ? 0.8 : 1 }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
