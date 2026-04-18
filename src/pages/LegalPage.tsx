import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LegalData {
  bg_color: string;
  text_color: string;
  heading_color: string;
  terms_title: string;
  terms_content: string;
  privacy_title: string;
  privacy_content: string;
  copyright_title: string;
  copyright_content: string;
}

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<LegalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: legal, error } = await supabase
        .from('legal_pages')
        .select('*')
        .single();
      
      if (error) throw error;
      setData(legal);
    } catch (err) {
      console.error('Error fetching legal pages:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2596be]" />
      </div>
    );
  }

  if (!data) return null;

  let title = '';
  let content = '';

  switch (slug) {
    case 'terms':
      title = data.terms_title;
      content = data.terms_content;
      break;
    case 'privacy':
      title = data.privacy_title;
      content = data.privacy_content;
      break;
    case 'copyright':
      title = data.copyright_title;
      content = data.copyright_content;
      break;
    default:
      return <div className="min-h-screen bg-black flex items-center justify-center text-white">Page not found</div>;
  }

  return (
    <div 
      className="min-h-screen py-32 px-6 md:px-12"
      style={{ backgroundColor: data.bg_color }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tighter"
            style={{ color: data.heading_color }}
          >
            {title}
          </h1>
          <div 
            className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-lg"
            style={{ color: data.text_color }}
          >
            {content}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
