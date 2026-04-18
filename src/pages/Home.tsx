import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import Testimonials from '../components/Testimonials';

// ─── Font helpers ─────────────────────────────────────────────────────────────
// Maps Tailwind text-* classes to rem values so DB-stored classes ALWAYS work
const TW_SIZE_MAP: Record<string, string> = {
  'text-xs': '0.75rem', 'text-sm': '0.875rem', 'text-base': '1rem',
  'text-lg': '1.125rem', 'text-xl': '1.25rem', 'text-2xl': '1.5rem',
  'text-3xl': '1.875rem', 'text-4xl': '2.25rem', 'text-5xl': '3rem',
  'text-6xl': '3.75rem', 'text-7xl': '4.5rem', 'text-8xl': '6rem',
  'text-9xl': '8rem',
};

// Parse a size string (could be "text-3xl md:text-5xl lg:text-6xl" or "48px" or "3rem")
// Returns { mobile, tablet, desktop } in raw CSS values
const parseFontSize = (sizeStr?: string, defaultMobile = '2.25rem', defaultDesktop = '4.5rem') => {
  if (!sizeStr) return { mobile: defaultMobile, tablet: defaultDesktop, desktop: defaultDesktop };

  // Raw CSS value (px, rem, em, vw)
  if (/^\d/.test(sizeStr) || sizeStr.includes('px') || sizeStr.includes('rem') || sizeStr.includes('em') || sizeStr.includes('vw')) {
    return { mobile: sizeStr, tablet: sizeStr, desktop: sizeStr };
  }

  const parts = sizeStr.split(/\s+/);
  let mobile = TW_SIZE_MAP[parts[0]] || defaultMobile;
  let tablet = mobile;
  let desktop = mobile;

  parts.forEach(p => {
    if (p.startsWith('md:')) {
      const key = p.replace('md:', '');
      tablet = TW_SIZE_MAP[key] || tablet;
    }
    if (p.startsWith('lg:')) {
      const key = p.replace('lg:', '');
      desktop = TW_SIZE_MAP[key] || desktop;
    }
  });

  return { mobile, tablet, desktop };
};

// Returns a CSS clamp() or the best single value
const getFontStyle = (sizeStr?: string, defaultMobile?: string, defaultDesktop?: string) => {
  const { mobile, tablet, desktop } = parseFontSize(sizeStr, defaultMobile, defaultDesktop);
  // Use clamp for fluid typography: clamp(min, preferred, max)
  if (mobile !== desktop) {
    return `clamp(${mobile}, 4vw, ${desktop})`;
  }
  return mobile;
};

