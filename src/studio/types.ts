export interface StudioOverride {
  text?: string;
  src?: string;
  href?: string;
  alt?: string;
  placeholder?: string;
  styles?: Record<string, string>;
  tabletStyles?: Record<string, string>;
  mobileStyles?: Record<string, string>;
  order?: number;
}

export interface StudioDocument {
  version: string;
  updatedAt: string;
  overrides: Record<string, StudioOverride>;
  seo: { title: string; description: string };
  theme: Record<string, string>;
}

export interface StudioElement {
  selector: string;
  section: string;
  label: string;
  type: 'heading' | 'text' | 'link' | 'image' | 'video' | 'field' | 'section';
  library?: string;
  text: string;
  src: string;
  href: string;
  alt: string;
  placeholder?: string;
  styles: Record<string, string>;
}

export interface StudioSection {
  selector: string;
  label: string;
  elements: StudioElement[];
}

export const STUDIO_PAGES = [
  { id: 'home', name: 'Home', path: '/', library: '/admin/home-page' },
  { id: 'services', name: 'Services', path: '/services', library: '/admin/services' },
  { id: 'courses', name: 'Courses', path: '/courses', library: '/admin/courses' },
  { id: 'projects', name: 'Projects', path: '/projects', library: '/admin/projects' },
  { id: 'about', name: 'About', path: '/about', library: '/admin/about-page' },
  { id: 'blogs', name: 'Blogs', path: '/blogs', library: '/admin/blogs' },
  { id: 'contact', name: 'Book a Call', path: '/contact', library: '/admin/contact-page' },
];

export function emptyStudioDocument(): StudioDocument {
  return { version: '', updatedAt: '', overrides: {}, seo: { title: '', description: '' }, theme: {} };
}
