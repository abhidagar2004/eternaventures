export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  brochure_url?: string;
  brochure_btn_text?: string;
  category_names: string[];
}
export interface ProjectReview {
  id: string;
  name: string;
  role: string;
  content: string;
  image_url: string;
  rating: number;
}
const storage = 'https://hcysdrryywfefpkknyyj.supabase.co/storage/v1/object/public/uploads/';
const brochure = `${storage}grras10x%20UIUX%20Brochure%20(2).pdf`;
export const DEFAULT_PROJECTS: Project[] = [
  { id: '66f3c8c8-eca4-475f-ba0c-c737670310da', title: 'Valia – Sunscreen Packaging Design', description: 'Designed a fresh and playful packaging concept for Valia Sunscreen, inspired by tropical elements and summer vibes. The design uses soft colors and minimal illustrations to create a clean, modern, and skin-friendly brand appeal.', image_url: `${storage}3.jpg`, brochure_url: brochure, category_names: ['Packaging Design'] },
  { id: '7f28bcc1-baa3-45c7-8a7e-61ce1b8044d6', title: 'Amrita Naturals – E-commerce Website Design', description: 'Designed a clean and nature-inspired e-commerce website for Amrita Naturals, focusing on a fresh green aesthetic and user-friendly shopping experience.', image_url: `${storage}35.jpg`, brochure_url: brochure, category_names: ['Website Design'] },
  { id: '9c9e448b-83a6-44b7-ac55-165bbe5e0b87', title: 'Digital Marketing Campaign – Social Media Growth Strategy', description: 'Executed a digital marketing campaign focused on increasing brand visibility and engagement. The strategy included social media content, audience targeting, and performance optimization to drive traffic, interactions, and conversions.', image_url: `${storage}digital-marketing.jpg`, category_names: ['Digital Marketing'] },
  { id: '956f12ee-bb10-4c6f-87ad-d5ea3e4c9951', title: 'Fire in the Disco – Craft Beer Can Design', description: 'Designed a bold and vibrant can packaging for Fire in the Disco, inspired by nightlife energy and party vibes. The design uses striking colors, playful shapes, and strong typography to create a fun, eye-catching identity for a modern craft beer brand.', image_url: `${storage}31.jpg`, category_names: ['Packaging Design'] },
  { id: '2cbb56f9-3096-4869-a7e3-edd20caa4a69', title: 'Classic Espresso Bites – Premium Chocolate Packaging Design', description: 'Designed a premium packaging concept for Classic Espresso Bites, blending rich green tones with coffee-inspired visuals. The design highlights natural ingredients, smooth flavor, and a strong connection to coffee origins, creating a modern and artisanal brand feel.', image_url: `${storage}9.jpg`, category_names: ['Packaging Design'] },
];
// Local copies of the existing public project media; new admin uploads retain their own URLs.
export const LOCAL_PROJECT_IMAGES: Record<string, string> = {
  [`${storage}3.jpg`]: '/images/project-valia.jpg',
  [`${storage}35.jpg`]: '/images/project-amrita.jpg',
  [`${storage}digital-marketing.jpg`]: '/images/project-digital-growth.jpg',
  [`${storage}31.jpg`]: '/images/project-disco.jpg',
  [`${storage}9.jpg`]: '/images/project-espresso.jpg',
};
export const DEFAULT_PROJECT_REVIEWS: ProjectReview[] = [
  { id: '7fbcf70d-6f1c-4b7b-9b60-bab355f04b47', name: 'Nadia Premnawari', role: 'Co-Founder, Véra', content: 'EternaVentures helped us sharpen our brand, tell a clearer story, and drive real business growth across every channel.', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', rating: 5 },
  { id: 'dadc4e11-4a4c-4bce-8189-90571fa18484', name: 'Rishy Aditya', role: 'CEO, Rooted', content: "A rare partner that combines big-picture strategy with flawless execution. They've had a huge impact on our growth.", image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', rating: 5 },
  { id: '04454c2f-e604-49ea-9867-0d1a5b7769c1', name: 'Daniel Hartono', role: 'Founder, The Disco Room', content: 'Strategic, creative, and performance-obsessed. The team at EternaVentures really understands how to build brands that last.', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', rating: 5 },
];
export const PROJECT_PAGE_DEFAULTS: Record<string, string> = {
  banner_heading: 'Work That Moves Brands.', banner_subheading: 'Our work across packaging, web and digital marketing.',
  numbers_stat1_value: '₹12Cr+', numbers_stat1_label: 'Revenue Generated', numbers_stat2_value: '320M+', numbers_stat2_label: 'Impressions Delivered', numbers_stat3_value: '180+', numbers_stat3_label: 'Projects Completed', numbers_stat4_value: '75+', numbers_stat4_label: 'Brands Served',
  our_work_heading: 'Featured Projects', our_work_cta_text: 'Start a Project', reviews_tag: 'Client Love', reviews_heading: 'Don’t just take our word for it.',
  cta_heading: 'Ready to See Results Like These?', cta_subheading: "We help brands scale with clarity, strategy, and execution — not guesswork. If you’re serious about growth, let’s talk.", cta_btn_text: 'Get Your Free Growth Audit',
};
