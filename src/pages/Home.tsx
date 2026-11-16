import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Crown, BellRing, BriefcaseBusiness, Rocket, Filter, Layers, Heart, Shirt, Mail, Pause, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { HOME_AUDIENCES, HOME_DEFAULTS, HOME_ORDER, HOME_PRACTICES, isImageMedia, resolveHomeContent } from '../data/home';
import { DEFAULT_INSIGHTS, insightImage, type Insight } from '../data/insights';
import { DEFAULT_PROJECTS, DEFAULT_PROJECT_REVIEWS, LOCAL_PROJECT_IMAGES, type ProjectReview } from '../data/projects';
import './Home.css';

type HomeProject = { id: string; title: string; image_url: string };
type HomeSettings = Record<string, any>;
const icons = [Crown, BellRing, BriefcaseBusiness, Rocket, Filter, Layers, Heart, Shirt];
const defaultProjects = DEFAULT_PROJECTS.map(project => ({...project, image_url: LOCAL_PROJECT_IMAGES[project.image_url] || project.image_url}));
const homeProjectImage = (url: string) => url.endsWith('/7.jpg') ? '/images/project-valia.jpg' : url.endsWith('/41.jpg') ? '/images/project-amrita.jpg' : LOCAL_PROJECT_IMAGES[url] || url;
function Highlight({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) { return <span className={`home-highlight${inverse ? ' home-highlight-inverse' : ''}`}><span>{children}</span></span>; }
function FinalWords({ text, count = 1, inverse = false }: {text: string; count?: number; inverse?: boolean}) { const words = text.trim().split(/\s+/); return <>{words.slice(0, -count).join(' ')} <Highlight inverse={inverse}>{words.slice(-count).join(' ')}</Highlight></>; }
function MovingRow({children, label, className = ''}: {children: ReactNode; label: string; className?: string}) {
  return <div className={`home-moving-row ${className}`} role="region" aria-label={label}>
    <div className="home-moving-viewport" tabIndex={0}><div className="home-moving-track"><div className="home-moving-group">{children}</div><div className="home-moving-group home-moving-copy" aria-hidden="true" inert>{children}</div></div></div>
  </div>;
}
function Hero({content}: {content: HomeSettings}) {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const media = String(content.hero_video_url || '').trim();
  const imageOnly = isImageMedia(media);
  useEffect(() => { const query = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(query.matches); update(); query.addEventListener('change', update); return () => query.removeEventListener('change', update); }, []);
  useEffect(() => { setReady(false); setFailed(false); setPaused(false); }, [media]);
  useEffect(() => { if (video.current) { if(reduced || paused) video.current.pause(); else video.current.play().catch(() => {setReady(false);setPaused(true);}); } }, [reduced, paused, media]);
  const lines = String(content.hero_text).split('\n').filter(Boolean);
  return <section className="home-hero" aria-labelledby="home-title">
    <img className="home-hero-media" src={imageOnly && !failed ? media : '/images/home-studio-hero.jpg'} onError={event => { if(imageOnly && !failed) {setFailed(true); event.currentTarget.src='/images/home-studio-hero.jpg';} }} alt="Creative studio with a wall of film projections" fetchPriority="high" />
    {media && !imageOnly && !failed && <video ref={video} key={media} className={`home-hero-media home-hero-video${ready ? ' is-ready' : ''}`} src={media} poster="/images/home-studio-hero.jpg" autoPlay={!reduced} muted loop playsInline preload="metadata" onPlaying={() => setReady(true)} onError={() => {setFailed(true);setReady(false);}} aria-hidden="true" />}
    <div className="home-container home-hero-copy"><h1 id="home-title">{lines.slice(0, -1).join(' ') || 'WE BUILD BRANDS THAT'}<br /><Highlight>{lines.at(-1)}</Highlight></h1><p>{content.hero_description}</p><div className="home-hero-actions"><Link className="home-pill" to="/contact">Start a Project <ArrowUpRight size={18} /></Link><Link className="home-pill home-pill-outline" to="/projects">Explore Our Work</Link></div></div>
    {media && !imageOnly && !failed && <button type="button" className="home-video-control" onClick={() => { if(reduced) {setReduced(false);setPaused(false);} else setPaused(value=>!value); }} aria-label={paused || reduced ? 'Play background video' : 'Pause background video'}>{paused || reduced ? <Play size={15} /> : <Pause size={15} />}<span>{paused || reduced ? 'Play' : 'Pause'} background video</span></button>}
  </section>;
}
export default function Home() {
  const [content, setContent] = useState<HomeSettings>({...HOME_DEFAULTS});
  const [projects, setProjects] = useState<HomeProject[]>(defaultProjects);
  const [blogs, setBlogs] = useState<Insight[]>(DEFAULT_INSIGHTS);
  const [reviews, setReviews] = useState<ProjectReview[]>(DEFAULT_PROJECT_REVIEWS);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await Promise.allSettled([
        supabase.from('homepage_content').select('*').order('created_at',{ascending:false}).limit(1).maybeSingle(),
        supabase.from('home_projects').select('*').order('created_at',{ascending:true}),
        supabase.from('blogs').select('*').neq('visibility','hidden').order('created_at',{ascending:false}).limit(3),
        supabase.from('testimonials').select('*').order('created_at',{ascending:false}),
      ]);
      if(cancelled) return;
      const [settings,work,articles,testimonials] = results;
      if(settings.status==='fulfilled' && settings.value.data) {
        setContent(resolveHomeContent(settings.value.data));
      }
      if(work.status==='fulfilled' && work.value.data?.length) setProjects(work.value.data.map(project=>({...project,image_url:homeProjectImage(project.image_url)})));
      if(articles.status==='fulfilled' && !articles.value.error && articles.value.data) setBlogs(articles.value.data);
      if(testimonials.status==='fulfilled' && testimonials.value.data?.length) setReviews(testimonials.value.data);
    }
    load().catch(error=>console.error('Unable to load home page',error));
    return ()=>{cancelled=true;};
  },[]);
  const visible = (key: string) => content[key] !== false;
  const sections: Record<string, ReactNode> = {
    hero: <Hero content={content} />,
    marquee: <MovingRow label="Agency statement" className="home-statement"><span>{content.marquee_text}</span><span aria-hidden="true">✳</span><span>{content.marquee_text}</span><span aria-hidden="true">✳</span></MovingRow>,
    philosophy: visible('phil_visibility') && <section className="home-philosophy"><img src="/images/home-philosophy-waves.png" alt="" loading="lazy" /><div className="home-container home-split-heading"><h2><FinalWords text={content.phil_title} count={3} /></h2><div>{String(content.phil_description).split(/\n\n/).map((text,index)=><p key={index}>{text}</p>)}</div></div></section>,
    services: visible('help_visibility') && <section className="home-practices"><div className="home-container"><div className="home-section-top"><div><p className="home-eyebrow">{content.help_tag}</p><h2><FinalWords text={content.help_heading} count={2} inverse /></h2></div><Link className="home-pill" to="/services">{content.help_button_text}<ArrowUpRight size={18}/></Link></div><div className="home-practice-grid">{HOME_PRACTICES.map((practice,index)=><article className="home-practice-card" key={practice.slug}><Link to={`/services/${practice.slug}`} tabIndex={-1} aria-hidden="true"><img src={practice.image} alt="" loading="lazy" /></Link><div><span className="home-practice-number">{String(index+1).padStart(2,'0')}</span><h3>{practice.title}</h3><p>{practice.text}</p><Link to={`/services/${practice.slug}`}>Explore Practice <ArrowUpRight size={17}/></Link></div></article>)}</div></div></section>,
    marquee_logos: visible('brands_visibility') && Array.isArray(content.brands_logos) && content.brands_logos.length>0 && <div className="home-brands"><div className="home-container"><MovingRow label="Client brands">{content.brands_logos.map((url:string,index:number)=><div className="home-brand" key={`${url}-${index}`}><img src={url} alt={`Client brand ${index+1}`} loading="lazy" /></div>)}</MovingRow></div></div>,
    method: visible('method_visibility') && <section className="home-method"><div className="home-container"><div className="home-section-top"><div><p className="home-eyebrow">{content.method_tag}</p><h2><FinalWords text={content.method_title}/></h2></div><p>{content.method_quote}</p></div><ol className="home-method-grid">{[1,2,3,4].map(index=><li key={index}><span className="home-method-dot"/><strong>0{index}</strong><h3>{content[`method_step${index}_title`]}</h3><p>{content[`method_step${index}_desc`]}</p></li>)}</ol></div></section>,
    who_we_serve: visible('serve_visibility') && <section className="home-audience"><div className="home-container"><div className="home-section-top"><div><p className="home-eyebrow">{content.serve_tag}</p><h2><FinalWords text={content.serve_title}/></h2></div><p>{content.serve_subheading}</p></div><div className="home-audience-grid">{HOME_AUDIENCES.map((item,index)=>{const Icon=icons[index];return <article key={item.title}><Icon size={29} aria-hidden="true"/><h3>{item.title}</h3><p>{item.desc}</p></article>;})}</div></div></section>,
    work: visible('work_visibility') && <section className="home-work"><div className="home-container home-work-heading"><h2>{content.our_work_heading}</h2><p>{content.our_work_subheading}</p><Link className="home-text-link" to="/projects">{content.our_work_btn_text}<ArrowUpRight size={20}/></Link></div><MovingRow label="Featured projects" className="home-projects-row">{projects.map(project=><Link className="home-project-tile" key={project.id} to="/projects"><img src={project.image_url} alt={project.title} loading="lazy"/><h3>{project.title.replace(/\s*[–—-]\s*/g,'\n')}</h3><span className="home-project-arrow"><ArrowUpRight size={22}/></span></Link>)}</MovingRow></section>,
    testimonials: visible('testimonials_visibility') && <section className="home-testimonials"><div className="home-container"><p className="home-eyebrow">{content.testimonials_tag}</p><h2><FinalWords text={content.testimonials_title}/></h2></div><MovingRow label="Client testimonials" className="home-reviews-row">{reviews.map(review=><figure className="home-review" key={review.id}><div className="home-stars" aria-label={`${review.rating || 5} out of 5 stars`}>{Array.from({length:Math.min(5,Math.max(1,review.rating||5))},(_,index)=><Star key={index} size={19} fill="currentColor" aria-hidden="true"/>)}</div><blockquote>“{review.content}”</blockquote><figcaption><img src={review.image_url} alt="" loading="lazy"/><div><strong>{review.name}</strong><span>{review.role}</span></div></figcaption></figure>)}</MovingRow></section>,
    blogs: visible('blogs_visibility') && <section className="home-blogs"><div className="home-container"><h2>{content.blogs_title}</h2><p>{content.blogs_subheading}</p><div className="home-blog-grid">{blogs.map(blog=><article key={blog.id}><Link to={`/blogs/${blog.slug}`} tabIndex={-1} aria-hidden="true"><img src={insightImage(blog)} alt="" loading="lazy"/></Link><div><h3><Link to={`/blogs/${blog.slug}`}>{blog.title}</Link></h3><Link className="home-text-link" to={`/blogs/${blog.slug}`}>Read Article <ArrowUpRight size={18}/></Link></div></article>)}</div></div></section>,
    cta: <section className="home-contact"><div className="home-container"><h2>{content.cta_heading}</h2><p>{content.cta_subheading}</p><div><Link className="home-pill" to={content.cta_btn_link}>{content.cta_btn_text}</Link><a href={`mailto:${content.cta_email}`}><Mail size={20}/>{content.cta_email}</a></div></div></section>,
  };
  const order = Array.isArray(content.section_order) && content.section_order.length ? content.section_order : HOME_ORDER;
  return <div className="home-reference">{Array.from(new Set<string>(order)).map(id=><div key={id} className={`home-section home-section-${id}`}>{sections[id]}</div>)}</div>;
}
