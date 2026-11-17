import { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Loader2, Mail, MapPin, Minus, Phone, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ContactPage.css';

const contactFaqs = [
  { question: 'What makes EternaVentures different from other agencies?', answer: 'We bring brand strategy, creative, digital experience, and performance together. Your team works with experienced operators who connect execution to your business goals.' },
  { question: 'Do you work with startups or just established brands?', answer: 'We partner with ambitious startups and established brands. The session helps us understand your stage, priorities, and the support you need.' },
  { question: 'What is your minimum engagement size?', answer: 'Engagements depend on your goals and the scope of work. We will discuss the right starting point during your strategy session.' },
  { question: 'How do you price your services?', answer: 'Pricing follows the agreed scope, deliverables, and timeline. We share a clear proposal after understanding your requirements.' },
];
const nextSteps = [
  { title: 'Share your goals', text: 'Tell us what you want to achieve.' },
  { title: 'Find the right fit', text: 'We’ll review your request and ask a few focused questions.' },
  { title: 'Map your next move', text: 'Discuss what to prioritize and agree on next steps.' },
];
const emptyForm = { name: '', email: '', phone: '', message: '' };

export default function ContactPage() {
  const [formData, setFormData] = useState(emptyForm);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const submitting = useRef(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name, work email, and message.' });
      return;
    }
    submitting.current = true;
    setLoading(true);
    setStatus(null);
    try {
      const selectedTopics = topics.length ? `Interested in ${topics.join(', ')}\n\n` : '';
      const { error } = await supabase.from('leads').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: selectedTopics + formData.message.trim(),
      });
      if (error) throw error;
      setStatus({ type: 'success', message: 'Your project inquiry has been sent. Our team will get in touch shortly.' });
      setFormData(emptyForm);
      setTopics([]);
    } catch {
      setStatus({ type: 'error', message: 'Your inquiry could not be sent. Please try again or email hello@eternaventures.in.' });
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return <div className="contact-page">
    <section className="contact-hero">
      <img src="/images/contact-hero-hd.jpg" alt="Hands mapping a strategy flowchart on paper" className="contact-hero-art" fetchPriority="high" />
      <div className="contact-hero-shade" />
      <div className="contact-container contact-hero-content"><p className="contact-eyebrow"><span>CONTACT</span> / STRATEGY SESSION</p><h1>LET’S BUILD<br /><span className="contact-highlight"><span>WHAT’S NEXT.</span></span></h1><p className="contact-hero-description">Tell us about your goals. We’ll map out a clear path to growth.</p><a href="#project-form">Request a Strategy Session <ArrowDown size={21} /></a></div>
    </section>

    <section id="project-form" className="contact-project"><div className="contact-container contact-project-grid">
      <div className="contact-project-intro"><p className="contact-eyebrow">LET’S TALK</p><h2>READY TO SCALE<br /><span className="contact-highlight contact-highlight-dark"><span>YOUR BRAND?</span></span></h2><p>Request a free growth audit and strategy session.</p><p>Tell us what you’re working on and where you want to go.</p></div>
      <form className="contact-form" onSubmit={handleSubmit} aria-busy={loading}>
        <h3>TELL US ABOUT YOUR PROJECT</h3>
        <fieldset disabled={loading}><legend>What can we help with? (Optional)</legend><div className="contact-topics">{['Branding', 'Social Media', 'Performance', 'Other'].map(topic => <button type="button" key={topic} aria-pressed={topics.includes(topic)} onClick={() => setTopics(current => current.includes(topic) ? current.filter(item => item !== topic) : [...current, topic])}>{topic}</button>)}</div></fieldset>
        <fieldset disabled={loading} className="contact-fields">
          <div><label htmlFor="contact-name">NAME</label><input id="contact-name" name="name" autoComplete="name" required maxLength={150} placeholder="Your Full Name" value={formData.name} onChange={event => setFormData({ ...formData, name: event.target.value })} /></div>
          <div><label htmlFor="contact-email">WORK EMAIL</label><input id="contact-email" name="email" autoComplete="email" type="email" required maxLength={254} placeholder="you@company.com" value={formData.email} onChange={event => setFormData({ ...formData, email: event.target.value })} /></div>
          <div className="contact-full-field"><label htmlFor="contact-phone">PHONE (OPTIONAL)</label><input id="contact-phone" name="phone" autoComplete="tel" type="tel" maxLength={40} placeholder="+91 00000 00000" value={formData.phone} onChange={event => setFormData({ ...formData, phone: event.target.value })} /></div>
          <div className="contact-full-field"><label htmlFor="contact-message">MESSAGE</label><textarea id="contact-message" name="message" rows={3} required maxLength={10000} placeholder="Tell us about your brand, goals, or current challenges..." value={formData.message} onChange={event => setFormData({ ...formData, message: event.target.value })} /></div>
        </fieldset>
        <button className="contact-submit" disabled={loading} type="submit">{loading ? <><Loader2 className="animate-spin" size={20} /> SENDING INQUIRY</> : <>SEND PROJECT INQUIRY <ArrowUpRight size={22} /></>}</button>
        {status && <p className={`contact-form-status contact-form-${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
      </form>
    </div></section>

    <section className="contact-details"><div className="contact-container"><a href="mailto:hello@eternaventures.in"><Mail /><div><span>EMAIL</span><strong>hello@eternaventures.in</strong></div></a><a href="tel:+917976307052"><Phone /><div><span>PHONE</span><strong>+91 7976307052</strong></div></a><div><MapPin /><div><span>BASED IN</span><strong>Jaipur, Rajasthan, India</strong></div></div></div></section>

    <section className="contact-next"><div className="contact-container"><h2>WHAT<br /> HAPPENS<br /> NEXT <span>/</span></h2>{nextSteps.map((step, index) => <div key={step.title}><span className="contact-step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>

    <section className="contact-faq"><div className="contact-container"><div className="contact-faq-intro"><p className="contact-eyebrow">FAQ</p><h2>GOOD TO<br />KNOW<span>.</span></h2><p>Quick answers to help you<br />get started with EternaVentures.</p></div><div>{contactFaqs.map((faq, index) => <div className="contact-faq-item" key={faq.question}><button aria-expanded={openFaq === index} aria-controls={`contact-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{faq.question}</span>{openFaq === index ? <Minus /> : <Plus />}</button><p id={`contact-answer-${index}`} hidden={openFaq !== index}>{faq.answer}</p></div>)}</div></div></section>
  </div>;
}
