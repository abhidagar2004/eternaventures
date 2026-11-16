import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, Sparkles, ArrowRight, ShieldCheck, Youtube, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail_url: string;
  youtube_playlist_id?: string;
  level: string;
  duration: string;
  lessons_count: number;
}

const FALLBACK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Brand Scaling & Modern Authority Blueprint',
    slug: 'brand-scaling-modern-authority',
    category: 'Brand Strategy',
    description: 'Master the psychology of brand dominance, category positioning, and high-impact identity architectures that command pricing power.',
    thumbnail_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200',
    youtube_playlist_id: 'PL6QreJ4529V66L0f9vU7_n1c_tN2XzE1K',
    level: 'Founder / Advanced',
    duration: '2h 45m',
    lessons_count: 5
  },
  {
    id: '2',
    title: 'Performance Marketing & Omni-Channel Media Buying',
    slug: 'performance-marketing-media-buying',
    category: 'Paid Growth',
    description: 'Deconstruct high-converting creative engines, algorithmic bidding across Meta & Google, and scalable customer acquisition funnels.',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    youtube_playlist_id: 'PLrAXtmErZgOdP_8GzEsRv42308865X34z',
    level: 'Growth Marketer',
    duration: '3h 10m',
    lessons_count: 4
  },
  {
    id: '3',
    title: 'Digital Experience & Conversion UX Engineering',
    slug: 'digital-experience-conversion-ux',
    category: 'Design & UX',
    description: 'Learn how top design agencies craft friction-free customer journeys, high-ticket landing pages, and conversion-optimized storefronts.',
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    youtube_playlist_id: 'PL0Zuz27SZ-6PrE9srvEn8jS75VjieFLvC',
    level: 'All Levels',
    duration: '1h 50m',
    lessons_count: 4
  }
];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(FALLBACK_COURSES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setCourses(data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#000000] text-white min-h-screen pt-28 pb-24 font-sans selection:bg-[#d4ff00] selection:text-black">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#d4ff00]/5 rounded-full blur-[140px]" />
        <div className="absolute top-3/4 left-1/4 w-[400px] h-[300px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4ff00]/30 bg-[#d4ff00]/10 text-[#d4ff00] text-xs font-mono font-bold tracking-widest uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>[ETERNA ACADEMY & MASTERCLASSES]</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.95] mb-6"
          >
            Founder & Growth <br />
            <span className="text-[#d4ff00]">Masterclasses.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Full-length curriculum engineered by the EternaVentures strategy team.
            Streaming directly in high definition with actionable playbooks — 100% free.
          </motion.p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#d4ff00] text-black shadow-[0_0_20px_rgba(212,255,0,0.3)]'
                    : 'bg-[#121212] text-gray-400 hover:text-white hover:bg-[#1a1a1a] border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search masterclasses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4ff00] transition-colors"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id || course.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4ff00]/60 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,255,0,0.08)]"
            >
              <Link to={`/courses/${course.slug}`} className="block relative aspect-video overflow-hidden bg-[#181818]">
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200'}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <div className="w-14 h-14 rounded-full bg-[#d4ff00] text-black flex items-center justify-center shadow-[0_0_25px_rgba(212,255,0,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                    <PlayCircle className="w-8 h-8 fill-black" />
                  </div>
                </div>

                {/* Badge tags */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[#d4ff00] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#d4ff00]/30">
                    {course.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[11px] font-mono border border-white/10">
                  <Clock className="w-3 h-3 text-[#d4ff00]" />
                  <span>{course.duration}</span>
                </div>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#d4ff00]" />
                      {course.lessons_count} Modules
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">{course.level}</span>
                  </div>

                  <Link to={`/courses/${course.slug}`}>
                    <h3 className="text-xl font-display font-bold uppercase tracking-tight text-white group-hover:text-[#d4ff00] transition-colors leading-snug mb-3">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-6">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span>YouTube HD Stream</span>
                  </div>

                  <Link
                    to={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#d4ff00] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Watch Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-[#0a0a0a] border border-white/10 rounded-2xl mt-8">
            <BookOpen className="w-12 h-12 text-[#d4ff00] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">No masterclasses found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-6 py-2.5 rounded-full bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Why Learn From EternaVentures Banner */}
        <div className="mt-28 p-8 md:p-14 bg-gradient-to-br from-[#0e0e0e] to-[#070707] border border-white/10 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#d4ff00]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-display font-bold uppercase tracking-tight mb-1 text-white">Battle-Tested Models</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Every framework taught has been executed across 8-figure brand portfolios. Zero theory.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] flex items-center justify-center flex-shrink-0">
                <Youtube className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-lg font-display font-bold uppercase tracking-tight mb-1 text-white">Official YouTube Player</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Watch smoothly without leaving the platform, with full YouTube HD playback & chapters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-display font-bold uppercase tracking-tight mb-1 text-white">No Paywalls, Period</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  High-value playbooks built to give ambitious operators an unfair competitive advantage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
