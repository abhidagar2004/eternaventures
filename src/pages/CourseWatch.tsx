import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, CheckCircle2, Share2, Youtube, ChevronLeft, CheckCircle, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { DEFAULT_COURSE_METADATA, DEFAULT_LESSONS, type CourseData, type Lesson } from '../data/courseContent';
import './CourseWatch.css';

type Tab = 'overview' | 'notes' | 'resources';
const courseExtras: Record<string, { takeaways: string[]; template: string; label: string }> = {
  'brand-scaling-modern-authority': { takeaways: ['Define the audience and category your brand can own.', 'Connect positioning, messaging, and visual identity across every touchpoint.', 'Choose measurable signs of authority before planning a launch.'], template: 'brand-positioning-worksheet.md', label: 'Brand positioning worksheet' },
  'performance-marketing-media-buying': { takeaways: ['Connect creative testing to a clear acquisition goal.', 'Review acquisition cost alongside margin and customer value.', 'Document each hypothesis before increasing spend.'], template: 'paid-growth-planning-worksheet.md', label: 'Paid growth planning worksheet' },
  'digital-experience-conversion-ux': { takeaways: ['Make the primary action clear on every screen.', 'Review the complete journey on mobile.', 'Prioritize friction by its effect on conversion and customer confidence.'], template: 'conversion-ux-audit.md', label: 'Conversion UX audit worksheet' },
};
function readProgress(slug: string): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(`eterna-course-progress:${slug}`) || '[]'); return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []; } catch { return []; }
}
function CoursePlayer({ slug }: { slug: string }) {
  const fallback = DEFAULT_COURSE_METADATA[slug];
  const [course, setCourse] = useState<CourseData | null>(fallback || null);
  const [lessons, setLessons] = useState<Lesson[]>(DEFAULT_LESSONS[slug] || []);
  const [loading, setLoading] = useState(!fallback);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>(() => readProgress(slug));
  const [tab, setTab] = useState<Tab>('overview');
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await supabase.from('courses').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
        if (cancelled || !data) return;
        setCourse({ ...fallback, ...data });
        const { data: items } = await supabase.from('course_lessons').select('*').eq('course_id', data.id).order('order_index', { ascending: true });
        if (!cancelled && items?.length) { setLessons(items); setActiveIndex(0); setPlaying(false); }
      } catch (error) { console.error('Unable to load course', error); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [slug, fallback]);
  useEffect(() => { try { localStorage.setItem(`eterna-course-progress:${slug}`, JSON.stringify(completed)); } catch { /* Progress still works for this session. */ } }, [slug, completed]);
  const active = lessons[activeIndex];
  const totalCompleted = lessons.filter(lesson => completed.includes(lesson.id)).length;
  const videoId = active?.youtube_video_id?.trim();
  const validVideo = !!videoId && /^[\w-]{11}$/.test(videoId);
  const youtubeUrl = validVideo ? `https://www.youtube.com/watch?v=${videoId}` : course?.youtube_playlist_id ? `https://www.youtube.com/playlist?list=${encodeURIComponent(course.youtube_playlist_id)}` : null;
  const selectLesson = (index: number) => { setActiveIndex(index); setPlaying(false); };
  const toggleCompleted = () => { if (active) setCompleted(previous => previous.includes(active.id) ? previous.filter(id => id !== active.id) : [...previous, active.id]); };
  const nextLesson = () => { if (active && activeIndex < lessons.length - 1) { setCompleted(previous => previous.includes(active.id) ? previous : [...previous, active.id]); selectLesson(activeIndex + 1); } };
  const share = async () => { try { if (navigator.share) await navigator.share({ title: course?.title || 'Eterna masterclass', url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); toast.success('Course link copied'); } } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) toast.error('Unable to share. Copy the page link from your browser.'); } };
  if (loading) return <div className="watch-status" role="status">Loading masterclass…</div>;
  if (!course) return <div className="watch-status"><h1>Masterclass not found.</h1><Link to="/courses">Browse all masterclasses <ArrowRight size={18} /></Link></div>;
  const words = course.title.split(' ');
  const splitAt = slug === 'brand-scaling-modern-authority' ? 4 : Math.ceil(words.length / 2);
  const extra = courseExtras[slug];
  const poster = slug === 'brand-scaling-modern-authority' ? '/images/academy-workbook.png' : course.thumbnail_url || fallback?.thumbnail_url || '/images/academy-workbook.png';
  return <div className="course-watch">
    <div className="watch-breadcrumb"><div className="watch-container"><div><Link to="/courses"><ArrowLeft size={18} /> ALL MASTERCLASSES</Link><span>/</span><span>{course.category}</span></div><div className="watch-top-actions"><button onClick={share} aria-label="Share masterclass"><Share2 size={19} /></button>{youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"><Youtube size={18} /> <span>Watch on YouTube</span> <ArrowUpRight size={16} /></a>}</div></div></div>
    <header className="watch-heading"><div className="watch-container"><p className="watch-eyebrow">ETERNA ACADEMY <span>/</span> <strong>{course.category}</strong></p><h1>{words.slice(0, splitAt).join(' ')}<br /><span className="watch-highlight"><span>{words.slice(splitAt).join(' ')}</span></span></h1><p className="watch-course-meta">{lessons.length || course.lessons_count} MODULES <span>·</span> {course.level}</p></div></header>
    <section className="watch-content" aria-label="Course player and curriculum"><div className="watch-container watch-layout">
      <div className="watch-main"><div className="watch-player">{playing && validVideo ? <iframe key={videoId} src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`} title={active?.title || course.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <><img className="watch-poster-art" src={poster} alt="Eterna Academy course workbook" /><div className="watch-poster-shade" /><div className="watch-poster-copy"><p>MODULE {String(activeIndex + 1).padStart(2, '0')}</p><h2>{active?.title.replace(/^\d+\s*[:.]\s*/, '') || course.title}</h2>{validVideo ? <button className="watch-poster-button" onClick={() => setPlaying(true)}><Play size={18} fill="currentColor" /> PLAY LESSON</button> : <p className="watch-unavailable">{youtubeUrl ? 'Video unavailable here.' : 'Lesson video coming soon.'}</p>}{youtubeUrl && <a className="watch-poster-button" href={youtubeUrl} target="_blank" rel="noopener noreferrer">WATCH ON YOUTUBE <ArrowUpRight size={18} /></a>}<span className="watch-poster-signature">ETERNA ACADEMY</span></div></>}</div>{playing && youtubeUrl && <a className="watch-player-help" href={youtubeUrl} target="_blank" rel="noopener noreferrer">Having trouble playing? Watch on YouTube <ArrowUpRight size={15} /></a>}
      {active && <div className="watch-lesson-actions"><div><p>MODULE {String(activeIndex + 1).padStart(2, '0')} OF {String(lessons.length).padStart(2, '0')} <span>·</span> {active.duration}</p><h2>{active.title}</h2></div><div className="watch-navigation"><button disabled={activeIndex === 0} onClick={() => selectLesson(activeIndex - 1)}><ChevronLeft size={16} /><span>PREVIOUS</span></button><button className="watch-complete" aria-pressed={completed.includes(active.id)} onClick={toggleCompleted}><CheckCircle2 size={17} />{completed.includes(active.id) ? 'COMPLETED' : 'MARK COMPLETE'}</button><button className="watch-next" disabled={activeIndex === lessons.length - 1} onClick={nextLesson}>NEXT MODULE <ArrowRight size={17} /></button></div></div>}
      <div className="watch-details"><div className="watch-tabs" role="tablist" aria-label="Lesson details">{([['overview', 'LESSON OVERVIEW'], ['notes', 'KEY TAKEAWAYS'], ['resources', 'ACTION TEMPLATES']] as const).map(([id, label]) => <button key={id} role="tab" id={`watch-tab-${id}`} aria-selected={tab === id} aria-controls={`watch-panel-${id}`} tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)} onKeyDown={event => { const tabs: Tab[] = ['overview', 'notes', 'resources']; const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0; if (offset) { event.preventDefault(); const next = tabs[(tabs.indexOf(id) + offset + 3) % 3]; setTab(next); document.getElementById(`watch-tab-${next}`)?.focus(); } }}>{label}</button>)}</div><div className="watch-tab-panel" role="tabpanel" id={`watch-panel-${tab}`} aria-labelledby={`watch-tab-${tab}`}>
        {tab === 'overview' && <p>{active?.description || course.description}</p>}
        {tab === 'notes' && (extra ? <ul>{extra.takeaways.map(text => <li key={text}><CheckCircle size={20} /><span>{text}</span></li>)}</ul> : <p>Use the lesson overview to record your main takeaways and next steps.</p>)}
        {tab === 'resources' && (extra ? <a className="watch-template" href={`/resources/${extra.template}`} download><span>{extra.label}<small>Markdown worksheet · editable in any text editor</small></span><Download size={22} /></a> : <p>Course templates will appear here when they are available.</p>)}
      </div></div></div>
      <aside className="watch-curriculum" aria-labelledby="curriculum-title"><div className="watch-curriculum-heading"><div><h2 id="curriculum-title">COURSE MODULES</h2><span>{totalCompleted} OF {lessons.length} COMPLETE</span></div><div role="progressbar" aria-label="Course completion" aria-valuemin={0} aria-valuemax={lessons.length || 1} aria-valuenow={totalCompleted} className="watch-progress"><span style={{ width: `${lessons.length ? totalCompleted / lessons.length * 100 : 0}%` }} /></div></div><ol>{lessons.map((lesson, index) => <li key={lesson.id}><button onClick={() => selectLesson(index)} aria-current={activeIndex === index ? 'step' : undefined} className={activeIndex === index ? 'is-active' : ''}><span className="watch-module-number">{completed.includes(lesson.id) ? <CheckCircle2 size={21} /> : activeIndex === index ? <Play size={16} fill="currentColor" /> : index + 1}</span><span className="watch-module-title">{lesson.title}</span><span className="watch-module-duration">{lesson.duration}</span></button></li>)}</ol>{lessons.length === 0 && <p className="watch-no-lessons">Course modules will be available soon.</p>}<div className="watch-curriculum-footer"><span><Youtube size={19} /> YouTube Official Embed</span><strong>1080p HD</strong></div></aside>
    </div></section>
    <section className="watch-brand-cta"><div className="watch-container"><div><h2>NEED CUSTOM EXECUTION FOR YOUR BRAND?</h2><p>Our strategy team executes these systems directly for high-growth partners.</p></div><Link to="/contact">BOOK A STRATEGY CALL <ArrowRight size={21} /></Link></div></section>
  </div>;
}
export default function CourseWatch() { const { slug = 'brand-scaling-modern-authority' } = useParams<{ slug: string }>(); return <CoursePlayer key={slug} slug={slug} />; }
