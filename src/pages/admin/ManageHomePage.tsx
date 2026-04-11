import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ManageHomeProjects from './ManageHomeProjects';

export default function ManageHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'content' | 'projects'>('content');
  const [formData, setFormData] = useState({
    page_bg_color: "#000000",
    page_text_color: "#ffffff",
    hero_video_url: "https://cdn.pixabay.com/video/2020/05/25/40131-425257528_large.mp4",
    hero_text: "We Are The\nModern\nAgency Of Record",
    hero_text_color: "#ffffff",
    hero_bg_color: "#000000",
    hero_text_size: "text-6xl md:text-8xl lg:text-9xl",
    marquee_text: "WE PUT SOCIAL AT THE CENTER OF EVERYTHING WE DO.",
    marquee_bg_color: "#2596be",
    marquee_text_color: "#ffffff",
    marquee_text_size: "text-2xl md:text-4xl",
    help_heading: "How We Can\nHelp You",
    help_subheading: "We're relentlessly focused on one thing: growing your brand through relevance.",
    help_button_text: "Learn More",
    help_bg_color: "#ffffff",
    help_text_color: "#000000",
    help_heading_size: "text-5xl md:text-7xl",
    help_subheading_size: "text-xl font-bold",
    help_btn_color: "#2596be",
    help_btn_text_color: "#ffffff",
    brands_logos: [] as string[],
    brands_bg_color: "#000000",
    brands_text_color: "#ffffff",
    our_work_heading: "A Glimpse At\nOur Work",
    our_work_subheading: "We are experts in driving relevance, with social at the center of everything we do.",
    our_work_btn_text: "See More",
    our_work_btn_color: "#2596be",
    our_work_bg_color: "#ffffff",
    our_work_text_color: "#000000",
    our_work_heading_size: "text-5xl md:text-7xl",
    our_work_subheading_size: "text-xl md:text-2xl",
    testimonials_tag: "Client Love",
    testimonials_tag_color: "#2596be",
    testimonials_title: "Don't just take our word for it.",
    testimonials_title_color: "#ffffff",
    testimonials_title_size: "text-4xl md:text-6xl",
    testimonials_bg_color: "#000000",
    blogs_title: "Read The Latest",
    blogs_title_color: "#ffffff",
    blogs_title_size: "text-5xl md:text-7xl",
    blogs_subheading: "Insights, thoughts, and industry news directly from our expert team.",
    blogs_subheading_size: "text-xl font-bold",
    blogs_btn_text: "Our Blog",
    blogs_btn_color: "#2596be",
    blogs_bg_color: "#111111",
    cta_heading: "Ready to transform your brand?",
    cta_subheading: "Let's create something amazing together.",
    cta_btn_text: "Get in Touch",
    cta_btn_link: "/contact",
    cta_text_color: "#ffffff",
    cta_btn_text_color: "#000000",
    cta_heading_size: "text-5xl md:text-7xl",
    cta_subheading_size: "text-xl md:text-2xl",
    help_btn_radius: "9999px",
    our_work_btn_text_color: "#ffffff",
    our_work_btn_radius: "9999px",
    blogs_btn_text_color: "#ffffff",
    blogs_btn_radius: "9999px",
    cta_btn_radius: "9999px"
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        if (error.code === '42P01') {
          toast.error("homepage_content table does not exist. Please create it in Supabase.");
        } else if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }
      }
      
      if (data) {
        setFormData({
          ...formData,
          ...data,
          brands_logos: data.brands_logos || formData.brands_logos
        });
        setRowId(data.id);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setFormData({ ...formData, brands_logos: [...formData.brands_logos, url] });
      toast.success('Logo uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = (index: number) => {
    const newLogos = [...formData.brands_logos];
    newLogos.splice(index, 1);
    setFormData({ ...formData, brands_logos: newLogos });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setFormData({ ...formData, hero_video_url: url });
      toast.success('Video uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (rowId) {
        const { error } = await supabase
          .from('homepage_content')
          .update(formData)
          .eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('homepage_content')
          .insert([formData])
          .select()
          .single();
        if (error) throw error;
        if (data) setRowId(data.id);
      }
      toast.success('Homepage content updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Home Page</h1>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'content' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Page Content
        </button>
        <button 
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Home Projects
        </button>
      </div>

      {activeTab === 'projects' ? (
        <ManageHomeProjects />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Global Page Settings */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Global Page Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.page_bg_color}
                    onChange={(e) => setFormData({ ...formData, page_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.page_bg_color}
                    onChange={(e) => setFormData({ ...formData, page_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.page_text_color}
                    onChange={(e) => setFormData({ ...formData, page_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.page_text_color}
                    onChange={(e) => setFormData({ ...formData, page_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Video URL</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={formData.hero_video_url}
                    onChange={(e) => setFormData({ ...formData, hero_video_url: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Video'}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Text (Use Enter for new lines)</label>
                <textarea
                  rows={4}
                  value={formData.hero_text}
                  onChange={(e) => setFormData({ ...formData, hero_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.hero_text_color}
                      onChange={(e) => setFormData({ ...formData, hero_text_color: e.target.value })}
                      className="h-10 w-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.hero_text_color}
                      onChange={(e) => setFormData({ ...formData, hero_text_color: e.target.value })}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Text Size (Tailwind)</label>
                  <input
                    type="text"
                    value={formData.hero_text_size}
                    onChange={(e) => setFormData({ ...formData, hero_text_size: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                    placeholder="e.g. text-6xl md:text-8xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Color (if no video)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.hero_bg_color}
                      onChange={(e) => setFormData({ ...formData, hero_bg_color: e.target.value })}
                      className="h-10 w-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.hero_bg_color}
                      onChange={(e) => setFormData({ ...formData, hero_bg_color: e.target.value })}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Scrolling Marquee</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Marquee Text</label>
                <input
                  type="text"
                  value={formData.marquee_text}
                  onChange={(e) => setFormData({ ...formData, marquee_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Marquee Text Size (Tailwind)</label>
                <input
                  type="text"
                  value={formData.marquee_text_size}
                  onChange={(e) => setFormData({ ...formData, marquee_text_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.marquee_bg_color}
                    onChange={(e) => setFormData({ ...formData, marquee_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.marquee_bg_color}
                    onChange={(e) => setFormData({ ...formData, marquee_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.marquee_text_color}
                    onChange={(e) => setFormData({ ...formData, marquee_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.marquee_text_color}
                    onChange={(e) => setFormData({ ...formData, marquee_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* How We Can Help Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">"How We Can Help You" Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <textarea
                  rows={2}
                  value={formData.help_heading}
                  onChange={(e) => setFormData({ ...formData, help_heading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                <input
                  type="text"
                  value={formData.help_heading_size}
                  onChange={(e) => setFormData({ ...formData, help_heading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                <textarea
                  rows={2}
                  value={formData.help_subheading}
                  onChange={(e) => setFormData({ ...formData, help_subheading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size</label>
                <input
                  type="text"
                  value={formData.help_subheading_size}
                  onChange={(e) => setFormData({ ...formData, help_subheading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.help_button_text}
                  onChange={(e) => setFormData({ ...formData, help_button_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.help_btn_color}
                    onChange={(e) => setFormData({ ...formData, help_btn_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.help_btn_color}
                    onChange={(e) => setFormData({ ...formData, help_btn_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.help_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, help_btn_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.help_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, help_btn_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Radius (e.g. 8px, 9999px)</label>
                <input
                  type="text"
                  value={formData.help_btn_radius}
                  onChange={(e) => setFormData({ ...formData, help_btn_radius: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.help_bg_color}
                    onChange={(e) => setFormData({ ...formData, help_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.help_bg_color}
                    onChange={(e) => setFormData({ ...formData, help_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.help_text_color}
                    onChange={(e) => setFormData({ ...formData, help_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.help_text_color}
                    onChange={(e) => setFormData({ ...formData, help_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brands Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Brands Scroll Logos</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.brands_bg_color}
                      onChange={(e) => setFormData({ ...formData, brands_bg_color: e.target.value })}
                      className="h-10 w-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.brands_bg_color}
                      onChange={(e) => setFormData({ ...formData, brands_bg_color: e.target.value })}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color (for default brands)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.brands_text_color}
                      onChange={(e) => setFormData({ ...formData, brands_text_color: e.target.value })}
                      className="h-10 w-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.brands_text_color}
                      onChange={(e) => setFormData({ ...formData, brands_text_color: e.target.value })}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {formData.brands_logos.map((logo, index) => (
                  <div key={index} className="relative group w-24 h-24 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                    {logo ? <img src={logo} alt="Brand" className="max-w-full max-h-full object-contain p-2" /> : null}
                    <button
                      type="button"
                      onClick={() => removeLogo(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : <Plus className="w-6 h-6 text-gray-400" />}
                </div>
              </div>
            </div>
          </div>

          {/* Our Work Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">"Our Work" Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <textarea
                  rows={2}
                  value={formData.our_work_heading}
                  onChange={(e) => setFormData({ ...formData, our_work_heading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                <input
                  type="text"
                  value={formData.our_work_heading_size}
                  onChange={(e) => setFormData({ ...formData, our_work_heading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                <textarea
                  rows={2}
                  value={formData.our_work_subheading}
                  onChange={(e) => setFormData({ ...formData, our_work_subheading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size</label>
                <input
                  type="text"
                  value={formData.our_work_subheading_size}
                  onChange={(e) => setFormData({ ...formData, our_work_subheading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.our_work_btn_text}
                  onChange={(e) => setFormData({ ...formData, our_work_btn_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.our_work_btn_color}
                    onChange={(e) => setFormData({ ...formData, our_work_btn_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.our_work_btn_color}
                    onChange={(e) => setFormData({ ...formData, our_work_btn_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.our_work_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, our_work_btn_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.our_work_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, our_work_btn_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Radius</label>
                <input
                  type="text"
                  value={formData.our_work_btn_radius}
                  onChange={(e) => setFormData({ ...formData, our_work_btn_radius: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.our_work_bg_color}
                    onChange={(e) => setFormData({ ...formData, our_work_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.our_work_bg_color}
                    onChange={(e) => setFormData({ ...formData, our_work_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.our_work_text_color}
                    onChange={(e) => setFormData({ ...formData, our_work_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.our_work_text_color}
                    onChange={(e) => setFormData({ ...formData, our_work_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Testimonials Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                <input
                  type="text"
                  value={formData.testimonials_tag}
                  onChange={(e) => setFormData({ ...formData, testimonials_tag: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.testimonials_tag_color}
                    onChange={(e) => setFormData({ ...formData, testimonials_tag_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.testimonials_tag_color}
                    onChange={(e) => setFormData({ ...formData, testimonials_tag_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <textarea
                  rows={2}
                  value={formData.testimonials_title}
                  onChange={(e) => setFormData({ ...formData, testimonials_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Size</label>
                <input
                  type="text"
                  value={formData.testimonials_title_size}
                  onChange={(e) => setFormData({ ...formData, testimonials_title_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.testimonials_title_color}
                    onChange={(e) => setFormData({ ...formData, testimonials_title_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.testimonials_title_color}
                    onChange={(e) => setFormData({ ...formData, testimonials_title_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.testimonials_bg_color}
                    onChange={(e) => setFormData({ ...formData, testimonials_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.testimonials_bg_color}
                    onChange={(e) => setFormData({ ...formData, testimonials_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blogs Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Blogs Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <textarea
                  rows={2}
                  value={formData.blogs_title}
                  onChange={(e) => setFormData({ ...formData, blogs_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Size</label>
                <input
                  type="text"
                  value={formData.blogs_title_size}
                  onChange={(e) => setFormData({ ...formData, blogs_title_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                <textarea
                  rows={2}
                  value={formData.blogs_subheading}
                  onChange={(e) => setFormData({ ...formData, blogs_subheading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size</label>
                <input
                  type="text"
                  value={formData.blogs_subheading_size}
                  onChange={(e) => setFormData({ ...formData, blogs_subheading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.blogs_title_color}
                    onChange={(e) => setFormData({ ...formData, blogs_title_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.blogs_title_color}
                    onChange={(e) => setFormData({ ...formData, blogs_title_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.blogs_btn_text}
                  onChange={(e) => setFormData({ ...formData, blogs_btn_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.blogs_btn_color}
                    onChange={(e) => setFormData({ ...formData, blogs_btn_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.blogs_btn_color}
                    onChange={(e) => setFormData({ ...formData, blogs_btn_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.blogs_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, blogs_btn_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.blogs_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, blogs_btn_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Radius</label>
                <input
                  type="text"
                  value={formData.blogs_btn_radius}
                  onChange={(e) => setFormData({ ...formData, blogs_btn_radius: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.blogs_bg_color}
                    onChange={(e) => setFormData({ ...formData, blogs_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.blogs_bg_color}
                    onChange={(e) => setFormData({ ...formData, blogs_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Call to Action (CTA) Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <textarea
                  rows={2}
                  value={formData.cta_heading}
                  onChange={(e) => setFormData({ ...formData, cta_heading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                <input
                  type="text"
                  value={formData.cta_heading_size}
                  onChange={(e) => setFormData({ ...formData, cta_heading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                <textarea
                  rows={2}
                  value={formData.cta_subheading}
                  onChange={(e) => setFormData({ ...formData, cta_subheading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size</label>
                <input
                  type="text"
                  value={formData.cta_subheading_size}
                  onChange={(e) => setFormData({ ...formData, cta_subheading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.cta_btn_text}
                  onChange={(e) => setFormData({ ...formData, cta_btn_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={formData.cta_btn_link}
                  onChange={(e) => setFormData({ ...formData, cta_btn_link: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.cta_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, cta_btn_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.cta_btn_text_color}
                    onChange={(e) => setFormData({ ...formData, cta_btn_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Radius</label>
                <input
                  type="text"
                  value={formData.cta_btn_radius}
                  onChange={(e) => setFormData({ ...formData, cta_btn_radius: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.cta_bg_color}
                    onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.cta_bg_color}
                    onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.cta_text_color}
                    onChange={(e) => setFormData({ ...formData, cta_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.cta_text_color}
                    onChange={(e) => setFormData({ ...formData, cta_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="px-6 py-2.5 bg-[#2596be] hover:bg-[#1e7a9b] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {(isSubmitting || uploading) ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
}
