import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Download, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LOCAL_PROJECT_IMAGES, type Project } from '../data/projects';

interface BrochureSettings { brochure_form_title?: string; brochure_form_btn_text?: string; }
export default function ProjectDialog({ project, requestBrochure, settings, onClose }: { project: Project; requestBrochure: boolean; settings: BrochureSettings; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => { element?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    const values = new FormData(event.currentTarget);
    const phone = String(values.get('phone') || '').replace(/\D/g, '');
    if (phone.length < 6) {
      setError('Please enter a valid contact number.');
      setSubmitting(false);
      return;
    }
    try {
      const { error: submissionError } = await supabase.from('leads').insert([{
        name: String(values.get('name') || '').trim(), email: String(values.get('email') || '').trim(), phone, country_code: String(values.get('country_code') || '+91'), message: String(values.get('message') || '').trim() || `Brochure request for ${project.title}`, project_title: project.title,
      }]);
      if (submissionError) throw submissionError;
      setSubmitted(true);
    } catch { setError('We couldn’t submit your request. Please try again.'); }
    finally { setSubmitting(false); }
  }
  return <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="project-dialog-content"><button type="button" className="project-dialog-close" onClick={onClose} aria-label="Close project"><X size={23} /></button>
      <img className="project-dialog-image" src={project.image_url || undefined} onError={event => { const fallback = LOCAL_PROJECT_IMAGES[project.image_url]; if (fallback && event.currentTarget.getAttribute('src') !== fallback) event.currentTarget.src = fallback; }} alt={project.title} />
      <div className="project-dialog-body"><p className="project-dialog-category">{project.category_names.join(' / ')}</p><h2 id="project-dialog-title">{requestBrochure ? settings.brochure_form_title || 'Brochure Request' : project.title}</h2>
        {requestBrochure ? <><p className="project-dialog-project-name">{project.title}</p>{submitted ? <div className="project-brochure-ready" role="status"><CheckCircle2 size={36} /><h3>Your brochure is ready.</h3><p>Thanks for your interest in this project.</p><a href={project.brochure_url} target="_blank" rel="noopener noreferrer" className="project-modal-button"><Download size={18} /> OPEN BROCHURE</a></div> : <form onSubmit={submit} className="project-brochure-form"><div className="project-form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={120} /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label></div><label>Contact number<div className="project-phone-row"><select name="country_code" defaultValue="+91" aria-label="Country calling code"><option value="+91">+91 (India)</option><option value="+1">+1 (US / Canada)</option><option value="+44">+44 (UK)</option><option value="+971">+971 (UAE)</option><option value="+61">+61 (Australia)</option><option value="+65">+65 (Singapore)</option><option value="+49">+49 (Germany)</option></select><input name="phone" type="tel" autoComplete="tel-national" inputMode="tel" aria-label="Contact number" required minLength={6} maxLength={20} /></div></label><label>Message <span>(optional)</span><textarea name="message" rows={3} maxLength={2000} /></label>{error && <p className="project-form-error" role="alert">{error}</p>}<button type="submit" className="project-modal-button" disabled={submitting}>{submitting ? <><Loader2 className="animate-spin" size={18} /> SUBMITTING…</> : <>{settings.brochure_form_btn_text || 'GET BROCHURE'} <Download size={18} /></>}</button></form>}</> : <><p className="project-dialog-description">{project.description}</p><Link className="project-modal-button" to={`/contact?project=${encodeURIComponent(project.title)}`} onClick={onClose}>START A SIMILAR PROJECT <ArrowUpRight size={19} /></Link></>}
      </div>
    </div>
  </dialog>;
}
