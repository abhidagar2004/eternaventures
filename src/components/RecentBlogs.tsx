import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function RecentBlogs() {
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error("Error fetching recent blogs:", error);
          setError(error.message);
        } else if (data) {
          setRecentBlogs(data);
        }
      } catch (err: any) {
        console.error("Exception fetching recent blogs:", err);
        setError(err.message);
      }
    };
    
    fetchBlogs();
  }, []);

  if (error) {
    return (
      <section className="py-24 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-red-500">
          <p>Error loading recent blogs: {error}</p>
        </div>
      </section>
    );
  }

  if (recentBlogs.length === 0) return null;

  return (
    <section className="py-24 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[#2596be] font-bold tracking-widest uppercase text-sm mb-3">Insights</h2>
            <h3 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter text-white leading-none">
              Latest from the Growth Hub
            </h3>
          </div>
          <Link to="/blogs" className="text-[#2596be] font-bold uppercase tracking-wider flex items-center gap-2 hover:text-[#2596be] transition-colors group">
            View All Articles <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentBlogs.map((blog, i) => (
            <Link to={`/blogs/${blog.slug}`} key={blog.id}>
              <motion.article 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }} 
                className="group cursor-pointer h-full flex flex-col bg-[#111] p-4 rounded-2xl border border-gray-800 hover:border-[#2596be]/50 transition-all"
              >
                <div className="relative h-56 rounded-xl overflow-hidden mb-6">
                  <img src={blog.thumbnail_url || 'https://picsum.photos/seed/blog/800/600'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="absolute top-4 left-4 bg-black/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide border border-gray-800">
                      {blog.tags[0]}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 px-2 uppercase tracking-widest font-bold">
                  <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2596be] transition-colors px-2 line-clamp-2 uppercase tracking-wide">{blog.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2 flex-1 px-2">{blog.content.substring(0, 100)}...</p>
                <div className="flex items-center gap-2 text-[#2596be] font-bold uppercase tracking-wider mt-auto px-2 pb-2">
                  Read Article <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
