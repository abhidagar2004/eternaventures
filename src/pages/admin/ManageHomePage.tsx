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
    hero_description: "",
    hero_description_color: "#ffffff",
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
    help_description_color: "#9ca3af",
    help_subheading_size: "text-xl font-bold",
    help_btn_color: "#2596be",
    help_btn_text_color: "#ffffff",
    brands_visibility: true,
    brands_logos: [] as string[],
    brands_bg_color: "#000000",
    brands_text_color: "#ffffff",
    our_work_heading: "A Glimpse At\nOur Work",
    work_visibility: true,
    our_work_subheading: "We are experts in driving relevance, with social at the center of everything we do.",
    our_work_btn_text: "See More",
    our_work_btn_color: "#2596be",
    our_work_bg_color: "#ffffff",
    our_work_text_color: "#000000",
    our_work_heading_size: "text-5xl md:text-7xl",
    our_work_subheading_size: "text-xl md:text-2xl",
    testimonials_tag: "Client Love",
    testimonials_visibility: true,
    testimonials_tag_color: "#2596be",
    testimonials_title: "Don't just take our word for it.",
    testimonials_title_color: "#ffffff",
    testimonials_title_size: "text-4xl md:text-6xl",
    testimonials_bg_color: "#000000",
    blogs_title: "Read The Latest",
    blogs_visibility: true,
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
    cta_bg_color: "#ceff00",
    cta_email: "hello@eternaventures.in",
    cta_email_color: "#000000",
    cta_text_color: "#ffffff",
    cta_btn_text_color: "#000000",
    cta_heading_size: "text-5xl md:text-7xl",
    cta_subheading_size: "text-xl md:text-2xl",
    phil_tag: "Our Philosophy",
    phil_tag_color: "#2596be",
    phil_tag_bg_color: "rgba(37, 150, 190, 0.1)",
    phil_title: "Growth is not a campaign. It’s a discipline.",
    phil_title_color: "#ffffff",
    phil_title_size: "text-4xl md:text-6xl lg:text-7xl",
    phil_description: "Most agencies sell tactics. We build systems. EternaVentures was founded on the belief that a brand's market position is its most valuable — and most underbuilt — asset. Every decision we make compounds. We work with founders, growth-stage brands, and challenger companies who understand that premium positioning isn't a luxury — it's the most efficient path to dominance. Based in Jaipur, operating across India and beyond. We don't run campaigns. We construct ecosystems where your audience finds you inevitable.",
    phil_description_color: "#9ca3af",
    phil_description_size: "text-lg md:text-xl",
    phil_bg_color: "#000000",
    phil_visibility: true,
    help_btn_radius: "9999px",
    our_work_btn_text_color: "#ffffff",
    our_work_btn_radius: "9999px",
    blogs_btn_text_color: "#ffffff",
    blogs_btn_radius: "9999px",
    cta_btn_radius: "9999px",
    help_tag: "What We Do",
    help_tag_color: "#2596be",
    method_visibility: true,
    method_tag: "How We Work",
    method_tag_color: "#2596be",
    method_title: "The EternaVentures Method",
    method_title_color: "#ffffff",
    method_quote: "“We don’t start with deliverables. We start with the gap between where your brand is and where it should be — and build the bridge.”",
    method_quote_color: "#c2ff00",
    method_bg_color: "#000000",
    method_step1_title: "Audit & Immersion",
    method_step1_desc: "We spend time in your world before we touch your brand. Market landscape, competitor positioning, audience signals, and the story your brand is currently telling — whether you intended it or not.",
    method_step2_title: "Strategic Foundation",
    method_step2_desc: "Every action we take is grounded in a positioning document that the whole team — ours and yours — can build from. Clear differentiation, defined audience tiers, and a growth thesis we can defend.",
    method_step3_title: "Build & Activate",
    method_step3_desc: "We execute across capabilities simultaneously — not in silos. Brand, content, performance, influence, and experience working as one integrated system, not a list of services.",
    method_step4_title: "Measure & Compound",
    method_step4_desc: "We track what matters: brand equity, audience quality, revenue influence, and market share signals. Then we reinvest learnings into the next cycle. Growth compounds when strategy doesn’t reset every quarter.",
    section_order: ['hero', 'philosophy', 'services', 'marquee', 'marquee_logos', 'method', 'who_we_serve', 'work', 'testimonials', 'cta', 'blogs'],
    method_step_color: "#ffffff",
    method_step_hover_color: "#2596be",
    method_step_title_size: "text-2xl",
    method_step_desc_size: "text-base",
    method_title_size: "text-5xl md:text-7xl lg:text-8xl",
    method_quote_size: "text-2xl md:text-3xl lg:text-4xl",
    hero_description_size: "text-xl md:text-2xl",
    help_tag_size: "text-sm",
    serve_visibility: true,
    serve_tag: "",
    serve_tag_color: "#2596be",
    serve_tag_size: "text-sm",
    serve_title: "",
    serve_title_color: "#ffffff",
    serve_title_size: "text-5xl md:text-7xl lg:text-8xl",
    serve_bg_color: "#000000",
    serve_text_color: "#ffffff",
    serve_hover_color: "#2596be",
    serve_item_title_size: "text-xl md:text-2xl",
    serve_item_desc_size: "text-base",
    serve_items: [],
    global_heading_font: "Space Grotesk",
    global_body_font: "Inter",
    global_tag_font: "Space Grotesk",
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

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...(formData.section_order || [])];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setFormData({ ...formData, section_order: newOrder });
  };

  const updateServeItem = (index: number, field: string, value: string) => {
    const newItems = [...(formData.serve_items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, serve_items: newItems });
  };

  const removeServeItem = (index: number) => {
    const newItems = (formData.serve_items || []).filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, serve_items: newItems });
  };

  const addServeItem = () => {
    setFormData({ 
      ...formData, 
      serve_items: [...(formData.serve_items || []), { title: "", desc: "" }] 
    });
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
          <form id="homepage-form" onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Section Visibility & Reordering */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Homepage Section Order</h2>
            <p className="text-sm text-gray-500 mb-4 font-normal">Use the arrows to reorder sections on your homepage. The top item will appear first.</p>
            <div className="space-y-2">
              {(formData.section_order || []).map((sectionId: string, index: number) => {
                const labels: Record<string, string> = {
                  hero: "Hero Section",
                  philosophy: "Philosophy Section",
                  services: "What We Do / Services",
                  marquee: "Text Marquee",
                  method: "How We Work / Method",
                  who_we_serve: "Who We Serve Section",
                  work: "Our Work / Projects",
                  testimonials: "Testimonials Section",
                  cta: "Call to Action (CTA)",
                  blogs: "Latest Blogs",
                  marquee_logos: "Client Logo Marquee"
                };
                return (
                  <div key={sectionId} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">{labels[sectionId] || sectionId}</span>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSection(index, 'up')}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4 transform -rotate-180" />
                        <span className="sr-only">Up</span>
                      </button>
                      <button 
                        type="button"
                        disabled={index === (formData.section_order?.length || 0) - 1}
                        onClick={() => moveSection(index, 'down')}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4 rotate-180" />
                        <span className="sr-only">Down</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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

          {/* Global Font Settings */}
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <h2 className="text-lg font-bold text-gray-900 mb-1 pb-2 border-b border-purple-200">🔤 Global Font Families</h2>
            <p className="text-sm text-purple-600 mb-4">Enter any Google Font name. Changes apply site-wide to headings, body text, and tags.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Heading Font <span className="text-purple-500 font-normal text-xs">(h1, h2, h3...)</span></label>
                <input
                  type="text"
                  value={formData.global_heading_font}
                  onChange={(e) => setFormData({ ...formData, global_heading_font: e.target.value })}
                  placeholder="Space Grotesk"
                  className="w-full border border-purple-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <p className="text-xs text-gray-500 mt-1">e.g. Playfair Display, Bebas Neue, Montserrat</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Body Font <span className="text-purple-500 font-normal text-xs">(paragraphs, descriptions)</span></label>
                <input
                  type="text"
                  value={formData.global_body_font}
                  onChange={(e) => setFormData({ ...formData, global_body_font: e.target.value })}
                  placeholder="Inter"
                  className="w-full border border-purple-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <p className="text-xs text-gray-500 mt-1">e.g. Inter, DM Sans, Lato, Open Sans</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tag Font <span className="text-purple-500 font-normal text-xs">(labels, tags, buttons)</span></label>
                <input
                  type="text"
                  value={formData.global_tag_font}
                  onChange={(e) => setFormData({ ...formData, global_tag_font: e.target.value })}
                  placeholder="Space Grotesk"
                  className="w-full border border-purple-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <p className="text-xs text-gray-500 mt-1">e.g. Space Grotesk, Rajdhani, Oswald</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-xs text-purple-700"><strong>💡 Tip for Size Fields:</strong> Use pixel values like <code className="bg-white px-1 rounded">48px</code> or Tailwind classes like <code className="bg-white px-1 rounded">text-3xl md:text-5xl lg:text-6xl</code>. Pixel values are more reliable.</p>
            </div>
          </div>

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
                    placeholder="e.g. text-6xl md:text-8xl lg:text-9xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
                <textarea
                  rows={3}
                  value={formData.hero_description}
                  onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.hero_description_color}
                      onChange={(e) => setFormData({ ...formData, hero_description_color: e.target.value })}
                      className="h-10 w-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.hero_description_color}
                      onChange={(e) => setFormData({ ...formData, hero_description_color: e.target.value })}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description Size</label>
                  <input
                    type="text"
                    value={formData.hero_description_size}
                    onChange={(e) => setFormData({ ...formData, hero_description_size: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                    placeholder="e.g. text-xl md:text-2xl"
                  />
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

          {/* Philosophy Section */}
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold text-gray-900">Philosophy Section</h2>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.phil_visibility}
                    onChange={(e) => setFormData({ ...formData, phil_visibility: e.target.checked })}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${formData.phil_visibility ? 'bg-[#2596be]' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.phil_visibility ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Visible</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                <input
                  type="text"
                  value={formData.phil_tag}
                  onChange={(e) => setFormData({ ...formData, phil_tag: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.phil_tag_color}
                    onChange={(e) => setFormData({ ...formData, phil_tag_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.phil_tag_color}
                    onChange={(e) => setFormData({ ...formData, phil_tag_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Background Color</label>
                <input
                  type="text"
                  value={formData.phil_tag_bg_color}
                  onChange={(e) => setFormData({ ...formData, phil_tag_bg_color: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  placeholder="rgba(37, 150, 190, 0.1)"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <textarea
                  rows={2}
                  value={formData.phil_title}
                  onChange={(e) => setFormData({ ...formData, phil_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Size</label>
                <input
                  type="text"
                  value={formData.phil_title_size}
                  onChange={(e) => setFormData({ ...formData, phil_title_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.phil_title_color}
                    onChange={(e) => setFormData({ ...formData, phil_title_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.phil_title_color}
                    onChange={(e) => setFormData({ ...formData, phil_title_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Philosophy Description</label>
                <textarea
                  rows={4}
                  value={formData.phil_description}
                  onChange={(e) => setFormData({ ...formData, phil_description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.phil_description_color}
                    onChange={(e) => setFormData({ ...formData, phil_description_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.phil_description_color}
                    onChange={(e) => setFormData({ ...formData, phil_description_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description Size</label>
                <input
                  type="text"
                  value={formData.phil_description_size}
                  onChange={(e) => setFormData({ ...formData, phil_description_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  placeholder="e.g. text-lg md:text-xl"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.phil_bg_color}
                    onChange={(e) => setFormData({ ...formData, phil_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.phil_bg_color}
                    onChange={(e) => setFormData({ ...formData, phil_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">"What We Do" (Services Section)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                <input
                  type="text"
                  value={formData.help_tag}
                  onChange={(e) => setFormData({ ...formData, help_tag: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.help_tag_color}
                    onChange={(e) => setFormData({ ...formData, help_tag_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.help_tag_color}
                    onChange={(e) => setFormData({ ...formData, help_tag_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Size (Tailwind)</label>
                <input
                  type="text"
                  value={formData.help_tag_size}
                  onChange={(e) => setFormData({ ...formData, help_tag_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  placeholder="e.g. text-sm"
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.help_description_color}
                    onChange={(e) => setFormData({ ...formData, help_description_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.help_description_color}
                    onChange={(e) => setFormData({ ...formData, help_description_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
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
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size (Tailwind)</label>
                <input
                  type="text"
                  value={formData.help_subheading_size}
                  onChange={(e) => setFormData({ ...formData, help_subheading_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.help_description_color}
                    onChange={(e) => setFormData({ ...formData, help_description_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.help_description_color}
                    onChange={(e) => setFormData({ ...formData, help_description_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Card Hover Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.serve_hover_color}
                    onChange={(e) => setFormData({ ...formData, serve_hover_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.serve_hover_color}
                    onChange={(e) => setFormData({ ...formData, serve_hover_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brands Section */}
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold text-gray-900">Brands Scroll Logos (Marquee Logos)</h2>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.brands_visibility !== false}
                    onChange={(e) => setFormData({ ...formData, brands_visibility: e.target.checked })}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${formData.brands_visibility !== false ? 'bg-[#2596be]' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.brands_visibility !== false ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Visible</span>
              </label>
            </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="text"
                  value={formData.cta_email}
                  onChange={(e) => setFormData({ ...formData, cta_email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  placeholder="e.g. hello@eternaventures.in"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.cta_email_color}
                    onChange={(e) => setFormData({ ...formData, cta_email_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.cta_email_color}
                    onChange={(e) => setFormData({ ...formData, cta_email_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* The EternaVentures Method Section */}
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold text-gray-900">How We Work (Method Section)</h2>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.method_visibility}
                    onChange={(e) => setFormData({ ...formData, method_visibility: e.target.checked })}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${formData.method_visibility ? 'bg-[#2596be]' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.method_visibility ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Visible</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                <input
                  type="text"
                  value={formData.method_tag}
                  onChange={(e) => setFormData({ ...formData, method_tag: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.method_tag_color}
                    onChange={(e) => setFormData({ ...formData, method_tag_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.method_tag_color}
                    onChange={(e) => setFormData({ ...formData, method_tag_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Method Title</label>
                <input
                  type="text"
                  value={formData.method_title}
                  onChange={(e) => setFormData({ ...formData, method_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Font Size (Tailwind Class)</label>
                <input
                  type="text"
                  value={formData.method_title_size}
                  onChange={(e) => setFormData({ ...formData, method_title_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  placeholder="e.g. text-5xl md:text-7xl"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quote Text</label>
                <textarea
                  rows={2}
                  value={formData.method_quote}
                  onChange={(e) => setFormData({ ...formData, method_quote: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quote Font Size (Tailwind Class)</label>
                <input
                  type="text"
                  value={formData.method_quote_size}
                  onChange={(e) => setFormData({ ...formData, method_quote_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  placeholder="e.g. text-2xl md:text-4xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quote Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.method_quote_color}
                    onChange={(e) => setFormData({ ...formData, method_quote_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.method_quote_color}
                    onChange={(e) => setFormData({ ...formData, method_quote_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.method_bg_color}
                    onChange={(e) => setFormData({ ...formData, method_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.method_bg_color}
                    onChange={(e) => setFormData({ ...formData, method_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Step Title Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.method_step_color}
                      onChange={(e) => setFormData({ ...formData, method_step_color: e.target.value })}
                      className="h-8 w-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.method_step_color}
                      onChange={(e) => setFormData({ ...formData, method_step_color: e.target.value })}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Step Hover Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.method_step_hover_color}
                      onChange={(e) => setFormData({ ...formData, method_step_hover_color: e.target.value })}
                      className="h-8 w-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.method_step_hover_color}
                      onChange={(e) => setFormData({ ...formData, method_step_hover_color: e.target.value })}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Step Title Size</label>
                  <input
                    type="text"
                    value={formData.method_step_title_size}
                    onChange={(e) => setFormData({ ...formData, method_step_title_size: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Step Desc Size</label>
                  <input
                    type="text"
                    value={formData.method_step_desc_size}
                    onChange={(e) => setFormData({ ...formData, method_step_desc_size: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b">Step 01</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.method_step1_title}
                      onChange={(e) => setFormData({ ...formData, method_step1_title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.method_step1_desc}
                      onChange={(e) => setFormData({ ...formData, method_step1_desc: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b">Step 02</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.method_step2_title}
                      onChange={(e) => setFormData({ ...formData, method_step2_title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.method_step2_desc}
                      onChange={(e) => setFormData({ ...formData, method_step2_desc: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b">Step 03</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.method_step3_title}
                      onChange={(e) => setFormData({ ...formData, method_step3_title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.method_step3_desc}
                      onChange={(e) => setFormData({ ...formData, method_step3_desc: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b">Step 04</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.method_step4_title}
                      onChange={(e) => setFormData({ ...formData, method_step4_title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.method_step4_desc}
                      onChange={(e) => setFormData({ ...formData, method_step4_desc: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Who We Serve Section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold text-gray-900">Who We Serve Section</h2>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.serve_visibility}
                    onChange={(e) => setFormData({ ...formData, serve_visibility: e.target.checked })}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${formData.serve_visibility ? 'bg-[#2596be]' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.serve_visibility ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Visible</span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                <input
                  type="text"
                  value={formData.serve_tag}
                  onChange={(e) => setFormData({ ...formData, serve_tag: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.serve_tag_color}
                    onChange={(e) => setFormData({ ...formData, serve_tag_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.serve_tag_color}
                    onChange={(e) => setFormData({ ...formData, serve_tag_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <textarea
                  rows={2}
                  value={formData.serve_title}
                  onChange={(e) => setFormData({ ...formData, serve_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.serve_title_color}
                    onChange={(e) => setFormData({ ...formData, serve_title_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.serve_title_color}
                    onChange={(e) => setFormData({ ...formData, serve_title_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.serve_bg_color}
                    onChange={(e) => setFormData({ ...formData, serve_bg_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.serve_bg_color}
                    onChange={(e) => setFormData({ ...formData, serve_bg_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Accent/Hover Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.serve_hover_color}
                    onChange={(e) => setFormData({ ...formData, serve_hover_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.serve_hover_color}
                    onChange={(e) => setFormData({ ...formData, serve_hover_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.serve_text_color}
                    onChange={(e) => setFormData({ ...formData, serve_text_color: e.target.value })}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.serve_text_color}
                    onChange={(e) => setFormData({ ...formData, serve_text_color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Title Size</label>
                  <input
                    type="text"
                    value={formData.serve_title_size}
                    onChange={(e) => setFormData({ ...formData, serve_title_size: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tag Size</label>
                  <input
                    type="text"
                    value={formData.serve_tag_size}
                    onChange={(e) => setFormData({ ...formData, serve_tag_size: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Item Title Size</label>
                  <input
                    type="text"
                    value={formData.serve_item_title_size}
                    onChange={(e) => setFormData({ ...formData, serve_item_title_size: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Item Desc Size</label>
                  <input
                    type="text"
                    value={formData.serve_item_desc_size}
                    onChange={(e) => setFormData({ ...formData, serve_item_desc_size: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>

              {/* Serve Items List */}
              <div className="md:col-span-2 space-y-4 mt-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-gray-900">Industries / Items</h3>
                  <button
                    type="button"
                    onClick={addServeItem}
                    className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-[#2596be] font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.serve_items || []).map((item: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
                      <button
                        type="button"
                        onClick={() => removeServeItem(index)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateServeItem(index, 'title', e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-1.5 focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be] outline-none"
                            placeholder="e.g. Consumer Brands"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Description</label>
                          <textarea
                            rows={2}
                            value={item.desc}
                            onChange={(e) => updateServeItem(index, 'desc', e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-1.5 focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be] outline-none text-sm"
                            placeholder="Brief description..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
          <div className="flex justify-end pt-12 mt-12 border-t border-gray-200">
            <button
              type="submit"
              form="homepage-form"
              disabled={isSubmitting || uploading}
              className="px-10 py-4 bg-[#2596be] hover:bg-[#1e7a9b] text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {(isSubmitting || uploading) ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
              Save All Changes
            </button>
          </div>
          <div className="h-32"></div>
        </div>
      )}
    </div>
  );
}
