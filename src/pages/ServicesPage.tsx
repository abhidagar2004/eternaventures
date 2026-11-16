import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  Compass, 
  Layers, 
  Rocket, 
  Target, 
  Shield, 
  Zap, 
  Video, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Fallback high-impact practices if database query is empty
const FALLBACK_PRACTICES = [
  {
    id: '1',
    slug: 'brand-architecture-identity-systems',
    title: 'Brand Architecture & Identity Systems',
    subtitle: 'Positioning • Identity • Messaging Systems • Brand Language',
    description: 'We define who you are before the market defines it for you. From naming and category framing to visual identity and verbal systems — we build brand structures that hold authority across every touchpoint.',
    deliverables: [
      'Category Framing & Market Vector Document',
      'Visual Identity System (Logo, Typography, Palette, Layouts)',
      'Brand Language Guide & Core Messaging Matrix',
      'Multi-Touchpoint Collateral & High-Conversion Templates'
    ],
    image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000',
    category: 'Brand'
  },
  {
    id: '2',
    slug: 'performance-marketing-media-buying',
    title: 'Performance Marketing & Media Buying',
    subtitle: 'Omni-Channel Ads • Algorithmic Bidding • CAC Optimization',
    description: 'Direct-response advertising engineered for enterprise ROI. We deploy campaigns across Meta, Google, TikTok, and YouTube with precise data modeling to scale customer acquisition predictably.',
    deliverables: [
      'Multi-Platform Ad Account Architecture',
      'High-Volume Native Creative Production Pipeline',
      'Algorithmic CBO & Advantage+ Scaling Protocols',
      'Real-Time Attribution & Contribution Margin Dashboard'
    ],
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    category: 'Growth'
  },
  {
    id: '3',
    slug: 'digital-experience-design',
    title: 'Digital Experience & Funnel Architecture',
    subtitle: 'Web Design • UX Systems • Conversion Optimization • Storefronts',
    description: 'Your digital presence is your highest-leverage asset. We design and build high-performance web experiences and conversion funnels that transform passive attention into high-ticket action.',
    deliverables: [
      'Frictionless Mobile-First User Flow Engineering',
      'Next.js & Webflow Custom Interactive Development',
      'High-Ticket Landing Page & Funnel Frameworks',
      'Continuous A/B Testing & Conversion Rate Optimization'
    ],
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000',
    category: 'Design'
  },
  {
    id: '4',
    slug: 'influence-cultural-capital',
    title: 'Influence Strategy & Cultural Capital',
    subtitle: 'Advocacy Programs • Creator Networks • Community Engineering',
    description: 'We don’t place ads in feeds — we place your brand in conversations. Our influence practice maps cultural networks, identifies genuine advocates, and builds trust at scale across niche and mass audiences.',
    deliverables: [
      'Tiered Creator & Ambassador Network Architecture',
      'High-Converting Whitelisted Ad Integrations',
      'Viral Seeding & Cultural Moment Hijacking',
      'Private Community Infrastructure & Retention Loops'
    ],
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
    category: 'Culture'
  },
  {
    id: '5',
    slug: 'content-production-creative-engine',
    title: 'Creative Factory & Content Production',
    subtitle: 'Short-Form Video • Cinematic Commercials • 3D Motion Graphics',
    description: 'Ad fatigue kills campaigns faster than poor targeting. Our in-house creative factory produces high-volume, native platform assets that stop thumbs and hold viewers captive.',
    deliverables: [
      'High-Converting UGC & Direct-Response Video Hooks',
      'Cinematic Commercials & Brand Storytelling Assets',
      '3D Product Renders & Motion Graphics Sequences',
      'Dynamic Asset Variants for Continuous Split-Testing'
    ],
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000',
    category: 'Creative'
  },
  {
    id: '6',
    slug: 'market-intelligence-growth-advisory',
    title: 'Market Intelligence & Growth Advisory',
    subtitle: 'Competitive Auditing • Unit Economics • Go-To-Market Playbooks',
    description: 'Before deploying capital, we analyze the competitive landscape with forensic precision. We identify whitespace opportunities and build unit-economic models to de-risk growth investments.',
    deliverables: [
      'Deep Competitor Funnel & Ad Spend Forensic Audit',
      'Unit Economics, Payback Window & LTV Modeling',
      'Omni-Channel Go-To-Market Execution Blueprint',
      'Fractional CMO & Executive Strategic Advisory'
    ],
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000',
    category: 'Growth'
  }
];

