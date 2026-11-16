import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Layers, 
  Target, 
  Zap
} from 'lucide-react';

interface Practice {
  number: string;
  title: string;
  slug: string;
  description: string;
  bullets: string[];
  image_url: string;
  category: 'BRAND' | 'GROWTH' | 'INFLUENCE' | 'PRODUCT' | 'INTELLIGENCE';
}

const PRACTICES: Practice[] = [
  {
    number: '01',
    title: 'BRAND ARCHITECTURE & IDENTITY SYSTEMS',
    slug: 'brand-architecture-identity-systems',
    description: 'Build distinctive, scalable brand systems that create clarity, credibility, and long-term category value.',
    bullets: [
      'Brand Strategy & Architecture',
      'Visual Identity & Brand Systems'
    ],
    image_url: 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%20Nov%202,%202026,%2005_08_25%20PM-1.png',
    category: 'BRAND'
  },
  {
    number: '02',
    title: 'NARRATIVE ENGINEERING',
    slug: 'narrative-engineering',
    description: 'Craft compelling, high-impact narratives that shape perception, build demand, and drive cultural relevance.',
    bullets: [
      'Messaging & Story Architecture',
      'Content Systems & Campaign Narratives'
    ],
    image_url: 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%20Nov%202,%202026,%2005_08_26%20PM-2.png',
    category: 'BRAND'
  },
  {
    number: '03',
    title: 'PERFORMANCE & PAID INTELLIGENCE',
    slug: 'performance-paid-intelligence',
    description: 'Turn demand into predictable growth through data-led media, performance strategy, and continuous optimization.',
    bullets: [
      'Paid Media Strategy & Execution',
      'Conversion & Performance Optimization'
    ],
    image_url: 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%20Nov%202,%202026,%2005_08_28%20PM-4.png',
    category: 'GROWTH'
  },
  {
    number: '04',
    title: 'INFLUENCE & CULTURAL CAPITAL',
    slug: 'influence-cultural-capital',
    description: 'Activate the right voices, communities, and cultural moments to build credibility, relevance, and lasting demand.',
    bullets: [
      'Creator & Influencer Strategy',
      'Community & Cultural Programs'
    ],
    image_url: 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%20Nov%202,%202026,%2005_08_27%20PM-3.png',
    category: 'INFLUENCE'
  },
  {
    number: '05',
    title: 'DIGITAL EXPERIENCE DESIGN',
    slug: 'digital-experience-design',
    description: 'Design and build high-performance digital experiences that convert, engage, and scale with your growth.',
    bullets: [
      'Website & Product Experience Design',
      'UX Optimization & Conversion Design'
    ],
    image_url: 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%20Nov%202,%202026,%2005_08_29%20PM-5.png',
    category: 'PRODUCT'
  },
  {
    number: '06',
    title: 'MARKET INTELLIGENCE & GROWTH ADVISORY',
    slug: 'market-intelligence-growth-advisory',
    description: 'Turn market insight into strategic advantage through research, opportunity mapping, and go-to-market guidance.',
    bullets: [
      'Market & Category Intelligence',
      'GTM Strategy & Growth Advisory'
    ],
    image_url: 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%20Nov%202,%202026,%2005_08_31%20PM-6.png',
    category: 'INTELLIGENCE'
  }
];

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<string>('ALL PRACTICES');

  const filteredPractices = PRACTICES.filter((p) => {
    if (activeFilter === 'ALL PRACTICES') return true;
    return p.category === activeFilter;
  });

  return (
    <div className="bg-black text-white font-sans selection:bg-[#CFF701] selection:text-black min-h-screen">
      
      {/* ─── SECTION 1: HERO (Dark Background #000000) ─────────────────────────── */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7">
            <span className="text-[#CFF701] text-xs font-mono font-bold tracking-widest uppercase block mb-4">
              SERVICES
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-display font-black tracking-tighter uppercase leading-[0.92] text-white mb-6">
              WE DON’T SELL <br />
              SERVICES. <br />
              <span className="inline-block bg-[#CFF701] text-black px-4 py-1 -skew-x-6 origin-left transform mt-2 mb-1.5">
                WE CONSTRUCT
              </span> <br />
              <span className="inline-block bg-[#CFF701] text-black px-4 py-1 -skew-x-6 origin-left transform">
                ECOSYSTEMS.
              </span>
            </h1>

            <p className="text-gray-300 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-normal">
              Six integrated practices engineered to build category defining brands, drive measurable growth, and create lasting market advantage.
            </p>

            <a
              href="#practices"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#CFF701] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#d9ff1a] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(207,247,1,0.3)]"
            >
              <span>EXPLORE OUR SERVICES</span>
              <span className="text-sm font-bold">→</span>
            </a>
          </div>

          {/* Right Hero 3D Sculpture */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <img
              src="/images/hero-3d-loop.png"
              alt="EternaVentures Ecosystem"
              className="w-full max-w-[440px] lg:max-w-[500px] h-auto object-contain"
            />
          </div>

        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#333333] bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#333333]">
            <div className="py-4 md:py-0 md:px-8 text-center">
              <div className="text-3xl md:text-4xl font-display font-black text-[#CFF701] mb-1">6</div>
              <div className="text-[10px] md:text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">INTEGRATED PRACTICES</div>
            </div>
            <div className="py-4 md:py-0 md:px-8 text-center">
              <div className="text-3xl md:text-4xl font-display font-black text-[#CFF701] mb-1">$45M+</div>
              <div className="text-[10px] md:text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">CAPITAL ENABLED</div>
            </div>
            <div className="py-4 md:py-0 md:px-8 text-center">
              <div className="text-3xl md:text-4xl font-display font-black text-[#CFF701] mb-1">8.4X</div>
              <div className="text-[10px] md:text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">AVERAGE ROAS</div>
            </div>
            <div className="py-4 md:py-0 md:px-8 text-center">
              <div className="text-3xl md:text-4xl font-display font-black text-[#CFF701] mb-1">100%</div>
              <div className="text-[10px] md:text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">EXECUTION OWNERSHIP</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: SIX PRACTICES (White Background #ffffff) ─────────────── */}
      <section id="practices" className="bg-white text-black py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tighter leading-[0.95] text-black">
                SIX PRACTICES. <br />
                ONE INTEGRATED <br />
                <span className="inline-block bg-[#CFF701] text-black px-4 py-1 -skew-x-6 origin-left transform mt-1.5">
                  GROWTH ENGINE.
                </span>
              </h2>
            </div>
            <div className="md:max-w-md md:border-l md:border-gray-200 md:pl-8">
              <p className="text-gray-600 text-sm leading-relaxed font-normal">
                A cohesive set of six practices that work together across brand, demand, influence, product, and market strategy to drive outsized, compounding growth.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mb-14">
            {['ALL PRACTICES', 'BRAND', 'GROWTH', 'INFLUENCE', 'PRODUCT', 'INTELLIGENCE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                  activeFilter === tab
                    ? 'bg-[#CFF701] text-black shadow-sm font-black'
                    : 'bg-white text-gray-800 border border-gray-300 hover:border-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 6 Practices Cards Grid (2 Columns, 3 Rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPractices.map((practice) => (
              <div
                key={practice.number}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Image Frame with Black Number Badge */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={practice.image_url}
                    alt={practice.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-black text-white font-mono font-bold text-sm flex items-center justify-center shadow-md">
                    {practice.number}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/services/${practice.slug}`} className="block">
                      <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-black hover:text-gray-600 transition-colors mb-3 leading-snug">
                        {practice.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                      {practice.description}
                    </p>

                    {/* Bullet Points with neon dashes */}
                    <div className="space-y-2 mb-8">
                      {practice.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-800 font-medium">
                          <span className="w-4 h-0.5 bg-[#CFF701] flex-shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explore Link */}
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      to={`/services/${practice.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:text-gray-500 transition-colors"
                    >
                      <span>EXPLORE PRACTICE</span>
                      <span className="text-sm font-bold">↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 3: THE ETERNAVENTURES METHOD (Black Background #000000) ── */}
      <section className="bg-black text-white py-20 md:py-24 px-6 md:px-12 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-4">
              THE ETERNAVENTURES{' '}
              <span className="inline-block bg-[#CFF701] text-black px-3 py-0.5 -skew-x-6 origin-left transform">
                METHOD
              </span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-normal">
              A proven, integrated approach that turns insight into brand, demand, and durable market leverage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'DIAGNOSTIC & AUDIT',
                desc: 'Uncover opportunity, assess position, and define the growth levers that matter.'
              },
              {
                step: '02',
                title: 'ARCHITECTURE & BLUEPRINT',
                desc: 'Build the strategic foundation across brand, demand, and market execution.'
              },
              {
                step: '03',
                title: 'OMNICHANNEL ROLLOUT',
                desc: 'Launch across the right channels with precision, creative, and speed.'
              },
              {
                step: '04',
                title: 'COMPOUND AUTHORITY',
                desc: 'Drive sustained advantage through optimization, expansion, and reputation building.'
              }
            ].map((method) => (
              <div
                key={method.step}
                className="p-6 sm:p-7 rounded-2xl bg-[#0e0e0e] border border-[#222] hover:border-gray-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[#CFF701] text-sm font-mono font-bold block mb-4">
                    {method.step}
                  </span>
                  <h4 className="text-base font-display font-bold uppercase tracking-tight text-white mb-3">
                    {method.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-normal">
                    {method.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 4: WHY CATEGORY LEADERS PARTNER WITH US (White Background) ─ */}
      <section className="bg-white text-black py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-black mb-3">
              WHY CATEGORY LEADERS <br />
              <span className="inline-block bg-[#CFF701] text-black px-3 py-0.5 -skew-x-6 origin-left transform mt-1">
                PARTNER WITH US.
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
              A strategic, senior-led partner for brands that want more than execution — they want category leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#CFF701]">
                <BarChart3 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-display font-black uppercase tracking-tight text-black mb-1">
                  DATA-DRIVEN PRECISION
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Decisions grounded in insight, performance data, and clear business impact.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#CFF701]">
                <Layers className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-display font-black uppercase tracking-tight text-black mb-1">
                  SENIOR-ONLY OPERATORS
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  A hands-on team of experienced strategists, creatives, and growth operators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#CFF701]">
                <Target className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-display font-black uppercase tracking-tight text-black mb-1">
                  TRANSPARENT ATTRIBUTION
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Clear measurement, real accountability, and visibility into what’s driving growth.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#CFF701]">
                <Zap className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-display font-black uppercase tracking-tight text-black mb-1">
                  A/B CREATIVE FACTORY
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  A continuous creative testing engine to identify what resonates, converts, and scales.
                </p>
              </div>
            </div>
          </div>

          {/* Watch Our Complete Growth Playbooks Card */}
          <div className="mt-20 p-6 sm:p-8 rounded-2xl border border-gray-200 bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
            <div className="flex-1">
              <h4 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-black leading-tight">
                WATCH OUR COMPLETE <br />
                <span className="inline-block bg-[#CFF701] text-black px-2.5 py-0.5 -skew-x-6 origin-left transform mt-1">
                  GROWTH PLAYBOOKS.
                </span>
              </h4>
            </div>
            <div className="lg:border-l lg:border-gray-200 lg:pl-8 flex-1">
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                Deep dives on brand, demand, influence, and market strategy, built from real operator experience.
              </p>
            </div>
            <div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 hover:border-black text-black font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
              >
                <span>VIEW THE PLAYBOOKS</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 5: READY TO OWN YOUR MARKET POSITION? (Neon Yellow #CFF701) ── */}
      <section className="bg-[#CFF701] text-black py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.92] text-black">
              READY TO OWN YOUR <br />
              <span className="inline-block border-4 border-black px-3 py-1 -skew-x-6 origin-left transform mt-2 shadow-[4px_4px_0px_#000000]">
                MARKET POSITION?
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-black text-sm sm:text-base font-medium leading-relaxed mb-8 max-w-lg">
              Book a strategy call to explore how EternaVentures can build, grow, and defend your category position.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors shadow-lg"
              >
                <span>BOOK A STRATEGY CALL</span>
                <span>→</span>
              </Link>

              <Link
                to="/projects"
                className="text-xs font-black uppercase tracking-wider text-black hover:opacity-75 transition-opacity underline-offset-4 hover:underline"
              >
                VIEW CASE STUDIES
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
