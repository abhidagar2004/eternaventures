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

export default function ManageAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [rowId, setRowId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    page_bg_color: '#000000',
    page_text_color: '#ffffff',
    font_style: 'font-sans',
    banner_bg_image: '',
    banner_overlay_color: '#000000',
    banner_overlay_opacity: '0.5',
    banner_padding_top: 'pt-40',
    banner_padding_bottom: 'pb-24',
    banner_heading: 'About EternaVentures',
    banner_heading_color: '#ffffff',
    banner_heading_size: 'text-6xl md:text-8xl',
    banner_subheading: 'We are a team of growth engineers, creative strategists, and media buyers dedicated to building the brands of tomorrow.',
    banner_subheading_color: '#9ca3af',
    banner_subheading_size: 'text-xl md:text-2xl',
    about_bg_color: '#000000',
    about_tag: 'About EternaVentures',
    about_tag_color: '#2596be',
    about_heading: 'Built for the modern digital landscape.',
    about_heading_color: '#ffffff',
    about_heading_size: 'text-5xl md:text-7xl',
    story_text: "EternaVentures was born out of frustration with traditional agencies that prioritize vanity metrics over actual business growth.",
    mission_text: "To help ambitious brands grow digitally by bridging the gap between thumb-stopping creative and ruthless performance marketing.",
    vision_text: "To become the premier global performance agency for D2C brands, startups, and visionary founders who want to dominate their market.",
    about_text_color: '#9ca3af',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    about_image_overlay_color: '#000000',
    about_image_overlay_opacity: '0.2',
    year_founded: '2020',
    year_founded_label: 'Founded',
    global_value: 'Global',
    global_label: 'Global Reach',
    trust_bg_color: '#000000',
    trust_text_color: '#ffffff',
    trust_stat1_value: '50+',
    trust_stat1_label: 'Brands Scaled',
    trust_stat2_value: '₹50Cr+',
    trust_stat2_label: 'Ad Spend Managed',
    trust_stat3_value: '100M+',
    trust_stat3_label: 'Reach Generated',
    trust_stat4_value: '4.9/5',
    trust_stat4_label: 'Client Rating',
    why_us_bg_color: '#f9fafb',
    why_us_tag: 'Why Us',
    why_us_tag_color: '#2596be',
    why_us_heading: "We don't just run ads. We build businesses.",
    why_us_heading_color: '#111827',
    why_us_text_color: '#111827',
    why_us_card_bg_color: '#ffffff',
    why_us_icon_color: '#2596be',
    cta_bg_color: '#000000',
    cta_heading: 'Join Our Mission',
    cta_heading_color: '#ffffff',
    cta_heading_size: 'text-5xl md:text-7xl',
    cta_subheading: "Whether you're a brand looking to scale or a creative looking for your next home, we want to hear from you.",
    cta_subheading_color: '#ffffff',
    cta_subheading_size: 'text-xl md:text-2xl',
    cta_btn_text: 'Contact Our Team',
    cta_btn_color: '#2596be',
    cta_btn_text_color: '#ffffff',
    cta_btn_radius: 'rounded-none',
    btn_link: '/contact',
  });

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
        const { error } = await supabase.from('about_page_content').update(formData).eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('about_page_content').insert([formData]).select().single();
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
        <h1 className="text-2xl font-bold text-gray-900">Manage About Page</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Global Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Global Page Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Page Background Color" field="page_bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <ColorInput label="Page Text Color" field="page_text_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
            <div className="md:col-span-2">
              <TextInput label="Font Style (Tailwind class e.g. font-sans, font-serif)" field="font_style" formData={formData} setFormData={setFormData} placeholder="font-sans" />
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Banner Section</h2>
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

        {/* About / Story Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">About / Story Section</h2>
          <div className="space-y-4">
            <ColorInput label="Section Background Color" field="about_bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Tag Text" field="about_tag" formData={formData} setFormData={setFormData} placeholder="About EternaVentures" />
              <ColorInput label="Tag Color" field="about_tag_color" formData={formData} setFormData={setFormData} defaultColor="#2596be" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput label="Heading" field="about_heading" formData={formData} setFormData={setFormData} />
              <ColorInput label="Heading Color" field="about_heading_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
              <TextInput label="Heading Size (Tailwind)" field="about_heading_size" formData={formData} setFormData={setFormData} placeholder="text-5xl md:text-7xl" />
            </div>
            <ColorInput label="Paragraph Text Color" field="about_text_color" formData={formData} setFormData={setFormData} defaultColor="#9ca3af" />
            <TextareaInput label="Story Text" field="story_text" formData={formData} setFormData={setFormData} rows={3} />
            <TextareaInput label="Mission Text" field="mission_text" formData={formData} setFormData={setFormData} rows={2} />
            <TextareaInput label="Vision Text" field="vision_text" formData={formData} setFormData={setFormData} rows={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Year Founded (Value)" field="year_founded" formData={formData} setFormData={setFormData} placeholder="2020" />
              <TextInput label="Year Founded (Label)" field="year_founded_label" formData={formData} setFormData={setFormData} placeholder="Founded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Global Reach (Value)" field="global_value" formData={formData} setFormData={setFormData} placeholder="Global" />
              <TextInput label="Global Reach (Label)" field="global_label" formData={formData} setFormData={setFormData} placeholder="Global Reach" />
            </div>
            <ImageUploadField label="Section Image" field="image_url" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorInput label="Image Overlay Color" field="about_image_overlay_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
              <TextInput label="Image Overlay Opacity (0 to 1)" field="about_image_overlay_opacity" formData={formData} setFormData={setFormData} placeholder="0.2" />
            </div>
          </div>
        </div>

        {/* TrustBar / Numbers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Numbers / Stats Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ColorInput label="Background Color" field="trust_bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <ColorInput label="Text Color" field="trust_text_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stat {n}</label>
                <input type="text" placeholder="Value" value={formData[`trust_stat${n}_value`] || ''} onChange={(e) => setFormData({ ...formData, [`trust_stat${n}_value`]: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm" />
                <input type="text" placeholder="Label" value={formData[`trust_stat${n}_label`] || ''} onChange={(e) => setFormData({ ...formData, [`trust_stat${n}_label`]: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Why Us Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Why Us Section</h2>
          <div className="space-y-4">
            <ColorInput label="Section Background Color" field="why_us_bg_color" formData={formData} setFormData={setFormData} defaultColor="#f9fafb" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Tag Text" field="why_us_tag" formData={formData} setFormData={setFormData} placeholder="Why Us" />
              <ColorInput label="Tag Color" field="why_us_tag_color" formData={formData} setFormData={setFormData} defaultColor="#2596be" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <TextInput label="Heading" field="why_us_heading" formData={formData} setFormData={setFormData} />
              </div>
              <ColorInput label="Heading Color" field="why_us_heading_color" formData={formData} setFormData={setFormData} defaultColor="#111827" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorInput label="Text Color" field="why_us_text_color" formData={formData} setFormData={setFormData} defaultColor="#111827" />
              <ColorInput label="Card Background Color" field="why_us_card_bg_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
              <ColorInput label="Icon Color" field="why_us_icon_color" formData={formData} setFormData={setFormData} defaultColor="#2596be" />
            </div>
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              💡 Why Us card items (title, description, icon) are managed separately under <strong>Services → Why Us Items</strong> in the sidebar.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">CTA Section</h2>
          <div className="space-y-4">
            <ColorInput label="Background Color" field="cta_bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput label="Heading" field="cta_heading" formData={formData} setFormData={setFormData} />
              <ColorInput label="Heading Color" field="cta_heading_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
              <TextInput label="Heading Size (Tailwind)" field="cta_heading_size" formData={formData} setFormData={setFormData} placeholder="text-5xl md:text-7xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextareaInput label="Subheading" field="cta_subheading" formData={formData} setFormData={setFormData} rows={2} />
              <ColorInput label="Subheading Color" field="cta_subheading_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
              <TextInput label="Subheading Size (Tailwind)" field="cta_subheading_size" formData={formData} setFormData={setFormData} placeholder="text-xl md:text-2xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Button Text" field="cta_btn_text" formData={formData} setFormData={setFormData} />
              <TextInput label="Button Link" field="btn_link" formData={formData} setFormData={setFormData} placeholder="/contact" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorInput label="Button Background Color" field="cta_btn_color" formData={formData} setFormData={setFormData} defaultColor="#2596be" />
              <ColorInput label="Button Text Color" field="cta_btn_text_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
              <TextInput label="Button Border Radius (e.g. rounded-full)" field="cta_btn_radius" formData={formData} setFormData={setFormData} placeholder="rounded-none" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pb-8">
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