export default function ServicesPage() {
  const [practices, setPractices] = useState(FALLBACK_PRACTICES);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('visibility', 'visible')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          // Merge with structured deliverables if missing
          const merged = data.map((item, idx) => {
            const fallback = FALLBACK_PRACTICES[idx] || FALLBACK_PRACTICES[0];
            return {
              ...item,
              deliverables: item.features && item.features.length > 0
                ? item.features.map((f: any) => typeof f === 'string' ? f : f.title || f.description)
                : fallback.deliverables,
              category: fallback.category
            };
          });
          setPractices(merged);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filterCategories = ['All', 'Brand', 'Growth', 'Design', 'Creative', 'Culture'];

  const filteredPractices = practices.filter(p => {
    if (selectedFilter === 'All') return true;
    return p.category === selectedFilter || p.subtitle?.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <div className="bg-[#000000] text-white min-h-screen pt-28 pb-24 font-sans selection:bg-[#d4ff00] selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4ff00]/5 rounded-full blur-[160px]" />
        <div className="absolute top-2/3 right-10 w-[500px] h-[350px] bg-white/[0.02] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4ff00]/30 bg-[#d4ff00]/10 text-[#d4ff00] text-xs font-mono font-bold tracking-widest uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>[PRACTICES & CAPABILITIES]</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter uppercase leading-[0.92] mb-8"
          >
            We Don't Sell Services. <br />
            <span className="text-[#d4ff00]">We Construct Ecosystems.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-normal"
          >
            Six integrated disciplines engineered to establish category dominance, capture high-intent attention,
            and compound enterprise revenue across modern digital channels.
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-black text-[#d4ff00]">6</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mt-1">Core Practices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-black text-white">$45M+</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mt-1">Client Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-black text-[#d4ff00]">8.4X</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mt-1">Avg Media ROAS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-black text-white">100%</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mt-1">In-House Execution</div>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-16 overflow-x-auto pb-4 scrollbar-none">
          {filterCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                selectedFilter === cat
                  ? 'bg-[#d4ff00] text-black shadow-[0_0_20px_rgba(212,255,0,0.3)]'
                  : 'bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#161616] border border-white/5'
              }`}
            >
              {cat === 'All' ? 'All Practices' : cat}
            </button>
          ))}
        </div>

        {/* Practices Cards Grid (2-Column high-end cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-28">
          {filteredPractices.map((practice, index) => (
            <motion.div
              key={practice.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#0c0c0c] border border-white/10 rounded-3xl p-8 sm:p-10 hover:border-[#d4ff00]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_16px_50px_rgba(212,255,0,0.06)] relative overflow-hidden"
            >
              {/* Subtle card glow on hover */}
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#d4ff00]/5 rounded-full blur-[80px] group-hover:bg-[#d4ff00]/10 transition-colors pointer-events-none" />

              <div>
                {/* Header row: Index & Subtitle tag */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-3xl font-display font-black text-[#d4ff00]">
                    0{index + 1}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
                    {practice.subtitle ? practice.subtitle.split('•')[0].trim() : 'Core Practice'}
                  </span>
                </div>

                {/* Media preview */}
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 bg-[#181818] relative">
                  <img
                    src={practice.image_url || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000'}
                    alt={practice.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/20 to-transparent" />
                </div>

                {/* Title */}
                <Link to={`/services/${practice.slug}`} className="block">
                  <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white group-hover:text-[#d4ff00] transition-colors mb-3 leading-tight">
                    {practice.title}
                  </h3>
                </Link>

                {/* Subtitle list */}
                {practice.subtitle && (
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4ff00] mb-4 opacity-90">
                    {practice.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  {practice.description}
                </p>

                {/* Core Deliverables Checklist */}
                {practice.deliverables && practice.deliverables.length > 0 && (
                  <div className="pt-5 border-t border-white/5 mb-8">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-3">
                      Key Deliverables & Systems:
                    </span>
                    <ul className="space-y-2.5">
                      {practice.deliverables.slice(0, 4).map((deliv: string, dIdx: number) => (
                        <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-[#d4ff00] flex-shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <Link
                  to={`/services/${practice.slug}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#d4ff00] transition-colors"
                >
                  <span>Explore Practice Details</span>
                  <ArrowRight className="w-4 h-4 text-[#d4ff00] group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/contact"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-[#d4ff00] hover:text-black text-xs font-bold uppercase tracking-wider border border-white/10 transition-all"
                >
                  Book Call
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Eterna Execution Method */}
        <div className="mb-28 pt-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full border border-[#d4ff00]/30 bg-[#d4ff00]/10 text-[#d4ff00] text-xs font-mono font-bold tracking-widest uppercase inline-block mb-4">
              [OPERATIONAL BLUEPRINT]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-4">
              The EternaVentures Method
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              How we take brands from commodity status to category authority through a repeatable, 4-stage execution cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Diagnostic & Vectors',
                desc: 'Forensic audit of your current unit economics, audience psychology, and competitive whitespace.'
              },
              {
                step: '02',
                title: 'Architecture & Engine',
                desc: 'Crafting the messaging matrix, high-converting digital storefront, and native creative pipeline.'
              },
              {
                step: '03',
                title: 'Omni-Channel Rollout',
                desc: 'Deploying high-impact campaigns across paid social, search, and influencer advocacy networks.'
              },
              {
                step: '04',
                title: 'Compound Authority',
                desc: 'Iterating on conversion data daily, eliminating low performers, and scaling category moats.'
              }
            ].map((method, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#0c0c0c] border border-white/10 hover:border-[#d4ff00]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] flex items-center justify-center font-display font-black text-lg mb-6">
                    {method.step}
                  </div>
                  <h4 className="text-lg font-display font-bold uppercase tracking-tight text-white mb-3">
                    {method.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-normal">
                    {method.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Strategic Advantage (Why Us) */}
        <div className="mb-28 p-8 sm:p-14 bg-gradient-to-b from-[#0a0a0a] to-[#040404] border border-white/10 rounded-3xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full border border-[#d4ff00]/30 bg-[#d4ff00]/10 text-[#d4ff00] text-xs font-mono font-bold tracking-widest uppercase inline-block mb-4">
              [THE ADVANTAGE]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-4">
              Why Category Leaders Partner With Us
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              We eliminate agency bureaucracy and replace it with ruthless accountability and senior-only execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Data-Driven Precision',
                desc: 'Zero guesswork. Every campaign, creative, and channel decision is backed by hard unit economics and rigorous split testing.'
              },
              {
                icon: Target,
                title: 'Senior-Only Operators',
                desc: 'No junior interns learning on your ad budget. Your account is spearheaded directly by operators who have scaled multi-million dollar brands.'
              },
              {
                icon: Shield,
                title: 'Transparent Attribution',
                desc: 'Zero vanity metrics. You get real-time dashboards monitoring CPA, blended ROAS, customer LTV, and net profit margins.'
              },
              {
                icon: Rocket,
                title: 'Agile Creative Factory',
                desc: 'We continuously produce native short-form hooks, product renders, and high-impact variations to permanently defeat ad fatigue.'
              }
            ].map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-white/15 transition-all flex items-start gap-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold uppercase tracking-tight text-white mb-2">
                      {adv.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-normal">
                      {adv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Masterclass Academy Callout Banner */}
        <div className="mb-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#121212] via-[#0d0d0d] to-[#141414] border border-[#d4ff00]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff00]/10 text-[#d4ff00] text-xs font-mono font-bold tracking-widest uppercase mb-4">
              <Video className="w-3.5 h-3.5" />
              <span>Free Founder Masterclasses</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-white mb-3">
              Watch Our Complete Growth Playbooks.
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Explore our full curriculum on Brand Architecture, Omni-Channel Paid Growth, and Conversion UX streamed directly on our learning portal.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link
              to="/courses"
              className="px-8 py-4 rounded-full bg-[#d4ff00] text-black font-display font-black text-sm uppercase tracking-wider hover:bg-[#e0ff33] transition-all shadow-[0_0_30px_rgba(212,255,0,0.4)] inline-flex items-center gap-2"
            >
              <span>Explore Masterclasses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="text-center max-w-3xl mx-auto pt-12 pb-6">
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter text-white mb-6">
            Ready to Own Your <br />
            <span className="text-[#d4ff00]">Market Position?</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
            Book a 30-minute growth strategy consultation with our partners. We'll audit your current positioning and map your scaling vectors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#d4ff00] text-black font-display font-black text-sm uppercase tracking-wider hover:bg-[#e0ff33] transition-all shadow-[0_0_30px_rgba(212,255,0,0.3)]"
            >
              Book Strategy Call
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#121212] hover:bg-[#1a1a1a] text-white border border-white/10 font-bold text-sm uppercase tracking-wider transition-all"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