// ─── Default content ──────────────────────────────────────────────────────────
const DEFAULT_CONTENT = {
  hero_video_url: "https://cdn.pixabay.com/video/2020/05/25/40131-425257528_large.mp4",
  hero_text: "We build brands that\nown their market position.",
  hero_text_color: "#ffffff",
  hero_description: "EternaVentures is a full-spectrum growth media platform for ambitious brands — architecting attention, engineering culture, and compounding market authority.",
  hero_description_color: "#ffffff",
  hero_bg_color: "#000000",
  hero_text_size: "text-5xl md:text-8xl lg:text-9xl",
  hero_description_size: "text-lg md:text-xl",
  marquee_text: "WE DON'T RUN CAMPAIGNS. WE CONSTRUCT ECOSYSTEMS.",
  marquee_bg_color: "#ceff00",
  marquee_text_color: "#000000",
  marquee_text_size: "text-xl md:text-3xl",
  help_tag: "What We Do",
  help_tag_color: "#ceff00",
  help_tag_size: "text-sm",
  help_heading: "Six practices.\nOne integrated growth engine.",
  help_heading_size: "text-4xl md:text-6xl lg:text-7xl",
  help_subheading: "Our capabilities aren't siloed services — they're interconnected practices designed to build market authority at every layer of your brand.",
  help_subheading_size: "text-base md:text-lg",
  help_description_color: "#9ca3af",
  help_bg_color: "#000000",
  help_text_color: "#ffffff",
  help_btn_color: "#ceff00",
  help_btn_text_color: "#000000",
  help_btn_radius: "12px",
  help_button_text: "View All Practices",
  help_visibility: true,
  brands_logos: [] as string[],
  brands_bg_color: "#000000",
  brands_visibility: true,
  our_work_heading: "Our Latest\nWork",
  our_work_heading_size: "text-4xl md:text-6xl lg:text-7xl",
  our_work_subheading: "Explore how we've helped ambitious brands scale.",
  our_work_subheading_size: "text-base md:text-lg",
  our_work_btn_text: "View All Projects",
  our_work_btn_color: "#ceff00",
  our_work_btn_text_color: "#000000",
  our_work_btn_radius: "9999px",
  our_work_bg_color: "#000000",
  our_work_text_color: "#ffffff",
  work_visibility: true,
  testimonials_tag: "Client Success",
  testimonials_tag_color: "#ceff00",
  testimonials_title: "Results that speak\nfor themselves.",
  testimonials_title_color: "#ffffff",
  testimonials_title_size: "text-3xl md:text-5xl",
  testimonials_bg_color: "#000000",
  testimonials_visibility: true,
  blogs_title: "Growth Hub",
  blogs_title_color: "#ffffff",
  blogs_title_size: "text-4xl md:text-6xl lg:text-7xl",
  blogs_subheading: "",
  blogs_subheading_color: "#ffffff80",
  blogs_subheading_size: "text-base md:text-lg",
  blogs_btn_text: "Read Insights",
  blogs_btn_color: "#ceff00",
  blogs_btn_text_color: "#000000",
  blogs_btn_radius: "9999px",
  blogs_bg_color: "#000000",
  blogs_visibility: true,
  cta_heading: "Ready to stop competing and start leading?",
  cta_heading_size: "text-4xl md:text-6xl lg:text-7xl",
  cta_subheading: "Tell us where your brand is. We'll show you where it could be.",
  cta_subheading_size: "text-base md:text-xl",
  cta_btn_text: "Contact Us",
  cta_btn_link: "/contact",
  cta_btn_radius: "9999px",
  cta_bg_color: "#ceff00",
  cta_text_color: "#000000",
  cta_email: "hello@eternaventures.in",
  cta_email_color: "#000000",
  page_bg_color: "#000000",
  page_text_color: "#ffffff",
  phil_tag: "Our Philosophy",
  phil_tag_color: "#ceff00",
  phil_tag_bg_color: "rgba(206, 255, 0, 0.1)",
  phil_title: "Growth is not a campaign.\nIt's a discipline.",
  phil_title_color: "#ffffff",
  phil_title_size: "text-4xl md:text-6xl lg:text-7xl",
  phil_description: "Most agencies sell tactics. We build systems. EternaVentures was founded on the belief that a brand's market position is its most valuable — and most underbuilt — asset. Every decision we make compounds.\n\nWe work with founders, growth-stage brands, and challenger companies who understand that premium positioning isn't a luxury — it's the most efficient path to dominance. Based in Jaipur, operating across India and beyond.\n\nWe don't run campaigns. We construct ecosystems where your audience finds you inevitable.",
  phil_description_color: "#9ca3af",
  phil_description_size: "text-base md:text-lg",
  phil_bg_color: "#000000",
  phil_visibility: true,
  method_visibility: true,
  method_tag: "How We Work",
  method_tag_color: "#ceff00",
  method_title: "The EternaVentures\nMethod",
  method_title_color: "#ffffff",
  method_title_size: "text-4xl md:text-6xl lg:text-7xl",
  method_quote: "\u201CWe don\u2019t start with deliverables. We start with the gap between where your brand is and where it should be \u2014 and build the bridge.\u201D",
  method_quote_color: "#ceff00",
  method_quote_size: "text-xl md:text-2xl lg:text-3xl",
  method_bg_color: "#0a0a0a",
  method_step1_title: "Audit & Immersion",
  method_step1_desc: "We spend time in your world before we touch your brand. Market landscape, competitor positioning, audience signals, and the story your brand is currently telling — whether you intended it or not.",
  method_step2_title: "Strategic Foundation",
  method_step2_desc: "Every action we take is grounded in a positioning document that the whole team — ours and yours — can build from. Clear differentiation, defined audience tiers, and a growth thesis we can defend.",
  method_step3_title: "Build & Activate",
  method_step3_desc: "We execute across capabilities simultaneously — not in silos. Brand, content, performance, influence, and experience working as one integrated system, not a list of services.",
  method_step4_title: "Measure & Compound",
  method_step4_desc: "We track what matters: brand equity, audience quality, revenue influence, and market share signals. Then we reinvest learnings into the next cycle. Growth compounds when strategy doesn't reset every quarter.",
  serve_visibility: true,
  serve_tag: "Who We Serve",
  serve_tag_color: "#ceff00",
  serve_title: "Built for brands with real ambition.",
  serve_title_color: "#ffffff",
  serve_title_size: "text-4xl md:text-6xl lg:text-7xl",
  serve_bg_color: "#000000",
  serve_items: [
    {title: "Consumer Brands", desc: "D2C, FMCG, and lifestyle brands competing for shelf space and mind share in an attention economy."},
    {title: "Retail & Hospitality", desc: "Physical and experiential brands that need premium positioning to justify premium pricing."},
    {title: "Professional Services", desc: "Firms where reputation is revenue — law, finance, consulting, healthcare, education."},
    {title: "Startups & Founders", desc: "Early-stage ventures that need to punch above their weight before funding gives them the right to."},
    {title: "Real Estate & Infrastructure", desc: "Developers and platforms where trust is built long before a transaction is signed."},
    {title: "Culture & Entertainment", desc: "Artists, labels, media companies, and experience brands building audiences for the long term."},
    {title: "Health & Wellness", desc: "Brands operating in high-trust, high-scrutiny categories where credibility is the product."},
    {title: "Fashion & Luxury", desc: "Labels and designers navigating the intersection of aspiration, authenticity, and culture."}
  ],
  practices: [
    { id: '01', title: 'Brand Architecture & Identity Systems', desc: 'We define who you are before the market defines it for you.', areas: ['Positioning', 'Identity', 'Messaging Systems', 'Brand Language'] },
    { id: '02', title: 'Narrative Engineering', desc: 'Stories don\'t go viral — relevant ones do.', areas: ['Content Strategy', 'Storytelling', 'Platform Behavior', 'Editorial Direction'] },
    { id: '03', title: 'Performance & Paid Intelligence', desc: 'Media buying is arbitrage. We treat every rupee as a signal.', areas: ['Paid Media', 'Creative Testing', 'Analytics', 'Attribution'] },
    { id: '04', title: 'Influence & Cultural Capital', desc: 'We don\'t place ads in feeds — we place your brand in conversations.', areas: ['Influence Strategy', 'Community Building', 'Advocacy Programs'] },
    { id: '05', title: 'Digital Experience Design', desc: 'Your website is your highest-leverage salesperson.', areas: ['Web Design', 'UX', 'Conversion Optimization', 'Funnel Architecture'] },
    { id: '06', title: 'Market Intelligence & Growth Advisory', desc: 'Before we build, we understand.', areas: ['Brand Strategy', 'Market Research', 'Competitive Intelligence', 'Growth Roadmapping'] }
  ],
  section_order: ['hero', 'philosophy', 'services', 'marquee', 'method', 'who_we_serve', 'work', 'testimonials', 'cta', 'blogs'],
  global_heading_font: 'Space Grotesk',
  global_body_font: 'Inter',
  global_tag_font: 'Space Grotesk',
};

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [homeContent, setHomeContent] = useState<any>(DEFAULT_CONTENT);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectsData } = await supabase.from('home_projects').select('*').order('created_at', { ascending: false });
        if (projectsData) setProjects(projectsData);
      } catch (_) {}

      try {
        const { data: servicesData } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (servicesData && servicesData.length > 0) setServices(servicesData);
      } catch (_) {}

      try {
        const { data: blogsData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false }).limit(3);
        if (blogsData) setBlogs(blogsData);
      } catch (_) {}

      try {
        const { data } = await supabase.from('homepage_content').select('*').order('created_at', { ascending: false }).limit(1).single();
        if (data) {
          setHomeContent((prev: any) => ({ ...prev, ...data, brands_logos: data.brands_logos || prev.brands_logos }));
        }
      } catch (_) {}
    };

    fetchData();
  }, []);

  // Inject Google Fonts dynamically if custom fonts selected
  useEffect(() => {
    const fonts = [homeContent.global_heading_font, homeContent.global_body_font, homeContent.global_tag_font]
      .filter(Boolean)
      .map((f: string) => f.replace(/ /g, '+'))
      .join('&family=');
    if (fonts) {
      const link = document.getElementById('dynamic-fonts') as HTMLLinkElement || document.createElement('link');
      link.id = 'dynamic-fonts';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fonts}:wght@400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    }
  }, [homeContent.global_heading_font, homeContent.global_body_font, homeContent.global_tag_font]);

  const minItems = 8;
  let baseProjects = [...projects];
  while (baseProjects.length > 0 && baseProjects.length < minItems) baseProjects = [...baseProjects, ...projects];
  const scrollingProjects = baseProjects.length > 0 ? [...baseProjects, ...baseProjects] : [];

  // Font helpers using live homeContent
  const hFont = homeContent.global_heading_font || 'Space Grotesk';
  const bFont = homeContent.global_body_font || 'Inter';
  const tFont = homeContent.global_tag_font || 'Space Grotesk';

  const headingStyle = (sizeKey: string, colorKey?: string, defaultMob = '2rem', defaultDesk = '4rem') => ({
    fontFamily: `'${hFont}', sans-serif`,
    fontSize: getFontStyle(homeContent[sizeKey], defaultMob, defaultDesk),
    color: colorKey ? homeContent[colorKey] : undefined,
    fontWeight: 900,
    letterSpacing: '-0.03em',
    lineHeight: '0.9',
    textTransform: 'uppercase' as const,
  });

  const bodyStyle = (sizeKey: string, colorKey?: string, colorDefault?: string) => ({
    fontFamily: `'${bFont}', sans-serif`,
    fontSize: getFontStyle(homeContent[sizeKey], '1rem', '1.25rem'),
    color: colorKey ? (homeContent[colorKey] || colorDefault || '#9ca3af') : undefined,
    lineHeight: '1.75',
  });

  const tagStyle = (colorKey: string, sizeKey?: string) => ({
    fontFamily: `'${tFont}', sans-serif`,
    fontSize: sizeKey ? getFontStyle(homeContent[sizeKey], '0.75rem', '0.875rem') : '0.75rem',
    color: homeContent[colorKey],
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
  });

  const renderSection = (id: string) => {
    switch (id) {

      case 'hero':
        return (homeContent.hero_text?.trim() || homeContent.hero_video_url) ? (
          <section key="hero" style={{ backgroundColor: homeContent.hero_bg_color }} className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              {homeContent.hero_video_url && (
                <video key={homeContent.hero_video_url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50">
                  <source src={homeContent.hero_video_url} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black" />
            </div>
            <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mt-20">
              {homeContent.hero_text?.trim() && (
                <motion.h1
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                  style={{
                    ...headingStyle('hero_text_size', 'hero_text_color', '2.5rem', '7rem'),
                    lineHeight: '0.85',
                    whiteSpace: 'pre-line',
                  }}
                  className="mb-8"
                >
                  {homeContent.hero_text}
                </motion.h1>
              )}
              {homeContent.hero_description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ ...bodyStyle('hero_description_size', 'hero_description_color'), maxWidth: '48rem', margin: '0 auto', opacity: 0.85 }}
                >
                  {homeContent.hero_description}
                </motion.p>
              )}
            </div>
          </section>
        ) : null;

      case 'philosophy':
        return (homeContent.phil_visibility && homeContent.phil_title) ? (
          <section key="phil" style={{ backgroundColor: homeContent.phil_bg_color }} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              {homeContent.phil_tag && (
                <motion.span
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="inline-block px-4 py-1.5 rounded-full mb-8 border border-[#ceff00]/20"
                  style={{ ...tagStyle('phil_tag_color'), backgroundColor: homeContent.phil_tag_bg_color || 'transparent' }}
                >
                  {homeContent.phil_tag}
                </motion.span>
              )}
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                <div className="lg:w-1/2">
                  <motion.h2
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    style={{ ...headingStyle('phil_title_size', 'phil_title_color', '2rem', '4.5rem'), whiteSpace: 'pre-line' }}
                  >
                    {homeContent.phil_title}
                  </motion.h2>
                </div>
                <div className="lg:w-1/2">
                  <motion.p
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                    style={{ ...bodyStyle('phil_description_size', 'phil_description_color', '#9ca3af'), whiteSpace: 'pre-line', opacity: 0.9 }}
                  >
                    {homeContent.phil_description}
                  </motion.p>
                </div>
              </div>
            </div>
          </section>
        ) : null;

      case 'services':
        return (homeContent.help_visibility !== false) ? (
          <section key="services" style={{ backgroundColor: homeContent.help_bg_color }} className="py-24 md:py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-24 mb-24">
                <div className="lg:w-3/5">
                  {homeContent.help_tag && (
                    <motion.span
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className="inline-block mb-8"
                      style={tagStyle('help_tag_color', 'help_tag_size')}
                    >
                      {homeContent.help_tag}
                    </motion.span>
                  )}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    style={{ ...headingStyle('help_heading_size', 'help_text_color', '2rem', '5rem'), whiteSpace: 'pre-line' }}
                  >
                    {homeContent.help_heading}
                  </motion.h2>
                </div>
                <div className="lg:w-2/5 flex flex-col items-start gap-8">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    style={bodyStyle('help_subheading_size', 'help_description_color', '#9ca3af')}
                  >
                    {homeContent.help_subheading}
                  </motion.p>
                  <Link
                    to="/services"
                    style={{ backgroundColor: homeContent.help_btn_color || '#ceff00', color: homeContent.help_btn_text_color || '#000', borderRadius: homeContent.help_btn_radius || '12px', fontFamily: `'${hFont}', sans-serif` }}
                    className="group flex items-center gap-3 font-bold uppercase tracking-widest px-8 py-4 hover:gap-6 transition-all"
                  >
                    {homeContent.help_button_text || 'View All Practices'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(services.length > 0 ? services.slice(0, 6) : homeContent.practices).map((service: any, index: number) => (
                  <motion.div
                    key={service.id || index}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group rounded-2xl p-4 -m-4 transition-colors"
                  >
                    <Link to={`/services/${service.slug || ''}`} className="block">
                      <div className="overflow-hidden mb-6 rounded-2xl bg-[#111]">
                        <img
                          src={service.image_url || service.image || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000'}
                          alt={service.title}
                          className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {(service.subtitle || service.areas) && (
                        <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60" style={{ color: homeContent.help_text_color, fontFamily: `'${tFont}', sans-serif` }}>
                          {service.subtitle || (service.areas ? service.areas.join(' • ') : '')}
                        </p>
                      )}
                      <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 transition-colors group-hover:text-[#ceff00]" style={{ color: homeContent.help_text_color, fontFamily: `'${hFont}', sans-serif` }}>
                        {service.title}
                      </h3>
                      <p className="leading-relaxed opacity-70 mb-6 line-clamp-2" style={{ color: homeContent.help_text_color, fontFamily: `'${bFont}', sans-serif` }}>
                        {service.description || service.desc}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all" style={{ color: homeContent.help_btn_color, fontFamily: `'${tFont}', sans-serif` }}>
                        Details <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'marquee':
        return (homeContent.marquee_text?.trim()) ? (
          <div key="marquee" style={{ backgroundColor: homeContent.marquee_bg_color, color: homeContent.marquee_text_color }} className="py-4 overflow-hidden flex whitespace-nowrap relative">
            <div className="flex w-max animate-[marquee_20s_linear_infinite]">
              {[0, 1].map(k => (
                <span key={k} style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.marquee_text_size, '1.25rem', '2rem'), fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: '0 1rem' }}>
                  {homeContent.marquee_text} &nbsp;&bull;&nbsp; {homeContent.marquee_text} &nbsp;&bull;&nbsp; {homeContent.marquee_text}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case 'marquee_logos':
        return (homeContent.brands_logos?.length > 0) ? (
          <section key="marquee_logos" style={{ backgroundColor: homeContent.brands_bg_color || '#000' }} className="py-20 overflow-hidden border-y border-white/5">
            <div className="flex whitespace-nowrap">
              <motion.div
                className="flex items-center gap-24 px-12"
                animate={{ x: [0, -1035 * (homeContent.brands_logos.length / 5)] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                {[...homeContent.brands_logos, ...homeContent.brands_logos, ...homeContent.brands_logos].map((logo: string, i: number) => (
                  <img key={i} src={logo} alt="Brand Logo" className="h-10 md:h-16 w-auto object-contain transition-all hover:scale-110" referrerPolicy="no-referrer" />
                ))}
              </motion.div>
            </div>
          </section>
        ) : null;

      case 'method':
        return homeContent.method_visibility ? (
          <section key="method" style={{ backgroundColor: homeContent.method_bg_color }} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
                <div className="lg:w-1/2">
                  {homeContent.method_tag && (
                    <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className="inline-block mb-8" style={tagStyle('method_tag_color')}>
                      {homeContent.method_tag}
                    </motion.span>
                  )}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    style={{ ...headingStyle('method_title_size', 'method_title_color', '2rem', '4.5rem'), whiteSpace: 'pre-line' }}
                    className="mb-12"
                  >
                    {homeContent.method_title}
                  </motion.h2>
                </div>
                <div className="lg:w-1/2 flex items-center">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.method_quote_size, '1.25rem', '2.25rem'), color: homeContent.method_quote_color, fontWeight: 700, lineHeight: '1.2', fontStyle: 'italic' }}
                  >
                    {homeContent.method_quote}
                  </motion.p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: homeContent.method_step1_title, desc: homeContent.method_step1_desc, step: "01" },
                  { title: homeContent.method_step2_title, desc: homeContent.method_step2_desc, step: "02" },
                  { title: homeContent.method_step3_title, desc: homeContent.method_step3_desc, step: "03" },
                  { title: homeContent.method_step4_title, desc: homeContent.method_step4_desc, step: "04" }
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * (i + 1) }}
                    className="relative group h-full bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="mb-6">
                      <span className="text-6xl font-display font-black text-[#ceff00]/20 group-hover:text-[#ceff00]/40 transition-all duration-500">{item.step}</span>
                    </div>
                    <h3 style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.method_step_title_size, '1.25rem', '1.5rem') }} className="font-black uppercase tracking-tight mb-4 text-white">{item.title}</h3>
                    <p style={{ fontFamily: `'${bFont}', sans-serif` }} className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'who_we_serve':
        return homeContent.serve_visibility ? (
          <section key="serve" style={{ backgroundColor: homeContent.serve_bg_color }} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="mb-20">
                {homeContent.serve_tag && (
                  <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="inline-block mb-8" style={tagStyle('serve_tag_color', 'serve_tag_size')}>
                    {homeContent.serve_tag}
                  </motion.span>
                )}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  style={{ ...headingStyle('serve_title_size', 'serve_title_color', '2rem', '4.5rem') }}
                  className="w-full lg:w-3/4"
                >
                  {homeContent.serve_title}
                </motion.h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                {homeContent.serve_items?.map((item: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 * i }}
                    className="group border-t pt-8" style={{ borderColor: homeContent.serve_tag_color + '33' }}>
                    <h3 style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.serve_item_title_size, '1.125rem', '1.375rem'), color: homeContent.serve_title_color || '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }} className="mb-4 group-hover:opacity-70 transition-opacity">
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: `'${bFont}', sans-serif`, fontSize: getFontStyle(homeContent.serve_item_desc_size, '0.875rem', '1rem'), color: homeContent.serve_text_color || '#9ca3af' }} className="leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'work':
        return (homeContent.work_visibility !== false && (homeContent.our_work_heading?.trim() || homeContent.our_work_subheading?.trim())) ? (
          <section key="work" style={{ backgroundColor: homeContent.our_work_bg_color || '#000', color: homeContent.our_work_text_color || '#fff' }} className="py-24 md:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div className="max-w-2xl">
                  {homeContent.our_work_subheading?.trim() && (
                    <p style={bodyStyle('our_work_subheading_size')} className="mb-12 opacity-80 leading-tight font-medium">
                      {homeContent.our_work_subheading}
                    </p>
                  )}
                  {homeContent.our_work_btn_text?.trim() && (
                    <Link to="/projects"
                      style={{ backgroundColor: homeContent.our_work_btn_color, color: homeContent.our_work_btn_text_color || '#000', borderRadius: homeContent.our_work_btn_radius || '9999px' }}
                      className="inline-flex items-center gap-3 font-bold uppercase tracking-wider px-10 py-5 hover:scale-105 transition-transform"
                    >
                      {homeContent.our_work_btn_text}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  )}
                </div>
                {homeContent.our_work_heading?.trim() && (
                  <h2 style={{ ...headingStyle('our_work_heading_size', undefined, '2rem', '5rem'), whiteSpace: 'pre-line', textAlign: 'right' }}>
                    {homeContent.our_work_heading}
                  </h2>
                )}
              </div>
            </div>
            {projects.length > 0 && (
              <div className="relative w-full overflow-hidden group">
                <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] items-center">
                  {scrollingProjects.map((project, i) => (
                    <Link to="/projects" key={`${project.id}-${i}`} className="w-[80vw] md:w-[40vw] lg:w-[22vw] flex-shrink-0 px-3 block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-900 border border-white/5">
                        <img src={project.image_url || 'https://picsum.photos/seed/project/800/1000'} alt={project.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-start justify-end flex-col p-8">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: homeContent.help_btn_color || '#ceff00' }}>{project.category || 'Featured'}</p>
                          <h3 className="font-black uppercase tracking-tighter leading-[0.9] line-clamp-2 transition-colors group-hover:opacity-70 text-white" style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: '1.5rem' }}>{project.title}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null;

      case 'testimonials':
        return homeContent.testimonials_visibility !== false ? (
          <div key="testimonials">
            <Testimonials
              tag={homeContent.testimonials_tag}
              tagColor={homeContent.testimonials_tag_color}
              title={homeContent.testimonials_title}
              titleColor={homeContent.testimonials_title_color}
              titleSize={homeContent.testimonials_title_size}
              bgColor={homeContent.testimonials_bg_color}
              headingFont={hFont}
              bodyFont={bFont}
            />
          </div>
        ) : null;

      case 'cta':
        return (homeContent.cta_heading?.trim()) ? (
          <section key="cta" style={{ backgroundColor: homeContent.cta_bg_color || "#ceff00" }} className="py-24 md:py-40 px-6 md:px-12 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <h2 style={{ ...headingStyle('cta_heading_size', 'cta_text_color', '2rem', '5rem') }} className="mb-8">
                  {homeContent.cta_heading}
                </h2>
                <p style={{ ...bodyStyle('cta_subheading_size', 'cta_text_color'), opacity: 0.8 }} className="mb-12 max-w-2xl mx-auto">
                  {homeContent.cta_subheading}
                </p>
              </motion.div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {homeContent.cta_btn_text?.trim() && (
                  <Link to={homeContent.cta_btn_link}
                    style={{ borderRadius: homeContent.cta_btn_radius || '9999px', backgroundColor: '#000000', color: homeContent.cta_btn_color || '#ceff00' }}
                    className="inline-block font-bold uppercase tracking-wider px-12 py-6 hover:scale-105 transition-transform text-lg"
                  >
                    {homeContent.cta_btn_text}
                  </Link>
                )}
                <a href={`mailto:${homeContent.cta_email || 'hello@eternaventures.in'}`}
                  style={{ color: homeContent.cta_email_color || '#000000', fontFamily: `'${bFont}', sans-serif` }}
                  className="font-black text-xl underline underline-offset-8 decoration-2 flex items-center gap-2"
                >
                  <Mail className="w-6 h-6" />
                  {homeContent.cta_email || 'hello@eternaventures.in'}
                </a>
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full border-[40px] border-black/5 rounded-full scale-150 pointer-events-none" />
          </section>
        ) : null;

      case 'blogs':
        return (homeContent.blogs_visibility !== false && homeContent.blogs_title?.trim()) ? (
          <section key="blogs" style={{ backgroundColor: homeContent.blogs_bg_color || "#000" }} className="py-24 md:py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
                <div className="max-w-2xl">
                  <h2 style={{ ...headingStyle('blogs_title_size', 'blogs_title_color', '2rem', '5rem') }} className="mb-8">
                    {homeContent.blogs_title}
                  </h2>
                  {homeContent.blogs_subheading && (
                    <p style={bodyStyle('blogs_subheading_size', 'blogs_subheading_color', '#ffffff80')}>
                      {homeContent.blogs_subheading}
                    </p>
                  )}
                </div>
                <div>
                  <Link to="/blogs"
                    style={{ backgroundColor: homeContent.blogs_btn_color || '#ceff00', color: homeContent.blogs_btn_text_color || '#000', borderRadius: homeContent.blogs_btn_radius || '0.75rem' }}
                    className="inline-flex items-center gap-3 font-bold uppercase tracking-widest px-8 py-4 hover:gap-6 transition-all"
                  >
                    {homeContent.blogs_btn_text || 'View All Insights'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              {blogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {blogs.map((blog, i) => (
                    <Link to={`/blogs/${blog.slug}`} key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/5">
                      <img src={blog.thumbnail_url || 'https://picsum.photos/seed/blog/800/1000'} alt={blog.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: homeContent.blogs_btn_color || '#ceff00' }}>
                          {format(new Date(blog.created_at), 'MMM d, yyyy')}
                        </p>
                        <h3 style={{ fontFamily: `'${hFont}', sans-serif`, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#ceff00] transition-colors">{blog.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : null;

      default:
        return null;
    }
  };

  const order = homeContent.section_order || DEFAULT_CONTENT.section_order;

  return (
    <div style={{ backgroundColor: homeContent.page_bg_color, color: homeContent.page_text_color }}>
      {order.map((sectionId: string) => renderSection(sectionId))}
    </div>
  );
}
