import { useEffect, useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReferenceArtwork from '../components/ReferenceArtwork';
import { ABOUT_DEFAULTS, ABOUT_DISCIPLINES, resolveAboutContent } from '../data/about';
import './AboutPage.css';

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
  const statements = content.what_we_believe_text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  return <div className="about-studio-page">
    <section className="about-studio-hero" aria-labelledby="about-studio-title"><div className="about-container">
      <div className="about-studio-intro"><div className="about-studio-copy"><p className="about-studio-eyebrow">STUDIO NOTES / JAIPUR, INDIA <span aria-hidden="true" /></p><h1 id="about-studio-title">{standardTitle ? <>WE DESIGN HOW<br />BRANDS ARE<br /><span className="about-studio-highlight"><span>UNDERSTOOD.</span></span></> : <>{titleWords.slice(0, -1).join(' ')}<br /><span className="about-studio-highlight"><span>{titleWords.at(-1)}</span></span></>}</h1><p className="about-studio-introduction">{content.banner_subheading}</p></div>
      <ReferenceArtwork className="about-studio-art" src="/images/about-studio-reference.png" sourceWidth={1402} sourceHeight={1122} x={670} y={80} width={720} height={526} priority alt="Hands studying letterform sketches with lime studio notes and a monochrome film strip" />
      </div>
      <div className="about-studio-stats" aria-label="Studio results">{[1, 2, 3, 4].map(index => <div key={index}><strong>{content[`trust_stat${index}_value`]}</strong><span>{content[`trust_stat${index}_label`]}</span></div>)}</div>
    </div></section>
    <section className="about-studio-beliefs" aria-labelledby="about-beliefs-title"><div className="about-container about-beliefs-grid"><div className="about-beliefs-context"><p className="about-section-index">01 / {content.who_we_are_heading}<span aria-hidden="true" /></p><p className="about-section-index">02 / {content.what_we_believe_heading}<span aria-hidden="true" /></p><p className="about-beliefs-summary">{content.who_we_are_text}</p></div><h2 id="about-beliefs-title" className="about-belief-statement">{statements.map((statement, index) => <span className={index === statements.length - 1 ? 'about-studio-acid' : ''} key={`${index}-${statement}`}>{statement}</span>)}</h2></div></section>
    <section className="about-studio-approach" aria-labelledby="about-approach-title"><div className="about-container"><p className="about-section-label">03 / {content.our_approach_heading}</p><h2 id="about-approach-title">FOUR DISCIPLINES. <span className="about-studio-highlight"><span>ONE DIRECTION.</span></span></h2><p className="about-approach-description">{content.our_approach_text}</p><ol className="about-disciplines">{ABOUT_DISCIPLINES.map((discipline, index) => <li key={discipline.name}><span className="about-discipline-number">{String(index + 1).padStart(2, '0')}</span><h3>{discipline.name}</h3><p>{discipline.description}</p></li>)}</ol></div></section>
    <section className="about-studio-clarity" aria-labelledby="about-clarity-title"><div className="about-container about-clarity-grid"><div><span className="about-short-rule" aria-hidden="true" /><h2 id="about-clarity-title">CLARITY<br />BEFORE<br />SCALE.</h2><h3 className="about-why-label">{content.why_eterna_heading}</h3><p>{content.why_eterna_text}</p></div><div className="about-clarity-details"><div><span className="about-short-rule" aria-hidden="true" /><h3>{content.who_we_work_with_heading}</h3><p>{content.who_we_work_with_text}</p></div><div><span className="about-short-rule" aria-hidden="true" /><h3>{content.our_role_heading}</h3><p>{content.our_role_text}</p></div></div></div></section>
    <section className="about-studio-mission" aria-labelledby="about-mission-title"><div className="about-container"><h2 id="about-mission-title">{content.cta_heading}</h2><p>{content.cta_subheading}</p><div className="about-mission-actions"><Link to={content.btn_link || '/contact'}>{content.cta_btn_text}<ArrowRight size={22} aria-hidden="true" /></Link><a className="about-mission-email" href={`mailto:${content.cta_email}`}><Mail size={22} aria-hidden="true" />{content.cta_email}</a></div></div></section>
  </div>;
}
