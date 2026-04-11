import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ManageServices from './ManageServices';
import ManageProcessItems from './ManageProcessItems';
import ManageWhyUsItems from './ManageWhyUsItems';

export default function ManageServicesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'items' | 'process' | 'whyus'>('content');
  
  const [formData, setFormData] = useState({
    page_bg_color: '#000000',
    page_text_color: '#ffffff',
    header_bg_color: '#000000',
    header_text_color: '#ffffff',
    header_heading_size: 'text-6xl md:text-8xl',
    header_subheading_size: 'text-xl',
    heading: 'Our Services',
    subheading: 'Comprehensive digital marketing solutions designed to scale your brand, increase revenue, and dominate your market.',
    services_bg_color: '#000000',
    services_text_color: '#ffffff',
    services_card_bg: '#111111',
    services_tag: 'Our Expertise',
    services_tag_color: '#2596be',
    services_heading: 'Everything you need to dominate digital.',
    services_heading_size: 'text-5xl md:text-7xl',
    services_desc: 'We combine thumb-stopping creative with ruthless performance data.',
    process_bg_color: '#111111',
    process_text_color: '#ffffff',
    why_us_bg_color: '#000000',
    why_us_text_color: '#ffffff',
    cta_bg_color: '#2596be',
    cta_text_color: '#ffffff',
    cta_heading_size: 'text-5xl md:text-7xl',
    cta_subheading_size: 'text-xl md:text-2xl',
    cta_heading: 'Let\'s Build Your Growth Engine',
    cta_subheading: 'Stop guessing with your marketing budget. Partner with us to build a scalable, predictable revenue system.',
    cta_btn_text: 'View Our Case Studies',
    cta_btn_link: '/projects',
    font_style: 'font-sans',
    header_bg_image: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop',
    header_overlay_color: '#000000',
    header_overlay_opacity: '0.5',
    process_heading: 'A proven system for predictable growth.',
    process_tag: 'How We Work',
    process_circle_bg_color: '#1f2937',
    process_circle_border_color: '#2596be',
    process_circle_text_color: '#2596be',
    why_us_heading: "We don't just run ads. We build businesses.",
    why_us_heading_color: '#111827',
    why_us_tag: 'Why Us',
    why_us_card_bg_color: '#ffffff',
    cta_btn_radius: 'rounded-none',
    process_tag_color: '#2596be',
    why_us_tag_color: '#2596be',
    why_us_icon_color: '#2596be',
    cta_btn_color: '#ffffff',
    cta_btn_text_color: '#2596be',
    banner_padding_top: 'pt-40',
    banner_padding_bottom: 'pb-24'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('services_page_content')
        .select('*')
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({ ...formData, ...data });
        setRowId(data.id);
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
      if (rowId) {
        const { error } = await supabase
          .from('services_page_content')
          .update(formData)
          .eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('services_page_content')
          .insert([formData])
          .select()
          .single();
        if (error) throw error;
        if (data) setRowId(data.id);
      }
      toast.success('Services page content updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setFormData({ ...formData, header_bg_image: url });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2596be]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Services Page</h1>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'content' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Page Content & Styling
        </button>
        <button 
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'items' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Manage Service Items
        </button>
        <button 
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'process' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Manage Process Steps
        </button>
        <button 
          onClick={() => setActiveTab('whyus')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'whyus' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Manage "Why Us" Items
        </button>
      </div>

      {activeTab === 'items' ? (
        <ManageServices />
      ) : activeTab === 'process' ? (
        <ManageProcessItems />
      ) : activeTab === 'whyus' ? (
        <ManageWhyUsItems />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            {/* Global & Header Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Global & Header Content</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.page_bg_color} onChange={(e) => setFormData({ ...formData, page_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.page_bg_color} onChange={(e) => setFormData({ ...formData, page_bg_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.page_text_color} onChange={(e) => setFormData({ ...formData, page_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.page_text_color} onChange={(e) => setFormData({ ...formData, page_text_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.header_bg_color} onChange={(e) => setFormData({ ...formData, header_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.header_bg_color} onChange={(e) => setFormData({ ...formData, header_bg_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.header_text_color} onChange={(e) => setFormData({ ...formData, header_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.header_text_color} onChange={(e) => setFormData({ ...formData, header_text_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header Image</label>
                  <div className="flex gap-4 items-center">
                    {formData.header_bg_image && <img src={formData.header_bg_image} alt="Preview" className="w-10 h-10 object-cover rounded" />}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button type="button" disabled={uploading} className="w-full h-10 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center gap-2">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload Header Image
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header Overlay Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.header_overlay_color} onChange={(e) => setFormData({ ...formData, header_overlay_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.header_overlay_color} onChange={(e) => setFormData({ ...formData, header_overlay_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header Overlay Opacity</label>
                  <input type="text" value={formData.header_overlay_opacity} onChange={(e) => setFormData({ ...formData, header_overlay_opacity: e.target.value })} className="w-full h-10 border rounded-lg px-4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Padding Top (e.g. 150 or 200)</label>
                  <input type="text" value={formData.banner_padding_top || ''} onChange={(e) => setFormData({ ...formData, banner_padding_top: e.target.value })} placeholder="160" className="w-full h-10 border rounded-lg px-4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Padding Bottom (e.g. 100)</label>
                  <input type="text" value={formData.banner_padding_bottom || ''} onChange={(e) => setFormData({ ...formData, banner_padding_bottom: e.target.value })} placeholder="100" className="w-full h-10 border rounded-lg px-4" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Font Style (Tailwind class, e.g. font-sans, font-serif)</label>
                  <input type="text" value={formData.font_style} onChange={(e) => setFormData({ ...formData, font_style: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                  <input type="text" value={formData.heading} onChange={(e) => setFormData({ ...formData, heading: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size (Tailwind)</label>
                  <input type="text" value={formData.header_heading_size} onChange={(e) => setFormData({ ...formData, header_heading_size: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                  <textarea rows={2} value={formData.subheading} onChange={(e) => setFormData({ ...formData, subheading: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size (Tailwind)</label>
                  <input type="text" value={formData.header_subheading_size} onChange={(e) => setFormData({ ...formData, header_subheading_size: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>

            {/* Services Section Styling */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Services Grid Styling</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.services_bg_color} onChange={(e) => setFormData({ ...formData, services_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.services_bg_color} onChange={(e) => setFormData({ ...formData, services_bg_color: e.target.value })} className="flex-1 border rounded-lg px-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.services_text_color} onChange={(e) => setFormData({ ...formData, services_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.services_text_color} onChange={(e) => setFormData({ ...formData, services_text_color: e.target.value })} className="flex-1 border rounded-lg px-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Background</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.services_card_bg} onChange={(e) => setFormData({ ...formData, services_card_bg: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.services_card_bg} onChange={(e) => setFormData({ ...formData, services_card_bg: e.target.value })} className="flex-1 border rounded-lg px-2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Top Tag</label>
                  <input type="text" value={formData.services_tag} onChange={(e) => setFormData({ ...formData, services_tag: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.services_tag_color} onChange={(e) => setFormData({ ...formData, services_tag_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.services_tag_color} onChange={(e) => setFormData({ ...formData, services_tag_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                  <input type="text" value={formData.services_heading} onChange={(e) => setFormData({ ...formData, services_heading: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                  <input type="text" value={formData.services_heading_size} onChange={(e) => setFormData({ ...formData, services_heading_size: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea rows={2} value={formData.services_desc} onChange={(e) => setFormData({ ...formData, services_desc: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>

            {/* Global Sections */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Shared Sections Styling (Process & Why Us)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.process_bg_color} onChange={(e) => setFormData({ ...formData, process_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.process_bg_color} onChange={(e) => setFormData({ ...formData, process_bg_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.process_text_color} onChange={(e) => setFormData({ ...formData, process_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.process_text_color} onChange={(e) => setFormData({ ...formData, process_text_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Tag</label>
                  <input type="text" value={formData.process_tag} onChange={(e) => setFormData({ ...formData, process_tag: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Tag Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.process_tag_color || '#2596be'} onChange={(e) => setFormData({ ...formData, process_tag_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.process_tag_color || ''} onChange={(e) => setFormData({ ...formData, process_tag_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Heading</label>
                  <input type="text" value={formData.process_heading} onChange={(e) => setFormData({ ...formData, process_heading: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Circle BG Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.process_circle_bg_color} onChange={(e) => setFormData({ ...formData, process_circle_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.process_circle_bg_color} onChange={(e) => setFormData({ ...formData, process_circle_bg_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Circle Border Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.process_circle_border_color} onChange={(e) => setFormData({ ...formData, process_circle_border_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.process_circle_border_color} onChange={(e) => setFormData({ ...formData, process_circle_border_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Circle Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.process_circle_text_color} onChange={(e) => setFormData({ ...formData, process_circle_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.process_circle_text_color} onChange={(e) => setFormData({ ...formData, process_circle_text_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>

                <div className="md:col-span-2 my-2 border-b border-gray-100"></div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.why_us_bg_color} onChange={(e) => setFormData({ ...formData, why_us_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.why_us_bg_color} onChange={(e) => setFormData({ ...formData, why_us_bg_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.why_us_text_color} onChange={(e) => setFormData({ ...formData, why_us_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.why_us_text_color} onChange={(e) => setFormData({ ...formData, why_us_text_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Tag</label>
                  <input type="text" value={formData.why_us_tag} onChange={(e) => setFormData({ ...formData, why_us_tag: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Tag Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.why_us_tag_color || '#2596be'} onChange={(e) => setFormData({ ...formData, why_us_tag_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.why_us_tag_color || ''} onChange={(e) => setFormData({ ...formData, why_us_tag_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Heading</label>
                  <input type="text" value={formData.why_us_heading} onChange={(e) => setFormData({ ...formData, why_us_heading: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Heading Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.why_us_heading_color || '#111827'} onChange={(e) => setFormData({ ...formData, why_us_heading_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.why_us_heading_color || ''} onChange={(e) => setFormData({ ...formData, why_us_heading_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Card BG Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.why_us_card_bg_color} onChange={(e) => setFormData({ ...formData, why_us_card_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.why_us_card_bg_color} onChange={(e) => setFormData({ ...formData, why_us_card_bg_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Us Icon Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.why_us_icon_color || '#2596be'} onChange={(e) => setFormData({ ...formData, why_us_icon_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.why_us_icon_color || ''} onChange={(e) => setFormData({ ...formData, why_us_icon_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Content */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">CTA Section Content</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.cta_bg_color || '#2596be'} onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.cta_bg_color || ''} onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.cta_text_color || '#ffffff'} onChange={(e) => setFormData({ ...formData, cta_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.cta_text_color || ''} onChange={(e) => setFormData({ ...formData, cta_text_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.cta_btn_color || '#ffffff'} onChange={(e) => setFormData({ ...formData, cta_btn_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.cta_btn_color || ''} onChange={(e) => setFormData({ ...formData, cta_btn_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.cta_btn_text_color || '#2596be'} onChange={(e) => setFormData({ ...formData, cta_btn_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.cta_btn_text_color || ''} onChange={(e) => setFormData({ ...formData, cta_btn_text_color: e.target.value })} className="flex-1 border rounded-lg px-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Heading</label>
                  <input type="text" value={formData.cta_heading} onChange={(e) => setFormData({ ...formData, cta_heading: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                  <input type="text" value={formData.cta_heading_size} onChange={(e) => setFormData({ ...formData, cta_heading_size: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Subheading</label>
                  <textarea rows={2} value={formData.cta_subheading} onChange={(e) => setFormData({ ...formData, cta_subheading: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size</label>
                  <input type="text" value={formData.cta_subheading_size} onChange={(e) => setFormData({ ...formData, cta_subheading_size: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                  <input type="text" value={formData.cta_btn_text} onChange={(e) => setFormData({ ...formData, cta_btn_text: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Link</label>
                  <input type="text" value={formData.cta_btn_link} onChange={(e) => setFormData({ ...formData, cta_btn_link: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Border Radius (Tailwind e.g., rounded-full)</label>
                  <input type="text" value={formData.cta_btn_radius} onChange={(e) => setFormData({ ...formData, cta_btn_radius: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#2596be] hover:bg-[#1e7a9b] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
