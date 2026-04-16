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
    hero_video_url: "",
    hero_text: "",
    hero_text_color: "#ffffff",
    marquee_text: "",
    marquee_bg_color: "#2596be",
    marquee_text_color: "#ffffff",
    help_heading: "",
    help_subheading: "",
    help_button_text: "",
    help_bg_color: "#ffffff",
    help_text_color: "#000000",
    help_btn_color: "#2596be",
    help_btn_text_color: "#ffffff",
    brands_logos: [] as string[],
    our_work_heading: "",
    our_work_subheading: "",
    our_work_btn_text: "",
    our_work_btn_color: "#2596be",
    our_work_bg_color: "#ffffff",
    our_work_text_color: "#000000",
    testimonials_tag: "",
    testimonials_tag_color: "#2596be",
    testimonials_title: "",
    testimonials_title_color: "#ffffff",
    testimonials_bg_color: "#000000",
    blogs_title: "",
    blogs_title_color: "#ffffff",
    blogs_btn_text: "",
    blogs_btn_color: "#2596be",
    blogs_bg_color: "#111111",
    cta_heading: "",
    cta_subheading: "",
    cta_btn_text: "",
    cta_btn_link: "/contact",
    cta_bg_color: "#2596be",
    cta_text_color: "#ffffff",
    hero_text_size: "text-4xl sm:text-6xl md:text-8xl lg:text-9xl",
    marquee_text_size: "text-xl md:text-4xl",
    help_heading_size: "text-4xl sm:text-5xl md:text-7xl",
    help_subheading_size: "text-lg md:text-xl font-bold",
    our_work_heading_size: "text-4xl sm:text-5xl md:text-7xl",
    our_work_subheading_size: "text-lg md:text-xl md:text-2xl",
    testimonials_title_size: "text-3xl sm:text-4xl md:text-6xl",
    blogs_title_size: "text-4xl sm:text-5xl md:text-7xl",
    cta_heading_size: "text-4xl sm:text-5xl md:text-7xl",
    cta_subheading_size: "text-lg md:text-xl md:text-2xl",
    page_bg_color: "#000000",
    page_text_color: "#ffffff",
    hero_bg_color: "#000000",
    brands_bg_color: "#000000",
    brands_text_color: "#ffffff",
    blogs_subheading: "",
    blogs_subheading_size: "text-lg md:text-xl font-bold",
    phil_tag: "Our Philosophy",
    phil_tag_color: "#2596be",
    phil_tag_bg_color: "rgba(37, 150, 190, 0.1)",
    phil_title: "Growth is not a campaign. It’s a discipline.",
    phil_title_color: "#ffffff",
    phil_title_size: "text-4xl md:text-6xl lg:text-7xl",
    phil_description: "",
    phil_description_color: "#9ca3af",
    phil_description_size: "text-lg md:text-xl",
    phil_bg_color: "#000000",
    phil_visibility: true,
    help_btn_radius: "9999px",
    our_work_btn_text_color: "#ffffff",
    our_work_btn_radius: "9999px",
    blogs_btn_text_color: "#ffffff",
    blogs_btn_radius: "9999px",
    cta_btn_text_color: "#000000",
    cta_btn_radius: "9999px",
    help_tag: "What We Do",
    help_tag_color: "#2596be",
    method_visibility: true,
    method_tag: "How We Work",
    method_tag_color: "#2596be",
    method_title: "The EternaVentures Method",
    method_title_color: "#ffffff",
    method_quote: "“We don’t start with deliverables. We start with the gap between where your brand is and where it should be — and build the bridge.”",
    method_quote_color: "#c2ff00",
    method_bg_color: "#000000",
    method_step1_title: "Audit & Immersion",
    method_step1_desc: "We spend time in your world before we touch your brand. Market landscape, competitor positioning, audience signals, and the story your brand is currently telling — whether you intended it or not.",
    method_step2_title: "Strategic Foundation",
    method_step2_desc: "Every action we take is grounded in a positioning document that the whole team — ours and yours — can build from. Clear differentiation, defined audience tiers, and a growth thesis we can defend.",
    method_step3_title: "Build & Activate",
    method_step3_desc: "We execute across capabilities simultaneously — not in silos. Brand, content, performance, influence, and experience working as one integrated system, not a list of services.",
    method_step4_title: "Measure & Compound",
    method_step4_desc: "We track what matters: brand equity, audience quality, revenue influence, and market share signals. Then we reinvest learnings into the next cycle. Growth compounds when strategy doesn’t reset every quarter."
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

  return (
    <div style={{ backgroundColor: homeContent.page_bg_color, color: homeContent.page_text_color }}>
      {/* Hero Section */}
      {((homeContent.hero_text && homeContent.hero_text.trim() !== "") || homeContent.hero_video_url) && (
        <section style={{ backgroundColor: homeContent.hero_bg_color }} className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video 
              key={homeContent.hero_video_url}
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-40"
            >
              {homeContent.hero_video_url ? <source src={homeContent.hero_video_url} type="video/mp4" /> : null}
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black"></div>
          </div>
          
          {homeContent.hero_text && homeContent.hero_text.trim() !== "" && (
            <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mt-20">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ color: homeContent.hero_text_color }}
                className={`${homeContent.hero_text_size || 'text-6xl md:text-8xl lg:text-9xl'} font-display font-black uppercase tracking-tighter leading-[0.85] whitespace-pre-line`}
              >
                {homeContent.hero_text}
              </motion.h1>
            </div>
          )}
        </section>
      )}

      {/* Purple Marquee */}
      {homeContent.marquee_text && homeContent.marquee_text.trim() !== "" && (
        <div style={{ backgroundColor: homeContent.marquee_bg_color, color: homeContent.marquee_text_color }} className="py-4 overflow-hidden flex whitespace-nowrap relative">
          <div className="flex w-max animate-[marquee_20s_linear_infinite]">
            <span className={`${homeContent.marquee_text_size || 'text-2xl md:text-4xl'} font-display font-black uppercase tracking-tighter mx-4`}>
              {homeContent.marquee_text} {homeContent.marquee_text} {homeContent.marquee_text}
            </span>
            <span className={`${homeContent.marquee_text_size || 'text-2xl md:text-4xl'} font-display font-black uppercase tracking-tighter mx-4`}>
              {homeContent.marquee_text} {homeContent.marquee_text} {homeContent.marquee_text}
            </span>
          </div>
        </div>
      )}

      {/* Philosophy Section */}
      {homeContent.phil_visibility && homeContent.phil_title && (
        <section style={{ backgroundColor: homeContent.phil_bg_color }} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
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
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-8"
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
                  className={`${homeContent.phil_title_size || 'text-4xl md:text-6xl'} font-display font-black uppercase tracking-tighter leading-[0.9] whitespace-pre-line`}
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
                    style={{ color: homeContent.phil_description_color }}
                    className={`${homeContent.phil_description_size || 'text-lg md:text-xl'} leading-relaxed opacity-90 whitespace-pre-line`}
                  >
                    {homeContent.phil_description}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#2596be]/5 to-transparent pointer-none"></div>
        </section>
      )}

      {/* Services Section */}

      {((homeContent.help_heading && homeContent.help_heading.trim() !== "") || (homeContent.help_subheading && homeContent.help_subheading.trim() !== "")) && (
        <section style={{ backgroundColor: homeContent.help_bg_color, color: homeContent.help_text_color }} className="py-24 md:py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {homeContent.help_tag && (
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ color: homeContent.help_tag_color }}
                className="inline-block text-sm font-bold uppercase tracking-[0.3em] mb-12"
              >
                {homeContent.help_tag}
              </motion.span>
            )}

            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24 mb-24">
              <div className="lg:w-3/5">
                {homeContent.help_heading && homeContent.help_heading.trim() !== "" && (
                  <h2 className={`${homeContent.help_heading_size || 'text-5xl md:text-7xl'} font-display font-black uppercase tracking-tighter leading-[0.85] whitespace-pre-line`}>
                    {homeContent.help_heading}
                  </h2>
                )}
              </div>
              <div className="lg:w-2/5 flex flex-col items-start lg:items-end lg:text-right">
                {homeContent.help_subheading && homeContent.help_subheading.trim() !== "" && (
                  <p className={`${homeContent.help_subheading_size || 'text-xl font-bold'} mb-10 leading-relaxed opacity-90 whitespace-pre-line`}>
                    {homeContent.help_subheading}
                  </p>
                )}
                {homeContent.help_button_text && homeContent.help_button_text.trim() !== "" && (
                  <Link 
                    to="/services" 
                    style={{ 
                      backgroundColor: homeContent.help_btn_color, 
                      color: homeContent.help_btn_text_color, 
                      borderRadius: homeContent.help_btn_radius 
                    }} 
                    className="group inline-flex items-center gap-3 font-bold uppercase tracking-wider px-10 py-5 hover:opacity-90 transition-all active:scale-95"
                  >
                    {homeContent.help_button_text}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>

            {services.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {services.slice(0, 6).map((service, i) => (
                  <Link to={`/services/${service.slug}`} key={i} className="group cursor-pointer">
                    <div className="overflow-hidden mb-6 rounded-xl bg-gray-100">
                      <img src={service.image_url || 'https://picsum.photos/seed/service/800/800'} alt={service.title} className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    {service.subtitle && <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{service.subtitle}</p>}
                    <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4 transition-colors">{service.title}</h3>
                    <p className="opacity-80 leading-relaxed line-clamp-3" style={{ color: homeContent.help_text_color }}>{service.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Client Logos Marquee */}
      {homeContent.brands_logos && homeContent.brands_logos.length > 0 && (
        <div style={{ backgroundColor: homeContent.brands_bg_color }} className="py-12 overflow-hidden flex whitespace-nowrap border-y border-gray-900 relative">
          <div className="flex w-max animate-[marquee_30s_linear_infinite]">
            <div className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32">
              {homeContent.brands_logos.map((logo, i) => (
                logo ? <img key={i} src={logo} alt="Brand Logo" className="h-12 md:h-16 w-auto max-w-none shrink-0 object-contain opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300" /> : null
              ))}
            </div>
            <div className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32">
              {homeContent.brands_logos.map((logo, i) => (
                logo ? <img key={`dup-${i}`} src={logo} alt="Brand Logo" className="h-12 md:h-16 w-auto max-w-none shrink-0 object-contain opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300" /> : null
              ))}
            </div>
          </div>
        </div>
      )}

      {/* The EternaVentures Method Section */}
      {homeContent.method_visibility && (
        <section style={{ backgroundColor: homeContent.method_bg_color }} className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
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
                  className="relative group h-full"
                >
                  <div className="mb-6">
                    <span className="text-6xl font-display font-black text-white/10 group-hover:text-[#2596be]/20 transition-colors duration-500">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white mb-4 group-hover:text-[#2596be] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Subtle methodology background accent */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2596be]/5 blur-[120px] rounded-full pointer-events-none"></div>
        </section>
      )}

      {/* Work Section */}

      {((homeContent.our_work_heading && homeContent.our_work_heading.trim() !== "") || (homeContent.our_work_subheading && homeContent.our_work_subheading.trim() !== "")) && (
        <section style={{ backgroundColor: homeContent.our_work_bg_color, color: homeContent.our_work_text_color }} className="py-24 md:py-32 overflow-hidden">
          <div className="max-w-[100rem] mx-auto px-6 md:px-12 mb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
              <div className="max-w-xl">
                {homeContent.our_work_subheading && homeContent.our_work_subheading.trim() !== "" && (
                  <p className={`${homeContent.our_work_subheading_size || 'text-xl md:text-2xl font-bold'} mb-8 whitespace-pre-line`}>
                    {homeContent.our_work_subheading}
                  </p>
                )}
                {homeContent.our_work_btn_text && homeContent.our_work_btn_text.trim() !== "" && (
                  <Link to="/projects" style={{ backgroundColor: homeContent.our_work_btn_color, color: homeContent.our_work_btn_text_color, borderRadius: homeContent.our_work_btn_radius }} className="inline-block font-bold uppercase tracking-wider px-8 py-4 hover:opacity-90 transition-opacity">
                    {homeContent.our_work_btn_text}
                  </Link>
                )}
              </div>
              {homeContent.our_work_heading && homeContent.our_work_heading.trim() !== "" && (
                <h2 className={`${homeContent.our_work_heading_size || 'text-5xl md:text-7xl'} font-display font-black uppercase tracking-tighter text-right mt-12 md:mt-0 leading-none whitespace-pre-line`}>
                  {homeContent.our_work_heading}
                </h2>
              )}
            </div>
          </div>

          {/* Auto-scrolling projects */}
          {projects.length > 0 && (
            <div className="relative w-full overflow-hidden group">
              <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] items-center">
                {scrollingProjects.map((project, i) => {
                  const aspectRatioClass = project.aspect_ratio === 'landscape' ? 'aspect-video' : project.aspect_ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-square';
                  return (
                    <Link 
                      to={`/projects`} 
                      key={`${project.id}-${i}`}
                      className="w-[80vw] md:w-[40vw] lg:w-[25vw] flex-shrink-0 px-2 block"
                    >
                      <div className={`relative ${aspectRatioClass} overflow-hidden rounded-xl bg-gray-100`}>
                        <img 
                          src={project.image_url || 'https://picsum.photos/seed/project/800/1000'} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
                          <h3 className="text-white text-2xl font-display font-black uppercase tracking-wide">{project.title}</h3>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Testimonials Section */}
      {homeContent.testimonials_title && homeContent.testimonials_title.trim() !== "" && (
        <Testimonials 
          tag={homeContent.testimonials_tag}
          tagColor={homeContent.testimonials_tag_color}
          title={homeContent.testimonials_title}
          titleColor={homeContent.testimonials_title_color}
          titleSize={homeContent.testimonials_title_size}
          bgColor={homeContent.testimonials_bg_color}
        />
      )}

      {/* CTA Section */}
      {((homeContent.cta_heading && homeContent.cta_heading.trim() !== "") || (homeContent.cta_subheading && homeContent.cta_subheading.trim() !== "")) && (
        <section style={{ backgroundColor: homeContent.cta_bg_color, color: homeContent.cta_text_color }} className="py-24 md:py-32 px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            {homeContent.cta_heading && homeContent.cta_heading.trim() !== "" && (
              <h2 className={`${homeContent.cta_heading_size || 'text-5xl md:text-7xl'} font-display font-black uppercase tracking-tighter mb-6 whitespace-pre-line`}>
                {homeContent.cta_heading}
              </h2>
            )}
            {homeContent.cta_subheading && homeContent.cta_subheading.trim() !== "" && (
              <p className={`${homeContent.cta_subheading_size || 'text-xl md:text-2xl font-medium'} mb-10 opacity-90 whitespace-pre-line`}>
                {homeContent.cta_subheading}
              </p>
            )}
            {homeContent.cta_btn_text && homeContent.cta_btn_text.trim() !== "" && (
              <Link 
                to={homeContent.cta_btn_link} 
                style={{ borderRadius: homeContent.cta_btn_radius, color: homeContent.cta_btn_text_color }}
                className="inline-block bg-white font-bold uppercase tracking-wider px-10 py-5 hover:scale-105 transition-transform"
              >
                {homeContent.cta_btn_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Blogs Section */}
      {homeContent.blogs_title && homeContent.blogs_title.trim() !== "" && (
        <section style={{ backgroundColor: homeContent.blogs_bg_color }} className="py-24 md:py-32 px-6 md:px-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-end mb-16 border-b border-gray-800 pb-8">
              <h2 style={{ color: homeContent.blogs_title_color }} className={`${homeContent.blogs_title_size || 'text-5xl md:text-7xl'} font-display font-black uppercase tracking-tighter leading-none text-left md:text-right whitespace-pre-line mb-8 md:mb-0`}>
                {homeContent.blogs_title}
              </h2>
              <div className="max-w-md">
                {homeContent.blogs_subheading && homeContent.blogs_subheading.trim() !== "" && (
                  <p className={`${homeContent.blogs_subheading_size || 'text-xl font-bold'} mb-6 whitespace-pre-line text-gray-300`}>
                    {homeContent.blogs_subheading}
                  </p>
                )}
                {homeContent.blogs_btn_text && homeContent.blogs_btn_text.trim() !== "" && (
                  <Link to="/blogs" style={{ backgroundColor: homeContent.blogs_btn_color, color: homeContent.blogs_btn_text_color, borderRadius: homeContent.blogs_btn_radius }} className="inline-block font-bold uppercase tracking-wider px-8 py-4 hover:opacity-90 transition-opacity">
                    {homeContent.blogs_btn_text}
                  </Link>
                )}
              </div>
            </div>

            {blogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {blogs.map((blog, i) => (
                  <Link to={`/blogs/${blog.slug}`} key={i} className="bg-white text-black p-6 group cursor-pointer hover:-translate-y-2 transition-transform duration-300 rounded-xl block">
                    <div className="overflow-hidden mb-6 rounded-lg">
                      <img src={blog.thumbnail_url || 'https://picsum.photos/seed/blog/800/600'} alt={blog.title} className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{format(new Date(blog.created_at), 'MMMM d, yyyy')}</p>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tighter leading-tight">{blog.title}</h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
