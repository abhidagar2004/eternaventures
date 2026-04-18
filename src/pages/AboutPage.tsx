import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import TrustBar from '../components/TrustBar';

// ─── Font size helper ─────────────────────────────────────────────────────────
const TW: Record<string, string> = {
  'text-xs': '0.75rem', 'text-sm': '0.875rem', 'text-base': '1rem',
  'text-lg': '1.125rem', 'text-xl': '1.25rem', 'text-2xl': '1.5rem',
  'text-3xl': '1.875rem', 'text-4xl': '2.25rem', 'text-5xl': '3rem',
  'text-6xl': '3.75rem', 'text-7xl': '4.5rem', 'text-8xl': '6rem', 'text-9xl': '8rem',
};
const fs = (s?: string, mob = '2rem', desk = '4rem') => {
  if (!s) return `clamp(${mob}, 4vw, ${desk})`;
  if (/^\d/.test(s) || s.includes('px') || s.includes('rem')) return s;
  const parts = s.split(/\s+/);
  const m = TW[parts[0]] || mob;
  let d = m;
  parts.forEach(p => {
    if (p.startsWith('lg:')) d = TW[p.replace('lg:', '')] || d;
    else if (p.startsWith('md:')) d = TW[p.replace('md:', '')] || d;
  });
  return m !== d ? `clamp(${m}, 4vw, ${d})` : m;
};

// ─── Default content ──────────────────────────────────────────────────────────
const DEF = {
  page_bg_color: '#000000',
  page_text_color: '#ffffff',
  banner_heading: 'We design how brands are understood',
  banner_heading_color: '#ffffff',
  banner_heading_size: 'text-4xl md:text-6xl lg:text-7xl',
  banner_subheading: 'EternaVentures is a growth media company based in Jaipur — built for brands that want to lead their category, not just participate in it.',
  banner_subheading_color: '#9ca3af',
  banner_subheading_size: 'text-lg md:text-xl',
  banner_bg_color: '#000000',
  banner_bg_image: '',
  banner_padding_top: '160',
  banner_padding_bottom: '100',

  who_we_are_heading: 'Who We Are',
  who_we_are_text: `EternaVentures was built on a simple observation:\n\nMost brands are not limited by resources.\nThey are limited by how they are perceived.\n\nThey invest in marketing, content, and campaigns — but without a clear position, everything becomes fragmented. The result is inconsistent growth, unclear messaging, and a brand that feels replaceable.\n\nWe exist to bring structure to that chaos.\n\nWe work with founders and teams to define, build, and scale brands with clarity — so every action contributes to long-term market authority.`,
  who_we_are_bg_color: '#000000',
  who_we_are_heading_color: '#ffffff',
  who_we_are_text_color: '#9ca3af',

  what_we_believe_heading: 'What We Believe',
  what_we_believe_text: `We don't look at marketing as a set of activities.\nWe look at it as a system of signals.\n\nEvery brand is constantly communicating — through its content, design, pricing, presence, and decisions.\n\nMost brands don't control these signals.\nWe help you take control of them.\n\nBecause in today's market:\nPerception drives attention\nAttention drives trust\nTrust drives growth`,
  what_we_believe_bg_color: '#0a0a0a',
  what_we_believe_heading_color: '#ffffff',
  what_we_believe_text_color: '#9ca3af',
  what_we_believe_accent_color: '#ceff00',

  our_approach_heading: 'Our Approach',
  our_approach_text: `We don't operate through isolated services.\nWe build interconnected growth systems.\n\nInstead of treating branding, content, performance, and experience separately — we align them.\n\nYour positioning defines your communication\nYour communication attracts the right audience\nYour audience informs your performance\nYour performance strengthens your strategy\n\nThis creates consistency, efficiency, and compounding growth over time.`,
  our_approach_bg_color: '#000000',
  our_approach_heading_color: '#ffffff',
  our_approach_text_color: '#9ca3af',

  why_eterna_heading: 'Why EternaVentures',
  why_eterna_text: `Because most growth today is reactive.\n\nBrands follow trends, copy competitors, and optimize for short-term metrics — without building long-term value.\n\nWe take a different approach.\n\nWe focus on:\nClarity before execution\nDirection before scale\nSystems over scattered efforts\n\nThe goal is not just visibility.\nThe goal is to become the obvious choice in your category.`,
  why_eterna_bg_color: '#0a0a0a',
  why_eterna_heading_color: '#ffffff',
  why_eterna_text_color: '#9ca3af',
  why_eterna_accent_color: '#ceff00',

  who_we_work_with_heading: 'Who We Work With',
  who_we_work_with_text: `We partner with brands that think beyond immediate results.\n\nTypically, the brands we work with:\nWant to build strong positioning, not just presence\nAre open to rethinking their current approach\nValue strategy as much as execution\nAim to grow with consistency, not unpredictability\n\nFrom Jaipur to global markets, we work with brands driven by ambition — not just activity.`,
  who_we_work_with_bg_color: '#000000',
  who_we_work_with_heading_color: '#ffffff',
  who_we_work_with_text_color: '#9ca3af',

  our_role_heading: 'Our Role',
  our_role_text: `We don't position ourselves as vendors.\n\nWe work as strategic partners — closely involved in how your brand thinks, communicates, and grows.\n\nOur role is to bring:\nClarity where there is confusion\nStructure where there is inconsistency\nDirection where there is noise`,
  our_role_bg_color: '#0a0a0a',
  our_role_heading_color: '#ffffff',
  our_role_text_color: '#9ca3af',

  closing_text: `If you're looking for someone to manage tasks, we may not be the right fit.\n\nBut if you're building a brand that deserves to lead —\nwe should talk.`,
  closing_bg_color: '#000000',
  closing_text_color: '#9ca3af',

  cta_heading: 'Tell us where your brand stands today.',
  cta_heading_color: '#000000',
  cta_heading_size: 'text-3xl md:text-5xl lg:text-6xl',
  cta_subheading: "We'll show you where it could go.",
  cta_subheading_color: '#000000',
  cta_bg_color: '#ceff00',
  cta_btn_text: 'Get In Touch',
  cta_btn_color: '#000000',
  cta_btn_text_color: '#ceff00',
  cta_btn_radius: '9999px',
  btn_link: '/contact',
  cta_email: 'hello@eternaventures.in',

  trust_stat1_value: '50+',
  trust_stat1_label: 'Brands Scaled',
  trust_stat2_value: '₹50Cr+',
  trust_stat2_label: 'Ad Spend Managed',
  trust_stat3_value: '100M+',
  trust_stat3_label: 'Reach Generated',
  trust_stat4_value: '4.9/5',
  trust_stat4_label: 'Client Rating',
  trust_bg_color: '#111111',
  trust_text_color: '#ffffff',
};

