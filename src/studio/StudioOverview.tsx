import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, FileText, Image, Mail, Palette, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { STUDIO_PAGES } from './types';

export default function StudioOverview() {
  const [published, setPublished] = useState<string[]>([]);
  const [counts, setCounts] = useState({ projects: 0, blogs: 0, courses: 0, inquiries: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      const [settings, projects, blogs, courses, leads] = await Promise.all([
        supabase.from('site_settings').select('setting_key').like('setting_key', 'studio:published:%'),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
      ]);
      if (!active) return;
      const failure = [settings, projects, blogs, courses, leads].find(result => result.error);
      if (failure?.error) setError(failure.error.message);
      setPublished(settings.data?.map(item => item.setting_key.replace('studio:published:', '')) || []);
      setCounts({ projects: projects.count || 0, blogs: blogs.count || 0, courses: courses.count || 0, inquiries: leads.count || 0 });
    }
    load().catch(() => { if (active) setError('Unable to load website statistics.'); });
    return () => { active = false; };
  }, []);
  return <div><div className="studio-breadcrumb">Studio <span>›</span> Overview</div><header className="studio-page-header"><div><h1>Website overview</h1><p>Manage your website pages, content, and reusable assets in EternaVentures Studio.</p></div></header>
    {error && <p role="alert" className="studio-error">{error}</p>}
    <div className="studio-quick-actions">{[
      { title: 'Edit homepage', text: 'Update page content, sections, and images.', icon: Pencil, to: '/admin/studio/home' },
      { title: 'Upload media', text: 'Manage your images, videos, and files.', icon: Image, to: '/admin/media' },
      { title: 'Manage inquiries', text: 'View website project inquiries.', icon: Mail, to: '/admin/leads' },
      { title: 'Edit website theme', text: 'Update colors, typography, and styles.', icon: Palette, to: '/admin/theme' },
    ].map(({ title, text, icon: Icon, to }) => <Link key={title} to={to} className="studio-panel"><Icon size={25} /><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={18} /></Link>)}</div>
    <div className="studio-overview-grid"><section className="studio-panel studio-pages-table"><header><h2>Pages</h2><p>Open a page to edit its content and design.</p></header><table><thead><tr><th>Page</th><th>URL</th><th>Studio changes</th><th>Actions</th></tr></thead><tbody>{STUDIO_PAGES.map(page => <tr key={page.id}><td><FileText size={18} />{page.name}</td><td>{page.path}</td><td><span className="studio-status">{published.includes(page.path) ? 'Published' : 'Website defaults'}</span></td><td><div><Link to={`/admin/studio/${page.id}`}><Pencil size={15} />Edit content</Link><Link to={`/admin/studio/${page.id}?tab=design`}><Palette size={15} />Edit design</Link><a href={page.path} target="_blank" rel="noopener noreferrer"><Eye size={15} />Preview</a></div></td></tr>)}</tbody></table></section>
    <aside className="studio-panel studio-overview-side"><h2>Content Library</h2>{Object.entries(counts).map(([key, count]) => <Link key={key} to={key === 'inquiries' ? '/admin/leads' : `/admin/${key}`}><span>{key}</span><strong>{count}</strong><ArrowRight size={16} /></Link>)}<h3>Shared website sections</h3><Link to="/admin/navbar">Header & Navigation <ArrowRight size={16} /></Link><Link to="/admin/footer">Global Footer <ArrowRight size={16} /></Link><Link to="/admin/testimonials">Testimonials <ArrowRight size={16} /></Link></aside></div>
  </div>;
}
