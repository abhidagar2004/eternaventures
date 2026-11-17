import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DEFAULT_INSIGHTS, INSIGHT_PRESENTATION, INSIGHTS_PAGE_DEFAULTS, insightCategories, insightExcerpt, insightImage, plainText, selectInsights, type Insight } from '../data/insights';
import './BlogsPage.css';

const FILTERS = ['All', 'AI & Search', 'Social Media', 'Brand Strategy', 'Marketing Trends'];
const timestamp = (value: string) => { const result = Date.parse(value); return Number.isFinite(result) ? result : 0; };
function articleDate(value: string) { return timestamp(value) ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(value)) : ''; }
function readTime(blog: Insight) { return INSIGHT_PRESENTATION[blog.slug] ? '5 min read' : `${Math.max(1, Math.ceil(plainText(blog.content || '').split(/\s+/).filter(Boolean).length / 200))} min read`; }
function Heading({ text }: { text: string }) { const words = plainText(text).split(/\s+/); return <>{words.slice(0, -1).join(' ')} <span className="insights-highlight insights-highlight-inverse"><span>{words.at(-1)}</span></span></>; }
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Insight[]>(DEFAULT_INSIGHTS);
  const [content, setContent] = useState(INSIGHTS_PAGE_DEFAULTS);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await Promise.allSettled([
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        supabase.from('blogs_page_content').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (cancelled) return;
      const [articles, page] = results;
      if (articles.status === 'fulfilled' && !articles.value.error && articles.value.data) { setBlogs(articles.value.data); setLoadError(false); } else setLoadError(true);
      if (page.status === 'fulfilled' && page.value.data) {
        const next = { ...INSIGHTS_PAGE_DEFAULTS };
        const legacy: Record<string, string> = { main_header_heading: 'OUR LATEST INSIGHTS', subtext_content: "We're relentlessly focused on one thing: growing your brand through relevance. hello hi", cta_subheading: 'Stop guessing with your marketing budget. Partner with us to build a scalable, predictable revenue system.' };
        for (const key of Object.keys(next)) {
          const raw = page.value.data[key];
          if (typeof raw !== 'string' || !raw.trim()) continue;
          const value = plainText(raw);
          if (legacy[key] && value === legacy[key]) continue;
          next[key] = value;
        }
        setContent(next);
      }
      setLoading(false);
    }
    load().catch(error => { console.error('Unable to load insights', error); if (!cancelled) { setLoadError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);
  const publicBlogs = blogs.filter(blog => blog.visibility !== 'hidden');
  const categories = [...FILTERS, ...Array.from(new Set(publicBlogs.flatMap(insightCategories))).filter(tag => !FILTERS.some(filter => filter.toLowerCase() === tag.toLowerCase()))];
  const filtered = selectInsights(blogs, category, query, sortBy);
  const heroWords = content.banner_heading.split(/\s+/);
  const defaultHero = /^the growth hub\.?$/i.test(content.banner_heading);
  return <div className="insights-page">
    <section className="insights-hero" aria-labelledby="insights-title"><img src="/images/insights-hero-hd.jpg" alt="Sculptural rolls of cream, black and lime editorial newsprint" className="insights-hero-art" fetchPriority="high" /><div className="insights-container insights-hero-content"><div><p className="insights-eyebrow">{content.banner_badge}</p><h1 id="insights-title">{defaultHero ? 'THE GROWTH' : heroWords.slice(0, -1).join(' ')}<br /><span className="insights-highlight"><span>{defaultHero ? 'HUB.' : heroWords.at(-1)}</span></span></h1><p className="insights-intro">{content.banner_subheading}</p><a className="insights-explore" href="#latest-insights">Explore Articles <ArrowDown size={19} aria-hidden="true" /></a></div></div></section>
    <section className="insights-latest" id="latest-insights" aria-labelledby="latest-insights-title"><div className="insights-container"><h2 id="latest-insights-title"><Heading text={content.main_header_heading} /></h2><p className="insights-section-intro">{content.subtext_content}</p><div className="insights-toolbar"><div className="insights-filters" aria-label="Filter articles by topic">{categories.map(tag => <button type="button" key={tag} aria-pressed={tag === category} onClick={() => setCategory(tag)}>{tag}</button>)}</div><div className="insights-tools"><label className="insights-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search articles</span><input type="search" placeholder="Search articles..." value={query} onChange={event => setQuery(event.target.value)} /></label><label className="insights-sort"><span className="sr-only">Sort articles</span><select value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="Newest">Sort: Newest</option><option value="Oldest">Sort: Oldest</option></select><ChevronDown size={18} aria-hidden="true" /></label></div></div>
      {loadError && <p className="insights-load-note" role="status">Showing recent articles while the latest updates are unavailable.</p>}
      <div className="insights-grid" aria-live="polite" aria-busy={loading}>{filtered.map(blog => <article className="insight-card" key={blog.id} data-studio-key={blog.id} data-studio-library="/admin/blogs"><Link className="insight-card-image" to={`/blogs/${blog.slug}`} aria-label={`Read ${blog.title}`}>{insightImage(blog) ? <img src={insightImage(blog)} alt={blog.title} loading="lazy" /> : <span className="insight-image-placeholder">ETERNA / INSIGHTS</span>}</Link><div className="insight-meta"><span>{insightCategories(blog)[0]}</span><span>{articleDate(blog.created_at)}</span><span>{readTime(blog)}</span></div><h3><Link to={`/blogs/${blog.slug}`}>{blog.title}</Link></h3><p className="insight-excerpt">{insightExcerpt(blog)}</p><Link className="insight-read" to={`/blogs/${blog.slug}`}>Read Article <ArrowUpRight size={20} aria-hidden="true" /></Link></article>)}</div>
      {!filtered.length && <div className="insights-empty"><h3>No articles found.</h3><p>Try another topic or search.</p><button type="button" onClick={() => { setCategory('All'); setQuery(''); }}>Show all articles</button></div>}
      <div className="insights-growth-cta"><h2>{content.cta_heading}</h2><p>{content.cta_subheading}</p><Link to="/projects"><span>{content.cta_btn_text}</span><ArrowUpRight size={21} aria-hidden="true" /></Link></div>
    </div></section>
  </div>;
}
