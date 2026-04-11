import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import NewsletterCTA from '../components/NewsletterCTA';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) {
          console.error("Error fetching blog post:", error);
          setError(error.message);
        } else if (data) {
          setBlog(data);
        }
      } catch (err: any) {
        console.error("Exception fetching blog post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      const originalTitle = document.title;
      document.title = blog.meta_title || `${blog.title} | Eterna Ventures`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', blog.meta_description || blog.excerpt || '');

      return () => {
        document.title = originalTitle;
      };
    }
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-display font-bold text-red-600 mb-6">Error Loading Article</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link to="/blogs" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors">
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-display font-bold text-gray-900 mb-6">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/blogs" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Blog Header */}
      <section className="pt-20 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to all articles
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            {blog.tags && blog.tags.length > 0 && blog.tags[0].trim() !== "" && (
              <span className="bg-gray-50 px-3 py-1 rounded-full text-blue-600 font-bold uppercase tracking-wide">
                {blog.tags[0]}
              </span>
            )}
            <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight mb-8">
            {blog.title}
          </h1>
        </div>
      </section>

      {/* Blog Image */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          <img 
            src={blog.thumbnail_url || 'https://picsum.photos/seed/blog/1200/600'} 
            alt={blog.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div 
            className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </section>
    </div>
  );
}
