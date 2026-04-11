import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageWhyUsItems() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    icon_name: 'Target',
    title: '',
    description: '',
    order_index: 0
  });

  // A small preset list of icons to pick from
  const ICON_CHOICES = [
    'Target', 'Zap', 'Shield', 'Rocket', 
    'TrendingUp', 'Users', 'Activity', 'Award', 
    'BarChart', 'Briefcase', 'CheckCircle', 'Code',
    'Compass', 'Cpu', 'Database', 'Eye'
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('why_us_items')
        .select('*')
        .order('order_index', { ascending: true });
        
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
        icon_name: item.icon_name || 'Target',
        title: item.title || '',
        description: item.description || '',
        order_index: item.order_index || 0
      });
    } else {
      setEditingItem(null);
      setFormData({
        icon_name: 'Target',
        title: '',
        description: '',
        order_index: items.length
      });
    }
    setShowModal(true);
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
          .from('why_us_items')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Item updated');
      } else {
        const { error } = await supabase
          .from('why_us_items')
          .insert([formData]);
        if (error) throw error;
        toast.success('Item added');
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
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase
        .from('why_us_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Item deleted');
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
        <h2 className="text-lg font-bold text-gray-900">Why Us Items List</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#2596be] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1e7a9b] transition-colors"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          // @ts-ignore
          const IconComponent = Icons[item.icon_name] || Icons.HelpCircle;
          return (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex gap-4 items-center bg-gray-50">
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-lg text-gray-700">
                <IconComponent size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-center text-gray-500 py-8">No items added yet.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon Name (Lucide React)</label>
                  <select 
                    value={formData.icon_name} 
                    onChange={e => setFormData({...formData, icon_name: e.target.value})} 
                    className="w-full border border-gray-300 rounded p-2"
                  >
                    {ICON_CHOICES.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order Index</label>
                  <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded p-2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded p-2" required />
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
