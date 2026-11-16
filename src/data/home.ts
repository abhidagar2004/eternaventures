import { HOME_SEEDED_COPY, HOME_SEEDED_ORDER } from './homeSeed';

export const HOME_DEFAULTS: Record<string, string> = {
 hero_text: 'We build brands that\nown their market position.', hero_description: 'Strategy, storytelling, digital experiences, and performance, working together.',
 marquee_text: 'WE DON’T RUN CAMPAIGNS. WE CONSTRUCT ECOSYSTEMS.',
 phil_title: 'Growth is not a campaign.\nIt’s a discipline.', phil_description: 'We are a creative growth agency that helps brands build lasting market position through strategic thinking, compelling storytelling, and integrated execution.\n\nFrom brand and content to experience and performance, we bring together the right disciplines to create momentum that compounds.',
 help_tag: 'What We Do', help_heading: 'Six practices. One integrated\ngrowth engine.', help_button_text: 'View All Services',
 method_tag: 'Our Approach', method_title: 'The EternaVentures Method', method_quote: 'A proven, end-to-end approach that turns strategy into sustained growth.',
 method_step1_title: 'Audit & Discovery', method_step1_desc: 'Uncover real opportunities by understanding your brand, market, and audience.',
 method_step2_title: 'Strategic Foundation', method_step2_desc: 'Turn insight into a clear, focused strategy, from positioning to execution roadmap.',
 method_step3_title: 'Build & Activate', method_step3_desc: 'Bring the strategy to life across brand, content, experience, and performance.',
 method_step4_title: 'Measured Compound Growth', method_step4_desc: 'Track, learn, and refine to build sustained, long-term momentum.',
 serve_tag: 'Who We Work With', serve_title: 'Built for brands\nwith real ambition.', serve_subheading: 'We partner with forward-thinking brands across industries to shape distinctive stories, build cultural relevance, and drive meaningful growth.',
 our_work_heading: 'A glimpse into\nwhat we build.', our_work_subheading: 'A curated look at recent work across brand, creative, content, and digital, spanning from new launches to category reinvention.', our_work_btn_text: 'See Work',
 testimonials_tag: 'Testimonials', testimonials_title: 'Experiences that\nspeak for themselves.',
 blogs_title: 'Read our latest blogs', blogs_subheading: 'Insights, thought starters, and industry notes directly from our expert team.',
 cta_heading: 'Ready to stop competing\nand start leading?', cta_subheading: 'Tell us about your brand, and let’s explore what’s next for it.', cta_btn_text: 'Get in Touch', cta_btn_link: '/contact', cta_email: 'hello@eternaventures.in',
};
export const HOME_PRACTICES = [
 {slug:'brand-architecture-identity-systems', title:'Brand Architecture & Identity Systems', text:'Build distinctive, enduring brands with clarity, cohesion, and creative precision.', image:'/images/about-branding-hd.jpg'},
 {slug:'narrative-engineering', title:'Narrative Engineering', text:'Turn strategy into stories that resonate, influence, and drive action.', image:'/images/home-narrative.jpg'},
 {slug:'performance-paid-intelligence', title:'Performance & Paid Intelligence', text:'Translate creative and strategy into measurable, compounding growth.', image:'/images/about-performance-hd.jpg'},
 {slug:'influence-cultural-capital', title:'Influence & Cultural Capital', text:'Build relevance and credibility through creators, communities, and culture.', image:'/images/home-influence.jpg'},
 {slug:'digital-experience-design', title:'Digital Experience Design', text:'Design digital experiences that are beautiful, intuitive, and built to convert.', image:'/images/about-experience-hd.jpg'},
 {slug:'market-intelligence-growth-advisory', title:'Market Intelligence & Growth Advisory', text:'Turn insights into focused opportunities and practical growth strategies.', image:'/images/home-intelligence.jpg'},
];
export const HOME_AUDIENCES = [
 {title:'Challenger Brands',desc:'Bold, agile brands ready to create category momentum.'},
 {title:'Ethical Hospitality',desc:'Purpose-led hospitality brands built on people, places, and impact.'},
 {title:'Professional Services',desc:'Expertise-driven firms looking to build visibility and trust.'},
 {title:'Startups & Founders',desc:'Early and growth-stage ventures ready to scale with focus and clarity.'},
 {title:'Full-Funnel Performance',desc:'Strategy, creative, and media working together across the entire customer journey.'},
 {title:'Culture-First Strategy',desc:'Brand and content systems that build loyalty from within and beyond.'},
 {title:'Health & Wellness',desc:'Wellness, lifestyle, and health brands with a people-first approach.'},
 {title:'Fashion & Luxury',desc:'Distinctive fashion and luxury labels that value craft, culture, and community.'},
];
export const HOME_ORDER = ['hero','marquee','philosophy','services','marquee_logos','method','who_we_serve','work','testimonials','blogs','cta'];
export function isImageMedia(url: string) { return /\.(avif|webp|png|jpe?g|gif|svg)(?:[?#]|$)/i.test(url); }

export function resolveHomeContent(data: Record<string, any>): Record<string, any> {
 const next = {...data, ...HOME_DEFAULTS};
 for(const key of Object.keys(HOME_DEFAULTS)) {
  if(typeof data[key] === 'string' && data[key].trim() && data[key] !== HOME_SEEDED_COPY[key]) next[key] = data[key];
 }
 if(JSON.stringify(data.section_order) === JSON.stringify(HOME_SEEDED_ORDER)) next.section_order = HOME_ORDER;
 return next;
}
