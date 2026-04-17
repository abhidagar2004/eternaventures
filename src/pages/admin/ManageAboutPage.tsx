import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save, ArrowUp, ArrowDown, Trash2, Plus, GripVertical, Image as ImageIcon, Type, Layout, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const FONT_FAMILIES = [
  { name: 'Default Sans', value: 'font-sans' },
  { name: 'Display (Space Grotesk)', value: 'font-display' },
  { name: 'Outfit', value: "'Outfit', sans-serif" },
  { name: 'Bebas Neue (Heavy)', value: "'Bebas Neue', cursive" },
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Serif', value: 'font-serif' },
  { name: 'Mono', value: 'font-mono' }
];

const FONT_SIZES = [
  { name: 'XS', value: 'text-xs' },
  { name: 'Small', value: 'text-sm' },
  { name: 'Base', value: 'text-base' },
  { name: 'Large', value: 'text-lg' },
  { name: 'XL', value: 'text-xl' },
  { name: '2XL', value: 'text-2xl' },
  { name: '3XL', value: 'text-3xl' },
  { name: '4XL', value: 'text-4xl md:text-5xl' },
  { name: '5XL', value: 'text-5xl md:text-6xl' },
  { name: '6XL', value: 'text-5xl md:text-7xl' },
  { name: '7XL', value: 'text-6xl md:text-8xl' },
  { name: '8XL', value: 'text-7xl md:text-8xl lg:text-9xl' }
];

