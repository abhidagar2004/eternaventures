import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Save, Loader2, ShieldCheck, Scale, Copyright } from 'lucide-react';

const ColorInput = ({ label, field, formData, setFormData, defaultColor = '#000000' }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex gap-2 items-center">
      <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
        <input 
          type="color" 
          value={formData[field] || defaultColor} 
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} 
          className="h-12 w-12 -ml-1 -mt-1 cursor-pointer" 
        />
      </div>
      <input 
        type="text" 
        value={formData[field] || ''} 
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} 
        className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be] text-sm uppercase font-mono" 
        placeholder={defaultColor} 
      />
    </div>
  </div>
);

const LegalSection = ({ title, icon: Icon, titleField, contentField, formData, setFormData }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
      <Icon className="w-5 h-5 text-[#2596be]" />
      <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">{title}</h3>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
        <input
          type="text"
          value={formData[titleField] || ''}
          onChange={(e) => setFormData({ ...formData, [titleField]: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          rows={12}
          value={formData[contentField] || ''}
          onChange={(e) => setFormData({ ...formData, [contentField]: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2596be] font-sans h-[400px]"
          placeholder={`Enter ${title} content...`}
        />
      </div>
    </div>
  </div>
);

export default function ManageLegalPages() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('legal_pages').select('*').limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setFormData(data);
        setRowId(data.id);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('legal_pages')
        .update(formData)
        .eq('id', rowId);
      
      if (error) throw error;
      toast.success('Legal pages updated successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#2596be]" /></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Manage Legal Pages</h1>
          <p className="text-gray-500 mt-1">Configure Terms, Privacy and Copyright policies</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2596be] text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-[#1a7a9c] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4">Global Styling</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ColorInput label="Background Color" field="bg_color" formData={formData} setFormData={setFormData} defaultColor="#000000" />
          <ColorInput label="Heading Color" field="heading_color" formData={formData} setFormData={setFormData} defaultColor="#ffffff" />
          <ColorInput label="Text Color" field="text_color" formData={formData} setFormData={setFormData} defaultColor="#9ca3af" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <LegalSection 
          title="Terms & Conditions" 
          icon={Scale}
          titleField="terms_title"
          contentField="terms_content"
          formData={formData}
          setFormData={setFormData}
        />
        <LegalSection 
          title="Privacy Policy" 
          icon={ShieldCheck}
          titleField="privacy_title"
          contentField="privacy_content"
          formData={formData}
          setFormData={setFormData}
        />
        <LegalSection 
          title="Copyright Policy" 
          icon={Copyright}
          titleField="copyright_title"
          contentField="copyright_content"
          formData={formData}
          setFormData={setFormData}
        />
      </form>
    </div>
  );
}
