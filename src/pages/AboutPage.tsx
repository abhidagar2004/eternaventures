import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { renderBlock } from '../components/about/AboutBlocks';

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from('about_page_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setContent(data);
        if (data.blocks && Array.isArray(data.blocks)) {
          setBlocks(data.blocks);
        }
      }
    }
    fetchContent();
  }, []);

  const c = content || {};

  return (
    <div
      className={`min-h-screen ${c.font_style || 'font-sans'}`}
      style={{ backgroundColor: c.page_bg_color || '#000000', color: c.page_text_color || '#ffffff' }}
    >
      {blocks.map(block => renderBlock(block))}
    </div>
  );
}
