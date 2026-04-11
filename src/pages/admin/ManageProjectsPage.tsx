import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    banner_bg_image: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
    banner_heading: "Our Work",
    banner_heading_color: "#ffffff",
    banner_heading_size: "text-6xl md:text-8xl",
    banner_subheading: "Explore how we've helped ambitious brands scale their revenue, build their communities, and dominate their industries.",
    banner_subheading_color: "#9ca3af",
    banner_subheading_size: "text-xl md:text-2xl",
    numbers_bg_color: "#2596be",
    numbers_text_color: "#ffffff",
    numbers_stat1_value: "$500M+",
    numbers_stat1_label: "Revenue Generated",
    numbers_stat2_value: "10B+",
    numbers_stat2_label: "Impressions",
    numbers_stat3_value: "50+",
    numbers_stat3_label: "Industry Awards",
    numbers_stat4_value: "",
    numbers_stat4_label: "",
    our_work_bg_color: "#000000",
    our_work_tag: "Case Studies",
    our_work_tag_color: "#2596be",
    our_work_tag_size: "text-sm",
    our_work_heading: "Featured Projects",
    our_work_heading_color: "#ffffff",
    our_work_heading_size: "text-5xl md:text-7xl",
    our_work_cta_text: "Start a project",
    our_work_cta_color: "#ffffff",
    our_work_cta_size: "text-sm",
    our_work_category_btn_color: "#1f2937",
    our_work_category_btn_active_color: "#2596be",
    our_work_category_text_color: "#9ca3af",
    our_work_category_text_active_color: "#ffffff",
    reviews_bg_color: "#000000",
    reviews_tag: "Client Love",
    reviews_tag_color: "#2596be",
    reviews_tag_size: "text-sm",
    reviews_heading: "Don't just take our word for it.",
    reviews_heading_color: "#ffffff",
    reviews_heading_size: "text-5xl md:text-7xl",
    cta_bg_color: "#2596be",
    cta_heading: "Want Results Like These?",
    cta_heading_color: "#ffffff",
    cta_heading_size: "text-5xl md:text-7xl",
    cta_subheading: "We've helped dozens of brands scale past 7 and 8 figures. You could be next.",
    cta_subheading_color: "#ffffff",
    cta_subheading_size: "text-xl md:text-2xl",
    cta_btn_text: "Get Your Free Growth Audit",
    cta_btn_color: "#ffffff",
    cta_btn_text_color: "#000000",
    cta_btn_radius: "rounded-none",
    page_bg_color: "#000000",
    page_text_color: "#ffffff",
    font_style: "font-sans",
    banner_padding_top: "pt-40",
    banner_padding_bottom: "pb-24"
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('projects_page_content')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        if (error.code === '42P01') {
          toast.error("projects_page_content table does not exist. Please run the SQL script.");
        } else if (error.code !== 'PGRST116') {
          throw error;
        }
      }
      
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setFormData({ ...formData, banner_bg_image: url });
      toast.success('Image uploaded successfully');
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
          .from('projects_page_content')
          .update(formData)
          .eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('projects_page_content')
          .insert([formData])
          .select()
          .single();
        if (error) throw error;
        if (data) setRowId(data.id);
      }
      toast.success('Projects page content updated successfully');
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Projects Page</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Global Page Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Primary Font Style (Tailwind class, e.g. font-sans, font-serif)</label>
                 <input type="text" value={formData.font_style} onChange={(e) => setFormData({ ...formData, font_style: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
              </div>
            </div>
          </div>

          {/* Banner Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Banner Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={formData.banner_bg_image}
                    onChange={(e) => setFormData({ ...formData, banner_bg_image: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                  <input
                    type="text"
                    value={formData.banner_heading}
                    onChange={(e) => setFormData({ ...formData, banner_heading: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.banner_heading_color} onChange={(e) => setFormData({ ...formData, banner_heading_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.banner_heading_color} onChange={(e) => setFormData({ ...formData, banner_heading_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size (Tailwind)</label>
                  <input
                    type="text"
                    value={formData.banner_heading_size}
                    onChange={(e) => setFormData({ ...formData, banner_heading_size: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                  <textarea
                    rows={2}
                    value={formData.banner_subheading}
                    onChange={(e) => setFormData({ ...formData, banner_subheading: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={formData.banner_subheading_color} onChange={(e) => setFormData({ ...formData, banner_subheading_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                    <input type="text" value={formData.banner_subheading_color} onChange={(e) => setFormData({ ...formData, banner_subheading_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Padding Top (e.g. 150 or 200)</label>
                  <input
                    type="text"
                    value={formData.banner_padding_top || ''}
                    onChange={(e) => setFormData({ ...formData, banner_padding_top: e.target.value })}
                    placeholder="160"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Padding Bottom (e.g. 100)</label>
                  <input
                    type="text"
                    value={formData.banner_padding_bottom || ''}
                    onChange={(e) => setFormData({ ...formData, banner_padding_bottom: e.target.value })}
                    placeholder="100"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Numbers Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Numbers Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.numbers_bg_color} onChange={(e) => setFormData({ ...formData, numbers_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.numbers_bg_color} onChange={(e) => setFormData({ ...formData, numbers_bg_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.numbers_text_color} onChange={(e) => setFormData({ ...formData, numbers_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.numbers_text_color} onChange={(e) => setFormData({ ...formData, numbers_text_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stat 1</label>
                <input type="text" placeholder="Value (e.g. $500M+)" value={formData.numbers_stat1_value} onChange={(e) => setFormData({ ...formData, numbers_stat1_value: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                <input type="text" placeholder="Label" value={formData.numbers_stat1_label} onChange={(e) => setFormData({ ...formData, numbers_stat1_label: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stat 2</label>
                <input type="text" placeholder="Value" value={formData.numbers_stat2_value} onChange={(e) => setFormData({ ...formData, numbers_stat2_value: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                <input type="text" placeholder="Label" value={formData.numbers_stat2_label} onChange={(e) => setFormData({ ...formData, numbers_stat2_label: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stat 3</label>
                <input type="text" placeholder="Value" value={formData.numbers_stat3_value} onChange={(e) => setFormData({ ...formData, numbers_stat3_value: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                <input type="text" placeholder="Label" value={formData.numbers_stat3_label} onChange={(e) => setFormData({ ...formData, numbers_stat3_label: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stat 4 (Optional)</label>
                <input type="text" placeholder="Value" value={formData.numbers_stat4_value || ''} onChange={(e) => setFormData({ ...formData, numbers_stat4_value: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                <input type="text" placeholder="Label" value={formData.numbers_stat4_label || ''} onChange={(e) => setFormData({ ...formData, numbers_stat4_label: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>
          </div>

          {/* Our Work Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Our Work Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                <input type="text" value={formData.our_work_tag} onChange={(e) => setFormData({ ...formData, our_work_tag: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.our_work_tag_color} onChange={(e) => setFormData({ ...formData, our_work_tag_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.our_work_tag_color} onChange={(e) => setFormData({ ...formData, our_work_tag_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Size</label>
                <input type="text" value={formData.our_work_tag_size} onChange={(e) => setFormData({ ...formData, our_work_tag_size: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input type="text" value={formData.our_work_heading} onChange={(e) => setFormData({ ...formData, our_work_heading: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.our_work_heading_color} onChange={(e) => setFormData({ ...formData, our_work_heading_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.our_work_heading_color} onChange={(e) => setFormData({ ...formData, our_work_heading_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                <input type="text" value={formData.our_work_heading_size} onChange={(e) => setFormData({ ...formData, our_work_heading_size: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                <input type="text" value={formData.our_work_cta_text} onChange={(e) => setFormData({ ...formData, our_work_cta_text: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.our_work_cta_color} onChange={(e) => setFormData({ ...formData, our_work_cta_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.our_work_cta_color} onChange={(e) => setFormData({ ...formData, our_work_cta_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Size</label>
                <input type="text" value={formData.our_work_cta_size} onChange={(e) => setFormData({ ...formData, our_work_cta_size: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Button Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.our_work_category_btn_color} onChange={(e) => setFormData({ ...formData, our_work_category_btn_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.our_work_category_btn_color} onChange={(e) => setFormData({ ...formData, our_work_category_btn_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Button Active Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.our_work_category_btn_active_color} onChange={(e) => setFormData({ ...formData, our_work_category_btn_active_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.our_work_category_btn_active_color} onChange={(e) => setFormData({ ...formData, our_work_category_btn_active_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Text Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.our_work_category_text_color} onChange={(e) => setFormData({ ...formData, our_work_category_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.our_work_category_text_color} onChange={(e) => setFormData({ ...formData, our_work_category_text_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Text Active Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.our_work_category_text_active_color} onChange={(e) => setFormData({ ...formData, our_work_category_text_active_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.our_work_category_text_active_color} onChange={(e) => setFormData({ ...formData, our_work_category_text_active_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={formData.our_work_bg_color} onChange={(e) => setFormData({ ...formData, our_work_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                <input type="text" value={formData.our_work_bg_color} onChange={(e) => setFormData({ ...formData, our_work_bg_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Reviews Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text</label>
                <input type="text" value={formData.reviews_tag} onChange={(e) => setFormData({ ...formData, reviews_tag: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.reviews_tag_color} onChange={(e) => setFormData({ ...formData, reviews_tag_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.reviews_tag_color} onChange={(e) => setFormData({ ...formData, reviews_tag_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Size</label>
                <input type="text" value={formData.reviews_tag_size} onChange={(e) => setFormData({ ...formData, reviews_tag_size: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input type="text" value={formData.reviews_heading} onChange={(e) => setFormData({ ...formData, reviews_heading: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.reviews_heading_color} onChange={(e) => setFormData({ ...formData, reviews_heading_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.reviews_heading_color} onChange={(e) => setFormData({ ...formData, reviews_heading_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                <input type="text" value={formData.reviews_heading_size} onChange={(e) => setFormData({ ...formData, reviews_heading_size: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={formData.reviews_bg_color} onChange={(e) => setFormData({ ...formData, reviews_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                <input type="text" value={formData.reviews_bg_color} onChange={(e) => setFormData({ ...formData, reviews_bg_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">CTA Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input type="text" value={formData.cta_heading} onChange={(e) => setFormData({ ...formData, cta_heading: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.cta_heading_color} onChange={(e) => setFormData({ ...formData, cta_heading_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.cta_heading_color} onChange={(e) => setFormData({ ...formData, cta_heading_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                <input type="text" value={formData.cta_heading_size} onChange={(e) => setFormData({ ...formData, cta_heading_size: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                <input type="text" value={formData.cta_subheading} onChange={(e) => setFormData({ ...formData, cta_subheading: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.cta_subheading_color} onChange={(e) => setFormData({ ...formData, cta_subheading_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.cta_subheading_color} onChange={(e) => setFormData({ ...formData, cta_subheading_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheading Size</label>
                <input type="text" value={formData.cta_subheading_size} onChange={(e) => setFormData({ ...formData, cta_subheading_size: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input type="text" value={formData.cta_btn_text} onChange={(e) => setFormData({ ...formData, cta_btn_text: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.cta_btn_color || '#ffffff'} onChange={(e) => setFormData({ ...formData, cta_btn_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.cta_btn_color || ''} onChange={(e) => setFormData({ ...formData, cta_btn_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.cta_btn_text_color || '#000000'} onChange={(e) => setFormData({ ...formData, cta_btn_text_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                  <input type="text" value={formData.cta_btn_text_color || ''} onChange={(e) => setFormData({ ...formData, cta_btn_text_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Border Radius (Tailwind e.g., rounded-full)</label>
                <input type="text" value={formData.cta_btn_radius || ''} onChange={(e) => setFormData({ ...formData, cta_btn_radius: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={formData.cta_bg_color} onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                <input type="text" value={formData.cta_bg_color} onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900" />
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
    </div>
  );
}
