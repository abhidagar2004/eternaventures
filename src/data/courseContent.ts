export interface Lesson {
  id: string;
  course_id?: string;
  title: string;
  description?: string;
  youtube_video_id: string;
  duration?: string;
  order_index?: number;
}

export interface CourseData {
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

export const DEFAULT_LESSONS: Record<string, Lesson[]> = {
  'brand-scaling-modern-authority': [
    {
      id: 'l1',
      title: '01: The Psychology of Brand Dominance',
      description: 'Why most brands remain commodities and how market leaders create category moats and compounding pricing power.',
      youtube_video_id: '',
      duration: '18:40',
      order_index: 1
    },
    {
      id: 'l2',
      title: '02: Positioning Vector & Messaging Matrices',
      description: 'How to write category-defining positioning claims and message architectures that stick in the customer psyche.',
      youtube_video_id: '',
      duration: '24:15',
      order_index: 2
    },
    {
      id: 'l3',
      title: '03: Visual Identity & Sensory Triggers',
      description: 'Color psychology, typography scaling, and high-impact visual grammar for digital touchpoints.',
      youtube_video_id: '',
      duration: '31:20',
      order_index: 3
    },
    {
      id: 'l4',
      title: '04: Building Viral Cultural Capital',
      description: 'Turning customers into cult advocates and engineering organic engagement loops in high-noise social feeds.',
      youtube_video_id: '',
      duration: '22:05',
      order_index: 4
    },
    {
      id: 'l5',
      title: '05: The Omni-Channel Launch Blueprint',
      description: 'A complete step-by-step launch playbook for testing, rollout, and scaling market authority across digital channels.',
      youtube_video_id: '',
      duration: '29:50',
      order_index: 5
    }
  ],
  'performance-marketing-media-buying': [
    {
      id: 'p1',
      title: '01: Creative Strategy for High-Scale Paid Social',
      description: 'Building an agile UGC and high-production creative pipeline that beats algorithm fatigue.',
      youtube_video_id: '',
      duration: '22:15',
      order_index: 1
    },
    {
      id: 'p2',
      title: '02: Meta & Google Bidding Algorithms Deconstructed',
      description: 'Account structures, CBO strategies, and advantage+ campaign scaling protocols.',
      youtube_video_id: '',
      duration: '35:40',
      order_index: 2
    },
    {
      id: 'p3',
      title: '03: Landing Page Friction & Conversion Optimization',
      description: 'Turning expensive clicks into profitable conversions with frictionless funnels.',
      youtube_video_id: '',
      duration: '28:10',
      order_index: 3
    },
    {
      id: 'p4',
      title: '04: Unit Economics & Scalable CAC Architecture',
      description: 'Understanding LTV, payback windows, and contribution margins to safely scale ad spend.',
      youtube_video_id: '',
      duration: '31:50',
      order_index: 4
    }
  ],
  'digital-experience-conversion-ux': [
    {
      id: 'd1',
      title: '01: The Modern Visual Hierarchy for High-Ticket Brands',
      description: 'How premium visual design establishes immediate trust and justifies premium pricing.',
      youtube_video_id: '',
      duration: '20:10',
      order_index: 1
    },
    {
      id: 'd2',
      title: '02: Interactive Motion & Micro-Interactions in Webflow/Next.js',
      description: 'Using tasteful motion to guide visitor eye flow without compromising page speed.',
      youtube_video_id: '',
      duration: '27:30',
      order_index: 2
    },
    {
      id: 'd3',
      title: '03: Mobile-First Checkout & Funnel Architecture',
      description: 'Eliminating mobile bounce rates and maximizing average order value.',
      youtube_video_id: '',
      duration: '24:45',
      order_index: 3
    },
    {
      id: 'd4',
      title: '04: Continuous CRO Testing & Data Loops',
      description: 'Using heatmaps, session recordings, and A/B tests to systematically lift conversion rates.',
      youtube_video_id: '',
      duration: '30:20',
      order_index: 4
    }
  ]
};

export const DEFAULT_COURSE_METADATA: Record<string, CourseData> = {
  'brand-scaling-modern-authority': {
    id: '1',
    title: 'Brand Scaling & Modern Authority Blueprint',
    slug: 'brand-scaling-modern-authority',
    category: 'Brand Strategy',
    description: 'Master the psychology of brand dominance, category positioning, and high-impact identity architectures that command pricing power.',
    thumbnail_url: '/images/academy-brand-v2.png',
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
    thumbnail_url: '/images/academy-growth-v2.png',
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
    thumbnail_url: '/images/academy-design-v2.png',
    level: 'All Levels',
    duration: '1h 50m',
    lessons_count: 4
  }
};
