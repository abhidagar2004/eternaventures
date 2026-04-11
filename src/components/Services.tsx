import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface ServicesProps {
  bgColor?: string;
  textColor?: string;
  cardBgColor?: string;
  tag?: string;
  tagColor?: string;
  heading?: string;
  headingSize?: string;
  description?: string;
}

export default function Services({
  bgColor = '#000000',
  textColor = '#ffffff',
  cardBgColor = 'transparent',
  tag,
  tagColor = '#2596be',
  heading,
  headingSize = 'text-5xl md:text-7xl',
  description
}: ServicesProps) {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchServices() {
      // The images grid uses order_index or created_at, let's just order by created_at ascending to match items
      const { data } = await supabase.from('services').select('*').eq('visibility', 'visible').order('created_at', { ascending: true });
      if (data) setServices(data);
    }
    fetchServices();
  }, []);

  if (!heading && !tag && services.length === 0) return null;

  if (!heading && !tag && services.length === 0) return null;

  return (
    <section id="services" className="py-24 relative" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 max-w-7xl">
          <div className="max-w-3xl">
            {tag && tag.trim() !== "" && <h2 className="font-bold tracking-widest uppercase text-sm mb-3" style={{ color: tagColor }}>{tag}</h2>}
            {heading && heading.trim() !== "" && (
              <h3 className={`${headingSize} font-display font-black uppercase tracking-tighter mb-6 md:mb-0 leading-none whitespace-pre-line`} style={{ color: textColor }}>
                {heading}
              </h3>
            )}
          </div>
          <div className="max-w-md text-left md:text-right">
             {description && description.trim() !== "" && (
               <p className="text-lg opacity-80 whitespace-pre-line" style={{ color: textColor }}>
                 {description}
               </p>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl p-4 -m-4 transition-colors"
              style={{ backgroundColor: cardBgColor === 'transparent' ? undefined : cardBgColor }}
            >
              <Link to={`/services/${service.slug}`} className="block">
                <div className="overflow-hidden mb-6 rounded-xl bg-gray-100">
                  <img 
                    src={service.image_url || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000'} 
                    alt={service.title} 
                    className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                {service.subtitle && (
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60" style={{ color: textColor }}>
                    {service.subtitle}
                  </p>
                )}
                <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4 transition-colors group-hover:text-[#c2ff00]" style={{ color: textColor }}>
                  {service.title}
                </h3>
                <p className="leading-relaxed opacity-80" style={{ color: textColor }}>
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
          {services.length === 0 && (
            <div className="col-span-3 text-center py-12 opacity-50 font-bold uppercase tracking-widest">
              No services found. Add some from the dashboard.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