export default function ManageAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);
  
  const [globalSettings, setGlobalSettings] = useState<any>({
    page_bg_color: '#000000',
    page_text_color: '#ffffff',
    font_style: 'font-sans'
  });

  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_page_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setRowId(data.id);
        setGlobalSettings({
          page_bg_color: data.page_bg_color || '#000000',
          page_text_color: data.page_text_color || '#ffffff',
          font_style: data.font_style || 'font-sans'
        });
        if (data.blocks && Array.isArray(data.blocks)) {
          setBlocks(data.blocks);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...globalSettings,
        blocks
      };

      if (rowId) {
        const { error } = await supabase.from('about_page_content').update(payload).eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('about_page_content').insert([payload]).select().single();
        if (error) throw error;
        if (data) setRowId(data.id);
      }
      toast.success('About page updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const updateBlock = (index: number, key: string, value: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [key]: value };
    setBlocks(newBlocks);
  };

  const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="flex gap-2">
        <input type="color" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded border" />
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="flex-1 border rounded px-2 text-xs" />
      </div>
    </div>
  );

  const FontSelector = ({ label, family, size, onFamilyChange, onSizeChange }: any) => (
    <div className="grid grid-cols-2 gap-2">
       {onFamilyChange && (
         <div>
           <label className="block text-xs font-medium text-gray-500 mb-1">{label} Family</label>
           <select value={family || ''} onChange={(e) => onFamilyChange(e.target.value)} className="w-full border rounded px-2 py-1 text-xs">
             <option value="">Default</option>
             {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
           </select>
         </div>
       )}
       {onSizeChange && (
         <div>
           <label className="block text-xs font-medium text-gray-500 mb-1">{label} Size</label>
           <select value={size || ''} onChange={(e) => onSizeChange(e.target.value)} className="w-full border rounded px-2 py-1 text-xs">
             <option value="">Default</option>
             {FONT_SIZES.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
           </select>
         </div>
       )}
    </div>
  );

  const ImageUploader = ({ label, value, onUpload, onChange, placeholder }: any) => {
    const [uploading, setUploading] = useState(false);
    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-[#D6FF00] text-sm"
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (!e.target.files?.length) return;
                setUploading(true);
                try {
                  const url = await uploadImage(e.target.files[0]);
                  onUpload(url);
                  toast.success('Image uploaded!');
                } catch (err: any) {
                  toast.error(err.message);
                } finally {
                  setUploading(false);
                }
              }}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button type="button" disabled={uploading} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap text-sm">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {uploading ? '...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBlockEditor = (block: any, index: number) => {
    return (
      <div key={block.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-900">
            <GripVertical className="text-gray-400 cursor-move" />
            <h3 className="font-black text-sm uppercase tracking-widest">{block.type.replace(/_/g, ' ')}</h3>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={block.isVisible} 
                onChange={(e) => updateBlock(index, 'isVisible', e.target.checked)}
                className="rounded border-gray-300 text-[#D6FF00] focus:ring-[#D6FF00]"
              />
              VISIBLE
            </label>
            <div className="flex border rounded-lg overflow-hidden">
              <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50 border-r"><ArrowUp className="w-4 h-4 text-gray-600" /></button>
              <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50"><ArrowDown className="w-4 h-4 text-gray-600" /></button>
            </div>
            <button type="button" onClick={() => {
                if (window.confirm('Delete this block?')) {
                  const nb = [...blocks];
                  nb.splice(index, 1);
                  setBlocks(nb);
                }
            }} className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-10">
            {/* 1. LAYOUT & BACKGROUND */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#2596be] mb-4">
                 <Layout className="w-4 h-4" /> 
                 <span className="font-black text-xs uppercase tracking-tighter">Layout & Background</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <ColorInput label="Background Color" value={block.bgColor} onChange={(v) => updateBlock(index, 'bgColor', v)} />
                <ColorInput label="Accent Color" value={block.accentColor} onChange={(v) => updateBlock(index, 'accentColor', v)} />
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Text Alignment</label>
                  <select value={block.alignment || 'left'} onChange={(e) => updateBlock(index, 'alignment', e.target.value)} className="w-full border rounded px-2 py-1.5 text-xs bg-white">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Padding Top/Bottom</label>
                  <input type="text" placeholder="e.g. py-24" value={block.paddingTop || ''} onChange={(e) => updateBlock(index, 'paddingTop', e.target.value)} className="w-full border rounded px-2 py-1.5 text-xs bg-white" />
                </div>
                <ImageUploader label="Banner / Background Image" value={block.bgImage} onUpload={(url: string) => updateBlock(index, 'bgImage', url)} onChange={(v: string) => updateBlock(index, 'bgImage', v)} placeholder="If empty, uses background color fallback" />
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <ColorInput label="Overlay Color" value={block.overlayColor} onChange={(v) => updateBlock(index, 'overlayColor', v)} />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Overlay Opacity (0.0 - 1.0)</label>
                    <input type="number" step="0.1" min="0" max="1" value={block.overlayOpacity ?? 0.6} onChange={(e) => updateBlock(index, 'overlayOpacity', parseFloat(e.target.value))} className="w-full border rounded px-2 py-1.5 text-xs bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. TYPOGRAPHY CONTROLS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#2596be] mb-4">
                 <Type className="w-4 h-4" /> 
                 <span className="font-black text-xs uppercase tracking-tighter">Typography Styles</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#11182705] p-6 rounded-2xl border border-gray-100">
                 <div className="space-y-4">
                    <ColorInput label="Heading Color" value={block.headingColor} onChange={(v) => updateBlock(index, 'headingColor', v)} />
                    <FontSelector label="Heading" family={block.headingFontFamily} size={block.headingSize} onFamilyChange={(v: string) => updateBlock(index, 'headingFontFamily', v)} onSizeChange={(v: string) => updateBlock(index, 'headingSize', v)} />
                 </div>
                 <div className="space-y-4">
                    <ColorInput label="Paragraph Color" value={block.paragraphColor} onChange={(v) => updateBlock(index, 'paragraphColor', v)} />
                    <FontSelector label="Paragraph" family={block.paragraphFontFamily} size={block.paragraphSize} onFamilyChange={(v: string) => updateBlock(index, 'paragraphFontFamily', v)} onSizeChange={(v: string) => updateBlock(index, 'paragraphSize', v)} />
                 </div>
                 <div className="space-y-4 border-t pt-4">
                    <ColorInput label="Tag Color" value={block.tagColor} onChange={(v) => updateBlock(index, 'tagColor', v)} />
                    <FontSelector label="Tag" family={block.tagFontFamily} size={block.tagSize} onFamilyChange={(v: string) => updateBlock(index, 'tagFontFamily', v)} onSizeChange={(v: string) => updateBlock(index, 'tagSize', v)} />
                 </div>
                 <div className="space-y-4 border-t pt-4">
                    <ColorInput label="Sub/Item Color" value={block.subtextColor || block.itemColor} onChange={(v) => updateBlock(index, block.subtextColor !== undefined ? 'subtextColor' : 'itemColor', v)} />
                    <FontSelector label="Subtext" family={block.subtextFontFamily} size={block.subtextSize} onFamilyChange={(v: string) => updateBlock(index, 'subtextFontFamily', v)} onSizeChange={(v: string) => updateBlock(index, 'subtextSize', v)} />
                 </div>
              </div>
            </div>

            {/* 3. CONTENT CONTENT */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#2596be] mb-4">
                 <Palette className="w-4 h-4" /> 
                 <span className="font-black text-xs uppercase tracking-tighter">Section Content</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(block.tag !== undefined) && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                    <input type="text" value={block.tag || ''} onChange={(e) => updateBlock(index, 'tag', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                )}
                {block.heading !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                    <input type="text" value={block.heading || ''} onChange={(e) => updateBlock(index, 'heading', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                )}
                {block.subtext !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtext</label>
                    <textarea value={block.subtext || ''} onChange={(e) => updateBlock(index, 'subtext', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" rows={2} />
                  </div>
                )}
                {block.paragraphs !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description Paragraphs (Auto-bullets logic or list splitting)</label>
                    <textarea value={block.paragraphs || ''} onChange={(e) => updateBlock(index, 'paragraphs', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" rows={5} />
                  </div>
                )}
                {block.closingText !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closing Statement</label>
                    <input type="text" value={block.closingText || ''} onChange={(e) => updateBlock(index, 'closingText', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                )}

                {/* Lists / Items */}
                {block.items !== undefined && (
                  <div className="md:col-span-2 border rounded-xl p-6 bg-gray-50 border-gray-200">
                    <label className="block text-xs font-black text-gray-400 mb-4 uppercase">List Items (Bullets/Features)</label>
                    {block.items.map((item: any, itIdx: number) => (
                      <div key={itIdx} className="flex gap-4 mb-4 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                         <div className="flex-1 space-y-3">
                            {item.title !== undefined && <input type="text" placeholder="Title" value={item.title || ''} onChange={(e) => {
                               const ni = [...block.items]; ni[itIdx].title = e.target.value; updateBlock(index, 'items', ni);
                            }} className="w-full border rounded px-3 py-1.5 text-sm" />}
                            {item.text !== undefined && <input type="text" placeholder="Bullet Point" value={item.text || ''} onChange={(e) => {
                               const ni = [...block.items]; ni[itIdx].text = e.target.value; updateBlock(index, 'items', ni);
                            }} className="w-full border rounded px-3 py-1.5 text-sm" />}
                            {item.desc !== undefined && <textarea placeholder="Description" value={item.desc || ''} onChange={(e) => {
                               const ni = [...block.items]; ni[itIdx].desc = e.target.value; updateBlock(index, 'items', ni);
                            }} className="w-full border rounded px-3 py-1.5 text-sm h-16" />}
                         </div>
                         <button type="button" onClick={() => {
                            const ni = [...block.items]; ni.splice(itIdx, 1); updateBlock(index, 'items', ni);
                         }} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                       const ni = [...block.items, { title: '', text: '', desc: '' }]; updateBlock(index, 'items', ni);
                    }} className="flex items-center gap-2 text-xs font-bold text-[#2596be] hover:underline uppercase"><Plus className="w-4 h-4" /> Add New Item</button>
                  </div>
                )}

                {/* Who We Are specific Image */}
                {block.imageUrl !== undefined && (
                   <div className="md:col-span-2 bg-[#111822] p-6 rounded-2xl border border-white/10 mt-4">
                     <ImageUploader label="Side Image (Who We Are / Why Us)" value={block.imageUrl} onUpload={(url: string) => updateBlock(index, 'imageUrl', url)} onChange={(url: string) => updateBlock(index, 'imageUrl', url)} />
                     <div className="mt-4 flex items-center gap-4">
                        <label className="text-xs font-bold text-gray-400 uppercase">Image Side:</label>
                        <select value={block.imageOrder || 'left'} onChange={(e) => updateBlock(index, 'imageOrder', e.target.value)} className="border rounded px-2 py-1 text-xs bg-white">
                          <option value="left">Left Side</option>
                          <option value="right">Right Side</option>
                        </select>
                     </div>
                   </div>
                )}

                {/* CTA logic */}
                {block.btnText !== undefined && (
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                       <input type="text" value={block.btnText || ''} onChange={(e) => updateBlock(index, 'btnText', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                       <input type="text" value={block.btnLink || ''} onChange={(e) => updateBlock(index, 'btnLink', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2596be]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">ABOUT PAGE BUILDER</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Design your storytelling narrative with granular control.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
               const newBlock = { id: `block-${Date.now()}`, type: 'hero', isVisible: true, heading: 'New Heading', alignment: 'center', bgColor: '#000000', headingColor: '#ffffff' };
               setBlocks([...blocks, newBlock]);
               toast.success('Block added! Scroll down.');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-black border-2 border-gray-900 rounded-xl hover:bg-gray-50 transition-all text-xs uppercase"
          >
            <Plus className="w-4 h-4" /> Add Block
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-[#111827] text-white font-black rounded-xl hover:bg-black transition-all shadow-xl disabled:opacity-50 text-xs uppercase"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Architecture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#D6FF00] rounded-full"></div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Global Canvas Settings</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ColorInput label="Page Canvas Background" value={globalSettings.page_bg_color} onChange={(v) => setGlobalSettings({...globalSettings, page_bg_color: v})} />
              <ColorInput label="Default Text Body" value={globalSettings.page_text_color} onChange={(v) => setGlobalSettings({...globalSettings, page_text_color: v})} />
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Base Typography Stack</label>
                <select value={globalSettings.font_style || ''} onChange={(e) => setGlobalSettings({...globalSettings, font_style: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-medium">
                   {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => renderBlockEditor(block, index))}
      </div>
      
    </div>
  );
}
