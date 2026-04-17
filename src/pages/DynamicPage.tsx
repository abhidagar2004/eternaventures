import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlockRenderer } from '../components/cms/BlockRenderer';
import { Loader2 } from 'lucide-react';

export default function DynamicPage({ systemSlug }: { systemSlug?: string }) {
  const { slug: urlSlug } = useParams();
  const slug = systemSlug || urlSlug || 'home';
  
  const [page, setPage] = useState<any>(null);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPage() {
      setLoading(true);
      try {
        const { data: pageData, error: pageError } = await supabase
          .from('site_pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (pageError || !pageData) {
          setError(true);
          setLoading(false);
          return;
        }

        setPage(pageData);

        // Fetch shared dynamic data if blocks need it
        const needsServices = (pageData.blocks || []).some((b: any) => b.type === 'services_grid');
        const needsProjects = (pageData.blocks || []).some((b: any) => b.type === 'projects_slider');
        const needsBlogs = (pageData.blocks || []).some((b: any) => b.type === 'latest_blogs');

        const promises = [];
        if (needsServices) promises.push(supabase.from('services').select('*').order('created_at', { ascending: true }));
        if (needsProjects) promises.push(supabase.from('home_projects').select('*').order('created_at', { ascending: false }));
        if (needsBlogs) promises.push(supabase.from('blogs').select('*').order('created_at', { ascending: false }).limit(3));

        const results = await Promise.all(promises);
        const newData: any = {};
        
        let resIdx = 0;
        if (needsServices) newData.services = results[resIdx++].data;
        if (needsProjects) newData.projects = results[resIdx++].data;
        if (needsBlogs) newData.blogs = results[resIdx++].data;
        
        setData(newData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2596be]" />
      </div>
    );
  }

  if (error || !page) {
    if (systemSlug === 'home') return <Navigate to="/about" />; // Resilience
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 text-center">
        <h1 className="text-9xl font-black font-display opacity-20">404</h1>
        <p className="text-2xl mt-4 font-bold uppercase tracking-widest">Page not found</p>
        <a href="/" className="mt-10 px-8 py-4 bg-[#2596be] rounded-full font-bold">Back to Home</a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: page.config?.bgColor || '#000000', color: page.config?.textColor || '#ffffff' }}>
      {(page.blocks || []).map((block: any, idx: number) => (
        <BlockRenderer key={block.id || idx} block={block} index={idx} data={data} />
      ))}
    </div>
  );
}
