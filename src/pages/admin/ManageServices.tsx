import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageServices() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    slug: '',
    detail_heading: '',
    detail_subheading: '',
    features: [] as any[],
    faqs: [] as any[],
    visibility: 'visible',
    title_color: '#ffffff',
    subtitle_color: '#c2ff00',
    faq_hover_color: '#c2ff00',
    cta_title: '',
    cta_text_color: '#ffffff',
    cta_bg_color: '#000000',
    cta_button_text: 'BOOK A STRATEGY CALL',
    cta_button_color: '#c2ff00',
    cta_button_text_color: '#000000',
    cta_button_radius: '9999px',
    features_content_color: '#9ca3af',
    features_number_color: 'rgba(255,255,255,0.1)',
    features_line_color: 'rgba(255,255,255,0.05)',
    features_bg_color: '#000000',
    banner_padding_top: 'pt-32',
    banner_padding_bottom: 'pb-12',
    show_banner_tag: true,
    features_font_size: 'text-lg lg:text-2xl'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      if (data) setServices(data);
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
      setFormData({ ...formData, image_url: url });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleFeatureImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      updateFeature(index, 'image_url', url);
      toast.success('Point image uploaded');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        image_url: formData.image_url,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        detail_heading: formData.detail_heading,
        detail_subheading: formData.detail_subheading,
        features: formData.features,
        faqs: formData.faqs,
        visibility: formData.visibility,
        title_color: formData.title_color,
        subtitle_color: formData.subtitle_color,
        faq_hover_color: formData.faq_hover_color,
        cta_title: formData.cta_title,
        cta_text_color: formData.cta_text_color,
        cta_bg_color: formData.cta_bg_color,
        cta_button_text: formData.cta_button_text,
        cta_button_color: formData.cta_button_color,
        cta_button_text_color: formData.cta_button_text_color,
        cta_button_radius: formData.cta_button_radius,
        features_content_color: formData.features_content_color,
        features_number_color: formData.features_number_color,
        features_line_color: formData.features_line_color,
        features_bg_color: formData.features_bg_color,
        banner_padding_top: formData.banner_padding_top,
        banner_padding_bottom: formData.banner_padding_bottom,
        show_banner_tag: formData.show_banner_tag,
        features_font_size: formData.features_font_size
      };

      if (formData.id) {
        const { error } = await supabase.from('services').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
        toast.success('Service created successfully');
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openModal = (service?: any) => {
    setActiveTab('general');
    if (service) {
      setFormData({
        id: service.id,
        title: service.title,
        subtitle: service.subtitle || '',
        description: service.description || '',
        image_url: service.image_url || '',
        slug: service.slug || '',
        detail_heading: service.detail_heading || '',
        detail_subheading: service.detail_subheading || '',
        features: service.features || [],
        faqs: service.faqs || [],
        visibility: service.visibility || 'visible',
        title_color: service.title_color || '#ffffff',
        subtitle_color: service.subtitle_color || '#c2ff00',
        faq_hover_color: service.faq_hover_color || '#c2ff00',
        cta_title: service.cta_title || '',
        cta_text_color: service.cta_text_color || '#ffffff',
        cta_bg_color: service.cta_bg_color || '#000000',
        cta_button_text: service.cta_button_text || 'BOOK A STRATEGY CALL',
        cta_button_color: service.cta_button_color || '#c2ff00',
        cta_button_text_color: service.cta_button_text_color || '#000000',
        cta_button_radius: service.cta_button_radius || '9999px',
        features_content_color: service.features_content_color || '#9ca3af',
        features_number_color: service.features_number_color || 'rgba(255,255,255,0.1)',
        features_line_color: service.features_line_color || 'rgba(255,255,255,0.05)',
        features_bg_color: service.features_bg_color || '#000000',
        banner_padding_top: service.banner_padding_top || 'pt-32',
        banner_padding_bottom: service.banner_padding_bottom || 'pb-12',
        show_banner_tag: service.show_banner_tag !== undefined ? service.show_banner_tag : true,
        features_font_size: service.features_font_size || 'text-lg lg:text-2xl'
      });
    } else {
      setFormData({ 
        id: '', title: '', subtitle: '', description: '', image_url: '', 
        slug: '', detail_heading: '', detail_subheading: '', features: [], faqs: [],
        visibility: 'visible', title_color: '#ffffff', subtitle_color: '#c2ff00',
        faq_hover_color: '#c2ff00',
        cta_title: '', cta_text_color: '#ffffff', cta_bg_color: '#000000',
        cta_button_text: 'BOOK A STRATEGY CALL', cta_button_color: '#c2ff00',
        cta_button_text_color: '#000000', cta_button_radius: '9999px',
        features_content_color: '#9ca3af', features_number_color: 'rgba(255,255,255,0.1)',
        features_line_color: 'rgba(255,255,255,0.05)', features_bg_color: '#000000',
        banner_padding_top: 'pt-32', banner_padding_bottom: 'pb-12', show_banner_tag: true,
        features_font_size: 'text-lg lg:text-2xl'
      });
    }
    setIsModalOpen(true);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: '', description: '', image_url: '' }]
    });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }]
    });
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index)
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2596be]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#2596be] hover:bg-[#1f7a99] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-900">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {service.image_url ? (
                        <img src={service.image_url} alt={service.title} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{service.title}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-tighter font-bold">{service.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">/{service.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openModal(service)}
                        className="p-2 text-[#2596be] hover:text-[#1f7a99] transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No services found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {formData.id ? 'Refine Service' : 'Onboard New Service'}
                </h2>
                <p className="text-sm text-gray-500">Configure core info and the premium detail page.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-50 px-6 pt-2 border-b border-gray-100">
              {[
                { id: 'general', label: '1. General Info' },
                { id: 'detail', label: '2. Detail Page' },
                { id: 'faqs', label: '3. FAQs' },
                { id: 'styling', label: '4. Styling & CTA' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-bold transition-all border-b-2 mr-2 ${
                    activeTab === tab.id 
                    ? 'border-[#2596be] text-[#2596be]' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-grow overflow-y-auto p-8">
              {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Media Buying"
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:border-[#2596be] transition-colors font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">URL Handle (Slug)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                        placeholder="e.g. media-buying"
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:border-[#2596be] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Internal Subtitle</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="e.g. BUILDING RELEVANCE"
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:border-[#2596be] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Featured Image</label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="Paste URL..."
                          className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-[#2596be]"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Visibility</label>
                      <select
                        value={formData.visibility}
                        onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 font-bold text-sm"
                      >
                        <option value="visible">Public (Visible)</option>
                        <option value="hidden">Hidden (Internal Only)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Grid Description</label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:border-[#2596be] transition-colors resize-none font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'detail' && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Banner Main Heading</label>
                      <input
                        type="text"
                        value={formData.detail_heading}
                        onChange={(e) => setFormData({ ...formData, detail_heading: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Banner Sub-heading</label>
                      <input
                        type="text"
                        value={formData.detail_subheading}
                        onChange={(e) => setFormData({ ...formData, detail_subheading: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Heading Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={formData.title_color} 
                          onChange={(e) => setFormData({ ...formData, title_color: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-100"
                        />
                        <input 
                          type="text" 
                          value={formData.title_color} 
                          onChange={(e) => setFormData({ ...formData, title_color: e.target.value })}
                          className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Subtitle Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={formData.subtitle_color} 
                          onChange={(e) => setFormData({ ...formData, subtitle_color: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-100"
                        />
                        <input 
                          type="text" 
                          value={formData.subtitle_color} 
                          onChange={(e) => setFormData({ ...formData, subtitle_color: e.target.value })}
                          className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-6">
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest">Banner Layout & Spacing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-[10px]">Top Padding (Tailwind Class)</label>
                        <input
                          type="text"
                          value={formData.banner_padding_top}
                          onChange={(e) => setFormData({ ...formData, banner_padding_top: e.target.value })}
                          placeholder="pt-32, pt-40, pt-60..."
                          className="w-full border-2 border-gray-100 rounded-xl px-4 py-2 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-[10px]">Bottom Padding (Tailwind Class)</label>
                        <input
                          type="text"
                          value={formData.banner_padding_bottom}
                          onChange={(e) => setFormData({ ...formData, banner_padding_bottom: e.target.value })}
                          placeholder="pb-12, pb-24, pb-40..."
                          className="w-full border-2 border-gray-100 rounded-xl px-4 py-2 font-mono text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-6">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={formData.show_banner_tag}
                            onChange={(e) => setFormData({ ...formData, show_banner_tag: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ml-3 text-xs font-black text-gray-400 uppercase tracking-widest">Show Tag</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-black text-red-400 uppercase tracking-widest">Sticky Scroll Points</label>
                      <button 
                        type="button" 
                        onClick={addFeature}
                        className="text-xs font-black text-[#2596be] hover:underline uppercase tracking-widest"
                      >
                        + Add Feature Point
                      </button>
                    </div>
                    
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative group">
                        <button 
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <input
                              placeholder="Feature Title"
                              value={feature.title}
                              onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                              className="w-full border-b border-gray-200 bg-transparent py-2 focus:border-[#2596be] outline-none font-bold"
                            />
                            <textarea
                              placeholder="Describe this logic..."
                              value={feature.description}
                              onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                              className="w-full border-b border-gray-200 bg-transparent py-2 focus:border-[#2596be] outline-none text-sm resize-none"
                            />
                          </div>
                            <div className="space-y-2">
                              <input
                                placeholder="Image URL for this point"
                                value={feature.image_url}
                                onChange={(e) => updateFeature(idx, 'image_url', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-xs focus:border-[#2596be] outline-none"
                              />
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFeatureImageUpload(idx, e)}
                                  disabled={uploading}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button type="button" disabled={uploading} className="w-full py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 flex items-center justify-center gap-2">
                                  {uploading ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />} Upload Point Image
                                </button>
                              </div>
                            </div>
                            {feature.image_url && (
                              <img src={feature.image_url} className="h-20 w-full object-cover rounded-lg border border-gray-200" alt="" />
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Service Specific FAQs</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Hover Color</label>
                        <input 
                          type="color" 
                          value={formData.faq_hover_color} 
                          onChange={(e) => setFormData({ ...formData, faq_hover_color: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={addFaq}
                        className="text-xs font-black text-[#2596be] hover:underline uppercase tracking-widest"
                      >
                        + Add New FAQ
                      </button>
                    </div>
                  </div>
                  
                  {formData.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 relative group">
                      <button 
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                      <input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                        className="w-full border-b border-gray-200 bg-transparent py-2 focus:border-[#2596be] outline-none font-bold"
                      />
                      <textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                        className="w-full border-b border-gray-200 bg-transparent py-2 focus:border-[#2596be] outline-none text-sm"
                      />
                    </div>
                  ))}
                  {formData.faqs.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                      <p className="text-gray-400 font-bold">No FAQs defined yet.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'styling' && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                  {/* CTA Configuration */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b pb-2">Footer CTA Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">CTA Custom Title</label>
                        <input
                          type="text"
                          value={formData.cta_title}
                          onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
                          placeholder="DOMINATE THE MARKET WITH..."
                          className="w-full border-2 border-gray-100 rounded-xl px-5 py-3"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Text Color</label>
                          <input type="color" value={formData.cta_text_color} onChange={(e) => setFormData({ ...formData, cta_text_color: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Section BG</label>
                          <input type="color" value={formData.cta_bg_color} onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Button Text</label>
                        <input
                          type="text"
                          value={formData.cta_button_text}
                          onChange={(e) => setFormData({ ...formData, cta_button_text: e.target.value })}
                          className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tight mb-2 text-center">Btn BG</label>
                          <input type="color" value={formData.cta_button_color} onChange={(e) => setFormData({ ...formData, cta_button_color: e.target.value })} className="w-full h-10 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tight mb-2 text-center">Btn Text</label>
                          <input type="color" value={formData.cta_button_text_color} onChange={(e) => setFormData({ ...formData, cta_button_text_color: e.target.value })} className="w-full h-10 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tight mb-2 text-center">Radius</label>
                          <input
                            type="text"
                            value={formData.cta_button_radius}
                            onChange={(e) => setFormData({ ...formData, cta_button_radius: e.target.value })}
                            className="w-full border-2 border-gray-100 rounded-lg px-2 py-2 text-[10px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Section Styling */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b pb-2">Sticky Features Styling</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Section BG</label>
                        <input type="color" value={formData.features_bg_color} onChange={(e) => setFormData({ ...formData, features_bg_color: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Content Text</label>
                        <input type="color" value={formData.features_content_color} onChange={(e) => setFormData({ ...formData, features_content_color: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Numbers</label>
                        <input type="color" value={formData.features_number_color} onChange={(e) => setFormData({ ...formData, features_number_color: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Lines/Dividers</label>
                        <input type="color" value={formData.features_line_color} onChange={(e) => setFormData({ ...formData, features_line_color: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Content Font Size</label>
                      <select
                        value={formData.features_font_size}
                        onChange={(e) => setFormData({ ...formData, features_font_size: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-xl px-5 py-3 font-bold text-sm"
                      >
                        <option value="text-sm lg:text-base">Small</option>
                        <option value="text-base lg:text-lg">Medium</option>
                        <option value="text-lg lg:text-2xl">Large (Default)</option>
                        <option value="text-xl lg:text-3xl">Extra Large</option>
                        <option value="text-2xl lg:text-4xl">Huge</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-400 font-bold max-w-xs uppercase tracking-tight">
                All changes are saved to the master service database.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 text-gray-500 hover:bg-gray-100 font-black text-xs uppercase tracking-widest rounded-full transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-10 py-3 bg-black text-[#c2ff00] font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2 shadow-xl"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {formData.id ? 'Save Configuration' : 'Launch Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
