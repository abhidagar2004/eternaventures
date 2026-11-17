import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock, Play, Search, ShieldCheck, Share2, Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Courses.css';

interface Course {
  id: string; title: string; slug: string; category: string; meta: string;
  description: string; image_url: string; duration: string;
}
const COURSES: Course[] = [
  { id: '1', title: 'BRAND SCALING & MODERN AUTHORITY BLUEPRINT', slug: 'brand-scaling-modern-authority', category: 'BRAND STRATEGY', meta: '5 MODULES · FOUNDER / ADVANCED', description: 'Build lasting brand equity through positioning and identity systems.', image_url: '/images/academy-brand-v2.png', duration: '2h 45m' },
  { id: '2', title: 'PERFORMANCE MARKETING & OMNI-CHANNEL MEDIA BUYING', slug: 'performance-marketing-media-buying', category: 'PAID GROWTH', meta: '4 MODULES · GROWTH MARKETER', description: 'Explore ad creative, bidding across Meta and Google, and scalable acquisition.', image_url: '/images/academy-growth-v2.png', duration: '3h 10m' },
  { id: '3', title: 'DIGITAL EXPERIENCE & CONVERSION UX ENGINEERING', slug: 'digital-experience-conversion-ux', category: 'DESIGN & UX', meta: '4 MODULES · ALL LEVELS', description: 'Design digital storefronts and customer journeys that make it easier to convert.', image_url: '/images/academy-design-v2.png', duration: '1h 50m' },
];
const FILTERS = ['ALL', 'BRAND STRATEGY', 'PAID GROWTH', 'DESIGN & UX'];
const seededThumbnails = ['photo-1557804506-669a67965ba0', 'photo-1460925895917-afdab827c52f', 'photo-1507238691740-187a5b1d37b8'];
const normalize = (value: string) => value.toUpperCase().replace(/&/g, 'AND').replace(/[^A-Z0-9]/g, '');
const benefits = [
  { icon: ShieldCheck, title: 'BATTLE-TESTED MODELS', text: 'Every framework taught has been executed across 8-figure brand portfolios. Zero theory.' },
  { icon: Youtube, title: 'OFFICIAL YOUTUBE PLAYER', text: 'Watch smoothly without leaving the platform, with full YouTube HD playback & chapters.' },
  { icon: Share2, title: 'NO PAYWALLS, PERIOD', text: 'High-value playbooks built to give ambitious operators an unfair competitive advantage.' },
];
export default function Courses() {
  const [courses, setCourses] = useState(COURSES);
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase.from('courses').select('*').eq('is_published', true).order('order_index', { ascending: true });
      if (!cancelled && !error && data?.length) setCourses(data.map((item, index) => {
        const reference = COURSES.find(course => course.slug === item.slug) || COURSES.find(course => normalize(course.category) === normalize(item.category || ''));
        const fallback = reference || COURSES[index % COURSES.length];
        const customThumbnail = item.thumbnail_url && !seededThumbnails.some(image => item.thumbnail_url.includes(image));
        return { id: item.id, title: item.title, slug: item.slug, category: (item.category || fallback.category).toUpperCase(), meta: `${item.lessons_count || 4} MODULES · ${(item.level || 'ALL LEVELS').toUpperCase()}`, description: item.description || fallback.description, image_url: customThumbnail ? item.thumbnail_url : reference?.image_url || fallback.image_url, duration: item.duration || fallback.duration };
      }));
    }
    load().catch(error => console.error('Unable to load masterclasses', error));
    return () => { cancelled = true;  };
  }, []);
  const visibleCourses = courses.filter(course => (filter === 'ALL' || normalize(course.category) === normalize(filter)) && `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="academy">
      <section className="academy-hero" aria-labelledby="academy-title">
        <img className="academy-hero-art" src="/images/academy-hero-v2.png" alt="Growth Playbook on an Eterna Academy studio monitor" fetchPriority="high" />
        <div className="academy-container academy-hero-inner">
          <div className="academy-hero-copy">
            <p className="academy-eyebrow">ETERNA ACADEMY & MASTERCLASSES</p>
            <h1 id="academy-title">FOUNDER & GROWTH<br /><span className="academy-highlight"><span>MASTERCLASSES.</span></span></h1>
            <p className="academy-intro">Free, full-length masterclasses from the EternaVentures<br className="academy-desktop-break" /> strategy team. Watch in HD and put the playbooks to work.</p>
            <a className="academy-button academy-button-neon" href="#catalog">BROWSE MASTERCLASSES <ArrowRight aria-hidden="true" /></a>
          </div>
          <span className="academy-free">FREE TO<br />WATCH</span>
          <span className="academy-edition">ETERNA ACADEMY / 01</span>
        </div>
      </section>
      <section id="catalog" className="academy-catalog" aria-labelledby="catalog-title">
        <div className="academy-container">
          <div className="academy-catalog-heading">
            <h2 id="catalog-title">EXPLORE THE <span className="academy-highlight academy-highlight-inverse"><span>MASTERCLASSES.</span></span></h2>
            <p>Three practical courses across<br /> brand, paid growth, and design.</p>
          </div>
          <div className="academy-toolbar">
            <div className="academy-filters" aria-label="Filter masterclasses by category">{FILTERS.map(category => <button key={category} type="button" aria-pressed={category === filter} className={category === filter ? 'is-active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
            <label className="academy-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search masterclasses</span><input type="search" placeholder="Search masterclasses..." value={query} onChange={event => setQuery(event.target.value)} /></label>
          </div>
          <div className="academy-grid" aria-live="polite">
            {visibleCourses.map(course => <article className="academy-card" key={course.id} data-studio-key={course.slug} data-studio-library="/admin/courses">
              <Link className="academy-card-image" to={`/courses/${course.slug}`} aria-label={`Watch ${course.title}`}>
                <img src={course.image_url} alt={course.category === 'BRAND STRATEGY' ? 'Brand strategy playbook and identity sketches on a desk' : course.category === 'PAID GROWTH' ? 'Blue performance marketing analytics charts' : 'Laptop and phone showing website wireframes'} loading="lazy" />
                <span className="academy-category">{course.category}</span><span className="academy-play"><Play fill="currentColor" size={19} aria-hidden="true" /></span><span className="academy-duration"><Clock size={14} aria-hidden="true" />{course.duration}</span>
              </Link>
              <div className="academy-card-content"><p className="academy-meta">{course.meta}</p><h3><Link to={`/courses/${course.slug}`}>{course.title}</Link></h3><p className="academy-description">{course.description}</p><div className="academy-card-footer"><span className="academy-stream"><Youtube size={19} aria-hidden="true" /> YOUTUBE HD STREAM</span><Link className="academy-button academy-watch" to={`/courses/${course.slug}`}>WATCH NOW <ArrowRight size={17} aria-hidden="true" /></Link></div></div>
            </article>)}
          </div>
          {visibleCourses.length === 0 && <div className="academy-empty"><h3>No masterclasses found.</h3><p>Try another search or category.</p><button onClick={() => { setQuery(''); setFilter('ALL'); }}>Show all masterclasses <ArrowRight size={18} /></button></div>}
        </div>
      </section>
      <section className="academy-benefits" aria-labelledby="benefits-title"><div className="academy-container"><h2 id="benefits-title">BUILT TO BE <span className="academy-highlight"><span>PUT TO WORK.</span></span></h2><div className="academy-benefit-grid">{benefits.map(({ icon: Icon, title, text }) => <div className="academy-benefit" key={title}><Icon size={36} strokeWidth={1.7} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
      <section className="academy-bottom-cta"><div className="academy-container"><h2>PICK A COURSE. PRESS PLAY.</h2><a className="academy-button" href="#catalog">BROWSE MASTERCLASSES <ArrowUpRight aria-hidden="true" /></a></div></section>
    </div>
  );
}
