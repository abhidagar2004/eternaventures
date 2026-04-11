import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save, Plus, Trash2, Edit2, X } from 'lucide-react';
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

export default function ManageContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [rowId, setRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'faqs'>('content');
  
  const [formData, setFormData] = useState<any>({
    // Global
    page_bg_color: '#000000',
    page_text_color: '#ffffff',
    font_style: 'font-sans',
    
    // Banner
    banner_badge: "Let's Talk",
    banner_badge_color: '#2596be',
    heading: 'Get in Touch',
    hero_bg_color: '#000000',
    hero_text_color: '#ffffff',
    banner_heading_size: 'text-6xl md:text-8xl',
    subheading: 'Ready to scale? Fill out the form below.',
    banner_subheading_size: 'text-xl md:text-2xl',
    banner_image: '',
    banner_overlay_color: '#000000',
    banner_overlay_opacity: '0.5',
    banner_padding_top: 'pt-40',
    banner_padding_bottom: 'pb-24',

    // Contact Info
    email: 'hello@eternaventures.com',
    phone: '+1 (555) 123-4567',
    address: '100 Innovation Drive, Suite 300, New York, NY 10001',
    business_hours: 'Mon - Fri, 9am - 6pm EST',

    // Contact Section Styling
    contact_section_bg_color: '#000000',
    contact_section_border_color: '#111827',
    contact_tag_text: "Let's Talk",
    contact_tag_color: '#2596be',
    contact_heading_text: 'Ready to scale your brand?',
    contact_heading_color: '#ffffff',
    contact_heading_size: 'text-5xl md:text-7xl',
    contact_desc_text: 'Fill out the form to request a free growth audit.',
    contact_desc_color: '#9ca3af',
    contact_desc_size: 'text-lg',

    // Info Cards
    info_icon_bg_color: '#111827',
    info_icon_color: '#2596be',
    info_label_color: '#6b7280',
    info_text_color: '#ffffff',

    // Form
    form_bg_color: '#111111',
    form_border_color: '#1f2937',
    input_bg_color: '#000000',
    input_border_color: '#1f2937',
    input_text_color: '#ffffff',
    label_text_color: '#9ca3af',
    btn_bg_color: '#2596be',
    btn_text_color: '#ffffff',
    btn_hover_bg_color: '#1e7a9b',
    btn_radius: 'rounded-lg',
    
    // Form Content
    form_name_placeholder: 'John Doe',
    form_email_placeholder: 'john@example.com',
    form_phone_placeholder: '+1 (555) 000-0000',
    form_message_placeholder: 'Tell us about your current challenges and goals...',
    form_button_text: 'Submit Request',

    // Brochure Form (New)
    brochure_form_title: 'Brochure Request',
    brochure_form_bg_color: '#111111',
    brochure_form_btn_text: 'Submit inquiry & Download',
    brochure_form_btn_bg_color: '#2596be',
    brochure_form_btn_text_color: '#ffffff',
    brochure_form_btn_radius: '0.75rem',

    // FAQ Styling
    faq_section_bg_color: '#000000',
    faq_section_border_color: '#111827',
    faq_tag_color: '#2596be',
    faq_heading_color: '#ffffff',
    faq_item_bg_color: '#111111',
    faq_item_border_color: '#1f2937',
    faq_question_color: '#ffffff',
    faq_answer_color: '#9ca3af',
    faq_icon_color: '#2596be',
    faq_hover_color: '#2596be',
  });

  const [faqs, setFaqs] = useState<any[]>([]);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', order_index: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: contentData, error: contentError } = await supabase
        .from('contact_page_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (contentError && contentError.code !== 'PGRST116') throw contentError;
      if (contentData) {
        setFormData((prev: any) => ({ ...prev, ...contentData }));
        setRowId(contentData.id);
      }
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });
      if (faqsError) throw faqsError;
      if (faqsData) setFaqs(faqsData);
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

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (rowId) {
        const { error } = await supabase.from('contact_page_content').update(formData).eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('contact_page_content').insert([formData]).select().single();
        if (error) throw error;
        if (data) setRowId(data.id);
      }
      toast.success('Contact page content updated!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) return toast.error('Required fields missing');
    setIsSubmitting(true);
    try {
      if (editingFaq) {
        const { error } = await supabase.from('faqs').update(faqForm).eq('id', editingFaq.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('faqs').insert([faqForm]);
        if (error) throw error;
      }
      setShowFaqModal(false);
      setEditingFaq(null);
      setFaqForm({ question: '', answer: '', order_index: faqs.length + 1 });
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete FAQ?')) return;
    try {
      await supabase.from('faqs').delete().eq('id', id);
      setFaqs(faqs.filter(f => f.id !== id));
      toast.success('FAQ deleted');
    } catch (error: any) {
      toast.error(error.message);
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
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
        />
        <div className="relative">
          <input type="file" onChange={(e) => handleImageUpload(e, field)} className="absolute inset-0 opacity-0 cursor-pointer" />
          <button type="button" className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300">
            {uploading === field ? <Loader2 className="animate-spin" /> : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Contact Page</h1>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg ${activeTab === 'content' ? 'bg-[#2596be] text-white' : 'hover:bg-gray-100'}`}>Page Content</button>
        <button onClick={() => setActiveTab('faqs')} className={`px-4 py-2 rounded-lg ${activeTab === 'faqs' ? 'bg-[#2596be] text-white' : 'hover:bg-gray-100'}`}>Manage FAQs</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'content' ? (
          <form onSubmit={handleContentSubmit} className="p-6 space-y-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <h2 className="font-bold border-b pb-2">Banner (PageHeader)</h2>
              <ImageUploadField label="Background Image" field="banner_image" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorInput label="Overlay Color" field="banner_overlay_color" formData={formData} setFormData={setFormData} />
                <TextInput label="Overlay Opacity (0-1)" field="banner_overlay_opacity" formData={formData} setFormData={setFormData} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Padding Top (e.g. 150nd 200)" field="banner_padding_top" formData={formData} setFormData={setFormData} placeholder="160" />
                <TextInput label="Padding Bottom (e.g. 100)" field="banner_padding_bottom" formData={formData} setFormData={setFormData} placeholder="100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput label="Badge Text" field="banner_badge" formData={formData} setFormData={setFormData} />
                <ColorInput label="Badge Color" field="banner_badge_color" formData={formData} setFormData={setFormData} />
                <TextInput label="Heading" field="heading" formData={formData} setFormData={setFormData} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextareaInput label="Subheading" field="subheading" formData={formData} setFormData={setFormData} />
                <ColorInput label="Hero Text Color" field="hero_text_color" formData={formData} setFormData={setFormData} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <h2 className="font-bold border-b pb-2">Contact Section Styling</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorInput label="Section BG" field="contact_section_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Section Border" field="contact_section_border_color" formData={formData} setFormData={setFormData} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput label="Tag Text" field="contact_tag_text" formData={formData} setFormData={setFormData} />
                <ColorInput label="Tag Color" field="contact_tag_color" formData={formData} setFormData={setFormData} />
                <TextInput label="Heading" field="contact_heading_text" formData={formData} setFormData={setFormData} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ColorInput label="Heading Color" field="contact_heading_color" formData={formData} setFormData={setFormData} />
                <TextInput label="Heading Size" field="contact_heading_size" formData={formData} setFormData={setFormData} />
                <ColorInput label="Desc Color" field="contact_desc_color" formData={formData} setFormData={setFormData} />
              </div>
              <TextareaInput label="Description Text" field="contact_desc_text" formData={formData} setFormData={setFormData} />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <h2 className="font-bold border-b pb-2">Info Cards & Icons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorInput label="Icon BG Color" field="info_icon_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Icon Color" field="info_icon_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Label Color" field="info_label_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Text Color" field="info_text_color" formData={formData} setFormData={setFormData} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Email" field="email" formData={formData} setFormData={setFormData} />
                <TextInput label="Phone" field="phone" formData={formData} setFormData={setFormData} />
                <TextInput label="Address" field="address" formData={formData} setFormData={setFormData} />
                <TextInput label="Hours" field="business_hours" formData={formData} setFormData={setFormData} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <h2 className="font-bold border-b pb-2">Form Styling</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorInput label="Form BG" field="form_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Form Border" field="form_border_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Input BG" field="input_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Input Text" field="input_text_color" formData={formData} setFormData={setFormData} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ColorInput label="Btn BG" field="btn_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Btn Hover" field="btn_hover_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Btn Text" field="btn_text_color" formData={formData} setFormData={setFormData} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <h2 className="font-bold border-b pb-2">Form Content (Placeholders)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Name Placeholder" field="form_name_placeholder" formData={formData} setFormData={setFormData} />
                <TextInput label="Email Placeholder" field="form_email_placeholder" formData={formData} setFormData={setFormData} />
                <TextInput label="Phone Placeholder" field="form_phone_placeholder" formData={formData} setFormData={setFormData} />
                <TextInput label="Button Text" field="form_button_text" formData={formData} setFormData={setFormData} />
              </div>
              <TextareaInput label="Message Placeholder" field="form_message_placeholder" formData={formData} setFormData={setFormData} />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <h2 className="font-bold border-b pb-2">Brochure Popup Form Styling</h2>
              <TextInput label="Form Title" field="brochure_form_title" formData={formData} setFormData={setFormData} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorInput label="Form BG" field="brochure_form_bg_color" formData={formData} setFormData={setFormData} />
                <TextInput label="Button Radius" field="brochure_form_btn_radius" formData={formData} setFormData={setFormData} placeholder="0.75rem or 12px" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput label="Button Text" field="brochure_form_btn_text" formData={formData} setFormData={setFormData} />
                <ColorInput label="Button BG" field="brochure_form_btn_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Button Text Color" field="brochure_form_btn_text_color" formData={formData} setFormData={setFormData} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <h2 className="font-bold border-b pb-2">FAQ Styling</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorInput label="FAQ Section BG" field="faq_section_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="FAQ Item BG" field="faq_item_bg_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Question Color" field="faq_question_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Answer Color" field="faq_answer_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Icon/Tag Color" field="faq_tag_color" formData={formData} setFormData={setFormData} />
                <ColorInput label="Hover Border Color" field="faq_hover_color" formData={formData} setFormData={setFormData} />
              </div>
            </div>

            <div className="flex justify-end p-4 border-t">
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#2596be] text-white rounded-lg flex items-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="flex justify-end mb-4"><button onClick={() => { setEditingFaq(null); setFaqForm({ question: '', answer: '', order_index: faqs.length }); setShowFaqModal(true); }} className="bg-[#2596be] text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus />Add FAQ</button></div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                  <div className="flex-1"><h3 className="font-bold">{faq.question}</h3><p className="text-gray-600 text-sm mt-1">{faq.answer}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingFaq(faq); setFaqForm({ question: faq.question, answer: faq.answer, order_index: faq.order_index }); setShowFaqModal(true); }} className="p-2 text-blue-600"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-red-600"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showFaqModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <div className="space-y-4">
              <TextInput label="Question" field="question" formData={faqForm} setFormData={setFaqForm} />
              <TextareaInput label="Answer" field="answer" formData={faqForm} setFormData={setFaqForm} rows={4} />
              <TextInput label="Order (number)" field="order_index" formData={faqForm} setFormData={setFaqForm} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowFaqModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleSaveFaq} className="px-4 py-2 bg-[#2596be] text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
