import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowUpRight, ArrowDown, Plus, Minus } from 'lucide-react';
import { servicesData, ServiceDetailData } from '../data/servicesData';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Lookup service from dataset
  const activeSlug = slug || 'brand-architecture-identity-systems';
  const service: ServiceDetailData = servicesData[activeSlug] || servicesData['brand-architecture-identity-systems'];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToCapabilities = () => {
    const el = document.getElementById('capabilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* 1. Hero Section (Dark Luxury Aesthetic) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb / Back Link */}
          <div className="mb-10">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-400 hover:text-[#d4ff00] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Services</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start z-10">
              <span className="text-xs font-black tracking-[0.25em] text-[#d4ff00] uppercase mb-4">
                {service.number} / {service.category}
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[0.95] mb-6">
                {service.heroHeading}<br />
                <span className="inline-block bg-[#d4ff00] text-black px-4 py-1.5 -rotate-1 mt-2 font-black shadow-lg">
                  {service.heroHighlight}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-xl mb-10 leading-relaxed">
                {service.heroDescription}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/contact"
                  className="bg-[#d4ff00] hover:bg-[#c6f000] active:scale-[0.98] text-black font-black uppercase text-xs sm:text-sm tracking-wider px-8 py-4 rounded-full shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span>{service.ctaButtonText}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <button
                  onClick={scrollToCapabilities}
                  className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-neutral-300 hover:text-white transition-colors cursor-pointer group"
                >
                  <span>Explore Capabilities</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-[#d4ff00]" />
                </button>
              </div>
            </div>

            {/* Right Column (Hero Visual Mockup) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none h-[300px] sm:h-[380px] md:h-[440px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
                <img 
                  src={service.heroImage} 
                  alt={service.heroHeading} 
                  className="w-full h-full object-cover scale-105"
                  style={{ objectPosition: service.heroImageObjectPos || 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What We Design / Offerings Section (Light Off-White Background) */}
      <section id="capabilities" className="py-24 md:py-32 bg-[#f7f7f5] text-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="mb-16">
            <span className="text-xs font-black tracking-[0.25em] text-neutral-500 uppercase block mb-3">
              {service.whatWeDesignEyebrow}
            </span>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[0.95] text-black">
              {service.whatWeDesignHeading}{' '}
              <span className="inline-block bg-[#d4ff00] text-black px-3.5 py-1 -rotate-1 font-black">
                {service.whatWeDesignHighlight}
              </span>
            </h2>
          </div>

          {/* Feature Grid: 1 Big Top Card + 2 Equal Columns Below */}
          <div className="space-y-8">
            {/* Top Card (Feature 01) */}
            {service.features[0] && (
              <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  <div className="lg:col-span-7 h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden bg-neutral-100">
                    <img 
                      src={service.features[0].image} 
                      alt={service.features[0].title}
                      className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                      style={{ objectPosition: service.features[0].imageObjectPos || 'center' }}
                    />
                  </div>
                  <div className="lg:col-span-5 p-8 sm:p-12">
                    <span className="text-xs font-black tracking-widest text-[#6c8100] uppercase block mb-2">
                      {service.features[0].number}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-black mb-4">
                      {service.features[0].title}
                    </h3>
                    <p className="text-neutral-600 text-base md:text-lg font-medium leading-relaxed">
                      {service.features[0].description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom 2 Cards (Feature 02 and Feature 03) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.features.slice(1, 3).map((feat, idx) => (
                <div key={idx} className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-[240px] sm:h-[280px] overflow-hidden bg-neutral-100">
                    <img 
                      src={feat.image} 
                      alt={feat.title}
                      className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                      style={{ objectPosition: feat.imageObjectPos || 'center' }}
                    />
                  </div>
                  <div className="p-8 sm:p-10 flex-1 flex flex-col justify-start">
                    <span className="text-xs font-black tracking-widest text-[#6c8100] uppercase block mb-2">
                      {feat.number}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-black mb-3">
                      {feat.title}
                    </h3>
                    <p className="text-neutral-600 text-sm sm:text-base font-medium leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Deliverables Section (Dark Black Background) */}
      <section className="py-24 md:py-32 bg-black text-white border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-16">
            <span className="text-xs font-black tracking-[0.25em] text-[#d4ff00] uppercase block mb-3">
              {service.deliverablesEyebrow}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[0.95]">
              {service.deliverablesHeading}{' '}
              <span className="inline-block bg-[#d4ff00] text-black px-3.5 py-1 -rotate-1 font-black">
                {service.deliverablesHighlight}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Mockup Image */}
            <div className="lg:col-span-6">
              <div className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
                <img 
                  src={service.deliverablesImage} 
                  alt={service.deliverablesHeading}
                  className="w-full h-full object-cover scale-105"
                  style={{ objectPosition: service.deliverablesImageObjectPos || 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right Numbered Deliverables List */}
            <div className="lg:col-span-6 space-y-8 divide-y divide-neutral-900">
              {service.deliverablesList.map((deliv, idx) => (
                <div key={idx} className="pt-8 first:pt-0">
                  <div className="flex items-start gap-4">
                    <span className="text-lg font-black text-[#d4ff00] tracking-wider shrink-0 mt-0.5">
                      {deliv.number}
                    </span>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mb-2">
                        {deliv.title}
                      </h4>
                      <p className="text-neutral-400 text-sm sm:text-base font-medium leading-relaxed">
                        {deliv.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Process Timeline (Light Off-White Background) */}
      <section className="py-24 md:py-32 bg-[#f7f7f5] text-neutral-900 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase text-black mb-16">
            {service.processHeading}
          </h2>

          {/* 4-Step Process Timeline */}
          <div className="relative">
            {/* Connecting horizontal line on desktop */}
            <div className="hidden lg:block absolute top-6 left-6 right-6 h-0.5 bg-neutral-300 -z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10">
              {service.processSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-[#d4ff00] border-2 border-black flex items-center justify-center font-black text-black text-sm mb-6 shadow-sm">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-black font-display tracking-tight uppercase text-black mb-2">
                    {step.title}
                  </h4>
                  <p className="text-neutral-600 text-sm font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Common Questions / FAQ Accordion (Light Background) */}
      <section className="py-24 md:py-32 bg-[#f7f7f5] text-neutral-900 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left FAQ Title */}
            <div className="lg:col-span-5">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.95] text-black mb-6">
                COMMON<br />QUESTIONS
              </h2>
              <div className="h-1.5 w-20 bg-[#d4ff00] mb-6 rounded-full" />
              <p className="text-neutral-600 text-lg font-medium max-w-sm">
                {service.faqSubtitle}
              </p>
            </div>

            {/* Right FAQ List */}
            <div className="lg:col-span-7 divide-y divide-neutral-300">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="py-6 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                  >
                    <span className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black transition-colors pr-6">
                      {idx + 1}. {faq.question}
                    </span>
                    <div className="p-2 rounded-full bg-neutral-200 group-hover:bg-[#d4ff00] transition-colors shrink-0">
                      {openFaq === idx ? (
                        <Minus className="w-4 h-4 text-black" />
                      ) : (
                        <Plus className="w-4 h-4 text-black" />
                      )}
                    </div>
                  </button>

                  {openFaq === idx && (
                    <div className="pt-3 pb-2 text-neutral-600 text-base md:text-lg leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. High-Impact Lime CTA Banner */}
      <section className="bg-[#d4ff00] text-black py-16 md:py-24 border-t border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Big Text */}
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.95]">
                {service.ctaHeading}
              </h2>
            </div>

            {/* Right Subtext & Action Button */}
            <div className="lg:col-span-5 flex flex-col lg:items-end justify-center">
              <p className="text-lg sm:text-xl font-bold text-black mb-6 max-w-md lg:text-right">
                {service.ctaDescription}
              </p>

              <Link
                to="/contact"
                className="bg-black text-white hover:bg-neutral-800 active:scale-[0.98] font-black uppercase text-xs sm:text-sm tracking-wider px-8 py-4 rounded-full shadow-xl transition-all inline-flex items-center gap-2 group w-fit"
              >
                <span>{service.ctaButtonText}</span>
                <ArrowUpRight className="w-4 h-4 text-[#d4ff00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}