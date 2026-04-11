import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Loader2, LayoutGrid, Box, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

type EntityType = 'project' | 'blog' | 'service';

export default function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EntityType>('blog');
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    entity_type: 'blog' as EntityType,
  });

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('entity_type', activeTab)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error(error.message);
        setError(error.message);
      } else {
        setCategories(data || []);
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (formData.id) {
        const { error } = await supabase.from('categories').update({ name: formData.name }).eq('id', formData.id);
        if (error) throw error;
        toast.success('Category updated successfully');
      } else {
        const { error } = await supabase.from('categories').insert([{ name: formData.name, entity_type: formData.entity_type }]);
        if (error) throw error;
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Category deleted successfully');
      fetchCategories();
    }
  };

  const openModal = (category?: any) => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        entity_type: category.entity_type || activeTab,
      });
    } else {
      setFormData({ id: '', name: '', entity_type: activeTab });
    }
    setIsModalOpen(true);
  };

  const tabs: { id: EntityType; label: string; icon: React.ReactNode }[] = [
    { id: 'blog', label: 'Blog Categories', icon: <FileText className="w-5 h-5 mr-2" /> },
    { id: 'project', label: 'Project Categories', icon: <Box className="w-5 h-5 mr-2" /> },
    { id: 'service', label: 'Service Categories', icon: <LayoutGrid className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && categories.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(category.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(category)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && !error && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No {activeTab} categories found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Category' : `Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Category`}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