// ─── Bullet parser ────────────────────────────────────────────────────────────
// Renders text where lines starting with a verb (e.g. "Clarity before…") are highlighted
function RichText({ text, textColor, accentColor }: { text: string; textColor: string; accentColor?: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const isEmpty = line.trim() === '';
        const isBullet = !isEmpty && line.trim().length < 60 && !line.trim().endsWith('.');
        return isEmpty ? (
          <div key={i} className="h-4" />
        ) : isBullet && accentColor ? (
          <p key={i} style={{ color: accentColor, fontWeight: 700, letterSpacing: '0.01em' }} className="text-sm uppercase tracking-wider mb-1">
            {line}
          </p>
        ) : (
          <p key={i} style={{ color: textColor }} className="leading-relaxed mb-0">
            {line}
          </p>
        );
      })}
    </>
  );
}

// ─── Content Section Template ─────────────────────────────────────────────────
function ContentSection({
  bgColor, headingColor, textColor, accentColor,
  heading, text, index, imageUrl
}: {
  bgColor: string, headingColor: string, textColor: string,
  accentColor?: string, heading: string, text: string, index: number, imageUrl?: string
}) {
  const isEven = index % 2 === 0;
  return (
    <section style={{ backgroundColor: bgColor }} className="py-20 md:py-28 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
          {/* Text side */}
          <div className={imageUrl ? "lg:w-1/2" : "w-full"}>
            <motion.div
              initial={{ opacity: 0, x: isEven ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: accentColor || '#ceff00' }} />
              <h2
                style={{
                  color: headingColor,
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: '1',
                  textTransform: 'uppercase',
                }}
                className="mb-8"
              >
                {heading}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base md:text-lg"
            >
              <RichText text={text} textColor={textColor} accentColor={accentColor} />
            </motion.div>
          </div>
          
          {/* Image side */}
          {imageUrl && (
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10"
              >
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img src={imageUrl} alt={heading} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AboutPage() {
  const [c, setC] = useState<any>(DEF);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data } = await supabase
          .from('about_page_content')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (data) setC((prev: any) => ({ ...prev, ...data }));
      } catch (_) {}
    }
    fetchContent();
  }, []);

  return (
    <div className="pt-20 min-h-screen" style={{ backgroundColor: c.page_bg_color, color: c.page_text_color }}>

      {/* Banner */}
      <PageHeader
        title={c.banner_heading}
        description={c.banner_subheading}
        bgImage={c.banner_bg_image}
        bannerBgColor={c.banner_bg_color || '#000000'}
        titleColor={c.banner_heading_color}
        titleSize={c.banner_heading_size}
        descColor={c.banner_subheading_color}
        descSize={c.banner_subheading_size}
        paddingTop={c.banner_padding_top || '160'}
        paddingBottom={c.banner_padding_bottom || '100'}
      />

      {/* Stats Bar */}
      {(c.trust_stat1_value || c.trust_stat2_value) && (
        <TrustBar
          bgColor={c.trust_bg_color}
          textColor={c.trust_text_color}
          stats={[
            { value: c.trust_stat1_value, label: c.trust_stat1_label },
            { value: c.trust_stat2_value, label: c.trust_stat2_label },
            { value: c.trust_stat3_value, label: c.trust_stat3_label },
            { value: c.trust_stat4_value, label: c.trust_stat4_label },
          ].filter(s => s.value || s.label)}
        />
      )}

      {/* Content Sections */}
      {[
        { heading: c.who_we_are_heading, text: c.who_we_are_text, bg: c.who_we_are_bg_color, hc: c.who_we_are_heading_color, tc: c.who_we_are_text_color, accent: '#ceff00', img: c.who_we_are_image },
        { heading: c.what_we_believe_heading, text: c.what_we_believe_text, bg: c.what_we_believe_bg_color, hc: c.what_we_believe_heading_color, tc: c.what_we_believe_text_color, accent: c.what_we_believe_accent_color, img: c.what_we_believe_image },
        { heading: c.our_approach_heading, text: c.our_approach_text, bg: c.our_approach_bg_color, hc: c.our_approach_heading_color, tc: c.our_approach_text_color, accent: '#ceff00', img: c.our_approach_image },
        { heading: c.why_eterna_heading, text: c.why_eterna_text, bg: c.why_eterna_bg_color, hc: c.why_eterna_heading_color, tc: c.why_eterna_text_color, accent: c.why_eterna_accent_color, img: c.why_eterna_image },
        { heading: c.who_we_work_with_heading, text: c.who_we_work_with_text, bg: c.who_we_work_with_bg_color, hc: c.who_we_work_with_heading_color, tc: c.who_we_work_with_text_color, accent: '#ceff00', img: c.who_we_work_with_image },
        { heading: c.our_role_heading, text: c.our_role_text, bg: c.our_role_bg_color, hc: c.our_role_heading_color, tc: c.our_role_text_color, accent: '#ceff00', img: c.our_role_image },
      ].filter(s => s.heading && s.text).map((s, i) => (
        <ContentSection
          key={i} index={i}
          bgColor={s.bg || '#000000'}
          headingColor={s.hc || '#ffffff'}
          textColor={s.tc || '#9ca3af'}
          accentColor={s.accent}
          heading={s.heading}
          text={s.text}
          imageUrl={s.img}
        />
      ))}

      {/* Closing Italic Quote */}
      {c.closing_text && (
        <section style={{ backgroundColor: c.closing_bg_color || '#000' }} className="py-20 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {c.closing_text.split('\n').map((line: string, i: number) => (
                line.trim() === '' ? <div key={i} className="h-4" /> :
                <p
                  key={i}
                  style={{ color: c.closing_text_color || '#9ca3af' }}
                  className="text-xl md:text-2xl leading-relaxed font-light italic"
                >
                  {line}
                </p>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {c.cta_heading?.trim() && (
        <section style={{ backgroundColor: c.cta_bg_color || '#ceff00' }} className="py-24 md:py-36 px-6 md:px-12 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2
                style={{
                  color: c.cta_heading_color || '#000000',
                  fontSize: fs(c.cta_heading_size, '1.875rem', '4rem'),
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: '1',
                  textTransform: 'uppercase',
                }}
                className="mb-6"
              >
                {c.cta_heading}
              </h2>
              {c.cta_subheading && (
                <p style={{ color: c.cta_subheading_color || '#000000', opacity: 0.8 }} className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  {c.cta_subheading}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {c.cta_btn_text && (
                  <Link
                    to={c.btn_link || '/contact'}
                    style={{ backgroundColor: c.cta_btn_color || '#000', color: c.cta_btn_text_color || '#ceff00', borderRadius: c.cta_btn_radius || '9999px' }}
                    className="inline-flex items-center gap-3 font-bold uppercase tracking-widest px-10 py-5 hover:scale-105 transition-transform"
                  >
                    {c.cta_btn_text}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
                <a
                  href={`mailto:${c.cta_email || 'hello@eternaventures.in'}`}
                  style={{ color: c.cta_heading_color || '#000000' }}
                  className="flex items-center gap-2 font-bold text-lg underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity"
                >
                  <Mail className="w-5 h-5" />
                  {c.cta_email || 'hello@eternaventures.in'}
                </a>
              </div>
            </motion.div>
          </div>
          {/* Decorative circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-black/5 rounded-full pointer-events-none" />
        </section>
      )}
    </div>
  );
}
