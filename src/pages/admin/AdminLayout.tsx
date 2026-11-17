import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, BriefcaseBusiness, CalendarDays, ChevronDown, ExternalLink, FolderOpen, Home, Image, Info, LayoutDashboard, Layers, Loader2, LogOut, Mail, Menu, Palette, Settings, UserRound, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import '../../studio/Studio.css';

const primary = [
  { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
  { name: 'Home', path: '/admin/studio/home', icon: Home },
  { name: 'Services', path: '/admin/studio/services', icon: Layers },
  { name: 'Courses', path: '/admin/studio/courses', icon: BookOpen },
  { name: 'Projects', path: '/admin/studio/projects', icon: FolderOpen },
  { name: 'About', path: '/admin/studio/about', icon: Info },
  { name: 'Blogs', path: '/admin/studio/blogs', icon: BriefcaseBusiness },
  { name: 'Book a Call', path: '/admin/studio/contact', icon: CalendarDays },
];
const secondary = [
  { name: 'Media Library', path: '/admin/media', icon: Image },
  { name: 'Global Theme', path: '/admin/theme', icon: Palette },
  { name: 'Global Settings', path: '/admin/settings', icon: Settings },
  { name: 'Inquiries', path: '/admin/leads', icon: Mail },
];

export default function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminEmails, setAdminEmails] = useState<string[] | null>(null);
  const [accessError, setAccessError] = useState('');
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); }).catch(() => setLoading(false));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); setLoading(false); });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    let active = true;
    const request = supabase.from('site_settings').select('setting_value').eq('setting_key', 'admin_emails').maybeSingle();
    Promise.resolve(request).then(({ data, error }) => {
      if (!active) return;
      if (error) setAccessError('Unable to verify administrator access. Please reload.');
      setAdminEmails(Array.isArray(data?.setting_value) ? data.setting_value.map((email: string) => email.toLowerCase()) : []);
    }).catch(() => { if (active) { setAccessError('Unable to verify administrator access. Please reload.'); setAdminEmails([]); } });
    return () => { active = false; };
  }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/admin/login');
  }
  if (loading || adminEmails === null) return <div className="studio-loading"><Loader2 className="animate-spin" />Loading Studio…</div>;
  if (!session) return <Navigate to="/admin/login" replace />;
  if (accessError) return <div className="studio-loading" role="alert">{accessError}</div>;
  if (!adminEmails.includes(session.user.email?.toLowerCase() || '')) return <div className="studio-loading"><p>This account does not have Studio administrator access.</p><Link to="/">Return to website</Link></div>;
  const studioRoute = location.pathname.includes('/studio/') || ['/admin/theme', '/admin/settings', '/admin/overview'].includes(location.pathname);
  return <div className="studio-shell">
    <button className="studio-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle Studio navigation">{open ? <X /> : <Menu />}</button>
    {open && <button className="studio-sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`studio-sidebar${open ? ' is-open' : ''}`}>
      <Link className="studio-brand" to="/admin/overview"><strong>Eterna<span>Ventures</span></strong><span>Studio</span></Link>
      <nav aria-label="Studio navigation">{[primary, secondary].map((group, index) => <div className="studio-nav-group" key={index}>{group.map(({ name, path, icon: Icon }) => <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'is-active' : ''}><Icon size={21} /><span>{name}</span></NavLink>)}</div>)}</nav>
      <div className="studio-account"><button onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen}><UserRound size={23} /><span><strong>Admin</strong><small>{session.user.email}</small></span><ChevronDown size={16} /></button>{accountOpen && <div><a href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />View website</a><button onClick={logout}><LogOut size={15} />Sign out</button></div>}</div>
    </aside>
    <main className="studio-main"><div className={studioRoute ? 'studio-workspace' : 'studio-workspace studio-legacy'}>{!studioRoute && <div className="studio-legacy-heading"><Link to="/admin/overview">Studio</Link><span>›</span><Link to="/admin/settings">Manage website</Link><a href="/" target="_blank" rel="noopener noreferrer">View website <ExternalLink size={14} /></a></div>}<Outlet /></div></main>
  </div>;
}
