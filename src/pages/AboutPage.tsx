import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AboutBlocks } from '../components/about/AboutBlocks';
import { Loader2 } from 'lucide-react';

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data } = await supabase
          .from('about_page_content')
          .select('*')
          .single();
        if (data) setContent(data);
      } catch (err) {
        console.error('Error fetching about content:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#D6FF00] animate-spin" />
      </div>
    );
  }

  const c = content || {};
  const blocks = c.blocks || [];
  const config = {
    font_style: c.font_style,
    accent_color: c.accent_color
  };

  return (
    <div className={`min-h-screen bg-black ${c.font_style || 'font-sans'}`}>
        <AboutBlocks blocks={blocks} config={config} />
    </div>
  );
}

