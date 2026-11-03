import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Layers, Diamond, TrendingUp } from 'lucide-react';
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
  help_details_color: "#000000",
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
  phil_f1_title: "Build Systems",
  phil_f2_title: "Premium Positioning",
  phil_f3_title: "Compounding Growth",
  phil_mountain_url: "/images/philosophy-mountain.png",
  method_visibility: true,
  method_tag: "OUR APPROACH",
  method_tag_color: "#d4ff00",
  method_title: "The EternaVentures\nMethod",
  method_title_color: "#ffffff",
  method_title_size: "text-4xl md:text-6xl lg:text-7xl",
  method_quote: "“ We don’t just execute tactics — we build an integrated growth system that moves your brand forward, compounding over time. ”",
  method_quote_color: "#ceff00",
  method_quote_size: "text-xl md:text-2xl lg:text-3xl",
  method_bg_color: "#0a0a0a",
  method_step1_title: "AUDIT & DISCOVERY",
  method_step1_desc: "Understand your brand, market, audience, and growth opportunities with depth and clarity.",
  method_step2_title: "STRATEGIC FOUNDATION",
  method_step2_desc: "Define the right positioning, brand strategy, and growth plan to create a focused path forward.",
  method_step3_title: "BUILD & ACTIVATE",
  method_step3_desc: "Bring the strategy to life across brand, content, media, and digital experiences.",
  method_step4_title: "MEASURED COMPOUND GROWTH",
  method_step4_desc: "Track performance, learn fast, and keep optimizing to drive stronger, more sustainable results.",
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
          <section key="phil" style={{ backgroundColor: homeContent.phil_bg_color || '#000000' }} className="py-20 md:py-24 lg:py-28 px-6 md:px-12 relative overflow-hidden text-white">
            <div className="max-w-7xl mx-auto relative">
              {/* Desktop Vertical Center Divider */}
              <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1px] bg-white/10 pointer-events-none">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[1px] w-[3px] h-12 bg-[#d4ff00] rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Column: Badge + Heading + Desktop Mountain */}
                <div className="flex flex-col items-start">
                  {homeContent.phil_tag && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#d4ff00] mb-6 md:mb-8"
                    >
                      <span
                        className="text-[#d4ff00] text-xs font-black tracking-widest uppercase"
                        style={{ fontFamily: `'${tFont}', sans-serif` }}
                      >
                        {homeContent.phil_tag}
                      </span>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="w-full"
                  >
                    {(() => {
                      const rawTitle = homeContent.phil_title || "GROWTH IS NOT A\nCAMPAIGN.\nIT'S A DISCIPLINE.";
                      const disciplineRegex = /(IT['’]?S\s+A\s+DISCIPLINE\.?)/i;

                      if (disciplineRegex.test(rawTitle)) {
                        const parts = rawTitle.split(disciplineRegex);
                        const before = parts[0].trim();
                        let beforeLines = before.split('\n').map((l: string) => l.trim()).filter(Boolean);
                        if (beforeLines.length === 1 && /growth is not a campaign/i.test(beforeLines[0])) {
                          beforeLines = ["GROWTH IS NOT A", "CAMPAIGN."];
                        }

                        return (
                          <h2 
                            className="font-black uppercase tracking-tighter text-white leading-[1.05]"
                            style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.phil_title_size, '2.25rem', '4rem') }}
                          >
                            {beforeLines.map((line, idx) => (
                              <div key={idx}>{line.toUpperCase()}</div>
                            ))}
                            <div className="inline-block bg-[#d4ff00] px-4 py-1 -skew-x-12 mt-3 shadow-lg">
                              <span className="inline-block skew-x-12 text-black font-black italic tracking-tight uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none">
                                IT’S A DISCIPLINE.
                              </span>
                            </div>
                          </h2>
                        );
                      }

                      return (
                        <h2 
                          className="font-black uppercase tracking-tighter text-white leading-[1.05]"
                          style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.phil_title_size, '2.25rem', '4rem') }}
                        >
                          {rawTitle.split('\n').map((l: string, i: number) => <div key={i}>{l}</div>)}
                        </h2>
                      );
                    })()}
                  </motion.div>

                  {/* Mobile Mountain Graphic (under heading on mobile) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="block lg:hidden my-8 w-full max-w-md mx-auto"
                  >
                    <img
                      src={homeContent.phil_mountain_url || '/images/philosophy-mountain.png'}
                      alt="Philosophy Mountain Peak with Glowing Eclipse"
                      className="w-full h-auto object-contain pointer-events-none select-none"
                    />
                  </motion.div>

                  {/* Desktop Mountain Graphic (at bottom-left on desktop) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="hidden lg:block mt-8 w-full max-w-lg"
                  >
                    <img
                      src={homeContent.phil_mountain_url || '/images/philosophy-mountain.png'}
                      alt="Philosophy Mountain Peak with Glowing Eclipse"
                      className="w-full h-auto object-contain pointer-events-none select-none"
                    />
                  </motion.div>
                </div>

                {/* Right Column: Paragraphs + Features (tightly grouped, no awkward gap!) */}
                <div className="flex flex-col lg:pl-6 xl:pl-10">
                  {/* Paragraphs */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed"
                    style={{ fontFamily: `'${bFont}', sans-serif` }}
                  >
                    {(() => {
                      const desc = homeContent.phil_description || "";
                      const paragraphs = desc.split('\n\n').filter(Boolean);
                      return paragraphs.map((p: string, idx: number) => {
                        if (/ecosystems/i.test(p)) {
                          const parts = p.split(/(ecosystems)/i);
                          return (
                            <p key={idx} className="opacity-95">
                              {parts.map((part, pIdx) =>
                                part.toLowerCase() === 'ecosystems' ? (
                                  <strong key={pIdx} className="text-white font-bold">{part}</strong>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          );
                        }
                        return <p key={idx} className="opacity-90">{p}</p>;
                      });
                    })()}
                  </motion.div>

                  {/* Mobile Horizontal Divider */}
                  <div className="lg:hidden w-full h-[1px] bg-white/10 relative my-8">
                    <div className="w-16 h-[3px] bg-[#d4ff00] rounded-full mx-auto absolute inset-x-0 -top-[1px]"></div>
                  </div>

                  {/* 3 Pillars / Feature Items (aligned directly below paragraphs with comfortable spacing) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                    className="mt-8 sm:mt-10 grid grid-cols-3 divide-x divide-white/10"
                  >
                    {/* Item 1 */}
                    <div className="px-2 sm:px-3 first:pl-0 flex flex-col lg:flex-row items-center text-center lg:text-left gap-2.5 sm:gap-3.5 group">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0f0f0f] border border-white/15 flex items-center justify-center p-2.5 sm:p-3 shadow-sm flex-shrink-0 group-hover:border-[#d4ff00]/50 transition-colors">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4ff00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      </div>
                      <span className="text-white font-bold text-xs sm:text-sm leading-tight" style={{ fontFamily: `'${hFont}', sans-serif` }}>
                        {homeContent.phil_f1_title || "Build Systems"}
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="px-2 sm:px-3 flex flex-col lg:flex-row items-center text-center lg:text-left gap-2.5 sm:gap-3.5 group">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0f0f0f] border border-white/15 flex items-center justify-center p-2.5 sm:p-3 shadow-sm flex-shrink-0 group-hover:border-[#d4ff00]/50 transition-colors">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4ff00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 3h12l4 6-10 12L2 9z" />
                          <path d="M11 3 8 9l4 12 4-12-3-6" />
                          <path d="M2 9h20" />
                        </svg>
                      </div>
                      <span className="text-white font-bold text-xs sm:text-sm leading-tight" style={{ fontFamily: `'${hFont}', sans-serif` }}>
                        {homeContent.phil_f2_title || "Premium Positioning"}
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="px-2 sm:px-3 last:pr-0 flex flex-col lg:flex-row items-center text-center lg:text-left gap-2.5 sm:gap-3.5 group">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0f0f0f] border border-white/15 flex items-center justify-center p-2.5 sm:p-3 shadow-sm flex-shrink-0 group-hover:border-[#d4ff00]/50 transition-colors">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4ff00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="16" width="3" height="5" rx="0.8" fill="currentColor" />
                          <rect x="8" y="12" width="3" height="9" rx="0.8" fill="currentColor" />
                          <rect x="13" y="8" width="3" height="13" rx="0.8" fill="currentColor" />
                          <rect x="18" y="4" width="3" height="17" rx="0.8" fill="currentColor" />
                          <path d="M15 4h6v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M21 4l-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-white font-bold text-xs sm:text-sm leading-tight" style={{ fontFamily: `'${hFont}', sans-serif` }}>
                        {homeContent.phil_f3_title || "Compounding Growth"}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        ) : null;

      case 'services':
        return (homeContent.help_visibility !== false) ? (
          <section key="services" style={{ backgroundColor: homeContent.help_bg_color || '#ffffff' }} className="py-20 md:py-28 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-16 mb-14 md:mb-16">
                <div className="lg:w-3/5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="flex items-center gap-2.5 mb-3"
                  >
                    <span className="w-8 h-[3px] bg-[#d4ff00] rounded-full inline-block"></span>
                    <span
                      className="text-xs font-black tracking-widest uppercase text-black"
                      style={{ fontFamily: `'${tFont}', sans-serif` }}
                    >
                      {homeContent.help_tag || 'OUR SERVICES'}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  >
                    {(() => {
                      const rawHeading = homeContent.help_heading || "SIX PRACTICES.\nONE INTEGRATED\nGROWTH ENGINE.";
                      const growthEngineRegex = /GROWTH ENGINE\.?/i;

                      if (growthEngineRegex.test(rawHeading)) {
                        const beforePart = rawHeading.replace(growthEngineRegex, '').trim();
                        const beforeLines = beforePart.split('\n').map(l => l.trim()).filter(Boolean);

                        return (
                          <h2 
                            className="font-black uppercase tracking-tighter text-black leading-[1.05]"
                            style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.help_heading_size, '2.25rem', '3.75rem') }}
                          >
                            {beforeLines.map((line, idx) => (
                              <div key={idx}>{line}</div>
                            ))}
                            <div className="inline-block bg-[#111111] px-4 py-1 sm:py-1.5 -skew-x-12 mt-2 shadow-sm rounded-[2px]">
                              <span className="inline-block skew-x-12 text-[#d4ff00] font-black tracking-tight">
                                GROWTH ENGINE.
                              </span>
                            </div>
                          </h2>
                        );
                      }

                      const lines = rawHeading.split('\n');
                      return (
                        <h2 
                          className="font-black uppercase tracking-tighter text-black leading-[1.05]"
                          style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.help_heading_size, '2.25rem', '3.75rem') }}
                        >
                          {lines.map((line: string, i: number) => (
                            <div key={i}>{line.trim()}</div>
                          ))}
                        </h2>
                      );
                    })()}
                  </motion.div>
                </div>

                <div className="lg:w-2/5 relative pl-6 sm:pl-8 border-l-2 border-[#d4ff00] flex flex-col items-start gap-5">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="text-sm sm:text-[15px] md:text-base text-gray-800 leading-relaxed font-normal"
                    style={{ fontFamily: `'${bFont}', sans-serif` }}
                  >
                    {homeContent.help_subheading || "A connected set of capabilities that work together to build stronger brands, create meaningful demand, and drive sustainable growth."}
                  </motion.p>
                  <Link
                    to="/services"
                    style={{ backgroundColor: homeContent.help_btn_color || '#d4ff00', color: homeContent.help_btn_text_color || '#000', fontFamily: `'${hFont}', sans-serif` }}
                    className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full font-black text-sm tracking-wide hover:gap-3.5 transition-all shadow-sm hover:brightness-105"
                  >
                    <span>{homeContent.help_button_text || 'All Services'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {(services.length > 0 ? services.slice(0, 6) : homeContent.practices).map((service: any, index: number) => (
                  <motion.div
                    key={service.id || index}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col hover:-translate-y-1"
                  >
                    <Link to={`/services/${service.slug || ''}`} className="flex flex-col h-full">
                      {/* Compact Landscape Image */}
                      <div className="w-full h-44 sm:h-48 overflow-hidden bg-gray-100 relative">
                        <img
                          src={service.image_url || service.image || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000'}
                          alt={service.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Card Content */}
                      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 
                            className="text-base sm:text-lg font-black uppercase tracking-tight text-black mb-2.5 leading-snug group-hover:text-black transition-colors"
                            style={{ fontFamily: `'${hFont}', sans-serif` }}
                          >
                            {service.title}
                          </h3>
                          <p 
                            className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal mb-5 line-clamp-3"
                            style={{ fontFamily: `'${bFont}', sans-serif` }}
                          >
                            {service.description || service.desc}
                          </p>
                        </div>

                        <div 
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-black group-hover:gap-3 transition-all mt-auto"
                          style={{ fontFamily: `'${tFont}', sans-serif` }}
                        >
                          <span>Explore Service</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </div>
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
          <section key="method" style={{ backgroundColor: homeContent.method_bg_color || '#0a0a0a' }} className="py-20 md:py-28 px-6 md:px-12 relative overflow-hidden text-white">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-16 mb-16 md:mb-20">
                {/* Left Side: Tag + Heading with METHOD badge */}
                <div className="lg:w-3/5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="flex items-center gap-2.5 mb-4"
                  >
                    <span className="w-8 h-[3px] bg-[#d4ff00] rounded-full inline-block"></span>
                    <span
                      className="text-xs font-black tracking-widest uppercase text-white"
                      style={{ fontFamily: `'${tFont}', sans-serif` }}
                    >
                      {homeContent.method_tag || 'OUR APPROACH'}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  >
                    {(() => {
                      const rawTitle = homeContent.method_title || "THE ETERNA\nVENTURES METHOD";
                      const methodRegex = /METHOD/i;

                      if (methodRegex.test(rawTitle)) {
                        const before = rawTitle.replace(methodRegex, '').trim();
                        let beforeLines = before.split('\n').map((l: string) => l.trim()).filter(Boolean);

                        return (
                          <h2
                            className="font-black uppercase tracking-tighter text-white leading-[1.05]"
                            style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.method_title_size, '2.5rem', '4.25rem') }}
                          >
                            {beforeLines.map((line, idx) => {
                              if (idx === beforeLines.length - 1) {
                                return (
                                  <div key={idx} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span>{line}</span>
                                    <div className="inline-block bg-[#d4ff00] px-3.5 sm:px-4 py-1 -skew-x-12 shadow-lg">
                                      <span className="inline-block skew-x-12 text-black font-black italic tracking-tight uppercase">
                                        METHOD
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                              return <div key={idx}>{line}</div>;
                            })}
                          </h2>
                        );
                      }

                      return (
                        <h2
                          className="font-black uppercase tracking-tighter text-white leading-[1.05]"
                          style={{ fontFamily: `'${hFont}', sans-serif`, fontSize: getFontStyle(homeContent.method_title_size, '2.5rem', '4.25rem') }}
                        >
                          {rawTitle.split('\n').map((l: string, i: number) => <div key={i}>{l}</div>)}
                        </h2>
                      );
                    })()}
                  </motion.div>
                </div>

                {/* Right Side: Quote with vertical divider */}
                <div className="lg:w-2/5 relative pl-6 sm:pl-8 border-l-2 border-white/10 lg:py-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-[#d4ff00] text-3xl font-serif font-black leading-none -mt-1 select-none">“</span>
                    <p
                      className="text-white italic text-base sm:text-lg md:text-[19px] leading-relaxed font-normal"
                      style={{ fontFamily: `'${bFont}', sans-serif` }}
                    >
                      {homeContent.method_quote?.replace(/^[“"']+|[”"']+$/g, '').trim() ||
                        "We don’t just execute tactics — we build an integrated growth system that moves your brand forward, compounding over time."}
                      <span className="text-[#d4ff00] text-3xl font-serif font-black leading-none ml-1.5 select-none">”</span>
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* 4 Cards Grid with Horizontal Connector */}
              <div className="relative">
                {/* Horizontal Connector Line & Glowing Nodes (Desktop) */}
                <div className="hidden lg:block absolute top-[28%] left-0 right-0 h-[1px] bg-white/10 z-0 pointer-events-none">
                  <div className="absolute left-[24.2%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_10px_#d4ff00]"></div>
                  <div className="absolute left-[49.5%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_10px_#d4ff00]"></div>
                  <div className="absolute left-[74.8%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_10px_#d4ff00]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  {[
                    {
                      step: "01",
                      title: homeContent.method_step1_title || "AUDIT & DISCOVERY",
                      desc: homeContent.method_step1_desc || "Understand your brand, market, audience, and growth opportunities with depth and clarity.",
                      image: "/images/method-step-1.png"
                    },
                    {
                      step: "02",
                      title: homeContent.method_step2_title || "STRATEGIC FOUNDATION",
                      desc: homeContent.method_step2_desc || "Define the right positioning, brand strategy, and growth plan to create a focused path forward.",
                      image: "/images/method-step-2.png"
                    },
                    {
                      step: "03",
                      title: homeContent.method_step3_title || "BUILD & ACTIVATE",
                      desc: homeContent.method_step3_desc || "Bring the strategy to life across brand, content, media, and digital experiences.",
                      image: "/images/method-step-3.png"
                    },
                    {
                      step: "04",
                      title: homeContent.method_step4_title || "MEASURED COMPOUND GROWTH",
                      desc: homeContent.method_step4_desc || "Track performance, learn fast, and keep optimizing to drive stronger, more sustainable results.",
                      image: "/images/method-step-4.png"
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * (i + 1) }}
                      className="group bg-[#0e0e0e] border border-white/10 hover:border-[#d4ff00]/40 rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    >
                      {/* Top 3D Visual Asset */}
                      <div className="w-full h-24 sm:h-26 flex items-center justify-center mb-5 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full object-contain pointer-events-none select-none transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div>
                        {/* Step Number */}
                        <div className="text-2xl sm:text-3xl font-black text-[#d4ff00] tracking-tight mb-2">
                          {item.step}
                        </div>

                        {/* Neon Dash */}
                        <div className="w-6 h-[2px] bg-[#d4ff00] mb-3.5"></div>

                        {/* Step Title */}
                        <h3
                          className="font-black uppercase tracking-tight text-white text-base sm:text-lg mb-3 leading-snug group-hover:text-white transition-colors"
                          style={{ fontFamily: `'${hFont}', sans-serif` }}
                        >
                          {item.title}
                        </h3>

                        {/* Step Description */}
                        <p
                          className="text-gray-400 text-xs sm:text-[13px] leading-relaxed font-normal"
                          style={{ fontFamily: `'${bFont}', sans-serif` }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
