import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save, MoveUp, MoveDown, Eye, EyeOff, Trash2, Plus, Settings2, Palette, Layout as LayoutIcon, Type } from 'lucide-react';
import toast from 'react-hot-toast';

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero Section' },
  { type: 'who_we_are', label: 'Who We Are (2 Column)' },
  { type: 'what_we_believe', label: 'What We Believe (Cards)' },
  { type: 'our_approach', label: 'Our Approach (Flow)' },
  { type: 'why_us', label: 'Why EternaVentures (Grid)' },
  { type: 'who_we_work_with', label: 'Who We Work With' },
  { type: 'our_role', label: 'Our Role (Big Lines)' },
  { type: 'cta', label: 'Closing CTA' },
];

const ColorInput = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
    <div className="flex gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 rounded cursor-pointer border border-gray-700 bg-gray-800"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D6FF00]"
        placeholder="#000000"
      />
    </div>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder = '' }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D6FF00]"
    />
  </div>
);

const TextareaInput = ({ label, value, onChange, rows = 3 }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
    <textarea
      rows={rows}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D6FF00]"
    />
  </div>
);

export default function ManageAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [rowId, setRowId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [config, setConfig] = useState<any>({
    font_style: 'font-sans',
    accent_color: '#D6FF00'
  });

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_page_content')
        .select('*')
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setBlocks(data.blocks || []);
        setRowId(data.id);
        setConfig({
          font_style: data.font_style || 'font-sans',
          accent_color: data.accent_color || '#D6FF00'
        });
        if (data.blocks && data.blocks.length > 0) {
          setActiveBlockId(data.blocks[0].id);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        blocks,
        ...config
      };
      if (rowId) {
        const { error } = await supabase.from('about_page_content').update(payload).eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('about_page_content').insert([payload]).select().single();
        if (error) throw error;
        if (data) setRowId(data.id);
      }
      toast.success('About page updated!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBlock = (type: string) => {
    const newBlock = {
      id: `${type}-${Date.now()}`,
      type,
      isVisible: true,
      paddingTop: '120px',
      paddingBottom: '120px',
      bgColor: '#000000',
      headingColor: '#ffffff'
    };
    setBlocks([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  const deleteBlock = (id: string) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      setBlocks(blocks.filter(b => b.id !== id));
      if (activeBlockId === id) setActiveBlockId(null);
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setBlocks(newBlocks);
  };

  const toggleVisibility = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, isVisible: !b.isVisible } : b));
  };

  const updateBlock = (id: string, updates: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    if (!e.target.files?.[0]) return;
    setUploading(blockId);
    try {
      const url = await uploadImage(e.target.files[0]);
      updateBlock(blockId, { imageUrl: url });
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505]">
        <Loader2 className="w-10 h-10 animate-spin text-[#D6FF00]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">About Page Editor</h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Premium Content Management</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-xs font-bold text-white/40 uppercase">Accent Color</span>
              <input 
                type="color" 
                value={config.accent_color} 
                onChange={(e) => setConfig({...config, accent_color: e.target.value})}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
           </div>
           <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-[#D6FF00] text-black font-black uppercase text-sm rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Sidebar: Blocks List */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div 
                key={block.id}
                onClick={() => setActiveBlockId(block.id)}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                  activeBlockId === block.id 
                  ? 'bg-white/10 border-[#D6FF00]/50 shadow-[0_0_20px_rgba(214,255,0,0.1)]' 
                  : 'bg-[#0A0A0A] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${activeBlockId === block.id ? 'text-[#D6FF00]' : 'text-white/30'}`}>
                    {block.type.replace(/_/g, ' ')}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }} className="p-1 hover:text-[#D6FF00] text-white/40"><MoveUp size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }} className="p-1 hover:text-[#D6FF00] text-white/40"><MoveDown size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleVisibility(block.id); }} className="p-1 hover:text-[#D6FF00] text-white/40">
                      {block.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="p-1 hover:text-red-500 text-white/40"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h4 className="text-white font-bold leading-tight line-clamp-1 text-sm">
                  {block.heading || block.id}
                </h4>
              </div>
            ))}
          </div>

          {/* Add Block Dropdown */}
          <div className="mt-4 p-4 border border-dashed border-white/10 rounded-xl bg-white/5">
            <h5 className="text-[10px] font-black uppercase text-white/40 mb-3 tracking-widest text-center">Add New Section</h5>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map(bt => (
                <button 
                  key={bt.type}
                  onClick={() => addBlock(bt.type)}
                  className="px-2 py-2 bg-white/5 hover:bg-[#D6FF00] hover:text-black rounded text-[10px] font-bold text-white/70 transition-colors border border-white/5 uppercase"
                >
                  {bt.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Editor */}
        <div className="flex-1 bg-[#0A0A0A] rounded-xl border border-white/5 overflow-y-auto p-8 custom-scrollbar">
          {activeBlock ? (
            <div className="max-w-3xl mx-auto space-y-10">
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{BLOCK_TYPES.find(b => b.type === activeBlock.type)?.label}</h2>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Block ID: {activeBlock.id}</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                   <span className="text-[10px] font-black text-white/30 uppercase mr-2">Visibility</span>
                   <button 
                    onClick={() => toggleVisibility(activeBlock.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${activeBlock.isVisible ? 'bg-[#D6FF00]' : 'bg-white/10'}`}
                   >
                     <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-transform ${activeBlock.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>
              </div>

              {/* Sections: Content, Style, Layout */}
              <div className="grid grid-cols-1 gap-12">
                
                {/* Content Section */}
                <div className="space-y-6">
                   <div className="flex items-center gap-2 mb-2">
                      <Settings2 className="w-4 h-4 text-[#D6FF00]" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Content Settings</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-6 bg-white/5 p-6 rounded-xl border border-white/5">
                      {activeBlock.type === 'hero' && (
                        <>
                          <TextInput label="Heading" value={activeBlock.heading} onChange={(v: string) => updateBlock(activeBlock.id, { heading: v })} />
                          <TextareaInput label="Subtext" value={activeBlock.subtext} onChange={(v: string) => updateBlock(activeBlock.id, { subtext: v })} />
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Text Alignment</label>
                            <div className="flex gap-2">
                              {['left', 'center', 'right'].map(align => (
                                <button 
                                  key={align}
                                  onClick={() => updateBlock(activeBlock.id, { alignment: align })}
                                  className={`flex-1 py-1 px-3 rounded text-[10px] font-bold uppercase transition-colors ${activeBlock.alignment === align ? 'bg-[#D6FF00] text-black' : 'bg-white/5 text-white/40'}`}
                                >{align}</button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      
                      {activeBlock.type === 'who_we_are' && (
                        <>
                          <TextInput label="Heading" value={activeBlock.heading} onChange={(v: string) => updateBlock(activeBlock.id, { heading: v })} />
                          <TextareaInput label="Paragraphs (Use double enter for new paragraph)" value={activeBlock.paragraphs} onChange={(v: string) => updateBlock(activeBlock.id, { paragraphs: v })} rows={6} />
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL</label>
                            <div className="flex gap-4">
                              <input 
                                type="text" value={activeBlock.imageUrl} onChange={(e) => updateBlock(activeBlock.id, { imageUrl: e.target.value })}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                              />
                              <div className="relative">
                                <input type="file" onChange={(e) => handleImageUpload(e, activeBlock.id)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <button className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/20">
                                  {uploading === activeBlock.id ? '...' : 'Upload'}
                                </button>
                              </div>
                            </div>
                            {activeBlock.imageUrl && <img src={activeBlock.imageUrl} className="mt-4 h-32 rounded-lg object-cover" alt="Preview" />}
                          </div>
                        </>
                      )}

                      {activeBlock.type === 'our_approach' && (
                        <div className="space-y-4">
                          {activeBlock.items?.map((item: any, i: number) => (
                            <div key={i} className="p-4 border border-white/5 rounded-lg bg-black/40 space-y-3">
                               <TextInput label={`Step ${i+1} Title`} value={item.title} onChange={(v: string) => {
                                 const items = [...activeBlock.items];
                                 items[i] = { ...items[i], title: v };
                                 updateBlock(activeBlock.id, { items });
                               }} />
                               <TextInput label={`Step ${i+1} Description`} value={item.desc} onChange={(v: string) => {
                                 const items = [...activeBlock.items];
                                 items[i] = { ...items[i], desc: v };
                                 updateBlock(activeBlock.id, { items });
                               }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {(activeBlock.type === 'why_us' || activeBlock.type === 'who_we_work_with' || activeBlock.type === 'what_we_believe') && (
                        <div className="space-y-4">
                           <div>
                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Grid Columns (on Desktop)</label>
                             <div className="flex gap-2">
                               {[2, 3, 4].map(cols => (
                                 <button 
                                   key={cols}
                                   onClick={() => updateBlock(activeBlock.id, { gridColumns: cols })}
                                   className={`flex-1 py-1 rounded text-[10px] font-bold uppercase ${activeBlock.gridColumns === cols ? 'bg-[#D6FF00] text-black' : 'bg-white/5 text-white/40'}`}
                                 >{cols} Columns</button>
                               ))}
                             </div>
                           </div>
                           {activeBlock.type !== 'what_we_believe' && (
                             <>
                               {activeBlock.items?.map((item: any, i: number) => (
                                 <div key={i} className="flex gap-3">
                                   <input 
                                    value={typeof item === 'string' ? item : item.title} 
                                    onChange={(e) => {
                                      const items = [...activeBlock.items];
                                      if (typeof item === 'string') items[i] = e.target.value;
                                      else items[i] = { ...items[i], title: e.target.value };
                                      updateBlock(activeBlock.id, { items });
                                    }}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                                   />
                                   <button onClick={() => {
                                     const items = activeBlock.items.filter((_:any, idx:number) => idx !== i);
                                     updateBlock(activeBlock.id, { items });
                                   }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                                 </div>
                               ))}
                               <button onClick={() => {
                                 const items = [...(activeBlock.items || []), activeBlock.type === 'why_us' ? {title: "", desc: ""} : ""];
                                 updateBlock(activeBlock.id, { items });
                               }} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-xs font-bold text-white/40 hover:text-white transition-colors">+ Add Item</button>
                             </>
                           )}
                        </div>
                      )}

                      {activeBlock.type === 'our_role' && (
                        <div className="space-y-4">
                           {activeBlock.lines?.map((line: any, i: number) => (
                             <div key={i} className="flex gap-3">
                               <input value={line.text} onChange={(e) => {
                                 const lines = [...activeBlock.lines];
                                 lines[i] = { ...lines[i], text: e.target.value };
                                 updateBlock(activeBlock.id, { lines });
                               }} className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm" />
                               <button onClick={() => updateBlock(activeBlock.id, { lines: activeBlock.lines.filter((_:any, idx:number) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                             </div>
                           ))}
                           <button onClick={() => updateBlock(activeBlock.id, { lines: [...(activeBlock.lines || []), {text: ""}] })} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-xs font-bold text-white/40 hover:text-white transition-colors">+ Add Line</button>
                        </div>
                      )}

                      {activeBlock.type === 'cta' && (
                        <>
                          <TextInput label="Heading" value={activeBlock.heading} onChange={(v: string) => updateBlock(activeBlock.id, { heading: v })} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInput label="Button Text" value={activeBlock.btnText} onChange={(v: string) => updateBlock(activeBlock.id, { btnText: v })} />
                            <TextInput label="Button Link" value={activeBlock.btnLink} onChange={(v: string) => updateBlock(activeBlock.id, { btnLink: v })} />
                          </div>
                          <TextInput label="Email" value={activeBlock.email} onChange={(v: string) => updateBlock(activeBlock.id, { email: v })} />
                        </>
                      )}
                   </div>
                </div>

                {/* Style Section */}
                <div className="space-y-6">
                   <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-4 h-4 text-[#D6FF00]" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Visual Styles</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-xl border border-white/5">
                      <ColorInput label="Background Color" value={activeBlock.bgColor} onChange={(v: string) => updateBlock(activeBlock.id, { bgColor: v })} />
                      <ColorInput label="Primary Heading Color" value={activeBlock.headingColor} onChange={(v: string) => updateBlock(activeBlock.id, { headingColor: v })} />
                      
                      {activeBlock.type === 'hero' && (
                        <>
                          <ColorInput label="Subtext Color" value={activeBlock.subtextColor} onChange={(v: string) => updateBlock(activeBlock.id, { subtextColor: v })} />
                          <TextInput label="Heading Size (clamp/vh/px)" value={activeBlock.headingSize} onChange={(v: string) => updateBlock(activeBlock.id, { headingSize: v })} placeholder="clamp(2.5rem, 8vw, 6rem)" />
                          <TextInput label="Font Weight" value={activeBlock.fontWeight} onChange={(v: string) => updateBlock(activeBlock.id, { fontWeight: v })} placeholder="800" />
                        </>
                      )}
                   </div>
                </div>

                {/* Layout Section */}
                <div className="space-y-6 font-sans">
                   <div className="flex items-center gap-2 mb-2">
                      <LayoutIcon className="w-4 h-4 text-[#D6FF00]" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Layout & Spacing</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-xl border border-white/5">
                      <TextInput label="Padding Top" value={activeBlock.paddingTop} onChange={(v: string) => updateBlock(activeBlock.id, { paddingTop: v })} placeholder="120px" />
                      <TextInput label="Padding Bottom" value={activeBlock.paddingBottom} onChange={(v: string) => updateBlock(activeBlock.id, { paddingBottom: v })} placeholder="120px" />
                      
                      {activeBlock.type === 'who_we_are' && (
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image Position</label>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => updateBlock(activeBlock.id, { imageOrder: 'left' })}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase ${activeBlock.imageOrder === 'left' ? 'bg-[#D6FF00] text-black' : 'bg-white/5 text-white/40'}`}
                            >Left</button>
                            <button 
                              onClick={() => updateBlock(activeBlock.id, { imageOrder: 'right' })}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase ${activeBlock.imageOrder === 'right' ? 'bg-[#D6FF00] text-black' : 'bg-white/5 text-white/40'}`}
                            >Right</button>
                          </div>
                        </div>
                      )}
                   </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Plus className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase">Select a block to edit</h3>
              <p className="text-white/40 max-w-xs uppercase text-[10px] font-black tracking-widest">Choose a section from the sidebar to manage its content and styling.</p>
            </div>
          )}
        </div>
      </div>

       {/* Custom Scrollbar Styles */}
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(214, 255, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
