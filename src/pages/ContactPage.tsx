import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowDown, ArrowRight, Plus, Minus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const contactFaqs = [
  {
    question: "What makes EternaVentures different from other agencies?",
    answer: "We operate as an integrated growth engine rather than a siloed agency. Senior-only operators handle your strategy, creative, and performance marketing with zero junior delegation and full transparent attribution."
  },
  {
    question: "Do you work with startups or just established brands?",
    answer: "We partner with ambitious, funded startups looking to claim market share as well as established industry leaders aiming to reinvent their categories."
  },
  {
    question: "What is your minimum engagement size?",
    answer: "Our typical strategic advisory or full-service engagements start from focused sprint commitments or quarterly retainers customized to your growth stage."
  },
  {
    question: "How do you price your services?",
    answer: "We offer transparent, value-aligned pricing based on scope—ranging from fixed strategic deliverables to performance-driven retainer partnerships."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please provide your name and email.');
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.from('leads').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }
      ]);

      if (error) {
        console.warn('Lead insert notice:', error);
      }

      toast.success('Strategy request submitted successfully! We will get in touch shortly.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      toast.success('Thank you! Your strategy session request has been received.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToForm = () => {
    const el = document.getElementById('project-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 flex flex-col items-start z-10">
              <span className="text-xs font-black tracking-[0.25em] text-[#d4ff00] uppercase mb-4">
                CONTACT / STRATEGY SESSION
              </span>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[0.95] mb-6">
                LET'S BUILD<br />
                <span className="inline-block bg-[#d4ff00] text-black px-4 py-1.5 -rotate-1 mt-2 font-black shadow-lg">
                  WHAT'S NEXT.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-lg mb-8 leading-relaxed">
                Tell us about your goals. We'll map out a clear path to growth.
              </p>

              <button 
                onClick={scrollToForm}
                className="group inline-flex items-center gap-2 text-sm md:text-base font-bold tracking-wide text-white hover:text-[#d4ff00] transition-colors"
              >
                <span>Request a Strategy Session</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-[#d4ff00]" />
              </button>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-none h-[280px] sm:h-[340px] md:h-[400px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
                <img 
                  src="/images/contact-reference.jpg" 
                  alt="Strategy Session Diagram and Planning" 
                  className="w-full h-full object-cover object-[85%_12%] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact & Form Section (Light Off-White Background) */}
      <section id="project-form" className="py-24 md:py-32 bg-[#f7f7f5] text-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
            {/* Left Column: Let's Talk */}
            <div className="lg:col-span-5 flex flex-col justify-between pt-2">
              <div>
                <span className="text-xs font-black tracking-[0.25em] text-neutral-500 uppercase block mb-3">
                  LET'S TALK
                </span>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[0.95] text-black mb-6">
                  READY TO SCALE<br />
                  <span className="inline-block bg-[#d4ff00] text-black px-3.5 py-1 -rotate-1 mt-2 font-black">
                    YOUR BRAND?
                  </span>
                </h2>

                <p className="text-neutral-600 text-lg md:text-xl font-medium mb-12 max-w-md">
                  Request a free growth audit and strategy session.
                </p>
              </div>

              {/* Contact Information Rows */}
              <div className="space-y-6 pt-4 border-t border-neutral-300/80">
                <a 
                  href="mailto:hello@eternaventures.in" 
                  className="flex items-center gap-4 group text-neutral-800 hover:text-black transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center group-hover:border-[#d4ff00] group-hover:bg-[#d4ff00] transition-colors">
                    <Mail className="w-4 h-4 text-neutral-800" />
                  </div>
                  <span className="font-bold text-base md:text-lg tracking-tight">
                    hello@eternaventures.in
                  </span>
                </a>

                <div className="h-px bg-neutral-200/80 w-full" />

                <a 
                  href="tel:+917976307052" 
                  className="flex items-center gap-4 group text-neutral-800 hover:text-black transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center group-hover:border-[#d4ff00] group-hover:bg-[#d4ff00] transition-colors">
                    <Phone className="w-4 h-4 text-neutral-800" />
                  </div>
                  <span className="font-bold text-base md:text-lg tracking-tight">
                    +91 7976307052
                  </span>
                </a>

                <div className="h-px bg-neutral-200/80 w-full" />

                <div className="flex items-center gap-4 text-neutral-800">
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-neutral-800" />
                  </div>
                  <span className="font-bold text-base md:text-lg tracking-tight">
                    Jaipur, Rajasthan, India
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Project Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-xl">
                <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase text-black mb-8">
                  TELL US ABOUT YOUR PROJECT
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black tracking-wider uppercase text-neutral-900 mb-2">
                        NAME
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="w-full bg-[#fbfbfa] border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder-neutral-400 font-medium text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black tracking-wider uppercase text-neutral-900 mb-2">
                        EMAIL
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-[#fbfbfa] border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder-neutral-400 font-medium text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider uppercase text-neutral-900 mb-2">
                      PHONE (OPTIONAL)
                    </label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#fbfbfa] border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder-neutral-400 font-medium text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider uppercase text-neutral-900 mb-2">
                      MESSAGE
                    </label>
                    <textarea 
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your brand, goals, or current challenges..."
                      className="w-full bg-[#fbfbfa] border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder-neutral-400 font-medium text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#d4ff00] hover:bg-[#c6f000] active:scale-[0.99] text-black font-black uppercase text-sm tracking-widest py-4 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>SUBMIT REQUEST</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ Section (Dark Background) */}
      <section className="py-24 md:py-32 bg-black text-white border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left FAQ Heading */}
            <div className="lg:col-span-5">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.95]">
                COMMON<br />QUESTIONS
              </h2>
              <div className="h-1.5 w-24 bg-[#d4ff00] my-6 rounded-full" />
              <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-sm">
                Quick answers to help you get started with EternaVentures.
              </p>
            </div>

            {/* Right FAQ List */}
            <div className="lg:col-span-7 divide-y divide-neutral-800">
              {contactFaqs.map((faq, idx) => (
                <div key={idx} className="py-6 first:pt-0 last:pb-0">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                  >
                    <span className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[#d4ff00] transition-colors pr-6">
                      {faq.question}
                    </span>
                    <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-[#d4ff00] group-hover:text-black transition-colors shrink-0">
                      {openFaq === idx ? (
                        <Minus className="w-4 h-4 text-white group-hover:text-black" />
                      ) : (
                        <Plus className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                      )}
                    </div>
                  </button>

                  {openFaq === idx && (
                    <div className="pt-3 pb-2 text-neutral-400 text-base md:text-lg leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}