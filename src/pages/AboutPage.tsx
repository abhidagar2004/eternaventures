import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ABOUT_DEFAULTS, ABOUT_DISCIPLINES, resolveAboutContent } from '../data/about';
import './AboutPage.css';

const disciplineImages = ['/images/about-branding-hd.jpg', '/images/about-content-hd.jpg', '/images/about-performance-hd.jpg', '/images/about-experience-hd.jpg'];
export default function AboutPage() {
  const [content, setContent] = useState(ABOUT_DEFAULTS);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase.from('about_page_content').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (!cancelled && !error && data) setContent(resolveAboutContent(data));
    }
    load().catch(error => console.error('Unable to load about page', error));
    return () => { cancelled = true; };
  }, []);
  const standardTitle = /^we design how brands are understood\.?$/i.test(content.banner_heading);
  const titleWords = content.banner_heading.split(/\s+/);
  return <div className="about-studio-page">
    <section className="about-studio-hero" aria-labelledby="about-studio-title"><div className="about-container about-studio-intro"><div className="about-studio-copy"><p className="about-studio-eyebrow">STUDIO NOTES / JAIPUR, INDIA <span aria-hidden="true" /></p><h1 id="about-studio-title">{standardTitle ? <>WE DESIGN HOW<br />BRANDS ARE<br /><span className="about-studio-highlight"><span>UNDERSTOOD.</span></span></> : <>{titleWords.slice(0, -1).join(' ')}<br /><span className="about-studio-highlight"><span>{titleWords.at(-1)}</span></span></>}</h1><p className="about-studio-introduction">{content.banner_subheading}</p></div><img className="about-studio-art" src="/images/about-hero-hd.jpg" alt="Studio collage of letterform sketches, ringed hands, a lime registration sheet and photographic film" fetchPriority="high" /></div></section>
    <section className="about-stats-wrap" aria-label="Studio results"><div className="about-container about-studio-stats">{[1, 2, 3, 4].map(index => <div key={index}><strong>{content[`trust_stat${index}_value`]}</strong><span>{content[`trust_stat${index}_label`]}</span></div>)}</div></section>
    <section className="about-position" aria-labelledby="about-position-title"><img className="about-position-art" src="/images/about-position-hd.jpg" alt="Sunlit typography studio with letterform drawings, film contact sheets and photographic prints" loading="lazy" /><div className="about-container"><div className="about-position-card"><p className="about-section-eyebrow">01 / {content.who_we_are_heading}<span aria-hidden="true" /></p><h2 id="about-position-title">A CLEAR<br />POSITION<br />CHANGES<br />EVERYTHING.</h2><p>{content.who_we_are_text}</p></div></div></section>
    <section className="about-belief-flow" aria-labelledby="about-belief-title"><div className="about-container"><p className="about-section-eyebrow">02 / {content.what_we_believe_heading}<span aria-hidden="true" /></p><h2 id="about-belief-title" className="about-belief-steps"><span>PERCEPTION</span><ArrowRight aria-hidden="true" /><span>ATTENTION</span><ArrowRight aria-hidden="true" /><span>TRUST</span></h2><p className="about-growth-statement"><span>TRUST DRIVES GROWTH.</span></p><p className="about-belief-note">Every touchpoint sends a signal.</p></div></section>
    <section className="about-disciplines-section" aria-labelledby="about-disciplines-title"><div className="about-container"><p className="about-section-eyebrow">03 / {content.our_approach_heading}<span aria-hidden="true" /></p><h2 id="about-disciplines-title">FOUR DISCIPLINES. ONE DIRECTION.</h2><div className="about-discipline-grid">{ABOUT_DISCIPLINES.map((discipline, index) => <article className="about-discipline-card" key={discipline.name}><img src={disciplineImages[index]} alt={`${discipline.name} practice at EternaVentures`} loading="lazy" /><div className="about-discipline-copy"><span className="about-discipline-number">{String(index + 1).padStart(2, '0')}</span><h3>{discipline.name}</h3><p>{discipline.description}</p></div></article>)}</div></div></section>
    <section className="about-studio-clarity" aria-labelledby="about-clarity-title"><div className="about-container about-clarity-grid"><div><p className="about-section-eyebrow">{content.why_eterna_heading}<span aria-hidden="true" /></p><h2 id="about-clarity-title">CLARITY<br />BEFORE<br />SCALE.</h2><p className="about-clarity-description">{content.why_eterna_text}</p></div><div className="about-clarity-details"><div><h3>{content.who_we_work_with_heading}</h3><p>{content.who_we_work_with_text}</p></div><div><h3>{content.our_role_heading}</h3><p>{content.our_role_text}</p></div></div></div></section>
    <section className="about-studio-mission" aria-labelledby="about-mission-title"><div className="about-container"><h2 id="about-mission-title">{content.cta_heading}</h2><div className="about-mission-copy"><p>{content.cta_subheading}</p><div className="about-mission-actions"><Link to={content.btn_link || '/contact'}>{content.cta_btn_text}<ArrowUpRight size={21} aria-hidden="true" /></Link><a className="about-mission-email" href={`mailto:${content.cta_email}`}>{content.cta_email}</a></div></div></div></section>
  </div>;
}
