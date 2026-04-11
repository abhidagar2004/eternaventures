import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import CTA from '../components/CTA';
import { motion } from 'motion/react';
import { ArrowRight, Search, User, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [sortBy, setSortBy] = useState('Newest');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [blogSettings, setBlogSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Blogs and Settings
        const [blogsRes, contentRes, settingsRes] = await Promise.all([
          supabase.from('blogs').select('*').order('created_at', { ascending: false }),
          supabase.from('blogs_page_content').select('*').order('created_at', { ascending: false }).limit(1).single(),
          supabase.from('blog_settings').select('*').limit(1).single()
        ]);
        
        if (blogsRes.error) throw blogsRes.error;
        if (blogsRes.data) setBlogs(blogsRes.data);

        if (contentRes.data) setContent(contentRes.data);
        if (settingsRes.data) setBlogSettings(settingsRes.data);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const c = content || {};

  // Extract unique categories from tags
  const categories = ['All', ...Array.from(new Set(blogs.flatMap(blog => blog.tags || [])))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesVisibility = blog.visibility !== 'hidden';
    const matchesCategory = selectedCategory === 'All' || (blog.tags && blog.tags.includes(selectedCategory));
    return matchesVisibility && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'Oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return 0;
  });

  if (loading && !blogs.length && !content) {
    return (
      <div className="pt-40 flex justify-center py-20 bg-black min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be]"></div>
      </div>
    );
  }

  return (
    <div className={`pt-20 min-h-screen ${c.font_style || 'font-sans'}`} style={{ backgroundColor: c.page_bg_color || '#ffffff' }}>
      <PageHeader 
        badge={c.banner_badge} 
        badgeColor={c.banner_badge_color}
        title={c.banner_heading} 
        description={c.banner_subheading} 
        bgImage={c.banner_bg_image}
        overlayColor={c.banner_overlay_color || '#000000'}
        overlayOpacity={c.banner_overlay_opacity ?? 0.5}
        titleColor={c.banner_heading_color || '#ffffff'}
        titleSize={c.banner_heading_size || 'text-6xl md:text-8xl'}
        descColor={c.banner_subheading_color || '#9ca3af'}
        descSize={c.banner_subheading_size || 'text-xl md:text-2xl'}
        paddingTop={c.banner_padding_top || "200"}
        paddingBottom={c.banner_padding_bottom || "100"}
      />
      
      <section className="py-24" style={{ backgroundColor: c.section_bg_color || '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Main Header Section */}
          {((c.main_header_heading && c.main_header_heading.trim() !== "") || (c.subtext_content && c.subtext_content.trim() !== "")) && (
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
              {c.main_header_heading && c.main_header_heading.trim() !== "" && (
                <h1 
                  className={`${c.main_header_heading_size || 'text-[3.5rem] md:text-[5.5rem] lg:text-[7rem]'} font-black leading-[0.9] tracking-tighter`}
                  style={{ color: c.main_header_heading_color || '#000000' }}
                  dangerouslySetInnerHTML={{ __html: c.main_header_heading }}
                />
              )}
              
              <div className="flex flex-col items-start lg:items-end gap-6 max-w-sm mt-4 lg:mt-0">
                {c.subtext_content && c.subtext_content.trim() !== "" && (
                  <p 
                    className={`${c.subtext_size || 'text-lg md:text-xl'} font-bold text-left lg:text-right leading-tight tracking-tight`}
                    style={{ color: c.subtext_color || '#111827' }}
                  >
                    {c.subtext_content}
                  </p>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ 
                      backgroundColor: c.sort_btn_bg_color || '#c2ff00',
                      color: c.sort_btn_text_color || '#000000'
                    }}
                    className="hover:opacity-90 font-extrabold uppercase px-8 py-4 rounded-full text-[13px] tracking-[0.15em] transition-transform active:scale-95 flex items-center gap-2 shadow-sm"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Sort: {sortBy}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full right-0 lg:left-0 lg:right-auto mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-20">
                      <button 
                        onClick={() => { setSortBy('Newest'); setDropdownOpen(false); }} 
                        className={`w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-bold ${sortBy === 'Newest' ? 'text-black' : 'text-gray-500'}`}
                      >
                        Newest First
                      </button>
                      <button 
                        onClick={() => { setSortBy('Oldest'); setDropdownOpen(false); }} 
                        className={`w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-bold border-t border-gray-50 ${sortBy === 'Oldest' ? 'text-black' : 'text-gray-500'}`}
                      >
                        Oldest First
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-12">
            <div className="flex gap-3 overflow-x-auto w-full hide-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor: selectedCategory === category 
                      ? (c.category_tab_active_bg || '#1DB954') 
                      : (c.category_tab_inactive_bg || '#f9fafb'),
                    color: selectedCategory === category 
                      ? (c.category_tab_active_text || '#ffffff') 
                      : (c.category_tab_inactive_text || '#4b5563')
                  }}
                  className={`px-6 py-2.5 text-sm font-bold rounded-full whitespace-nowrap transition-all tracking-wide ${
                    selectedCategory === category ? 'shadow-md shadow-green-500/20' : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          {error ? (
            <div className="text-center py-20 text-red-600">
              <p>Error loading blogs: {error}</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, i) => {
                return (
                  <Link to={`/blogs/${blog.slug}`} key={blog.id} className="h-full">
                    <motion.article 
                      initial={{ opacity: 0, y: 20 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ once: true }} 
                      transition={{ delay: i * 0.1 }} 
                      className="group h-full flex flex-col bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-[220px] rounded-2xl overflow-hidden mb-6 bg-gray-50 flex-shrink-0">
                        <img src={blog.thumbnail_url || 'https://picsum.photos/seed/blog/800/600'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                          {blog.tags && blog.tags.length > 0 ? (
                            <span 
                              className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                              style={{ 
                                backgroundColor: blogSettings?.tag_bg_color || '#fdf2f8',
                                color: blogSettings?.tag_text_color || '#db2777'
                              }}
                            >
                              {blog.tags[0]}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                              Blog
                            </span>
                          )}
                          <span className="text-xs font-medium text-gray-400">
                            {format(new Date(blog.created_at), 'dd MMM')}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors leading-snug">{blog.title}</h3>
                        
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">{blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4">
                          <span 
                            className="text-xs font-bold flex items-center uppercase tracking-wide"
                            style={{ color: blogSettings?.read_article_color || '#3BB163' }}
                          >
                            READ ARTICLE <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <span className="text-xs text-gray-400 flex items-center font-medium">
                            <User className="w-3.5 h-3.5 mr-1" /> 5 min read
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {c.cta_heading && c.cta_heading.trim() !== "" && (
        <CTA 
          title={c.cta_heading}
          description={c.cta_subheading || ""}
          buttonText={c.cta_btn_text || "VIEW OUR CASE STUDIES"}
          buttonLink="/contact"
          bgColor={c.cta_bg_color || "#c2ff00"}
          titleColor={c.cta_heading_color || "#000000"}
          descColor={c.cta_subheading_color || "#000000"}
          btnColor={c.cta_btn_color || "#000000"}
          btnTextColor={c.cta_btn_text_color || "#ffffff"}
          btnRadius={c.cta_btn_radius || "rounded-full"}
        />
      )}
    </div>
  );
}
