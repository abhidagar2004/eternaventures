import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Search, 
  Youtube, 
  ShieldCheck, 
  Tv, 
  Share2 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  title: string;
  slug: string;
  category: 'BRAND STRATEGY' | 'PAID GROWTH' | 'DESIGN & UX' | string;
  meta: string;
  description: string;
  image_url: string;
  duration: string;
}

const COURSES_DATA: Course[] = [
  {
    id: '1',
    title: 'BRAND SCALING & MODERN AUTHORITY BLUEPRINT',
    slug: 'brand-scaling-modern-authority',
    category: 'BRAND STRATEGY',
    meta: '5 MODULES • FOUNDER / ADVANCED',
    description: 'Build lasting brand equity through positioning and identity systems.',
    image_url: '/images/course-card-1.png',
    duration: '2h 45m'
  },
  {
    id: '2',
    title: 'PERFORMANCE MARKETING & OMNI-CHANNEL MEDIA BUYING',
    slug: 'performance-marketing-media-buying',
    category: 'PAID GROWTH',
    meta: '4 MODULES • GROWTH MARKETER',
    description: 'Explore ad creative, bidding across Meta and Google, and scalable acquisition.',
    image_url: '/images/course-card-2.png',
    duration: '3h 10m'
  },
  {
    id: '3',
    title: 'DIGITAL EXPERIENCE & CONVERSION UX ENGINEERING',
    slug: 'digital-experience-conversion-ux',
    category: 'DESIGN & UX',
    meta: '4 MODULES • ALL LEVELS',
    description: 'Design digital storefronts and customer journeys that make it easier to convert.',
    image_url: '/images/course-card-3.png',
    duration: '1h 50m'
  }
];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchDbCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          // Merge db items with exact thumbnails
          const merged = data.map((item, idx) => {
            const fallback = COURSES_DATA[idx] || COURSES_DATA[0];
            return {
              id: item.id,
              title: item.title,
              slug: item.slug,
              category: (item.category || fallback.category).toUpperCase(),
              meta: `${item.lessons_count || 4} MODULES • ${(item.level || 'ALL LEVELS').toUpperCase()}`,
              description: item.description || fallback.description,
              image_url: fallback.image_url,
              duration: item.duration || fallback.duration
            };
          });
          setCourses(merged);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    }
    fetchDbCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesFilter = activeFilter === 'ALL' || c.category.toUpperCase().includes(activeFilter.replace(' & ', ' '));
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-black text-white font-sans selection:bg-[#CFF701] selection:text-black min-h-screen">
      
      {/* ─── SECTION 1: HERO (Dark Background #000000) ─────────────────────────── */}
      <section className="pt-28 md:pt-36 pb-14 md:pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7">
            <span className="text-gray-300 text-xs font-mono font-bold tracking-widest uppercase block mb-4">
              ETERNA ACADEMY & MASTERCLASSES
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-display font-black tracking-tighter uppercase leading-[0.92] text-white mb-6">
              FOUNDER & GROWTH <br />
              <span className="inline-block bg-[#CFF701] text-black px-4 py-1.5 -skew-x-6 origin-left transform mt-2 font-display font-black">
                MASTERCLASSES.
              </span>
            </h1>

            <p className="text-gray-300 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-normal">
              Free, full-length masterclasses from the EternaVentures strategy team. Watch in HD and put the playbooks to work.
            </p>

            <a
              href="#catalog"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#CFF701] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#d9ff1a] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(207,247,1,0.3)] font-sans"
            >
              <span>BROWSE MASTERCLASSES</span>
              <span className="text-sm font-bold">→</span>
            </a>
          </div>

          {/* Right Monitor Mockup */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative">
            <img
              src="/images/courses-hero-monitor.png"
              alt="Eterna Academy Growth Playbook"
              className="w-full max-w-[480px] lg:max-w-[540px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(207,247,1,0.15)]"
            />
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: EXPLORE THE MASTERCLASSES (White Background #ffffff) ──── */}
      <section id="catalog" className="bg-white text-black py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            <div className="lg:col-span-8">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tighter leading-[0.95] text-black">
                EXPLORE THE{' '}
                <span className="inline-block bg-[#CFF701] text-black px-4 py-1 -skew-x-6 origin-left transform font-display font-black">
                  MASTERCLASSES.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-4 border-l-2 border-black pl-6 py-1">
              <p className="text-base sm:text-lg font-bold text-black leading-snug">
                Three practical courses across <br className="hidden sm:inline" />
                brand, paid growth, and design.
              </p>
            </div>
          </div>

          {/* Filter Pills & Search Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              {['ALL', 'BRAND STRATEGY', 'PAID GROWTH', 'DESIGN & UX'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                    activeFilter === tab
                      ? 'bg-[#CFF701] text-black shadow-sm font-black'
                      : 'bg-white text-black border border-gray-300 hover:border-black font-bold'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search masterclasses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-full pl-9 pr-4 py-2 text-xs text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          {/* 3 Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Image Frame with Category Tag & Play Icon */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Category Slanted Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-block bg-[#CFF701] text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 -skew-x-6 shadow-sm">
                      {course.category}
                    </span>
                  </div>

                  {/* Play Circle Icon */}
                  <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-white text-[10px] font-mono border border-white/10">
                    <Clock className="w-2.5 h-2.5 text-[#CFF701]" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono font-bold tracking-wider text-gray-700 uppercase mb-2">
                      {course.meta}
                    </div>

                    <Link to={`/courses/${course.slug}`}>
                      <h3 className="text-lg sm:text-xl font-display font-black uppercase tracking-tight text-black hover:text-gray-600 transition-colors mb-3 leading-snug">
                        {course.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                      {course.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-black">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span>YouTube HD Stream</span>
                    </div>

                    <Link
                      to={`/courses/${course.slug}`}
                      className="px-4 py-2 rounded-lg bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors inline-flex items-center gap-1"
                    >
                      <span>WATCH NOW</span>
                      <span className="font-bold">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 3: BUILT TO BE PUT TO WORK (Dark Background #000000) ────── */}
      <section className="bg-black text-white py-20 md:py-24 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-12">
            BUILT TO BE{' '}
            <span className="inline-block bg-[#CFF701] text-black px-4 py-1 -skew-x-6 origin-left transform">
              PUT TO WORK.
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#CFF701] flex-shrink-0">
                <ShieldCheck className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-display font-black uppercase tracking-tight text-white mb-1.5">
                  BATTLE-TESTED MODELS
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Every framework taught has been executed across 8-figure brand portfolios. Zero theory.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#CFF701] flex-shrink-0">
                <Tv className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-display font-black uppercase tracking-tight text-white mb-1.5">
                  OFFICIAL YOUTUBE PLAYER
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Watch smoothly without leaving the platform, with full YouTube HD playback & chapters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#CFF701] flex-shrink-0">
                <Share2 className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-display font-black uppercase tracking-tight text-white mb-1.5">
                  NO PAYWALLS, PERIOD
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  High-value playbooks built to give ambitious operators an unfair competitive advantage.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 4: PICK A COURSE. PRESS PLAY. (Neon Yellow #CFF701) ──────── */}
      <section className="bg-[#CFF701] text-black py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-black text-center sm:text-left">
            PICK A COURSE. PRESS PLAY.
          </h2>
          <a
            href="#catalog"
            className="px-6 py-3.5 rounded-lg bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-gray-900 transition-colors inline-flex items-center gap-1.5 shadow-md flex-shrink-0"
          >
            <span>BROWSE MASTERCLASSES</span>
            <span className="text-sm font-bold">↗</span>
          </a>
        </div>
      </section>

    </div>
  );
}
