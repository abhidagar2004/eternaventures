import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, FileText, Briefcase, Tags, MessageSquare, Users, LogOut, Loader2, Home, FolderOpen, ShieldCheck, Layout, Type } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Website Pages', path: '/admin/pages', icon: LayoutDashboard },
    { name: 'Global Typography', path: '/admin/global-sections', icon: Type },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Services Page', path: '/admin/services-page', icon: Briefcase },
    { name: 'Leads', path: '/admin', icon: Users },
    { name: 'Manage Navbar', path: '/admin/navbar', icon: LayoutDashboard },
    { name: 'Manage Footer', path: '/admin/footer', icon: Layout },
    { name: 'Media Library', path: '/admin/media', icon: FolderOpen },
    { name: 'Contact & FAQs', path: '/admin/contact-page', icon: MessageSquare },
    { name: 'Manage Admins', path: '/admin/admins', icon: ShieldCheck },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden text-gray-900 font-sans">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col flex-shrink-0 z-10 relative">
        <div className="h-20 flex items-center px-8 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-bold text-lg leading-none">E</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#18181b] text-blue-400 shadow-sm border border-gray-800/50'
                    : 'text-gray-400 hover:bg-[#121212] hover:text-gray-200'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#1a1a1a] space-y-2 bg-[#0a0a0a]">
          <Link
            to="/"
            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-400 rounded-xl hover:bg-[#121212] hover:text-gray-200 transition-all duration-200"
          >
            <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-500 rounded-xl hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
        <div className="p-8 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
