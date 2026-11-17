import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BarChart3, Layers, Target, Zap } from 'lucide-react';
import ReferenceArtwork from '../components/ReferenceArtwork';
import HeroButton from '../components/HeroButton';
import './ServicesPage.css';

const practices = [
  { number: '01', label: 'BRAND', title: 'BRAND ARCHITECTURE & IDENTITY SYSTEMS', slug: 'brand-architecture-identity-systems', description: 'Build a distinctive identity that scales.', specialties: 'Brand Strategy  ·  Visual Identity', category: 'BRAND', x: 61, y: 623, width: 316, height: 120, alt: 'Cream and black brand identity books with lime page edges' },
  { number: '02', label: 'CONTENT', title: 'NARRATIVE ENGINEERING', slug: 'narrative-engineering', description: 'Tell stories that shape how audiences see your brand.', specialties: 'Messaging  ·  Campaigns', category: 'BRAND', x: 392, y: 623, width: 307, height: 120, alt: 'Red cinematic film strips and blue editorial campaign imagery' },
  { number: '03', label: 'PERFORMANCE', title: 'PERFORMANCE & PAID INTELLIGENCE', slug: 'performance-paid-intelligence', description: 'Turn paid media into measurable growth.', specialties: 'Paid Media  ·  Conversion', category: 'GROWTH', x: 715, y: 623, width: 311, height: 120, alt: 'Electric blue performance analytics on a dark screen' },
  { number: '04', label: 'INFLUENCE', title: 'INFLUENCE & CULTURAL CAPITAL', slug: 'influence-cultural-capital', description: 'Build relevance through creators and communities.', specialties: 'Creators  ·  Community', category: 'INFLUENCE', x: 61, y: 921, width: 316, height: 116, alt: 'Creator portrait against a warm golden background' },
  { number: '05', label: 'DIGITAL', title: 'DIGITAL EXPERIENCE DESIGN', slug: 'digital-experience-design', description: 'Build intuitive websites that are easy to use.', specialties: 'Web Design  ·  UX', category: 'PRODUCT', x: 392, y: 921, width: 307, height: 116, alt: 'Laptop displaying a digital experience studio website' },
  { number: '06', label: 'STRATEGY', title: 'MARKET INTELLIGENCE & GROWTH ADVISORY', slug: 'market-intelligence-growth-advisory', description: 'Use market research to decide where to grow next.', specialties: 'Market Research  ·  Growth Strategy', category: 'INTELLIGENCE', x: 715, y: 921, width: 311, height: 116, alt: 'Layered translucent green research and strategy panels' },
];
const methods = [
  { title: 'DIAGNOSTIC & AUDIT', text: 'Uncover opportunity, assess position, and define the growth levers that matter.' },
  { title: 'ARCHITECTURE & BLUEPRINT', text: 'Build the strategic foundation across brand, demand, and market execution.' },
  { title: 'OMNICHANNEL ROLLOUT', text: 'Activate a coordinated plan across all touchpoints to build momentum and impact.' },
  { title: 'COMPOUND AUTHORITY', text: 'Drive sustained advantage through optimization, expansion, and reputation building.' },
];
const advantages = [
  { icon: BarChart3, title: 'DATA-DRIVEN PRECISION', text: 'Decisions grounded in insight, performance data, and clear business impact.' },
  { icon: Layers, title: 'SENIOR-ONLY OPERATORS', text: 'A hands-on team of experienced strategists, creatives, and growth operators.' },
  { icon: Target, title: 'TRANSPARENT ATTRIBUTION', text: 'Clear measurement, real accountability, and visibility into what’s driving growth.' },
  { icon: Zap, title: 'A/B CREATIVE FACTORY', text: 'A continuous creative testing engine to identify what resonates, converts, and scales.' },
];
function Highlight({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) { return <span className={`practice-highlight${inverse ? ' practice-highlight-inverse' : ''}`}><span>{children}</span></span>; }
export default function ServicesPage() {
  const [filter, setFilter] = useState('ALL PRACTICES');
  return <div className="practices-page">
    <section className="practices-hero" aria-labelledby="services-title">
      <img className="practices-banner" src="/images/services-campaign-banner.png" alt="An integrated brand, content, digital experience and performance campaign board" fetchPriority="high" />
      <div className="practices-hero-overlay" aria-hidden="true" />
      <div className="practice-container practices-hero-content"><p className="practice-eyebrow"><span>SERVICES</span> / &nbsp;01 – 06</p><h1 id="services-title">WE DON’T SELL<br />SERVICES.<br /><Highlight>WE CONSTRUCT<br />ECOSYSTEMS.</Highlight></h1><p className="practice-intro">Six integrated practices engineered to build category-defining brands, drive measurable growth, and create lasting market advantage.</p><HeroButton href="#practices">EXPLORE THE PRACTICES</HeroButton></div>
    </section>
    <div className="practice-stats"><div className="practice-container">{[['6', 'INTEGRATED PRACTICES'], ['$45M+', 'CAPITAL MOBILIZED'], ['8.4X', 'AVERAGE ROAS'], ['100%', 'EXECUTION OWNERSHIP']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div>
    <section id="practices" className="practice-catalog" aria-labelledby="practices-title"><div className="practice-container">
      <div className="practice-section-heading"><h2 id="practices-title">SIX PRACTICES.<br />ONE INTEGRATED<br /><Highlight inverse>GROWTH ENGINE.</Highlight></h2><p>A cohesive set of six practices that work together across brand, demand, influence, product, and market strategy to drive outsized, compounding growth.</p></div>
      <div className="practice-filters" aria-label="Filter practices">{['ALL PRACTICES', 'BRAND', 'GROWTH', 'INFLUENCE', 'PRODUCT', 'INTELLIGENCE'].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <div className="practice-grid" aria-live="polite">{practices.filter(practice => filter === 'ALL PRACTICES' || practice.category === filter).map(practice => <article className="practice-card" key={practice.slug} data-studio-key={practice.slug}><Link to={`/services/${practice.slug}`} aria-label={`Explore ${practice.title}`}><ReferenceArtwork {...practice} className="practice-card-art" /></Link><div className="practice-card-body"><p className="practice-number">{practice.number} / {practice.label}</p><h3><Link to={`/services/${practice.slug}`}>{practice.title}</Link></h3><p className="practice-description">{practice.description}</p><p className="practice-specialties">{practice.specialties}</p><Link className="practice-card-link" to={`/services/${practice.slug}`}>EXPLORE PRACTICE <ArrowUpRight size={21} /></Link></div></article>)}</div>
    </div></section>
    <section className="practice-method" aria-labelledby="method-title"><div className="practice-container"><div className="practice-section-heading"><h2 id="method-title">THE<br />ETERNAVENTURES<br /><Highlight>METHOD</Highlight></h2><p>A proven, integrated approach that turns insight into brand, demand, and durable market advantage.</p></div><ol className="practice-timeline">{methods.map((method, index) => <li key={method.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{method.title}</h3><p>{method.text}</p></li>)}</ol></div></section>
    <section className="practice-advantages" aria-labelledby="advantages-title"><div className="practice-container"><h2 id="advantages-title">WHY CATEGORY LEADERS<br /><Highlight inverse>PARTNER WITH US.</Highlight></h2><p className="practice-advantages-intro">A strategic, senior-led partner for brands that want more than execution —<br className="practice-desktop-break" /> they want category leadership.</p><div className="practice-advantage-grid">{advantages.map(({ icon: Icon, title, text }) => <div key={title} className="practice-advantage"><Icon aria-hidden="true" size={57} strokeWidth={1.8} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><div className="practice-playbooks"><h3>WATCH OUR COMPLETE<br /><Highlight inverse>GROWTH PLAYBOOKS.</Highlight></h3><p>Deep dives on brand, demand, influence, and market strategy, built from real execution experience.</p><Link className="practice-button practice-button-outline" to="/courses">VIEW THE PLAYBOOKS <ArrowUpRight size={21} /></Link></div></div></section>
    <section className="practice-cta"><div className="practice-container"><h2>READY TO OWN YOUR<br />MARKET POSITION?</h2><div><p>Let’s build a durable growth engine<br />for your brand, category, and audience.</p><div className="practice-cta-actions"><Link className="practice-button" to="/contact">BOOK A STRATEGY CALL <ArrowUpRight size={21} /></Link><Link className="practice-case-link" to="/projects">VIEW CASE STUDIES</Link></div></div></div></section>
  </div>;
}
