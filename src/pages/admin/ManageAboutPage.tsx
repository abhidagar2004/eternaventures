import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save, ArrowUp, ArrowDown, Trash2, Plus, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const ImageUploader = ({ block, index, field }: { block: any, index: number, field: string }) => {
    const [uploading, setUploading] = useState(false);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={block[field] || ''}
            onChange={(e) => updateBlock(index, field, e.target.value)}
            placeholder="Paste image URL or upload"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-[#D6FF00]"
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
                  updateBlock(index, field, url);
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
            <button
              type="button"
              disabled={uploading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
            </button>
          </div>
        </div>
        {block[field] && (
          <img src={block[field]} alt="Preview" className="mt-2 h-24 rounded-lg object-cover border border-gray-200" />
        )}
      </div>
    );
  };

  const renderBlockEditor = (block: any, index: number) => {
    return (
      <div key={block.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GripVertical className="text-gray-400" />
            <h3 className="font-bold text-gray-900 uppercase">{block.type.replace(/_/g, ' ')}</h3>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={block.isVisible} 
                onChange={(e) => updateBlock(index, 'isVisible', e.target.checked)}
                className="rounded border-gray-300 text-[#D6FF00] focus:ring-[#D6FF00]"
              />
              Visible
            </label>
            <div className="flex border rounded-lg overflow-hidden">
              <button 
                type="button" 
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0}
                className="px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50 border-r"
              ><ArrowUp className="w-4 h-4 text-gray-600" /></button>
              <button 
                type="button"
                onClick={() => moveBlock(index, 'down')}
                disabled={index === blocks.length - 1}
                className="px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50"
              ><ArrowDown className="w-4 h-4 text-gray-600" /></button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Common Layout & Styling Controls */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">BG Color</label>
                <div className="flex gap-2">
                  <input type="color" value={block.bgColor || '#000000'} onChange={(e) => updateBlock(index, 'bgColor', e.target.value)} className="w-8 h-8 rounded" />
                  <input type="text" value={block.bgColor || '#000000'} onChange={(e) => updateBlock(index, 'bgColor', e.target.value)} className="flex-1 border rounded px-2 text-sm" />
                </div>
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Text Color</label>
                <div className="flex gap-2">
                  <input type="color" value={block.textColor || '#ffffff'} onChange={(e) => updateBlock(index, 'textColor', e.target.value)} className="w-8 h-8 rounded" />
                  <input type="text" value={block.textColor || '#ffffff'} onChange={(e) => updateBlock(index, 'textColor', e.target.value)} className="flex-1 border rounded px-2 text-sm" />
                </div>
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Accent Color</label>
                <div className="flex gap-2">
                  <input type="color" value={block.accentColor || '#D6FF00'} onChange={(e) => updateBlock(index, 'accentColor', e.target.value)} className="w-8 h-8 rounded" />
                  <input type="text" value={block.accentColor || '#D6FF00'} onChange={(e) => updateBlock(index, 'accentColor', e.target.value)} className="flex-1 border rounded px-2 text-sm" />
                </div>
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Alignment</label>
                <select value={block.alignment || 'left'} onChange={(e) => updateBlock(index, 'alignment', e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm bg-white">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
             </div>
          </div>

          {/* Block Specific Controls */}
          {block.heading !== undefined && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input type="text" value={block.heading || ''} onChange={(e) => updateBlock(index, 'heading', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
          )}
          {block.subtext !== undefined && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtext</label>
              <textarea value={block.subtext || ''} onChange={(e) => updateBlock(index, 'subtext', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" rows={2} />
            </div>
          )}
          {block.highlightText !== undefined && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlight Text</label>
              <textarea value={block.highlightText || ''} onChange={(e) => updateBlock(index, 'highlightText', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" rows={2} />
            </div>
          )}
          {block.paragraphs !== undefined && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphs (Line breaks create new paragraphs)</label>
              <textarea value={block.paragraphs || ''} onChange={(e) => updateBlock(index, 'paragraphs', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" rows={6} />
            </div>
          )}
          {block.imageUrl !== undefined && (
            <div className="md:col-span-2">
              <ImageUploader block={block} index={index} field="imageUrl" />
            </div>
          )}
          {block.items !== undefined && (
            <div className="md:col-span-2 border rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-4">List Items</label>
              {block.items.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex gap-4 mb-4 items-start bg-white p-3 rounded-lg border">
                  <div className="flex-1 space-y-3">
                    {item.title !== undefined && (
                      <input type="text" placeholder="Title" value={item.title || ''} onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[itemIndex] = { ...newItems[itemIndex], title: e.target.value };
                        updateBlock(index, 'items', newItems);
                      }} className="w-full border border-gray-300 rounded px-3 py-1" />
                    )}
                    {item.text !== undefined && (
                      <input type="text" placeholder="Text" value={item.text || ''} onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[itemIndex] = { ...newItems[itemIndex], text: e.target.value };
                        updateBlock(index, 'items', newItems);
                      }} className="w-full border border-gray-300 rounded px-3 py-1" />
                    )}
                    {item.desc !== undefined && (
                      <textarea placeholder="Description" value={item.desc || ''} onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[itemIndex] = { ...newItems[itemIndex], desc: e.target.value };
                        updateBlock(index, 'items', newItems);
                      }} className="w-full border border-gray-300 rounded px-3 py-1 h-16" />
                    )}
                  </div>
                  <button type="button" onClick={() => {
                    const newItems = [...block.items];
                    newItems.splice(itemIndex, 1);
                    updateBlock(index, 'items', newItems);
                  }} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const newItems = [...block.items];
                const newItem = block.items[0] ? { ...block.items[0] } : {};
                Object.keys(newItem).forEach(k => newItem[k] = ''); // clear values
                newItems.push(newItem);
                updateBlock(index, 'items', newItems);
              }} className="flex items-center gap-2 text-sm text-[#2596be] hover:underline font-medium">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          )}
          {block.lines !== undefined && (
             <div className="md:col-span-2 border rounded-lg p-4 bg-gray-50">
             <label className="block text-sm font-medium text-gray-700 mb-4">Text Lines</label>
             {block.lines.map((item: any, itemIndex: number) => (
               <div key={itemIndex} className="flex gap-4 mb-4 items-center">
                 <input type="text" value={item.text || ''} onChange={(e) => {
                   const newLines = [...block.lines];
                   newLines[itemIndex] = { text: e.target.value };
                   updateBlock(index, 'lines', newLines);
                 }} className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
                 <button type="button" onClick={() => {
                   const newLines = [...block.lines];
                   newLines.splice(itemIndex, 1);
                   updateBlock(index, 'lines', newLines);
                 }} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
               </div>
             ))}
             <button type="button" onClick={() => {
               const newLines = [...block.lines, { text: 'New Line' }];
               updateBlock(index, 'lines', newLines);
             }} className="flex items-center gap-2 text-sm text-[#2596be] hover:underline font-medium">
               <Plus className="w-4 h-4" /> Add Line
             </button>
           </div>
          )}

          {block.btnText !== undefined && (
             <div className="md:col-span-1">
               <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
               <input type="text" value={block.btnText || ''} onChange={(e) => updateBlock(index, 'btnText', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
             </div>
          )}
          {block.btnLink !== undefined && (
             <div className="md:col-span-1">
               <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
               <input type="text" value={block.btnLink || ''} onChange={(e) => updateBlock(index, 'btnLink', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
             </div>
          )}
          {block.email !== undefined && (
             <div className="md:col-span-1">
               <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
               <input type="email" value={block.email || ''} onChange={(e) => updateBlock(index, 'email', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
             </div>
          )}

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
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage About Page</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#111827] text-white font-bold rounded-lg hover:bg-black transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save All Changes
        </button>
      </div>

      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <h2 className="text-lg font-bold text-gray-900 mb-4">Global Settings</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Global Background</label>
                <div className="flex gap-2">
                  <input type="color" value={globalSettings.page_bg_color || '#000000'} onChange={(e) => setGlobalSettings({...globalSettings, page_bg_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                  <input type="text" value={globalSettings.page_bg_color || '#000000'} onChange={(e) => setGlobalSettings({...globalSettings, page_bg_color: e.target.value})} className="flex-1 border rounded-lg px-3" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Global Text</label>
                <div className="flex gap-2">
                  <input type="color" value={globalSettings.page_text_color || '#ffffff'} onChange={(e) => setGlobalSettings({...globalSettings, page_text_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                  <input type="text" value={globalSettings.page_text_color || '#ffffff'} onChange={(e) => setGlobalSettings({...globalSettings, page_text_color: e.target.value})} className="flex-1 border rounded-lg px-3" />
                </div>
            </div>
         </div>
      </div>

      <div className="space-y-2">
        {blocks.map((block, index) => renderBlockEditor(block, index))}
      </div>
      
    </div>
  );
}
