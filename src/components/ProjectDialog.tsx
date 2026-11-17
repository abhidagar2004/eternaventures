import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Download, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LOCAL_PROJECT_IMAGES, type Project } from '../data/projects';
import './ProjectDialog.css';

interface BrochureSettings {
  brochure_form_title?: string;
  brochure_form_btn_text?: string;
}

const projectPalettes: Record<string, string[]> = {
  '66f3c8c8-eca4-475f-ba0c-c737670310da': ['#fbdece', '#a5c9c6', '#d7a68b'],
  '7f28bcc1-baa3-45c7-8a7e-61ce1b8044d6': ['#e6e5d3', '#788548', '#d8bc73'],
  '956f12ee-bb10-4c6f-87ad-d5ea3e4c9951': ['#213e20', '#f0a42c', '#c13570'],
  '2cbb56f9-3096-4869-a7e3-edd20caa4a69': ['#163d2c', '#d4b36c', '#583a2c'],
};

export default function ProjectDialog({ project, requestBrochure, settings, onClose }: {
  project: Project;
  requestBrochure: boolean;
  settings: BrochureSettings;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitInProgress = useRef(false);
  const [showBrochure, setShowBrochure] = useState(requestBrochure);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const titleParts = project.title.split(/\s+[–—-]\s+/);
  const name = titleParts[0];
  const subtitle = titleParts.slice(1).join(' — ');
  const image = LOCAL_PROJECT_IMAGES[project.image_url] || project.image_url;
  const palette = projectPalettes[project.id];
  const isValia = project.id === '66f3c8c8-eca4-475f-ba0c-c737670310da' && image === '/images/project-valia.jpg';
  const brochureTitle = settings.brochure_form_title?.trim();
  const formTitle = brochureTitle && !/^(brochure request|get brochure)$/i.test(brochureTitle)
    ? brochureTitle : 'GET THE BROCHURE';

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    dialog.current?.scrollTo(0, 0);
  }, [showBrochure]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitInProgress.current) return;
    const values = new FormData(event.currentTarget);
    const fullName = String(values.get('name') || '').trim();
    const email = String(values.get('email') || '').trim();
    const phone = String(values.get('phone') || '').replace(/\D/g, '');
    if (!fullName || !email || phone.length < 6) {
      setError('Please enter your name, email, and a valid contact number.');
      return;
    }
    submitInProgress.current = true;
    setSubmitting(true);
    setError('');
    try {
      const { error: submissionError } = await supabase.from('leads').insert([{
        name: fullName,
        email,
        phone,
        country_code: String(values.get('country_code') || '+91'),
        message: String(values.get('message') || '').trim() || `Brochure request for ${project.title}`,
        project_title: project.title,
      }]);
      if (submissionError) throw submissionError;
      setSubmitted(true);
    } catch {
      setError('We couldn’t submit your request. Please try again.');
    } finally {
      submitInProgress.current = false;
      setSubmitting(false);
    }
  }

  return <dialog
    ref={dialog}
    className={`project-dialog ${showBrochure ? 'project-dialog-brochure' : 'project-dialog-detail'}`}
    aria-labelledby="project-dialog-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
  >
    <div className="project-dialog-content">
      <button type="button" className="project-dialog-close" onClick={onClose} aria-label="Close project"><X size={26} /></button>
      {showBrochure ? <>
        <aside className="project-brochure-cover" style={{ '--project-cover-color': palette?.[0] || '#e1ded4' } as CSSProperties} aria-label={`${name} project brochure preview`}>
          <div className="project-brochure-cover-heading"><span>PROJECT BROCHURE</span><span>PDF</span></div>
          <p className="project-brochure-cover-name">{name}</p>
          {isValia ? <div className="project-brochure-fan" aria-hidden="true">
            {[0, 1, 2].map(index => <div key={index} style={{ backgroundImage: `url("${image}")` }} />)}
          </div> : <img className="project-brochure-cover-image" src={image} alt={project.title} />}
        </aside>
        <div className="project-dialog-body project-brochure-body">
          <p className="project-dialog-eyebrow">PROJECT DOWNLOAD</p>
          <h2 id="project-dialog-title">{formTitle}</h2>
          <p className="project-dialog-project-name">Enter your details to download the {name} project brochure.</p>
          {submitted ? <div className="project-brochure-ready" role="status">
            <CheckCircle2 size={36} /><h3>Your brochure is ready.</h3><p>Thanks for your interest in this project.</p>
            <a href={project.brochure_url} target="_blank" rel="noopener noreferrer" className="project-modal-button"><Download size={20} /> DOWNLOAD BROCHURE</a>
          </div> : <form onSubmit={submit} className="project-brochure-form" aria-busy={submitting}>
            <fieldset disabled={submitting}>
              <div className="project-form-row">
                <label>Your name<input name="name" autoComplete="name" required maxLength={120} /></label>
                <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
              </div>
              <div className="project-phone-field">
                <label htmlFor="project-brochure-phone">Contact number</label>
                <div className="project-phone-row">
                  <select name="country_code" defaultValue="+91" aria-label="Country calling code">
                    <option value="+91">+91 (India)</option><option value="+1">+1 (US / Canada)</option><option value="+44">+44 (UK)</option><option value="+971">+971 (UAE)</option><option value="+61">+61 (Australia)</option><option value="+65">+65 (Singapore)</option><option value="+49">+49 (Germany)</option>
                  </select>
                  <input id="project-brochure-phone" name="phone" type="tel" autoComplete="tel-national" required minLength={6} maxLength={20} />
                </div>
              </div>
              <label className="project-message-field"><span>Message <span>(optional)</span></span><textarea name="message" rows={3} maxLength={2000} /></label>
            </fieldset>
            {error && <p className="project-form-error" role="alert">{error}</p>}
            <button type="submit" className="project-modal-button" disabled={submitting}>
              {submitting ? <><Loader2 className="animate-spin" size={20} /> SUBMITTING…</> : <>{settings.brochure_form_btn_text || 'SUBMIT INQUIRY & DOWNLOAD'} <Download size={22} /></>}
            </button>
          </form>}
        </div>
      </> : <>
        <div className="project-detail-visual" style={{ backgroundColor: palette?.[0] || '#202020' }}>
          <img src={image} alt={project.title} />
          <span className="project-selected-label">SELECTED WORK</span>
        </div>
        <div className="project-dialog-body project-detail-body">
          <p className="project-dialog-category">{project.category_names.join(' / ')}</p>
          <h2 id="project-dialog-title">{name}</h2>
          {subtitle && <p className="project-detail-subtitle">{subtitle}</p>}
          <p className="project-dialog-description">{project.description}</p>
          {palette && <div className="project-detail-palette" aria-label="Project color palette">{palette.map(color => <span key={color} style={{ backgroundColor: color }} />)}</div>}
          <Link className="project-modal-button" to={`/contact?project=${encodeURIComponent(project.title)}`} onClick={onClose}>Start a Similar Project <ArrowUpRight size={25} /></Link>
          {project.brochure_url && <button type="button" className="project-detail-download" onClick={() => setShowBrochure(true)}>Download Brochure <Download size={20} /></button>}
        </div>
      </>}
    </div>
  </dialog>;
}
