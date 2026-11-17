import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ExternalLink, FileText, LayoutPanelTop, Menu, Palette, Pencil, Search, Shield, Tags, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { mergeNavbar } from './sharedSettings';
import NavigationPreview from './NavigationPreview';
import './StudioSettings.css';

const groups = [
  { title: 'Website structure', items: [
    { name: 'Header & Navigation', text: 'Logo, navigation links, and Book a Call button.', path: '/admin/navbar', icon: Menu },
    { name: 'Global Footer', text: 'Brand description, social profiles, and footer links.', path: '/admin/footer', icon: LayoutPanelTop },
  ] },
  { title: 'Shared content', items: [
    { name: 'Categories', text: 'Organize your articles, courses, and projects.', path: '/admin/categories', icon: Tags },
    { name: 'Testimonials', text: 'Client reviews and profile images.', path: '/admin/testimonials', icon: Users },
  ] },
  { title: 'Administration', items: [
    { name: 'Legal Pages', text: 'Terms, privacy, and copyright content.', path: '/admin/legal', icon: FileText },
    { name: 'Administrators', text: 'Manage your existing administrator accounts.', path: '/admin/admins', icon: Shield },
  ] },
];
export default function StudioSettings() {
  const [search, setSearch] = useState(''), [config, setConfig] = useState(() => mergeNavbar());
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { let active = true; Promise.resolve(supabase.from('site_settings').select('setting_value').eq('setting_key', 'navbar_config').maybeSingle()).then(({ data, error }) => { if (active && !error) { setConfig(mergeNavbar(data?.setting_value)); setLoaded(true); } }).catch(() => {}); return () => { active = false; }; }, []);
  const filtered = groups.map(group => ({ ...group, items: group.items.filter(item => `${group.title} ${item.name} ${item.text}`.toLowerCase().includes(search.toLowerCase())) })).filter(group => group.items.length);
  return <div className="settings-overview"><div className="studio-breadcrumb settings-overview-toolbar"><span>Studio <span> / </span> Global Settings</span><div><label className="settings-search"><Search size={18} /><input aria-label="Search settings" placeholder="Search settings…" value={search} onChange={e => setSearch(e.target.value)} /></label><a className="settings-outline-action" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={17} />View website</a></div></div><header className="studio-page-header"><div><h1>Global Settings</h1><p>Manage shared navigation, footer, categories, and website administration.</p></div></header>
    <div className="settings-navigation-overview"><div className="studio-panel settings-preview-panel">{loaded ? <NavigationPreview config={config} /> : <p>Loading navigation preview…</p>}</div><Link className="settings-outline-action" to="/admin/navbar"><Pencil size={19} />Edit navigation</Link></div>
    <div className="settings-group-list">{filtered.map(group => <section className="settings-overview-group" key={group.title}><h2>{group.title}</h2><div>{group.items.map(({ name, text, path, icon: Icon }) => <Link className="studio-panel settings-overview-card" to={path} key={path}><span className="settings-card-icon"><Icon size={27} /></span><div><h2>{name}</h2><p>{text}</p></div><ChevronRight size={22} /></Link>)}</div></section>)}{!filtered.length && <p className="settings-empty">No settings match “{search}”.</p>}</div>
    <div className="settings-theme-hint"><Palette size={25} /><span>Looking for fonts or colors?</span><Link to="/admin/theme">Open Global Theme <ArrowRight size={20} /></Link></div>
  </div>;
}
