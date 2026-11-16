import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { ABOUT_DISCIPLINES } from '../data/about';

type SectionId = 'who' | 'beliefs' | 'approach';

export default function AboutSections({ content }: { content: Record<string, string> }) {
  const [activeSection, setActiveSection] = useState<SectionId>('beliefs');
  const sections: { id: SectionId; number: string; title: string }[] = [
    { id: 'who', number: '01', title: content.who_we_are_heading },
    { id: 'beliefs', number: '02', title: content.what_we_believe_heading },
    { id: 'approach', number: '03', title: content.our_approach_heading },
  ];
  const statements = content.what_we_believe_text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const titleWords = content.banner_heading.split(/\s+/);
  const standardTitle = /^we design how brands are understood\.?$/i.test(content.banner_heading);

  return <section className="about-studio-beliefs" aria-label="About our studio">
    <div className="about-container about-beliefs-grid">
      <div className="about-beliefs-context">
        <div className="about-section-switcher">
          {sections.map(section => <h2 className="about-accordion-heading" key={section.id}>
            <button type="button" className="about-section-trigger" id={`about-trigger-${section.id}`} aria-expanded={activeSection === section.id} aria-controls={`about-panel-${section.id}`} onClick={() => setActiveSection(section.id)}>
              <span>{section.number} / {section.title}</span><span className="about-section-rule" aria-hidden="true" />{activeSection === section.id ? <Minus size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
            </button>
          </h2>)}
        </div>
        <p className="about-beliefs-summary">{activeSection === 'approach' ? content.our_approach_text : content.who_we_are_text}</p>
      </div>
      <div className="about-accordion-panels">
        <div className="about-accordion-panel" id="about-panel-who" role="region" aria-labelledby="about-trigger-who" hidden={activeSection !== 'who'}>
          <h3 className="about-belief-statement">{standardTitle ? <><span>WE DESIGN HOW</span><span>BRANDS ARE</span><span className="about-studio-acid">UNDERSTOOD.</span></> : <><span>{titleWords.slice(0, -1).join(' ')}</span><span className="about-studio-acid">{titleWords.at(-1)}</span></>}</h3>
        </div>
        <div className="about-accordion-panel" id="about-panel-beliefs" role="region" aria-labelledby="about-trigger-beliefs" hidden={activeSection !== 'beliefs'}>
          <h3 className="about-belief-statement">{statements.map((statement, index) => <span className={index === statements.length - 1 ? 'about-studio-acid' : ''} key={`${index}-${statement}`}>{statement}</span>)}</h3>
        </div>
        <div className="about-accordion-panel about-accordion-approach" id="about-panel-approach" role="region" aria-labelledby="about-trigger-approach" hidden={activeSection !== 'approach'}>
          <h3 className="about-approach-title">FOUR DISCIPLINES.<br /><span className="about-studio-acid">ONE DIRECTION.</span></h3>
          <ol className="about-disciplines">{ABOUT_DISCIPLINES.map((discipline, index) => <li key={discipline.name}><span className="about-discipline-number">{String(index + 1).padStart(2, '0')}</span><h4>{discipline.name}</h4><p>{discipline.description}</p></li>)}</ol>
        </div>
      </div>
    </div>
  </section>;
}
