import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReferenceArtwork from '../components/ReferenceArtwork';
import HeroButton from '../components/HeroButton';
import ProjectDialog from '../components/ProjectDialog';
import { DEFAULT_PROJECTS, DEFAULT_PROJECT_REVIEWS, LOCAL_PROJECT_IMAGES, PROJECT_PAGE_DEFAULTS, type Project, type ProjectReview } from '../data/projects';
import './ProjectsPage.css';

const FILTERS = ['All', 'Packaging Design', 'Website Design', 'Digital Marketing'];
const normalize = (value: string) => value.trim().toLowerCase();
const projectOrder = (project: Project) => { const title = normalize(project.title); const position = ['valia', 'amrita', 'digital marketing', 'fire in the disco', 'classic espresso'].findIndex(prefix => title.startsWith(prefix)); return position < 0 ? 5 : position; };
const reviewOrder = (review: ProjectReview) => { const position = DEFAULT_PROJECT_REVIEWS.findIndex(item => item.id === review.id); return position < 0 ? DEFAULT_PROJECT_REVIEWS.length : position; };
function Heading({ text, highlightWords = 1, inverse = false }: { text: string; highlightWords?: number; inverse?: boolean }) {
  const words = text.trim().split(/\s+/);
  const splitAt = Math.max(0, words.length - highlightWords);
  return <>{words.slice(0, splitAt).join(' ')}{' '}<span className={`project-highlight${inverse ? ' project-highlight-inverse' : ''}`}><span>{words.slice(splitAt).join(' ')}</span></span></>;
}
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [reviews, setReviews] = useState<ProjectReview[]>(DEFAULT_PROJECT_REVIEWS);
  const [content, setContent] = useState(PROJECT_PAGE_DEFAULTS);
  const [filter, setFilter] = useState('All');
  const [reviewStart, setReviewStart] = useState(0);
  const [selected, setSelected] = useState<{ project: Project; brochure: boolean } | null>(null);
  const [formSettings, setFormSettings] = useState<{ brochure_form_title?: string; brochure_form_btn_text?: string }>({});
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await Promise.allSettled([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('projects_page_content').select('*').limit(1).maybeSingle(),
        supabase.from('testimonials').select('*').order('created_at', { ascending: true }),
        supabase.from('contact_page_content').select('brochure_form_title,brochure_form_btn_text').limit(1).maybeSingle(),
      ]);
      if (cancelled) return;
      const [projectResult, pageResult, reviewResult, settingsResult] = results;
      if (projectResult.status === 'fulfilled' && !projectResult.value.error && projectResult.value.data) setProjects(projectResult.value.data.map(project => ({ ...project, category_names: Array.isArray(project.category_names) ? project.category_names : [] })));
      if (pageResult.status === 'fulfilled' && pageResult.value.data) {
        const data: Record<string, string> = {};
        for (const [key, value] of Object.entries(pageResult.value.data)) { if (typeof value === 'string' && value.trim()) data[key] = value.trim(); }
        setContent({ ...PROJECT_PAGE_DEFAULTS, ...data });
      }
      if (reviewResult.status === 'fulfilled' && !reviewResult.value.error && reviewResult.value.data) setReviews([...reviewResult.value.data].sort((a, b) => reviewOrder(a) - reviewOrder(b)));
      if (settingsResult.status === 'fulfilled' && settingsResult.value.data) setFormSettings(settingsResult.value.data);
    }
    load().catch(error => console.error('Unable to load projects page', error));
    return () => { cancelled = true; };
  }, []);
  const categories = [...FILTERS, ...Array.from(new Set(projects.flatMap(project => project.category_names))).filter(category => !FILTERS.some(filterName => normalize(filterName) === normalize(category)))];
  const visible = [...projects].sort((a, b) => projectOrder(a) - projectOrder(b)).filter(project => filter === 'All' || project.category_names.some(category => normalize(category) === normalize(filter)));
  const heroTitle = /^our work\s*$/i.test(content.banner_heading) ? PROJECT_PAGE_DEFAULTS.banner_heading : content.banner_heading;
  const heroWords = heroTitle.split(/\s+/);
  const heroSplit = Math.max(1, heroWords.length - 2);
  const intro = /^explore how we/i.test(content.banner_subheading) ? PROJECT_PAGE_DEFAULTS.banner_subheading : content.banner_subheading;
  const visibleReviews = Array.from({ length: Math.min(3, reviews.length) }, (_, index) => reviews[(reviewStart + index) % reviews.length]);
  return <div className="projects-page">
    <section className="projects-hero" aria-labelledby="projects-title">
      <div className="projects-hero-visual"><ReferenceArtwork className="projects-hero-art" src="/images/projects-reference.png" sourceWidth={767} sourceHeight={2051} x={394} y={43} width={373} height={356} priority alt="Three charcoal sculptural panels crossed by a bright lime plane" /></div>
      <div className="project-container projects-hero-content"><div><p className="projects-eyebrow">SELECTED WORK / ETERNAVENTURES</p><h1 id="projects-title">{heroWords.slice(0, heroSplit).join(' ')}<br /><span className="project-highlight"><span>{heroWords.slice(heroSplit).join(' ')}</span></span></h1><p className="projects-intro">{intro}</p><HeroButton href="#featured-projects">EXPLORE PROJECTS</HeroButton></div></div>
    </section>
    <section className="projects-stats" aria-label="Agency results"><div className="project-container">{[1, 2, 3, 4].map(index => <div key={index}><strong>{content[`numbers_stat${index}_value`]}</strong><span>{content[`numbers_stat${index}_label`]}</span></div>)}</div></section>
    <section className="projects-catalog" id="featured-projects" aria-labelledby="featured-title"><div className="project-container"><div className="projects-section-heading"><h2 id="featured-title"><Heading text={content.our_work_heading} inverse /></h2><Link to="/contact">{content.our_work_cta_text} <ArrowUpRight size={20} aria-hidden="true" /></Link></div><div className="projects-filters" aria-label="Filter projects by category">{categories.map(category => <button type="button" key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <div className="projects-grid" aria-live="polite">{visible.map((project, index) => <article className={`project-card${(filter === 'All' && index < 2) || visible.length <= 2 ? ' project-card-featured' : ''}`} key={project.id}><button type="button" className="project-card-image" onClick={() => setSelected({ project, brochure: false })} aria-label={`Explore ${project.title}`}><img src={project.image_url || undefined} onError={event => { const fallback = LOCAL_PROJECT_IMAGES[project.image_url]; if (fallback && event.currentTarget.getAttribute('src') !== fallback) event.currentTarget.src = fallback; }} alt={project.title} loading="lazy" /><span className="project-category">{project.category_names[0] || 'SELECTED WORK'}</span></button><div className="project-card-body"><h3><button type="button" onClick={() => setSelected({ project, brochure: false })}>{project.title}</button></h3><p>{project.description}</p><button type="button" className={`project-card-action${project.brochure_url ? ' project-download' : ''}`} onClick={() => setSelected({ project, brochure: !!project.brochure_url })}>{project.brochure_url ? <><Download size={18} aria-hidden="true" />{project.brochure_btn_text || 'DOWNLOAD BROCHURE'}</> : <>EXPLORE PROJECT <ArrowUpRight size={19} aria-hidden="true" /></>}</button></div></article>)}</div>
      {visible.length === 0 && <div className="projects-empty"><h3>No projects in this category yet.</h3><button onClick={() => setFilter('All')}>View all projects <ArrowRight size={18} /></button></div>}
    </div></section>
    {reviews.length > 0 && <section className="projects-reviews" aria-labelledby="reviews-title"><div className="project-container"><p className="projects-review-eyebrow"><span />{content.reviews_tag}</p><div className="projects-review-heading"><h2 id="reviews-title"><Heading text={content.reviews_heading} highlightWords={3} /></h2>{reviews.length > 3 && <div className="projects-review-controls"><button type="button" aria-label="Previous testimonials" onClick={() => setReviewStart(previous => (previous - 1 + reviews.length) % reviews.length)}><ArrowLeft size={20} /></button><button type="button" aria-label="Next testimonials" onClick={() => setReviewStart(previous => (previous + 1) % reviews.length)}><ArrowRight size={20} /></button></div>}</div><div className="projects-review-grid" aria-live="polite">{visibleReviews.map(review => <figure className="project-review" key={review.id}><div className="project-review-stars" aria-label={`${Math.max(0, Math.min(5, review.rating || 5))} out of 5 stars`}>{Array.from({ length: Math.max(0, Math.min(5, review.rating || 5)) }, (_, index) => <Star key={index} size={20} fill="currentColor" aria-hidden="true" />)}</div><blockquote>“{review.content}”</blockquote><figcaption>{review.image_url && <img src={review.image_url} alt="" loading="lazy" />}<div><strong>{review.name}</strong><span>{review.role}</span></div></figcaption></figure>)}</div></div></section>}
    <section className="projects-cta"><div className="project-container"><h2>{content.cta_heading}</h2><div><p>{content.cta_subheading}</p><Link to="/contact">{content.cta_btn_text.replace(/\s*[→↗]\s*$/, '')} <ArrowUpRight size={21} aria-hidden="true" /></Link></div></div></section>
    {selected && <ProjectDialog key={`${selected.project.id}-${selected.brochure}`} project={selected.project} requestBrochure={selected.brochure} settings={formSettings} onClose={() => setSelected(null)} />}
  </div>;
}
