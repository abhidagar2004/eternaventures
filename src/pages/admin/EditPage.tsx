import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, uploadImage } from '../../lib/supabase';
import { 
  Loader2, Save, ArrowLeft, ArrowUp, ArrowDown, Trash2, Plus, 
  GripVertical, Image as ImageIcon, Type, Layout, Palette, 
  Layers, Monitor, Smartphone, Check, X, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const FONT_FAMILIES = [
  { name: 'Default Sans', value: 'font-sans' },
  { name: 'Display (Space Grotesk)', value: 'font-display' },
  { name: 'Outfit', value: "'Outfit', sans-serif" },
  { name: 'Bebas Neue (Heavy)', value: "'Bebas Neue', cursive" },
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Serif', value: 'font-serif' }
];

const FONT_SIZES = [
  { name: 'XS', value: 'text-xs' }, { name: 'Small', value: 'text-sm' },
  { name: 'Base', value: 'text-base' }, { name: 'Large', value: 'text-lg' },
  { name: 'XL', value: 'text-xl' }, { name: '2XL', value: 'text-2xl' },
  { name: '3XL', value: 'text-3xl' }, { name: '4XL', value: 'text-4xl md:text-5xl' },
  { name: '5XL', value: 'text-5xl md:text-7xl' }, { name: '7XL', value: 'text-6xl md:text-8xl' },
  { name: '9XL', value: 'text-7xl md:text-9xl' }
];

const BLOCK_TEMPLATES = [
  { type: 'hero', name: 'Hero (Main Banner)', icon: <Layout />, desc: 'Large title with Video/Image background.' },
  { type: 'side_image', name: 'Side Image Block', icon: <Layers />, desc: 'Text on one side, large image on the other.' },
  { type: 'marquee', name: 'Scrolling Marquee', icon: <Type />, desc: 'Continuous scrolling text line.' },
  { type: 'method_grid', name: 'Method / Process', icon: <GripVertical />, desc: 'Numbered steps grid (01, 02, etc).' },
  { type: 'services_grid', name: 'Services Grid', icon: <Palette />, desc: 'Pulls existing services from database.' },
  { type: 'projects_slider', name: 'Projects Slider', icon: <Monitor />, desc: 'Horizontal scrolling project images.' },
  { type: 'testimonials', name: 'Testimonials', icon: <Check />, desc: 'Client quotes and feedback.' },
  { type: 'cta', name: 'CTA Banner', icon: <Smartphone />, desc: 'Large button and heading for conversions.' },
  { type: 'latest_blogs', name: 'Latest Blogs', icon: <FileText size={18}/>, desc: 'Pulls last 3 blogs from your articles.' }
];

// Reusable components for the editor
const ColorInput = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label}</label>
    <div className="flex gap-2">
      <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-xl border-2 border-gray-100 cursor-pointer" />
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-3 text-xs font-bold" />
    </div>
  </div>
);

