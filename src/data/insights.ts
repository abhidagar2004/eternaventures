export interface Insight {
  id: string; slug: string; title: string; thumbnail_url: string; tags: string[]; created_at: string;
  excerpt?: string; content?: string; visibility?: string;
}
const storage = 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/';
export const INSIGHT_PRESENTATION: Record<string, { category: string; image: string; originalImage: string; excerpt: string }> = {
  'aeo-105-how-social-media-powers-ai-discovery-for-brands': { category: 'AI & Search', image: '/images/insights-search-hd.jpg', originalImage: `${storage}link.webp`, excerpt: 'How social platforms are shaping AI discovery, brand visibility, and the next phase of growth.' },
  'aeo-101-how-social-media-powers-ai-discovery-for-brands': { category: 'AI & Search', image: '/images/insights-aeo-hd.jpg', originalImage: `${storage}Brand%20strategy%20in%20action.png`, excerpt: 'A beginner-friendly guide to how social media fuels AI discovery and brand momentum.' },
  'the-latest-tech-breakthroughs-and-marketing-shifts-of-2026-a-newfronts-recap': { category: 'Marketing Trends', image: '/images/insights-conference-hd.jpg', originalImage: `${storage}Marketing%20analytics%20meeting%20in%20focus.png`, excerpt: 'The biggest announcements, emerging trends, and what they mean for marketers in 2026.' },
};
export const DEFAULT_INSIGHTS: Insight[] = [
  { id: '8bdb5139-cc87-45dc-823e-52defce5ff8c', slug: 'aeo-105-how-social-media-powers-ai-discovery-for-brands', title: 'AEO 105: How Social Media Powers AI Discovery for Brands', thumbnail_url: '/images/insights-search-hd.jpg', tags: ['AI & Search'], created_at: '2026-04-14T09:29:21.318045+00:00', visibility: 'visible' },
  { id: 'a6d1fc88-7218-4566-b0ed-60658c4b2acb', slug: 'aeo-101-how-social-media-powers-ai-discovery-for-brands', title: 'AEO 101: How Social Media Powers AI Discovery for Brands', thumbnail_url: '/images/insights-aeo-hd.jpg', tags: ['AI & Search'], created_at: '2026-04-14T09:26:33.328730+00:00', visibility: 'visible' },
  { id: 'ff36a71e-61e7-4d76-95cc-f274dbfd4245', slug: 'the-latest-tech-breakthroughs-and-marketing-shifts-of-2026-a-newfronts-recap', title: 'The Latest Tech Breakthroughs and Marketing Shifts of 2026: A NewFronts Recap', thumbnail_url: '/images/insights-conference-hd.jpg', tags: ['Marketing Trends'], created_at: '2026-04-08T10:08:17.929054+00:00', visibility: 'visible' },
];
export const INSIGHTS_PAGE_DEFAULTS: Record<string, string> = {
  banner_badge: 'ETERNAVENTURES / INSIGHTS', banner_heading: 'The Growth Hub.', banner_subheading: 'Strategies, insights, and playbooks from the frontlines of digital marketing.',
  main_header_heading: 'Latest Insights', subtext_content: 'Actionable ideas, deep dives, and real-world marketing insights to help you grow smarter in the age of AI.',
  cta_heading: 'LET’S BUILD YOUR GROWTH ENGINE.', cta_subheading: 'Turn insights into impact with a growth partner that blends strategy, creativity, and execution.', cta_btn_text: 'View Our Case Studies',
};
export const plainText = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export function insightCategories(blog: Insight): string[] {
  const tags = Array.isArray(blog.tags) ? blog.tags.filter(tag => typeof tag === 'string' && tag.trim()) : [];
  const presentation = INSIGHT_PRESENTATION[blog.slug];
  return presentation && (!tags.length || (tags.length === 1 && tags[0].toLowerCase() === 'krutik')) ? [presentation.category] : tags.length ? tags : ['Insights'];
}
export function insightImage(blog: Insight): string {
  const presentation = INSIGHT_PRESENTATION[blog.slug];
  return presentation && (!blog.thumbnail_url || blog.thumbnail_url === presentation.originalImage) ? presentation.image : blog.thumbnail_url;
}
export function insightExcerpt(blog: Insight): string {
  const excerpt = plainText(blog.excerpt || '');
  return (!excerpt || excerpt === 'helllom this is the summery or this blog') && INSIGHT_PRESENTATION[blog.slug] ? INSIGHT_PRESENTATION[blog.slug].excerpt : excerpt || plainText(blog.content || '').slice(0, 160);
}

export function selectInsights(blogs: Insight[], category: string, query: string, sortBy: string): Insight[] {
  const search = query.trim().toLowerCase();
  const time = (value: string) => Date.parse(value) || 0;
  return blogs.filter(blog => blog.visibility !== 'hidden')
    .filter(blog => category === 'All' || insightCategories(blog).some(tag => tag.toLowerCase() === category.toLowerCase()))
    .filter(blog => `${blog.title} ${insightExcerpt(blog)} ${insightCategories(blog).join(' ')}`.toLowerCase().includes(search))
    .sort((a, b) => sortBy === 'Newest' ? time(b.created_at) - time(a.created_at) : time(a.created_at) - time(b.created_at));
}
