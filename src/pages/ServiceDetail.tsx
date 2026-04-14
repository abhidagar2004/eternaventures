import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchService();
  }, [slug]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setService(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-6">
        <h1 className="text-4xl font-display font-bold mb-4">Service Not Found</h1>
        <p className="text-gray-400 mb-8">The service you are looking for might have been moved or doesn't exist.</p>
        <Link to="/services" className="bg-blue-600 px-6 py-3 rounded-full font-bold">
          Back to Services
        </Link>
      </div>
    );
  }

  const features = service.features || [];
  const faqs = service.faqs || [];

  return (
    <div className="bg-black text-white">
      {/* Banner */}
      <section className={`relative flex items-center justify-center overflow-hidden ${service.banner_padding_top || 'pt-32'} ${service.banner_padding_bottom || 'pb-12'}`}>
        <div className="absolute inset-0 z-0">
          <img 
            src={service.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426'} 
            className="w-full h-full object-cover opacity-40 blur-[2px] scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-32 pb-12 lg:pt-0 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {service.show_banner_tag !== false && (
              <span className="font-bold uppercase tracking-widest text-sm mb-4 lg:mb-6 block" style={{ color: service.subtitle_color || '#c2ff00' }}>
                {service.subtitle || 'Service Expertise'}
              </span>
            )}
            <h1 className="text-5xl md:text-9xl font-display font-black leading-[0.9] lg:leading-[0.8] tracking-tighter mb-6 lg:mb-10 max-w-5xl mx-auto" style={{ color: service.title_color || '#ffffff' }}>
              {service.detail_heading || service.title}
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              {service.detail_subheading || service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section 
          className="pb-32 relative" 
          ref={containerRef}
          style={{ backgroundColor: service.features_bg_color || '#000000' }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            {features.filter((f: any) => f.title && f.description).map((feature: any, idx: number) => (
              <div key={idx} className="flex flex-col lg:flex-row gap-10 lg:gap-20 min-h-[50vh] lg:min-h-screen py-20 lg:py-0 items-center">
                {/* Left Side: Content */}
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-6 mb-8 lg:mb-10">
                    <span 
                      className="text-3xl lg:text-4xl font-display font-black"
                      style={{ color: service.features_number_color || 'rgba(255,255,255,0.1)' }}
                    >
                      0{idx + 1}
                    </span>
                    <div 
                      className="h-[2px] flex-grow"
                      style={{ backgroundColor: service.features_line_color || 'rgba(255,255,255,0.05)' }}
                    ></div>
                  </div>
                  
                  <h3 className="text-4xl lg:text-6xl font-display font-black text-white mb-6 lg:mb-8 leading-tight tracking-tighter">
                    {feature.title}
                  </h3>
                  
                  <p 
                    className={`leading-relaxed font-medium mb-12 ${service.features_font_size || 'text-lg lg:text-2xl'}`}
                    style={{ color: service.features_content_color || '#9ca3af' }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Right Side: Sticky Image Context */}
                <div className="lg:w-1/2 lg:sticky lg:top-[20vh] lg:h-[60vh] flex items-center">
                  <div className="relative w-full h-[400px] lg:h-full rounded-2xl lg:rounded-[3rem] overflow-hidden shadow-2xl bg-gray-900 border border-white/5 ring-1 ring-white/10">
                    <img 
                      src={feature.image_url || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070'} 
                      className="w-full h-full object-cover" 
                      alt={feature.title}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8 lg:bottom-12 lg:left-12 lg:right-12 flex items-center justify-between">
                      <div className="h-1 flex-grow bg-white/20 rounded-full overflow-hidden mr-6" style={{ backgroundColor: `${service.features_line_color}33` }}>
                        <div 
                          className="h-full w-full"
                          style={{ backgroundColor: service.subtitle_color || '#c2ff00' }}
                        />
                      </div>
                      <span className="font-black text-xl lg:text-2xl tracking-tighter opacity-50" style={{ color: service.features_number_color || '#ffffff' }}>
                        0{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.filter((f: any) => f.question && f.answer).length > 0 && (
        <section className="py-32 bg-[#0a0a0a] border-y border-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20 text-balance">
              <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tighter">COMMON QUESTIONS</h2>
              <p className="text-gray-400 text-lg">Everything you need to know about our {service.title} process.</p>
            </div>
            <div className="space-y-4">
              {faqs.filter((f: any) => f.question && f.answer).map((faq: any, idx: number) => (
                <FAQItem key={idx} faq={faq} hoverColor={service.faq_hover_color || '#c2ff00'} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section 
        className="py-40 text-center relative overflow-hidden"
        style={{ backgroundColor: service.cta_bg_color || '#000000' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-5xl mx-auto px-6">
          <h2 
            className="text-6xl md:text-9xl font-display font-black mb-12 leading-[0.85] tracking-tighter text-balance"
            style={{ color: service.cta_text_color || '#ffffff' }}
          >
            {service.cta_title || `DOMINATE THE MARKET WITH ${service.title.toUpperCase()}`}
          </h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-4 px-16 py-6 font-black tracking-widest hover:scale-105 transition-all duration-300 shadow-xl group"
            style={{ 
              backgroundColor: service.cta_button_color || '#c2ff00',
              color: service.cta_button_text_color || '#000000',
              borderRadius: service.cta_button_radius || '9999px'
            }}
          >
            {service.cta_button_text || 'BOOK A STRATEGY CALL'}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}



function FAQItem({ faq, hoverColor }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="bg-[#111111] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-300"
      style={{ 
        borderColor: isOpen ? `${hoverColor}33` : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isOpen) e.currentTarget.style.borderColor = `${hoverColor}33`;
      }}
      onMouseLeave={(e) => {
        if (!isOpen) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
      }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 text-left"
      >
        <span className="text-xl md:text-2xl font-bold text-white tracking-tight">{faq.question}</span>
        <div 
          className="p-2 rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: isOpen ? hoverColor : 'rgba(255,255,255,0.05)',
            color: isOpen ? '#000000' : '#ffffff'
          }}
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="px-8 pb-8 text-xl text-gray-500 leading-relaxed font-medium">
          {faq.answer}
        </div>
      </motion.div>
    </div>
  );
}
