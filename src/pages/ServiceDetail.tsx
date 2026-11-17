import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUpRight, Minus, Plus } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import './ServiceDetail.css';

function Highlight({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return <span className={`service-highlight${inverse ? ' service-highlight-inverse' : ''}`}><span>{children}</span></span>;
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? servicesData[slug] : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpenFaq(null);
  }, [slug]);

  if (!service) {
    return <section className="service-not-found"><h1>Service not found</h1><Link to="/services">Explore all services</Link></section>;
  }

  return <div className="service-detail">
    <section className={`service-hero${service.number === '01' ? ' service-hero-panoramic' : ''}`}>
      <img className="service-hero-art" src={service.heroImage} alt={`${service.category} studio materials`} fetchPriority="high" style={{ objectPosition: service.heroImageObjectPos }} />
      <div className="service-hero-shade" />
      <div className="service-container service-hero-content">
        <Link className="service-back" to="/services"><ArrowLeft size={16} /> All Services</Link>
        <p className="service-eyebrow"><span>{service.number}</span> / {service.category}</p>
        <h1>{service.heroHeading}<br /><Highlight>{service.heroHighlight}</Highlight></h1>
        <p className="service-hero-description">{service.heroDescription}</p>
        <div className="service-hero-actions"><Link className="service-pill" to="/contact">{service.ctaButtonText} <ArrowUpRight size={17} /></Link><a href="#capabilities">Explore Capabilities <ArrowDown size={16} /></a></div>
      </div>
    </section>

    <section id="capabilities" className="service-capabilities"><div className="service-container">
      <p className="service-eyebrow">{service.whatWeDesignEyebrow}</p>
      <h2>{service.whatWeDesignHeading}<br /><Highlight inverse>{service.whatWeDesignHighlight}</Highlight></h2>
      <div className="service-feature-grid">
        {service.features.map((feature, index) => <article className={`service-feature${index === 0 ? ' service-feature-wide' : ''}`} key={feature.number}>
          <img src={feature.image} alt={feature.title} loading="lazy" style={{ objectPosition: feature.imageObjectPos }} />
          <div><span className="service-feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.description}</p></div>
        </article>)}
      </div>
    </div></section>

    <section className="service-deliverables"><div className="service-container">
      <p className="service-eyebrow">{service.deliverablesEyebrow}</p>
      <h2>{service.deliverablesHeading}<Highlight>{service.deliverablesHighlight}</Highlight></h2>
      <div className="service-deliverables-grid"><img src={service.deliverablesImage} alt={`${service.category} deliverable toolkit`} loading="lazy" style={{ objectPosition: service.deliverablesImageObjectPos }} />
        <ol>{service.deliverablesList.map(item => <li key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>
      </div>
    </div></section>

    <section className="service-process"><div className="service-container">
      <h2>{service.processHeading}</h2>
      <ol className="service-process-steps">{service.processSteps.map(step => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      <div className="service-faq"><div><h2>COMMON<br />QUESTIONS</h2><p>{service.faqSubtitle}</p></div><div>{service.faqs.map((faq, index) => <div className="service-faq-item" key={faq.question}>
        <button aria-expanded={openFaq === index} aria-controls={`service-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{index + 1}. {faq.question}</span>{openFaq === index ? <Minus size={21} /> : <Plus size={21} />}</button>
        <p id={`service-answer-${index}`} hidden={openFaq !== index}>{faq.answer}</p>
      </div>)}</div></div>
    </div></section>

    <section className="service-cta"><div className="service-container"><h2>{service.ctaHeading}</h2><div><p>{service.ctaDescription}</p><Link className="service-pill" to="/contact">{service.ctaButtonText} <ArrowUpRight size={17} /></Link></div></div></section>
  </div>;
}
