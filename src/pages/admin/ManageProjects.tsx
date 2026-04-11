import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ManageProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image_url: '',
    brochure_url: '',
    category_names: [] as string[],
    brochure_btn_text: 'Download Brochure',
    brochure_btn_bg_color: '#ffffff',
    brochure_btn_text_color: '#000000',
    brochure_btn_radius: '8px',
  });

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true })
      ]);
      
      if (projectsRes.error) {
        toast.error(projectsRes.error.message);
        setError(projectsRes.error.message);
      } else {
        setProjects(projectsRes.data || []);
      }
      
      if (categoriesRes.error) {
        toast.error(categoriesRes.error.message);
        if (!error) setError(categoriesRes.error.message);
      } else {
        setCategories(categoriesRes.data || []);
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'brochure_url') => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setFormData({ ...formData, [field]: url });
      toast.success(`${field.includes('image') ? 'Image' : 'Brochure'} uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    setFormData(prev => {
      const current = prev.category_names || [];
      if (current.includes(categoryName)) {
        return { ...prev, category_names: current.filter(c => c !== categoryName) };
      } else {
        return { ...prev, category_names: [...current, categoryName] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      brochure_url: formData.brochure_url,
      category_names: formData.category_names,
      brochure_btn_text: formData.brochure_btn_text,
      brochure_btn_bg_color: formData.brochure_btn_bg_color,
      brochure_btn_text_color: formData.brochure_btn_text_color,
      brochure_btn_radius: formData.brochure_btn_radius,
    };

    try {
      if (formData.id) {
        const { error } = await supabase.from('projects').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Project deleted successfully');
      fetchData();
    }
  };

  const openModal = (project?: any) => {
    if (project) {
      setFormData({
        id: project.id,
        title: project.title,
        description: project.description || '',
        image_url: project.image_url || '',
        brochure_url: project.brochure_url || '',
        category_names: project.category_names || [],
        brochure_btn_text: project.brochure_btn_text || 'Download Brochure',
        brochure_btn_bg_color: project.brochure_btn_bg_color || '#ffffff',
        brochure_btn_text_color: project.brochure_btn_text_color || '#000000',
        brochure_btn_radius: project.brochure_btn_radius || '8px',
      });
    } else {
      setFormData({ 
        id: '', 
        title: '', 
        description: '', 
        image_url: '', 
        brochure_url: '', 
        category_names: [],
        brochure_btn_text: 'Download Brochure',
        brochure_btn_bg_color: '#ffffff',
        brochure_btn_text_color: '#000000',
        brochure_btn_radius: '8px',
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && projects.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.image_url ? (
                        <img className="h-10 w-10 rounded object-cover" src={project.image_url} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {(project.category_names || []).map((cat: string) => (
                        <span key={cat} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(project.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(project)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && !error && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No projects found. Create one to get started.
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Image (URL or Upload)</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Paste image URL here..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm"
                  />
                  <div className="flex items-center space-x-4">
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Project" className="h-16 w-16 object-cover rounded border" />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image_url')}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {uploading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brochure PDF (URL or Upload)</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Paste brochure URL here..."
                    value={formData.brochure_url}
                    onChange={(e) => setFormData({ ...formData, brochure_url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, 'brochure_url')}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {uploading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                  </div>
                  {formData.brochure_url && (
                    <p className="text-xs text-blue-600 font-medium truncate">Current PDF: {formData.brochure_url}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.category_names.includes(cat.name)}
                        onChange={() => handleCategoryToggle(cat.name)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Button Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.brochure_btn_text}
                      onChange={(e) => setFormData({ ...formData, brochure_btn_text: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm"
                      placeholder="e.g., Download Brochure"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                    <input
                      type="text"
                      value={formData.brochure_btn_radius}
                      onChange={(e) => setFormData({ ...formData, brochure_btn_radius: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm"
                      placeholder="e.g., 8px or 50px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <div className="flex gap-2">
                       <input
                        type="color"
                        value={formData.brochure_btn_bg_color}
                        onChange={(e) => setFormData({ ...formData, brochure_btn_bg_color: e.target.value })}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brochure_btn_bg_color}
                        onChange={(e) => setFormData({ ...formData, brochure_btn_bg_color: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                    <div className="flex gap-2">
                       <input
                        type="color"
                        value={formData.brochure_btn_text_color}
                        onChange={(e) => setFormData({ ...formData, brochure_btn_text_color: e.target.value })}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brochure_btn_text_color}
                        onChange={(e) => setFormData({ ...formData, brochure_btn_text_color: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
