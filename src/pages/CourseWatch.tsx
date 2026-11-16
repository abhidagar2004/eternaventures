import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Clock, 
  Share2, 
  ExternalLink, 
  Youtube, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  course_id?: string;
  title: string;
  description?: string;
  youtube_video_id: string;
  duration?: string;
  order_index?: number;
}

interface CourseData {
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

const DEFAULT_LESSONS: Record<string, Lesson[]> = {
  'brand-scaling-modern-authority': [
    {
      id: 'l1',
      title: '01: The Psychology of Brand Dominance',
      description: 'Why most brands remain commodities and how market leaders create category moats and compounding pricing power.',
      youtube_video_id: 'dQw4w9WgXcQ',
      duration: '18:40',
      order_index: 1
    },
    {
      id: 'l2',
      title: '02: Positioning Vector & Messaging Matrices',
      description: 'How to write category-defining positioning claims and message architectures that stick in the customer psyche.',
      youtube_video_id: 'L_LUpnjgPso',
      duration: '24:15',
      order_index: 2
    },
    {
      id: 'l3',
      title: '03: Visual Identity & Sensory Triggers',
      description: 'Color psychology, typography scaling, and high-impact visual grammar for digital touchpoints.',
      youtube_video_id: 'aircAruvnKk',
      duration: '31:20',
      order_index: 3
    },
    {
      id: 'l4',
      title: '04: Building Viral Cultural Capital',
      description: 'Turning customers into cult advocates and engineering organic engagement loops in high-noise social feeds.',
      youtube_video_id: 'ScMzIvxBSi4',
      duration: '22:05',
      order_index: 4
    },
    {
      id: 'l5',
      title: '05: The Omni-Channel Launch Blueprint',
      description: 'A complete step-by-step launch playbook for testing, rollout, and scaling market authority across digital channels.',
      youtube_video_id: 'kJQP7kiw5Fk',
      duration: '29:50',
      order_index: 5
    }
  ],
  'performance-marketing-media-buying': [
    {
      id: 'p1',
      title: '01: Creative Strategy for High-Scale Paid Social',
      description: 'Building an agile UGC and high-production creative pipeline that beats algorithm fatigue.',
      youtube_video_id: 'dQw4w9WgXcQ',
      duration: '22:15',
      order_index: 1
    },
    {
      id: 'p2',
      title: '02: Meta & Google Bidding Algorithms Deconstructed',
      description: 'Account structures, CBO strategies, and advantage+ campaign scaling protocols.',
      youtube_video_id: 'L_LUpnjgPso',
      duration: '35:40',
      order_index: 2
    },
    {
      id: 'p3',
      title: '03: Landing Page Friction & Conversion Optimization',
      description: 'Turning expensive clicks into profitable conversions with frictionless funnels.',
      youtube_video_id: 'aircAruvnKk',
      duration: '28:10',
      order_index: 3
    },
    {
      id: 'p4',
      title: '04: Unit Economics & Scalable CAC Architecture',
      description: 'Understanding LTV, payback windows, and contribution margins to safely scale ad spend.',
      youtube_video_id: 'ScMzIvxBSi4',
      duration: '31:50',
      order_index: 4
    }
  ],
  'digital-experience-conversion-ux': [
    {
      id: 'd1',
      title: '01: The Modern Visual Hierarchy for High-Ticket Brands',
      description: 'How premium visual design establishes immediate trust and justifies premium pricing.',
      youtube_video_id: 'dQw4w9WgXcQ',
      duration: '20:10',
      order_index: 1
    },
    {
      id: 'd2',
      title: '02: Interactive Motion & Micro-Interactions in Webflow/Next.js',
      description: 'Using tasteful motion to guide visitor eye flow without compromising page speed.',
      youtube_video_id: 'L_LUpnjgPso',
      duration: '27:30',
      order_index: 2
    },
    {
      id: 'd3',
      title: '03: Mobile-First Checkout & Funnel Architecture',
      description: 'Eliminating mobile bounce rates and maximizing average order value.',
      youtube_video_id: 'aircAruvnKk',
      duration: '24:45',
      order_index: 3
    },
    {
      id: 'd4',
      title: '04: Continuous CRO Testing & Data Loops',
      description: 'Using heatmaps, session recordings, and A/B tests to systematically lift conversion rates.',
      youtube_video_id: 'ScMzIvxBSi4',
      duration: '30:20',
      order_index: 4
    }
  ]
};

const DEFAULT_COURSE_METADATA: Record<string, CourseData> = {
  'brand-scaling-modern-authority': {
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
  'performance-marketing-media-buying': {
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
  'digital-experience-conversion-ux': {
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
};

export default function CourseWatch() {
  const { slug } = useParams<{ slug: string }>();
  const currentSlug = slug || 'brand-scaling-modern-authority';

  const [course, setCourse] = useState<CourseData | null>(DEFAULT_COURSE_METADATA[currentSlug] || null);
  const [lessons, setLessons] = useState<Lesson[]>(DEFAULT_LESSONS[currentSlug] || []);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources'>('overview');

  // Load from Supabase if available
  useEffect(() => {
    async function loadCourseFromDb() {
      try {
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', currentSlug)
          .single();

        if (courseData) {
          setCourse(courseData);

          const { data: lessonData } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('course_id', courseData.id)
            .order('order_index', { ascending: true });

          if (lessonData && lessonData.length > 0) {
            setLessons(lessonData);
          }
        }
      } catch (err) {
        console.error('Course watch load error:', err);
      }
    }
    loadCourseFromDb();
  }, [currentSlug]);

  const activeLesson = lessons[activeLessonIndex] || lessons[0];

  const toggleCompleted = (lessonId: string) => {
    setCompletedLessonIds(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      if (activeLesson && !completedLessonIds.includes(activeLesson.id)) {
        setCompletedLessonIds(prev => [...prev, activeLesson.id]);
      }
      setActiveLessonIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course?.title || 'Eterna Masterclass',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const progressPercent = lessons.length > 0 
    ? Math.round((completedLessonIds.length / lessons.length) * 100) 
    : 0;

  // YouTube embed URL with playlist and individual video support
  const activeVideoId = activeLesson?.youtube_video_id || 'dQw4w9WgXcQ';
  const playlistParam = course?.youtube_playlist_id ? `&list=${course.youtube_playlist_id}` : '';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1${playlistParam}`;

  return (
    <div className="bg-[#000000] text-white min-h-screen pt-20 pb-20 font-sans selection:bg-[#d4ff00] selection:text-black">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-white/10 bg-[#070707]/90 backdrop-blur-md sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-[#d4ff00] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Masterclasses</span>
            </Link>
            <span className="text-white/20 hidden sm:inline">/</span>
            <div className="truncate">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/20 mr-2 uppercase">
                {course?.category || 'Masterclass'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate inline-block max-w-[200px] sm:max-w-md align-middle">
                {course?.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 text-gray-300 hover:text-white transition-colors"
              title="Share Masterclass"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${activeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-red-500/10 border border-white/10 hover:border-red-500/40 text-xs text-gray-300 hover:text-red-400 transition-colors"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Watch on YouTube</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main LMS Portal Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Stage: Cinema Video Player (70% width on Desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 16:9 Video Player Frame */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <iframe
                key={activeVideoId}
                src={embedUrl}
                title={activeLesson?.title || 'Course Player'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Below Player Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c0c0c] border border-white/10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#d4ff00]">
                    Module {activeLessonIndex + 1} of {lessons.length}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4ff00]" />
                    {activeLesson?.duration || '20:00'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-white">
                  {activeLesson?.title}
                </h1>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <button
                  onClick={handlePrevLesson}
                  disabled={activeLessonIndex === 0}
                  className="px-3.5 py-2 rounded-xl bg-[#141414] border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <button
                  onClick={() => activeLesson && toggleCompleted(activeLesson.id)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    activeLesson && completedLessonIds.includes(activeLesson.id)
                      ? 'bg-[#d4ff00]/10 border-[#d4ff00] text-[#d4ff00]'
                      : 'bg-[#141414] border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeLesson && completedLessonIds.includes(activeLesson.id) ? 'Completed' : 'Mark Complete'}</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={activeLessonIndex === lessons.length - 1}
                  className="px-3.5 py-2 rounded-xl bg-[#d4ff00] text-black disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#e0ff33] transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lesson Details Tabs */}
            <div className="rounded-2xl bg-[#0c0c0c] border border-white/10 p-6">
              <div className="flex items-center gap-6 border-b border-white/10 pb-4 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`text-xs font-mono font-bold uppercase tracking-wider pb-1 transition-all ${
                    activeTab === 'overview'
                      ? 'text-[#d4ff00] border-b-2 border-[#d4ff00]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Lesson Overview
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`text-xs font-mono font-bold uppercase tracking-wider pb-1 transition-all ${
                    activeTab === 'notes'
                      ? 'text-[#d4ff00] border-b-2 border-[#d4ff00]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Key Takeaways
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`text-xs font-mono font-bold uppercase tracking-wider pb-1 transition-all ${
                    activeTab === 'resources'
                      ? 'text-[#d4ff00] border-b-2 border-[#d4ff00]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Action Templates
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {activeLesson?.description || course?.description}
                  </p>
                  
                  <div className="p-4 rounded-xl bg-[#141414] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-0.5">Need custom execution for your brand?</h4>
                      <p className="text-xs text-gray-400">Our strategy team executes these systems directly for high-growth partners.</p>
                    </div>
                    <Link
                      to="/contact"
                      className="px-4 py-2 rounded-full bg-[#d4ff00] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e0ff33] transition-colors whitespace-nowrap"
                    >
                      Book Strategy Call
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-[#d4ff00] flex-shrink-0 mt-0.5" />
                    <span>Focus on positioning vectors rather than incremental tactical tweaks.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-[#d4ff00] flex-shrink-0 mt-0.5" />
                    <span>Every digital touchpoint must communicate category authority within 3 seconds.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-[#d4ff00] flex-shrink-0 mt-0.5" />
                    <span>Compound organic cultural capital to lower blending CAC across ad platforms.</span>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#141414] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-[#d4ff00]" />
                      <span className="text-sm font-medium text-white">Brand Architecture Strategy Canvas (PDF)</span>
                    </div>
                    <span className="text-xs font-mono text-[#d4ff00] uppercase font-bold">Included</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141414] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-[#d4ff00]" />
                      <span className="text-sm font-medium text-white">Unit Economics & ROAS Matrix Sheet</span>
                    </div>
                    <span className="text-xs font-mono text-[#d4ff00] uppercase font-bold">Included</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right / Masterclass Curriculum Sidebar (30% width on Desktop) */}
          <div className="lg:col-span-4 sticky top-36">
            <div className="rounded-2xl bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-xl">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-white/10 bg-[#121212]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white">
                    Course Modules
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#d4ff00]">
                    {progressPercent}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#d4ff00] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Lessons List */}
              <div className="max-h-[550px] overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-gray-800">
                {lessons.map((lesson, idx) => {
                  const isActive = idx === activeLessonIndex;
                  const isCompleted = completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonIndex(idx);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-4 transition-all duration-200 flex items-start gap-3.5 ${
                        isActive
                          ? 'bg-[#181818] border-l-4 border-l-[#d4ff00]'
                          : 'hover:bg-[#121212]'
                      }`}
                    >
                      {/* Play / Completed Status Icon */}
                      <div className="mt-0.5 flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#d4ff00]" />
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full bg-[#d4ff00] text-black flex items-center justify-center shadow-[0_0_12px_rgba(212,255,0,0.5)]">
                            <Play className="w-2.5 h-2.5 fill-black ml-0.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-[10px] font-mono text-gray-400">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      {/* Lesson Title & Duration */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isActive ? 'text-[#d4ff00]' : 'text-gray-400'}`}>
                            Module 0{idx + 1}
                          </span>
                          <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {lesson.duration || '20:00'}
                          </span>
                        </div>
                        <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-tight line-clamp-2 leading-snug ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {lesson.title}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-white/10 bg-[#0e0e0e] flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-500" />
                  YouTube Official Embed
                </span>
                <span className="text-[#d4ff00]">1080p HD</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
