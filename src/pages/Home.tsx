import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import Testimonials from '../components/Testimonials';

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [homeContent, setHomeContent] = useState<any>({
    hero_video_url: "https://cdn.pixabay.com/video/2020/05/25/40131-425257528_large.mp4",
    hero_text: "We build brands that\nown their market position.",
    hero_text_color: "#ffffff",
    hero_description: "EternaVentures is a full-spectrum growth media platform for ambitious brands — architecting attention, engineering culture, and compounding market authority.",
    hero_bg_color: "#000000",
    hero_text_size: "text-5xl md:text-8x lg:text-9xl",
    marquee_text: "WE DON'T RUN CAMPAIGNS. WE CONSTRUCT ECOSYSTEMS.",
    marquee_bg_color: "#ceff00",
    marquee_text_color: "#000000",
    marquee_text_size: "text-xl md:text-3xl",
    help_tag: "What We Do",
    help_tag_color: "#ceff00",
    help_heading: "Six practices.\nOne integrated growth engine.",
    help_subheading: "Our capabilities aren’t siloed services — they’re interconnected practices designed to build market authority at every layer of your brand.",
    help_bg_color: "#000000",
    help_text_color: "#ffffff",
    help_btn_color: "#ceff00",
    help_btn_text_color: "#000000",
    help_heading_size: "text-4xl md:text-7xl",
    help_subheading_size: "text-lg md:text-xl",
    brands_logos: [] as string[],
    brands_bg_color: "#000000",
    our_work_heading: "Our Latest\nWork",
    our_work_subheading: "Explore how we've helped ambitious brands scale.",
    our_work_btn_text: "View All Projects",
    our_work_btn_color: "#ceff00",
    our_work_bg_color: "#000000",
    our_work_text_color: "#ffffff",
    testimonials_tag: "Client Success",
    testimonials_tag_color: "#ceff00",
    testimonials_title: "Results that speak\nfor themselves.",
    testimonials_title_color: "#ffffff",
    testimonials_bg_color: "#000000",
    blogs_title: "Growth Hub",
    blogs_title_color: "#ffffff",
    blogs_btn_text: "Read Insights",
    blogs_btn_color: "#ceff00",
    blogs_bg_color: "#000000",
    cta_heading: "Ready to stop competing and start leading?",
    cta_subheading: "Tell us where your brand is. We’ll show you where it could be.",
    cta_btn_text: "Contact Us",
    cta_btn_link: "/contact",
    cta_bg_color: "#ceff00",
    cta_text_color: "#000000",
    page_bg_color: "#000000",
    page_text_color: "#ffffff",
    phil_tag: "Our Philosophy",
    phil_tag_color: "#ceff00",
    phil_tag_bg_color: "rgba(206, 255, 0, 0.1)",
    phil_title: "Growth is not a campaign.\nIt’s a discipline.",
    phil_title_color: "#ffffff",
    phil_title_size: "text-4xl md:text-7xl",
    phil_description: "Most agencies sell tactics. We build systems. EternaVentures was founded on the belief that a brand's market position is its most valuable — and most underbuilt — asset. Every decision we make compounds.\n\nWe work with founders, growth-stage brands, and challenger companies who understand that premium positioning isn't a luxury — it's the most efficient path to dominance. Based in Jaipur, operating across India and beyond.\n\nWe don't run campaigns. We construct ecosystems where your audience finds you inevitable.",
    phil_bg_color: "#000000",
    phil_visibility: true,
    method_visibility: true,
    method_tag: "How We Work",
    method_tag_color: "#ceff00",
    method_title: "The EternaVentures\nMethod",
    method_title_color: "#ffffff",
    method_quote: "“We don’t start with deliverables. We start with the gap between where your brand is and where it should be — and build the bridge.”",
    method_quote_color: "#ceff00",
    method_bg_color: "#0a0a0a",
    method_step1_title: "Audit & Immersion",
    method_step1_desc: "We spend time in your world before we touch your brand. Market landscape, competitor positioning, audience signals, and the story your brand is currently telling — whether you intended it or not.",
    method_step2_title: "Strategic Foundation",
    method_step2_desc: "Every action we take is grounded in a positioning document that the whole team — ours and yours — can build from. Clear differentiation, defined audience tiers, and a growth thesis we can defend.",
    method_step3_title: "Build & Activate",
    method_step3_desc: "We execute across capabilities simultaneously — not in silos. Brand, content, performance, influence, and experience working as one integrated system, not a list of services.",
    method_step4_title: "Measure & Compound",
    method_step4_desc: "We track what matters: brand equity, audience quality, revenue influence, and market share signals. Then we reinvest learnings into the next cycle. Growth compounds when strategy doesn’t reset every quarter.",
    serve_visibility: true,
    serve_tag: "Who We Serve",
    serve_tag_color: "#ceff00",
    serve_title: "Built for brands with real ambition.",
    serve_title_color: "#ffffff",
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
      { id: '01', title: 'Brand Architecture & Identity Systems', desc: 'We define who you are before the market defines it for you. From naming and positioning to visual identity and verbal systems.', areas: ['Positioning', 'Identity', 'Messaging Systems', 'Brand Language'] },
      { id: '02', title: 'Narrative Engineering', desc: 'Stories don’t go viral — relevant ones do. We craft brand narratives rooted in cultural tension, audience psychology, and platform behavior.', areas: ['Content Strategy', 'Storytelling', 'Platform Behavior', 'Editorial Direction'] },
      { id: '03', title: 'Performance & Paid Intelligence', desc: 'Media buying is arbitrage. We treat every rupee as a signal, not a spend — running performance ecosystems.', areas: ['Paid Media', 'Creative Testing', 'Analytics', 'Attribution'] },
      { id: '04', title: 'Influence & Cultural Capital', desc: 'We don’t place ads in feeds — we place your brand in conversations. Our influence practice maps cultural networks.', areas: ['Influence Strategy', 'Community Building', 'Advocacy Programs'] },
      { id: '05', title: 'Digital Experience Design', desc: 'Your website is your highest-leverage salesperson. We design and build digital experiences that convert attention into action.', areas: ['Web Design', 'UX', 'Conversion Optimization', 'Funnel Architecture'] },
      { id: '06', title: 'Market Intelligence & Growth Advisory', desc: 'Before we build, we understand. Our advisory practice gives founders and leadership teams strategic clarity.', areas: ['Brand Strategy', 'Market Research', 'Competitive Intelligence', 'Growth Roadmapping'] }
    ],
    section_order: ['hero', 'philosophy', 'services', 'marquee', 'method', 'who_we_serve', 'work', 'testimonials', 'cta', 'blogs']
  });
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch home projects
      try {
        const { data: projectsData, error } = await supabase
          .from('home_projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (projectsData && !error) {
          setProjects(projectsData);
        }
      } catch (e) {
        console.log("home_projects table might not exist yet.");
      }

      // Fetch services (if table exists, otherwise fallback to default)
      try {
        const { data: servicesData, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (servicesData && servicesData.length > 0 && !error) {
          setServices(servicesData);
        }
      } catch (e) {
        console.log("Services table might not exist yet.");
      }

      // Fetch latest blogs
      try {
        const { data: blogsData, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (blogsData && !error) {
          setBlogs(blogsData);
        }
      } catch (e) {
        console.log("Blogs table might not exist yet.");
      }

      // Fetch homepage content
      try {
        const { data: contentData, error } = await supabase
          .from('homepage_content')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (contentData && !error) {
          setHomeContent(prev => ({
            ...prev,
            ...contentData,
            brands_logos: contentData.brands_logos || prev.brands_logos
          }));
        }
      } catch (e) {
        console.log("homepage_content table might not exist yet.");
      }
    };

    fetchData();
  }, []);

  // Duplicate projects exactly once for seamless 50% translation scrolling
  // If there are too few projects, we might need to duplicate more, but we need the two halves to be identical.
  // To ensure it fills the screen, we can duplicate the base array until it's long enough, then double THAT.
  const minItems = 8; // Need at least 8 items to fill 200vw (8 * 25vw)
  let baseProjects = [...projects];
  while (baseProjects.length > 0 && baseProjects.length < minItems) {
    baseProjects = [...baseProjects, ...projects];
  }
  const scrollingProjects = baseProjects.length > 0 ? [...baseProjects, ...baseProjects] : [];

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return ((homeContent.hero_text && homeContent.hero_text.trim() !== "") || homeContent.hero_video_url) ? (
          <section key="hero" style={{ backgroundColor: homeContent.hero_bg_color }} className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <video 
                key={homeContent.hero_video_url}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-50"
              >
                {homeContent.hero_video_url ? <source src={homeContent.hero_video_url} type="video/mp4" /> : null}
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black"></div>
            </div>
            <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mt-20">
              {homeContent.hero_text && homeContent.hero_text.trim() !== "" && (
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ color: homeContent.hero_text_color }}
                  className={`${homeContent.hero_text_size || 'text-6xl md:text-8xl lg:text-9xl'} font-display font-black uppercase tracking-tighter leading-[0.85] whitespace-pre-line mb-8`}
                >
                  {homeContent.hero_text}
                </motion.h1>
              )}
              {homeContent.hero_description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-3xl mx-auto text-xl md:text-2xl text-white/80 leading-relaxed font-medium"
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ 
                    color: homeContent.phil_tag_color,
                    backgroundColor: homeContent.phil_tag_bg_color || 'transparent'
                  }}
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-8 border border-[#ceff00]/20"
                >
                  {homeContent.phil_tag}
                </motion.span>
              )}
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                <div className="lg:w-1/2">
                  <motion.h2 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{ color: homeContent.phil_title_color }}
                    className={`${homeContent.phil_title_size || 'text-4xl md:text-7xl'} font-display font-black uppercase tracking-tighter leading-[0.9] whitespace-pre-line`}
                  >
                    {homeContent.phil_title}
                  </motion.h2>
                </div>
                <div className="lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <p 
                      style={{ color: homeContent.phil_description_color || '#9ca3af' }}
                      className="text-lg md:text-xl leading-relaxed opacity-90 whitespace-pre-line"
                    >
                      {homeContent.phil_description}
                    </p>
                  </motion.div>
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
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      style={{ color: homeContent.help_tag_color }}
                      className={`${homeContent.help_tag_size || 'text-sm'} inline-block font-bold uppercase tracking-[0.3em] mb-8`}
                    >
                      {homeContent.help_tag}
                    </motion.span>
                  )}
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    style={{ color: homeContent.help_text_color }}
                    className={`${homeContent.help_heading_size || 'text-5xl md:text-7xl lg:text-8xl'} font-display font-black uppercase tracking-tighter leading-[0.85] whitespace-pre-line`}
                  >
                    {homeContent.help_heading}
                  </motion.h2>
                </div>
                <div className="lg:w-2/5 flex flex-col items-start gap-8">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{ color: homeContent.help_description_color || '#9ca3af' }}
                    className={`${homeContent.help_subheading_size || 'text-xl md:text-2xl'} font-medium leading-relaxed`}
                  >
                    {homeContent.help_subheading}
                  </motion.p>
                  <Link 
                    to="/services" 
                    style={{ 
                      backgroundColor: homeContent.help_btn_color || '#ceff00',
                      color: homeContent.help_btn_text_color || '#000',
                      borderRadius: homeContent.help_btn_radius || '12px'
                    }}
                    className="group flex items-center gap-3 font-bold uppercase tracking-widest px-8 py-4 hover:gap-6 transition-all"
                  >
                    {homeContent.help_button_text || 'View All Practices'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(services.length > 0 ? services.slice(0, 6) : homeContent.practices).map((item: any, i: number) => (
                  <Link
                    to={`/services/${item.slug || ''}`}
                    key={i}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * i }}
                      className="bg-[#111111] rounded-3xl p-6 border border-white/5 hover:border-[#ceff00]/30 transition-all duration-500 flex flex-col h-full"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden mb-8 bg-neutral-900">
                        <img 
                          src={item.image_url || item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                        {(item.tags || item.areas || (item.subtitle ? item.subtitle.split(' • ') : [])).map((tag: any, j: number) => (
                          <span key={j} className="text-[10px] font-bold tracking-[0.2em] text-[#ceff00] opacity-80 uppercase whitespace-nowrap">{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4 text-white leading-[0.9] group-hover:text-[#ceff00] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed text-sm line-clamp-3">
                        {item.desc || item.description || item.subtitle}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'marquee':
        return (homeContent.marquee_text && homeContent.marquee_text.trim() !== "") ? (
          <div key="marquee" style={{ backgroundColor: homeContent.marquee_bg_color, color: homeContent.marquee_text_color }} className="py-4 overflow-hidden flex whitespace-nowrap relative">
            <div className="flex w-max animate-[marquee_20s_linear_infinite]">
              <span className={`${homeContent.marquee_text_size || 'text-2xl md:text-4xl'} font-display font-black uppercase tracking-tighter mx-4`}>
                {homeContent.marquee_text} {homeContent.marquee_text} {homeContent.marquee_text}
              </span>
              <span className={`${homeContent.marquee_text_size || 'text-2xl md:text-4xl'} font-display font-black uppercase tracking-tighter mx-4`}>
                {homeContent.marquee_text} {homeContent.marquee_text} {homeContent.marquee_text}
              </span>
            </div>
          </div>
        ) : null;

      case 'marquee_logos':
        return (homeContent.brands_logos && homeContent.brands_logos.length > 0) ? (
          <section key="brands" style={{ backgroundColor: homeContent.brands_bg_color }} className="py-20 overflow-hidden border-y border-white/5">
            <div className="flex w-max animate-[marquee_40s_linear_infinite] items-center gap-12 transition-all duration-700">
              {[...homeContent.brands_logos, ...homeContent.brands_logos, ...homeContent.brands_logos, ...homeContent.brands_logos].map((logo, i) => (
                <img key={i} src={logo} alt="Brand Logo" className="h-8 md:h-12 w-auto object-contain mx-12" />
              ))}
            </div>
          </section>
        ) : null;

      case 'method':
        return (homeContent.method_visibility) ? (
          <section key="method" style={{ backgroundColor: homeContent.method_bg_color }} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
                <div className="lg:w-1/2">
                  {homeContent.method_tag && (
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      style={{ color: homeContent.method_tag_color }}
                      className="inline-block text-sm font-bold uppercase tracking-[0.3em] mb-8"
                    >
                      {homeContent.method_tag}
                    </motion.span>
                  )}
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    style={{ color: homeContent.method_title_color }}
                    className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85] mb-12"
                  >
                    {homeContent.method_title}
                  </motion.h2>
                </div>
                <div className="lg:w-1/2 flex items-center">
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{ color: homeContent.method_quote_color }}
                    className="text-2xl md:text-3xl lg:text-4xl font-display font-black uppercase tracking-tight italic leading-tight"
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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * (i + 1) }}
                    className="relative group h-full bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="mb-6">
                      <span className="text-6xl font-display font-black text-[#ceff00]/20 group-hover:text-[#ceff00]/40 transition-all duration-500">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4 text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'who_we_serve':
        return (homeContent.serve_visibility) ? (
          <section key="serve" style={{ backgroundColor: homeContent.serve_bg_color }} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="mb-20">
                {homeContent.serve_tag && (
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ color: homeContent.serve_tag_color }}
                    className="inline-block text-sm font-bold uppercase tracking-[0.3em] mb-8"
                  >
                    {homeContent.serve_tag}
                  </motion.span>
                )}
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  style={{ color: homeContent.serve_title_color }}
                  className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85] w-full lg:w-3/4"
                >
                  {homeContent.serve_title}
                </motion.h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                {homeContent.serve_items && homeContent.serve_items.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="group"
                  >
                    <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-4 text-white group-hover:text-[#ceff00] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'work':
        return ((homeContent.our_work_heading && homeContent.our_work_heading.trim() !== "") || (homeContent.our_work_subheading && homeContent.our_work_subheading.trim() !== "")) ? (
          <section key="work" style={{ backgroundColor: homeContent.our_work_bg_color || '#000', color: homeContent.our_work_text_color || '#fff' }} className="py-24 md:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div className="max-w-2xl">
                  {homeContent.our_work_subheading && homeContent.our_work_subheading.trim() !== "" && (
                    <p className="text-2xl md:text-3xl font-medium mb-12 opacity-80 leading-tight">
                      {homeContent.our_work_subheading}
                    </p>
                  )}
                  {homeContent.our_work_btn_text && homeContent.our_work_btn_text.trim() !== "" && (
                    <Link 
                      to="/projects" 
                      style={{ 
                        backgroundColor: homeContent.our_work_btn_color, 
                        color: "#000",
                        borderRadius: "12px"
                      }} 
                      className="inline-flex items-center gap-3 font-bold uppercase tracking-wider px-10 py-5 hover:scale-105 transition-transform"
                    >
                      {homeContent.our_work_btn_text}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  )}
                </div>
                {homeContent.our_work_heading && homeContent.our_work_heading.trim() !== "" && (
                  <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter text-left md:text-right leading-[0.8] whitespace-pre-line">
                    {homeContent.our_work_heading}
                  </h2>
                )}
              </div>
            </div>
            {projects.length > 0 && (
              <div className="relative w-full overflow-hidden group">
                <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] items-center">
                  {scrollingProjects.map((project, i) => (
                    <Link to={`/projects`} key={`${project.id}-${i}`} className="w-[80vw] md:w-[40vw] lg:w-[22vw] flex-shrink-0 px-3 block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-900 border border-white/5">
                        <img src={project.image_url || 'https://picsum.photos/seed/project/800/1000'} alt={project.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-8">
                          <div>
                            <p className="text-[#ceff00] text-xs font-bold uppercase tracking-widest mb-2">{project.category || 'Featured'}</p>
                            <h3 className="text-white text-3xl font-display font-black uppercase tracking-tight leading-[1] line-clamp-2">{project.title}</h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null;

      case 'cta':
        return ((homeContent.cta_heading && homeContent.cta_heading.trim() !== "") || (homeContent.cta_subheading && homeContent.cta_subheading.trim() !== "")) ? (
          <section key="cta" style={{ backgroundColor: "#ceff00" }} className="py-24 md:py-40 px-6 md:px-12 text-center relative overflow-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
              {homeContent.cta_heading && homeContent.cta_heading.trim() !== "" && (
                <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 text-black leading-[0.85]">
                  {homeContent.cta_heading}
                </h2>
              )}
              {homeContent.cta_subheading && homeContent.cta_subheading.trim() !== "" && (
                <p className="text-xl md:text-3xl text-black/80 mb-12 font-medium max-w-2xl mx-auto">
                  {homeContent.cta_subheading}
                </p>
              )}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {homeContent.cta_btn_text && homeContent.cta_btn_text.trim() !== "" && (
                  <Link to={homeContent.cta_btn_link} className="inline-block bg-black text-[#ceff00] font-bold uppercase tracking-wider px-12 py-6 rounded-2xl hover:scale-105 transition-transform text-lg">
                    {homeContent.cta_btn_text}
                  </Link>
                )}
                <a href="mailto:hello@eternaventures.in" className="text-black font-black text-xl md:text-2xl underline underline-offset-8 decoration-2">
                  hello@eternaventures.in
                </a>
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full border-[40px] border-black/5 rounded-full scale-150"></div>
          </section>
        ) : null;

      case 'blogs':
        return (homeContent.blogs_title && homeContent.blogs_title.trim() !== "") ? (
          <section key="blogs" style={{ backgroundColor: "#000" }} className="py-24 md:py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
                <div className="max-w-2xl">
                  <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-black uppercase tracking-tighter leading-[0.8] text-white mb-8">
                    {homeContent.blogs_title}
                  </h2>
                  {homeContent.blogs_subheading && (
                    <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed">
                      {homeContent.blogs_subheading}
                    </p>
                  )}
                </div>
                <div>
                  <Link to="/blogs" className="inline-flex items-center gap-3 bg-[#ceff00] text-black font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:gap-6 transition-all">
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
                        <p className="text-[#ceff00] text-xs font-bold uppercase tracking-widest mb-4">
                          {format(new Date(blog.created_at), 'MMM d, yyyy')}
                        </p>
                        <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white group-hover:text-[#ceff00] transition-colors">
                          {blog.title}
                        </h3>
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

  return (
    <div style={{ backgroundColor: homeContent.page_bg_color, color: homeContent.page_text_color }}>
      {homeContent.section_order && homeContent.section_order.map((sectionId: string) => renderSection(sectionId))}
      
      {/* Fallback for legacy if section_order is missing */}
      {!homeContent.section_order && (
        <>
          {renderSection('hero')}
          {renderSection('marquee')}
          {renderSection('philosophy')}
          {renderSection('services')}
          {renderSection('marquee_logos')}
          {renderSection('method')}
          {renderSection('who_we_serve')}
          {renderSection('work')}
          {renderSection('testimonials')}
          {renderSection('cta')}
          {renderSection('blogs')}
        </>
      )}
    </div>
  );
}