const FontSelector = ({ label, family, size, onFamilyChange, onSizeChange }: any) => (
  <div className="grid grid-cols-2 gap-3">
     <div>
       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label} Font</label>
       <select value={family || ''} onChange={(e) => onFamilyChange(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-xs font-bold">
         <option value="">Default</option>
         {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
       </select>
     </div>
     <div>
       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label} Size</label>
       <select value={size || ''} onChange={(e) => onSizeChange(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-xs font-bold">
         <option value="">Default</option>
         {FONT_SIZES.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
       </select>
     </div>
  </div>
);

export default function EditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  useEffect(() => { fetchPage(); }, [slug]);

  const fetchPage = async () => {
    const { data, error } = await supabase.from('site_pages').select('*').eq('slug', slug).single();
    if (data) {
      setPage(data);
      setBlocks(data.blocks || []);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.from('site_pages').update({ blocks, updated_at: new Date() }).eq('slug', slug);
    if (!error) toast.success('Architecture Saved!');
    else toast.error(error.message);
    setIsSubmitting(false);
  };

  const addBlock = (type: string) => {
    const defaultTemplates: Record<string, any> = {
      hero: { id: Date.now(), type: 'hero', heading: 'NEW HERO SECTION', subtext: 'Write some subtext here...', bgColor: '#000000', headingColor: '#ffffff', alignment: 'center', isVisible: true },
      side_image: { id: Date.now(), type: 'side_image', heading: 'STORYTELLING BLOCK', paragraphs: 'Write your story here...', imageOrder: 'right', isVisible: true, bgColor: '#000000', accentColor: '#D6FF00' },
      marquee: { id: Date.now(), type: 'marquee', text: 'ANNOUNCEMENT GOES HERE — ', fontSize: 'text-5xl', bgColor: '#2596be', isVisible: true },
      method_grid: { id: Date.now(), type: 'method_grid', heading: 'THE SYSTEM', quote: 'A defining quote...', items: [{title: 'Step 1', desc: 'Desc'}], isVisible: true },
      cta: { id: Date.now(), type: 'cta', heading: 'READY TO GROW?', btnText: 'Contact Us', isVisible: true },
      latest_blogs: { id: Date.now(), type: 'latest_blogs', heading: 'READ THE LATEST', isVisible: true },
      services_grid: { id: Date.now(), type: 'services_grid', heading: 'WHAT WE DO', isVisible: true },
      projects_slider: { id: Date.now(), type: 'projects_slider', heading: 'SELECTED WORKS', isVisible: true },
      testimonials: { id: Date.now(), type: 'testimonials', heading: 'CLIENT LOVE', isVisible: true }
    };
    setBlocks([...blocks, defaultTemplates[type]]);
    setShowBlockPicker(false);
  };

  const updateBlock = (idx: number, updates: any) => {
    const nb = [...blocks];
    nb[idx] = { ...nb[idx], ...updates };
    setBlocks(nb);
  };

  const moveBlock = (idx: number, dir: 'up' | 'down') => {
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === blocks.length - 1)) return;
    const nb = [...blocks];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    [nb[idx], nb[target]] = [nb[target], nb[idx]];
    setBlocks(nb);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-black" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 sticky top-0 z-40 bg-gray-50/80 backdrop-blur-xl py-6 border-b-2 border-gray-100">
         <div className="flex items-center gap-6">
            <button onClick={() => navigate('/admin/pages')} className="p-4 bg-white rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm"><ArrowLeft size={20} /></button>
            <div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">{page.title} <span className="text-gray-300"> Architect</span></h1>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-500 px-2 py-1 rounded-md">LIVE SLUG: /{page.slug}</span>
               </div>
            </div>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button
               onClick={() => window.open(page.slug === 'home' ? '/' : (page.slug === 'about' ? '/about' : `/p/${page.slug}`), '_blank')}
               className="flex-1 md:flex-none border-2 border-gray-100 bg-white text-gray-900 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
               <Eye size={16} /> View Live
            </button>
            <button 
               onClick={handleSave}
               disabled={isSubmitting}
               className="flex-1 md:flex-none bg-black text-white p-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
            >
               {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
               Save Page
            </button>
         </div>
      </div>

      {/* Block List */}
      <div className="space-y-10">
         <AnimatePresence>
         {blocks.map((block, idx) => (
           <motion.div 
             key={block.id || idx}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`bg-white rounded-[32px] border-2 ${block.isVisible ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'} overflow-hidden shadow-sm hover:shadow-xl transition-all group`}
           >
              {/* Block Header */}
              <div className="bg-gray-50/50 border-b-2 border-gray-100 px-8 py-5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <GripVertical className="text-gray-300 cursor-grab" />
                    <div className="p-2 bg-black text-white rounded-lg">
                       {BLOCK_TEMPLATES.find(t => t.type === block.type)?.icon || <Layers size={14}/>}
                    </div>
                    <div>
                       <h3 className="text-xs font-black uppercase tracking-widest">{block.type.replace(/_/g, ' ')}</h3>
                       <p className="text-[9px] text-gray-400 font-bold uppercase">Section ID: {block.id}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => updateBlock(idx, { isVisible: !block.isVisible })} className={`p-2 rounded-xl border-2 transition-all ${block.isVisible ? 'bg-[#D6FF0033] border-[#a9c900] text-[#a9c900]' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                       <Check size={16} />
                    </button>
                    <div className="h-8 w-[2px] bg-gray-200 mx-1"></div>
                    <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-2 bg-white border-2 border-gray-100 rounded-xl hover:bg-gray-100 disabled:opacity-30"><ArrowUp size={16} /></button>
                    <button onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} className="p-2 bg-white border-2 border-gray-100 rounded-xl hover:bg-gray-100 disabled:opacity-30"><ArrowDown size={16} /></button>
                    <button 
                       onClick={() => { if(confirm('Erase this section?')) { const nb = [...blocks]; nb.splice(idx, 1); setBlocks(nb); } }}
                       className="p-2 bg-white border-2 border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all ml-2"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>

              {/* Block Editor Body */}
              <div className="p-10">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Panel: Content */}
                    <div className="lg:col-span-8 space-y-8">
                       <div className="grid grid-cols-1 gap-6">
                          {block.heading !== undefined && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Section Heading</label>
                                <input type="text" value={block.heading} onChange={e => updateBlock(idx, { heading: e.target.value })} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 font-black uppercase text-xl outline-none focus:border-black transition-all" />
                             </div>
                          )}
                          {block.subtext !== undefined && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description / Subtext</label>
                                <textarea rows={3} value={block.subtext} onChange={e => updateBlock(idx, { subtext: e.target.value })} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold text-gray-700 outline-none focus:border-black transition-all" />
                          </div>
                       )}
                       {block.paragraphs !== undefined && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Story Content (Markdown Supported)</label>
                                <textarea rows={6} value={block.paragraphs} onChange={e => updateBlock(idx, { paragraphs: e.target.value })} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 font-medium text-gray-600 outline-none focus:border-black transition-all" />
                          </div>
                       )}
                       {block.text !== undefined && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Small Label / Marquee Text</label>
                                <input type="text" value={block.text} onChange={e => updateBlock(idx, { text: e.target.value })} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-black transition-all" />
                          </div>
                       )}
                       </div>

                       {/* List Management (Common for items in methods/side_image) */}
                       {block.items !== undefined && (
                          <div className="bg-gray-50 p-6 rounded-[24px] border-2 border-gray-100">
                             <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Section List Items</span>
                                <button 
                                   onClick={() => { const ni = [...block.items, { title: 'New Item', desc: '' }]; updateBlock(idx, { items: ni }); }}
                                   className="text-[9px] font-black uppercase text-blue-500 hover:text-black transition-all"
                                >
                                   + ADD ITEM
                                </button>
                             </div>
                             <div className="space-y-4">
                                {block.items.map((item: any, itIdx: number) => (
                                   <div key={itIdx} className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex gap-4">
                                      <div className="flex-1 space-y-3">
                                         <input type="text" value={item.title} onChange={e => { const ni = [...block.items]; ni[itIdx].title = e.target.value; updateBlock(idx, { items: ni }); }} className="w-full border-b pb-1 font-bold outline-none border-gray-100 focus:border-black" />
                                         <textarea value={item.desc} onChange={e => { const ni = [...block.items]; ni[itIdx].desc = e.target.value; updateBlock(idx, { items: ni }); }} className="w-full text-xs text-gray-500 outline-none" placeholder="Description..." />
                                      </div>
                                      <button onClick={() => { const ni = [...block.items]; ni.splice(itIdx, 1); updateBlock(idx, { items: ni }); }} className="text-red-200 hover:text-red-500"><X size={16}/></button>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>

                    {/* Right Panel: Styles & Media */}
                    <div className="lg:col-span-4 bg-gray-50/50 p-8 rounded-[32px] border-2 border-gray-100 space-y-10">
                       <div className="space-y-6">
                          <ColorInput label="Background" value={block.bgColor} onChange={(v: string) => updateBlock(idx, { bgColor: v })} />
                          <div className="grid grid-cols-2 gap-4">
                             <ColorInput label="Heading" value={block.headingColor} onChange={(v: string) => updateBlock(idx, { headingColor: v })} />
                             <ColorInput label="Accent" value={block.accentColor} onChange={(v: string) => updateBlock(idx, { accentColor: v })} />
                          </div>
                          <FontSelector label="Heading" family={block.headingFontFamily} size={block.headingSize} onFamilyChange={(v: string) => updateBlock(idx, { headingFontFamily: v })} onSizeChange={(v: string) => updateBlock(idx, { headingSize: v })} />
                       </div>

                       {/* Media Uploads */}
                       {(block.imageUrl !== undefined || block.bgImage !== undefined || block.hero_video_url !== undefined) && (
                         <div className="pt-8 border-t-2 border-gray-100 space-y-6">
                            {(block.imageUrl !== undefined || block.bgImage !== undefined) && (
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Section Image</label>
                                  <div className="bg-white border-2 border-gray-100 p-2 rounded-2xl relative group/img cursor-pointer transition-all hover:border-black">
                                     <img src={block.imageUrl || block.bgImage || 'https://picsum.photos/seed/placeholder/800/800'} className="w-full aspect-video object-cover rounded-xl" />
                                     <input 
                                       type="file" 
                                       className="absolute inset-0 opacity-0 cursor-pointer" 
                                       onChange={async (e) => {
                                          if (!e.target.files?.length) return;
                                          const url = await uploadImage(e.target.files[0]);
                                          updateBlock(idx, block.imageUrl !== undefined ? { imageUrl: url } : { bgImage: url });
                                          toast.success('Media Uploaded!');
                                       }}
                                     />
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl">
                                        <ImageIcon className="text-white" size={32} />
                                     </div>
                                  </div>
                               </div>
                            )}

                            {block.imageOrder !== undefined && (
                               <div>
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Image Placement</label>
                                  <div className="flex bg-white rounded-xl p-1 border-2 border-gray-100 overflow-hidden">
                                     <button onClick={() => updateBlock(idx, { imageOrder: 'left' })} className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${block.imageOrder === 'left' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>Left</button>
                                     <button onClick={() => updateBlock(idx, { imageOrder: 'right' })} className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${block.imageOrder === 'right' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>Right</button>
                                  </div>
                               </div>
                            )}
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </motion.div>
         ))}
         </AnimatePresence>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
         <button 
           onClick={() => setShowBlockPicker(true)}
           className="bg-black text-[#D6FF00] px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 hover:scale-110 active:scale-95 transition-all"
         >
           <Plus size={20} /> Build Website Architecture
         </button>
      </div>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[40px] w-full max-w-6xl p-12 relative h-max mt-20"
          >
             <button onClick={() => setShowBlockPicker(false)} className="absolute top-10 right-10 p-4 hover:bg-gray-100 rounded-full transition-all"><X size={24} /></button>
             
             <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-2">Block Directory</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Choose a component to add to your archive</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BLOCK_TEMPLATES.map(t => (
                  <button 
                    key={t.type} 
                    onClick={() => addBlock(t.type)}
                    className="bg-gray-50 border-2 border-gray-100 rounded-[32px] p-8 text-left hover:border-black hover:bg-black hover:text-white transition-all group"
                  >
                     <div className="p-4 bg-white text-black rounded-2xl w-max mb-6 group-hover:bg-[#D6FF00]">
                        {t.icon}
                     </div>
                     <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{t.name}</h3>
                     <p className="text-sm opacity-60 font-medium leading-relaxed">{t.desc}</p>
                  </button>
                ))}
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
