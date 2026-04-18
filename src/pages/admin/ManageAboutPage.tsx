import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Reusable Input Components ─────────────────────────────────────────────────
const ColorInput = ({ label, field, formData, setFormData, defaultColor = '#000000', note }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}{note && <span className="ml-1 text-xs text-gray-400 font-normal">{note}</span>}</label>
    <div className="flex gap-2 items-center">
      <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
        <input type="color" value={formData[field] || defaultColor} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="h-12 w-12 -ml-1 -mt-1 cursor-pointer" />
      </div>
      <input type="text" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be] text-sm uppercase font-mono" placeholder={defaultColor} />
    </div>
  </div>
);

const TextInput = ({ label, field, formData, setFormData, placeholder = '', note }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{note && <span className="ml-1 text-xs text-gray-400 font-normal">{note}</span>}</label>
    <input type="text" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} placeholder={placeholder} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]" />
  </div>
);

const TextareaInput = ({ label, field, formData, setFormData, rows = 4, note }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{note && <span className="ml-1 text-xs text-gray-400 font-normal">{note}</span>}</label>
    <textarea rows={rows} value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be] font-mono text-sm" />
  </div>
);

// ─── Section Card ──────────────────────────────────────────────────────────────
const SectionCard = ({ title, accent = false, children }: { title: string; accent?: boolean; children: React.ReactNode }) => (
  <div className={`rounded-xl shadow-sm border p-6 ${accent ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
    <h2 className={`text-lg font-bold mb-4 pb-2 border-b ${accent ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200'}`}>{title}</h2>
    <div className="space-y-4">{children}</div>
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
    // Banner
    banner_bg_image: '',
    banner_bg_color: '#000000',
    banner_padding_top: '160',
    banner_padding_bottom: '100',
    banner_heading: 'We design how brands are understood',
    banner_heading_color: '#ffffff',
    banner_heading_size: 'text-4xl md:text-6xl lg:text-7xl',
    banner_subheading: 'EternaVentures is a growth media company based in Jaipur — built for brands that want to lead their category, not just participate in it.',
    banner_subheading_color: '#9ca3af',
    banner_subheading_size: 'text-lg md:text-xl',
    // Stats
    trust_bg_color: '#111111',
    trust_text_color: '#ffffff',
    trust_stat1_value: '50+', trust_stat1_label: 'Brands Scaled',
    trust_stat2_value: '₹50Cr+', trust_stat2_label: 'Ad Spend Managed',
    trust_stat3_value: '100M+', trust_stat3_label: 'Reach Generated',
    trust_stat4_value: '4.9/5', trust_stat4_label: 'Client Rating',
    // Who We Are
    who_we_are_heading: 'Who We Are',
    who_we_are_text: `EternaVentures was built on a simple observation:\n\nMost brands are not limited by resources.\nThey are limited by how they are perceived.\n\nThey invest in marketing, content, and campaigns — but without a clear position, everything becomes fragmented. The result is inconsistent growth, unclear messaging, and a brand that feels replaceable.\n\nWe exist to bring structure to that chaos.\n\nWe work with founders and teams to define, build, and scale brands with clarity — so every action contributes to long-term market authority.`,
    who_we_are_bg_color: '#000000',
    who_we_are_heading_color: '#ffffff',
    who_we_are_text_color: '#9ca3af',
    // What We Believe
    what_we_believe_heading: 'What We Believe',
    what_we_believe_text: `We don't look at marketing as a set of activities.\nWe look at it as a system of signals.\n\nEvery brand is constantly communicating — through its content, design, pricing, presence, and decisions.\n\nMost brands don't control these signals.\nWe help you take control of them.\n\nBecause in today's market:\nPerception drives attention\nAttention drives trust\nTrust drives growth`,
    what_we_believe_bg_color: '#0a0a0a',
    what_we_believe_heading_color: '#ffffff',
    what_we_believe_text_color: '#9ca3af',
    what_we_believe_accent_color: '#ceff00',
    // Our Approach
    our_approach_heading: 'Our Approach',
    our_approach_text: `We don't operate through isolated services.\nWe build interconnected growth systems.\n\nInstead of treating branding, content, performance, and experience separately — we align them.\n\nYour positioning defines your communication\nYour communication attracts the right audience\nYour audience informs your performance\nYour performance strengthens your strategy\n\nThis creates consistency, efficiency, and compounding growth over time.`,
    our_approach_bg_color: '#000000',
    our_approach_heading_color: '#ffffff',
    our_approach_text_color: '#9ca3af',
    // Why EternaVentures
    why_eterna_heading: 'Why EternaVentures',
    why_eterna_text: `Because most growth today is reactive.\n\nBrands follow trends, copy competitors, and optimize for short-term metrics — without building long-term value.\n\nWe take a different approach.\n\nWe focus on:\nClarity before execution\nDirection before scale\nSystems over scattered efforts\n\nThe goal is not just visibility.\nThe goal is to become the obvious choice in your category.`,
    why_eterna_bg_color: '#0a0a0a',
    why_eterna_heading_color: '#ffffff',
    why_eterna_text_color: '#9ca3af',
    why_eterna_accent_color: '#ceff00',
    // Who We Work With
    who_we_work_with_heading: 'Who We Work With',
    who_we_work_with_text: `We partner with brands that think beyond immediate results.\n\nTypically, the brands we work with:\nWant to build strong positioning, not just presence\nAre open to rethinking their current approach\nValue strategy as much as execution\nAim to grow with consistency, not unpredictability\n\nFrom Jaipur to global markets, we work with brands driven by ambition — not just activity.`,
    who_we_work_with_bg_color: '#000000',
    who_we_work_with_heading_color: '#ffffff',
    who_we_work_with_text_color: '#9ca3af',
    // Our Role
    our_role_heading: 'Our Role',
    our_role_text: `We don't position ourselves as vendors.\n\nWe work as strategic partners — closely involved in how your brand thinks, communicates, and grows.\n\nOur role is to bring:\nClarity where there is confusion\nStructure where there is inconsistency\nDirection where there is noise`,
    our_role_bg_color: '#0a0a0a',
    our_role_heading_color: '#ffffff',
    our_role_text_color: '#9ca3af',
    // Closing
    closing_text: `If you're looking for someone to manage tasks, we may not be the right fit.\n\nBut if you're building a brand that deserves to lead —\nwe should talk.`,
    closing_bg_color: '#000000',
    closing_text_color: '#9ca3af',
    // CTA
    cta_heading: 'Tell us where your brand stands today.',
    cta_heading_color: '#000000',
    cta_heading_size: 'text-3xl md:text-5xl lg:text-6xl',
    cta_subheading: "We'll show you where it could go.",
    cta_subheading_color: '#000000',
    cta_bg_color: '#ceff00',
    cta_btn_text: 'Get In Touch',
    cta_btn_color: '#000000',
    cta_btn_text_color: '#ceff00',
    cta_btn_radius: '9999px',
    btn_link: '/contact',
    cta_email: 'hello@eternaventures.in',
  });

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from('about_page_content').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) { setFormData((prev: any) => ({ ...prev, ...data })); setRowId(data.id); }
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

  const ImageField = ({ label, field }: { label: string; field: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-3">
        <input type="text" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} placeholder="Paste URL or upload" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]" />
        <button type="button" onClick={() => setFormData({ ...formData, [field]: '' })} className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Clear</button>
        <div className="relative">
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field)} disabled={!!uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <button type="button" disabled={!!uploading} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap">
            {uploading === field ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
          </button>
        </div>
      </div>
      {formData[field] && <img src={formData[field]} alt="Preview" className="mt-2 h-20 rounded-lg object-cover border border-gray-200" />}
    </div>
  );

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#2596be]" /></div>;

  const textSections = [
    { title: '📌 Who We Are', headingField: 'who_we_are_heading', textField: 'who_we_are_text', bgField: 'who_we_are_bg_color', hcField: 'who_we_are_heading_color', tcField: 'who_we_are_text_color', accentField: 'who_we_are_accent_color', imgField: 'who_we_are_image' },
    { title: '💡 What We Believe', headingField: 'what_we_believe_heading', textField: 'what_we_believe_text', bgField: 'what_we_believe_bg_color', hcField: 'what_we_believe_heading_color', tcField: 'what_we_believe_text_color', accentField: 'what_we_believe_accent_color', imgField: 'what_we_believe_image' },
    { title: '🔗 Our Approach', headingField: 'our_approach_heading', textField: 'our_approach_text', bgField: 'our_approach_bg_color', hcField: 'our_approach_heading_color', tcField: 'our_approach_text_color', accentField: 'our_approach_accent_color', imgField: 'our_approach_image' },
    { title: '⭐ Why EternaVentures', headingField: 'why_eterna_heading', textField: 'why_eterna_text', bgField: 'why_eterna_bg_color', hcField: 'why_eterna_heading_color', tcField: 'why_eterna_text_color', accentField: 'why_eterna_accent_color', imgField: 'why_eterna_image' },
    { title: '🤝 Who We Work With', headingField: 'who_we_work_with_heading', textField: 'who_we_work_with_text', bgField: 'who_we_work_with_bg_color', hcField: 'who_we_work_with_heading_color', tcField: 'who_we_work_with_text_color', accentField: 'who_we_work_with_accent_color', imgField: 'who_we_work_with_image' },
    { title: '🎯 Our Role', headingField: 'our_role_heading', textField: 'our_role_text', bgField: 'our_role_bg_color', hcField: 'our_role_heading_color', tcField: 'our_role_text_color', accentField: 'our_role_accent_color', imgField: 'our_role_image' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage About Page</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global */}
        <SectionCard title="Global Page Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Page Background" field="page_bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <ColorInput label="Page Text Color" field="page_text_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
          </div>
        </SectionCard>

        {/* Banner */}
        <SectionCard title="🖼️ Banner / Hero Section">
          <ImageField label="Background Image (optional)" field="banner_bg_image" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Banner BG Color" note="(shown when no image)" field="banner_bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Padding Top (px)" field="banner_padding_top" formData={formData} setFormData={setFormData} placeholder="160" />
            <TextInput label="Padding Bottom (px)" field="banner_padding_bottom" formData={formData} setFormData={setFormData} placeholder="100" />
          </div>
          <TextInput label="Heading" field="banner_heading" formData={formData} setFormData={setFormData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Heading Color" field="banner_heading_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
            <TextInput label="Heading Size" field="banner_heading_size" formData={formData} setFormData={setFormData} placeholder="text-5xl md:text-7xl" />
          </div>
          <TextareaInput label="Subheading" field="banner_subheading" formData={formData} setFormData={setFormData} rows={2} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Subheading Color" field="banner_subheading_color" formData={formData} setFormData={setFormData} defaultColor="#9ca3af" />
            <TextInput label="Subheading Size" field="banner_subheading_size" formData={formData} setFormData={setFormData} placeholder="text-lg md:text-xl" />
          </div>
        </SectionCard>

        {/* Stats */}
        <SectionCard title="📊 Stats Bar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Background Color" field="trust_bg_color" formData={formData} setFormData={setFormData} defaultColor="#111111" />
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
        </SectionCard>

        {/* All text sections */}
        {textSections.map((sec) => (
          <SectionCard key={sec.headingField} title={sec.title}>
            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
              💡 <strong>Tip:</strong> Use blank lines to separate paragraphs. Short lines (no full-stop at end) will appear as accent-colored bullet points on the page.
            </p>
            {sec.imgField && <ImageField label="Section Image (Optional)" field={sec.imgField} />}
            <TextInput label="Section Heading" field={sec.headingField} formData={formData} setFormData={setFormData} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <ColorInput label="Background Color" field={sec.bgField} formData={formData} setFormData={setFormData} defaultColor="#000000" />
              <ColorInput label="Heading Color" field={sec.hcField} formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
              <ColorInput label="Text Color" field={sec.tcField} formData={formData} setFormData={setFormData} defaultColor="#9ca3af" />
              {sec.accentField && (
                <ColorInput label="Accent / Bullet Color" field={sec.accentField} formData={formData} setFormData={setFormData} defaultColor="#ceff00" />
              )}
            </div>
            <TextareaInput label="Section Text" field={sec.textField} formData={formData} setFormData={setFormData} rows={8} />
          </SectionCard>
        ))}

        {/* Closing */}
        <SectionCard title="✒️ Closing Quote">
          <p className="text-xs text-gray-500">This appears as a centered italic quote before the CTA.</p>
          <TextareaInput label="Closing Text" field="closing_text" formData={formData} setFormData={setFormData} rows={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Background Color" field="closing_bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <ColorInput label="Text Color" field="closing_text_color" formData={formData} setFormData={setFormData} defaultColor="#9ca3af" />
          </div>
        </SectionCard>

        {/* CTA */}
        <SectionCard title="📣 CTA Section">
          <ColorInput label="Background Color" field="cta_bg_color" formData={formData} setFormData={setFormData} defaultColor="#ceff00" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput label="Heading" field="cta_heading" formData={formData} setFormData={setFormData} />
            <ColorInput label="Heading Color" field="cta_heading_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <TextInput label="Heading Size" field="cta_heading_size" formData={formData} setFormData={setFormData} placeholder="text-3xl md:text-5xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Subheading" field="cta_subheading" formData={formData} setFormData={setFormData} />
            <ColorInput label="Subheading Color" field="cta_subheading_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Button Text" field="cta_btn_text" formData={formData} setFormData={setFormData} />
            <TextInput label="Button Link" field="btn_link" formData={formData} setFormData={setFormData} placeholder="/contact" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorInput label="Button BG Color" field="cta_btn_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
            <ColorInput label="Button Text Color" field="cta_btn_text_color" formData={formData} setFormData={setFormData} defaultColor="#ceff00" />
            <TextInput label="Button Border Radius (px)" field="cta_btn_radius" formData={formData} setFormData={setFormData} placeholder="9999px or 12px" />
          </div>
          <TextInput label="Email Address" field="cta_email" formData={formData} setFormData={setFormData} placeholder="hello@eternaventures.in" />
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end pb-8">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-[#2596be] text-white font-bold rounded-lg hover:bg-[#1a7a9e] transition-colors disabled:opacity-50 shadow-lg">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
