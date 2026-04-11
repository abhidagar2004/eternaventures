import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Briefcase, MessageSquare, Users } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    testimonials: 0,
    leads: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogs, projects, testimonials, leads] = await Promise.all([
          supabase.from('blogs').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
        ]);

        if (blogs.error) throw blogs.error;
        if (projects.error) throw projects.error;
        if (testimonials.error) throw testimonials.error;
        if (leads.error) throw leads.error;

        setStats({
          blogs: blogs.count || 0,
          projects: projects.count || 0,
          testimonials: testimonials.count || 0,
          leads: leads.count || 0,
        });
      } catch (err: any) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Blogs', value: stats.blogs, icon: FileText, bg: 'bg-white', text: 'text-blue-600', border: 'border-blue-100', path: '/admin/blogs' },
    { name: 'Total Projects', value: stats.projects, icon: Briefcase, bg: 'bg-white', text: 'text-green-600', border: 'border-green-100', path: '/admin/projects' },
    { name: 'Testimonials', value: stats.testimonials, icon: MessageSquare, bg: 'bg-white', text: 'text-purple-600', border: 'border-purple-100', path: '/admin/testimonials' },
    { name: 'Total Leads', value: stats.leads, icon: Users, bg: 'bg-white', text: 'text-orange-600', border: 'border-orange-100', path: '/admin' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
      <p className="text-gray-600 mb-8">Welcome back to your control center.</p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link 
                key={stat.name} 
                to={stat.path}
                className={`rounded-3xl p-6 border ${stat.border} ${stat.bg} shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 block group`}
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`p-4 rounded-xl bg-gray-50 shadow-sm border border-gray-100/50 ${stat.text}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">{stat.name}</p>
                </div>
                {/* Decorative background icon */}
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
                  <Icon className={`w-32 h-32 ${stat.text}`} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
