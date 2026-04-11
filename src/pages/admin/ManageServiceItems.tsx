import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageServiceItems() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      if (data) setItems(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        subtitle: item.subtitle || '',
        description: item.description || '',
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image_url: ''
      });
    }
    setShowModal(true);
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
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and Description are required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Service updated');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData]);
        if (error) throw error;
        toast.success('Service added');
      }
      setShowModal(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Service deleted');
      fetchItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#2596be]" /></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Services List</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#2596be] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1e7a9b] transition-colors"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex gap-4 items-center bg-gray-50">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
            ) : (
              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg text-gray-400">
                <ImageIcon size={24} />
              </div>
            )}
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">{item.subtitle}</span>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-500 py-8">No services added yet.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex gap-4 items-center">
                  {formData.image_url && <img src={formData.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button type="button" disabled={uploading} className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg flex items-center gap-2">
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload Image
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-[#2596be] hover:bg-[#1e7a9b] text-white px-4 py-2 rounded flex items-center gap-2">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
