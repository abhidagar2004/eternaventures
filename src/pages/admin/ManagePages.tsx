import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, FileText, ExternalLink, Trash2, Edit2, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ManagePages() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data } = await supabase.from('site_pages').select('*').order('is_system', { ascending: false }).order('created_at', { ascending: false });
    if (data) setPages(data);
    setIsLoading(false);
  };

  const handleCreatePage = async () => {
    if (!newPage.title || !newPage.slug) return toast.error('Please fill all fields');
    
    try {
      const { error } = await supabase.from('site_pages').insert([{
        title: newPage.title,
        slug: newPage.slug.toLowerCase().replace(/ /g, '-'),
        blocks: [],
        config: { bgColor: '#000000', textColor: '#ffffff' }
      }]);
      
      if (error) throw error;
      toast.success('Page created! Now add blocks.');
      setShowCreateModal(false);
      fetchPages();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (slug: string, isSystem: boolean) => {
    if (isSystem) return toast.error('System pages cannot be deleted');
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    const { error } = await supabase.from('site_pages').delete().eq('slug', slug);
    if (error) toast.error(error.message);
    else {
      toast.success('Page deleted');
      fetchPages();
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Website Pages</h1>
          <p className="text-gray-500 font-medium">Create and manage your website architecture.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
        >
          <Plus size={18} /> New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map(page => (
          <div key={page.id} className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-2xl ${page.is_system ? 'bg-[#D6FF0033] text-[#a9c900]' : 'bg-blue-50 text-blue-500'}`}>
                  <FileText size={24} />
               </div>
               {page.is_system && <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-1 rounded-full">System Page</span>}
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-1 line-clamp-1">{page.title}</h3>
            <p className="text-sm text-gray-400 font-mono mb-8">/{page.slug}</p>
            
            <div className="flex items-center gap-3">
               <Link 
                 to={`/admin/pages/edit/${page.slug}`}
                 className="flex-1 bg-gray-50 text-gray-900 px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100"
               >
                 <Edit2 size={16} /> Edit Design
               </Link>
               <a 
                 href={page.slug === 'home' ? '/' : (page.slug === 'about' ? '/about' : `/p/${page.slug}`)} 
                 target="_blank" 
                 className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-black transition-colors"
               >
                 <ExternalLink size={18} />
               </a>
               {!page.is_system && (
                 <button 
                   onClick={() => handleDelete(page.slug, page.is_system)}
                   className="p-3 bg-red-50 text-red-300 rounded-xl hover:text-red-600 transition-colors"
                 >
                   <Trash2 size={18} />
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] w-full max-w-xl p-12 shadow-2xl"
          >
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Create New Page</h2>
            <p className="text-gray-500 mb-10">Define the URL and title for your new masterpiece.</p>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Page Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Our Culture"
                    value={newPage.title} 
                    onChange={e => {
                       const t = e.target.value;
                       setNewPage({ ...newPage, title: t, slug: t.toLowerCase().replace(/ /g, '-') });
                    }}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold outline-none focus:border-black transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Page Slug (URL)</label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4">
                     <span className="text-gray-400 font-bold">eternaventures.com/p/</span>
                     <input 
                       type="text" 
                       value={newPage.slug}
                       onChange={e => setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                       className="flex-1 bg-transparent text-lg font-bold outline-none"
                     />
                  </div>
               </div>
            </div>
            
            <div className="flex gap-4 mt-12">
               <button onClick={() => setShowCreateModal(false)} className="flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-400 hover:text-black transition-colors">Cancel</button>
               <button onClick={handleCreatePage} className="flex-[2] bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl">Launch Page</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
