import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ColorInput = ({ label, field, formData, setFormData, defaultColor = '#000000' }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex gap-2">
      <input
        type="color"
        value={formData[field] || defaultColor}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="h-10 w-10 rounded cursor-pointer border border-gray-300"
      />
      <input
        type="text"
        value={formData[field] || ''}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
        placeholder={defaultColor}
      />
    </div>
  </div>
);

const TextInput = ({ label, field, formData, setFormData, placeholder = '' }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="text"
      value={formData[field] || ''}
      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
    />
  </div>
);

const TextareaInput = ({ label, field, formData, setFormData, rows = 3 }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      rows={rows}
      value={formData[field] || ''}
      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
    />
  </div>
);

export default function ManageBlogsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [rowId, setRowId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    page_bg_color: '#ffffff',
    page_text_color: '#000000',
    font_style: 'font-sans',
    banner_badge: 'Insights',
    banner_badge_color: '#2596be',
    banner_heading: 'The Growth Hub',
    banner_subheading: 'Strategies, insights, and playbooks from the frontlines of digital marketing.',
    banner_bg_image: '',
    banner_overlay_color: '#000000',
    banner_overlay_opacity: '0.5',
    banner_heading_color: '#ffffff',
    banner_heading_size: 'text-6xl md:text-8xl',
    banner_subheading_color: '#9ca3af',
    banner_subheading_size: 'text-xl md:text-2xl',
    banner_padding_top: 'pt-40',
    banner_padding_bottom: 'pb-24',
    section_bg_color: '#ffffff',
    main_header_heading: 'OUR LATEST<br />INSIGHTS',
    main_header_heading_color: '#000000',
    main_header_heading_size: 'text-[3.5rem] md:text-[5.5rem] lg:text-[7rem]',
    subtext_content: "We're relentlessly focused on one thing: growing your brand through relevance.",
    subtext_color: '#111827',
    subtext_size: 'text-lg md:text-xl',
    sort_btn_bg_color: '#c2ff00',
    sort_btn_text_color: '#000000',
    category_tab_active_bg: '#1DB954',
    category_tab_active_text: '#ffffff',
    category_tab_inactive_bg: '#f9fafb',
    category_tab_inactive_text: '#4b5563',
    cta_heading: "LET'S BUILD YOUR GROWTH ENGINE",
    cta_heading_color: '#000000',
    cta_subheading: "Stop guessing with your marketing budget. Partner with us to build a scalable, predictable revenue system.",
    cta_subheading_color: '#000000',
    cta_btn_text: 'VIEW OUR CASE STUDIES',
    cta_btn_color: '#000000',
    cta_btn_text_color: '#ffffff',
    cta_btn_radius: 'rounded-full',
    cta_bg_color: '#c2ff00',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs_page_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setRowId(data.id);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(field);
    try {
      const url = await uploadImage(e.target.files[0]);
      setFormData((prev: any) => ({ ...prev, [field]: url }));
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (rowId) {
        const { error } = await supabase.from('blogs_page_content').update(formData).eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('blogs_page_content').insert([formData]).select().single();
        if (error) throw error;
        if (data) setRowId(data.id);
      }
      toast.success('Blogs page content updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ImageUploadField = ({ label, field }: { label: string; field: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-3">
        <input
          type="text"
          value={formData[field] || ''}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          placeholder="Paste image URL or upload"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
        />
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, field)}
            disabled={!!uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button
            type="button"
            disabled={!!uploading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap"
          >
            {uploading === field ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
          </button>
        </div>
      </div>
      {formData[field] && (
        <img src={formData[field]} alt="Preview" className="mt-2 h-24 rounded-lg object-cover border border-gray-200" />
      )}
    </div>
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Manage Blogs Page</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        {/* Global Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Global Page Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Page Background Color" field="page_bg_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
            <ColorInput label="Page Text Color" field="page_text_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <div className="md:col-span-2">
              <TextInput label="Font Style (Tailwind class e.g. font-sans, font-serif)" field="font_style" formData={formData} setFormData={setFormData} placeholder="font-sans" />
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Banner Section (PageHeader)</h2>
          <div className="space-y-4">
            <ImageUploadField label="Background Image" field="banner_bg_image" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorInput label="Overlay Color" field="banner_overlay_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
              <TextInput label="Overlay Opacity (0 to 1, e.g. 0.5)" field="banner_overlay_opacity" formData={formData} setFormData={setFormData} placeholder="0.5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Padding Top (e.g. 150 or 200)" field="banner_padding_top" formData={formData} setFormData={setFormData} placeholder="160" />
              <TextInput label="Padding Bottom (e.g. 100)" field="banner_padding_bottom" formData={formData} setFormData={setFormData} placeholder="100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Badge Text" field="banner_badge" formData={formData} setFormData={setFormData} />
              <ColorInput label="Badge Color" field="banner_badge_color" formData={formData} setFormData={setFormData} defaultColor="#2596be" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput label="Heading" field="banner_heading" formData={formData} setFormData={setFormData} />
              <ColorInput label="Heading Color" field="banner_heading_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
              <TextInput label="Heading Size (Tailwind)" field="banner_heading_size" formData={formData} setFormData={setFormData} placeholder="text-6xl md:text-8xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextareaInput label="Subheading" field="banner_subheading" formData={formData} setFormData={setFormData} rows={2} />
              <ColorInput label="Subheading Color" field="banner_subheading_color" formData={formData} setFormData={setFormData} defaultColor="#9ca3af" />
              <TextInput label="Subheading Size (Tailwind)" field="banner_subheading_size" formData={formData} setFormData={setFormData} placeholder="text-xl md:text-2xl" />
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Main Header Section</h2>
          <div className="space-y-4">
            <ColorInput label="Section Background Color" field="section_bg_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <TextareaInput label="Main Heading (HTML supported, use <br /> for new lines)" field="main_header_heading" formData={formData} setFormData={setFormData} rows={2} />
              </div>
              <ColorInput label="Main Heading Color" field="main_header_heading_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            </div>
            <TextInput label="Main Heading Size (Tailwind, e.g. text-[7rem])" field="main_header_heading_size" formData={formData} setFormData={setFormData} placeholder="text-[3.5rem] md:text-[5.5rem] lg:text-[7rem]" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <div className="md:col-span-2">
                <TextareaInput label="Subtext Content" field="subtext_content" formData={formData} setFormData={setFormData} rows={2} />
              </div>
              <div className="space-y-4">
                <ColorInput label="Subtext Color" field="subtext_color" formData={formData} setFormData={setFormData} defaultColor="#111827" />
                <TextInput label="Subtext Size (Tailwind)" field="subtext_size" formData={formData} setFormData={setFormData} placeholder="text-lg md:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Footer CTA Section</h2>
          <div className="space-y-4">
            <ColorInput label="Section BG Color" field="cta_bg_color" formData={formData} setFormData={setFormData} defaultColor="#c2ff00" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="CTA Heading" field="cta_heading" formData={formData} setFormData={setFormData} />
              <ColorInput label="Heading Color" field="cta_heading_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextareaInput label="CTA Subheading" field="cta_subheading" formData={formData} setFormData={setFormData} rows={2} />
              <ColorInput label="Subheading Color" field="cta_subheading_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput label="Button Text" field="cta_btn_text" formData={formData} setFormData={setFormData} />
              <ColorInput label="Button Color" field="cta_btn_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
              <ColorInput label="Button Text Color" field="cta_btn_text_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
            </div>
            <TextInput label="Button Radius (e.g. rounded-full)" field="cta_btn_radius" formData={formData} setFormData={setFormData} placeholder="rounded-full" />
          </div>
        </div>

        {/* Components Styling */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">UI Components Styling (Listings)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-700">Sort Button</h3>
              <ColorInput label="BG Color" field="sort_btn_bg_color" formData={formData} setFormData={setFormData} defaultColor="#c2ff00" />
              <ColorInput label="Text Color" field="sort_btn_text_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            </div>
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-700">Category Tabs</h3>
              <div className="grid grid-cols-1 gap-4">
                <ColorInput label="Active BG Color" field="category_tab_active_bg" formData={formData} setFormData={setFormData} defaultColor="#1DB954" />
                <ColorInput label="Active Text Color" field="category_tab_active_text" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
                <ColorInput label="Inactive BG Color" field="category_tab_inactive_bg" formData={formData} setFormData={setFormData} defaultColor="#f9fafb" />
                <ColorInput label="Inactive Text Color" field="category_tab_inactive_text" formData={formData} setFormData={setFormData} defaultColor="#4b5563" />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-[#2596be] text-white font-bold rounded-lg hover:bg-[#1a7a9e] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
