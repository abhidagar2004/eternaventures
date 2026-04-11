import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageHomeProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    image_url: '',
    aspect_ratio: 'square'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('home_projects').select('*').order('created_at', { ascending: false });
      if (error) {
        if (error.code === '42P01') {
          toast.error("home_projects table does not exist. Please create it in Supabase.");
        } else {
          throw error;
        }
      }
      if (data) setProjects(data);
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
      toast.error(error.message);
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
        image_url: formData.image_url,
        aspect_ratio: formData.aspect_ratio
      };

      if (formData.id) {
        const { error } = await supabase.from('home_projects').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast.success('Home project updated successfully');
      } else {
        const { error } = await supabase.from('home_projects').insert([payload]);
        if (error) throw error;
        toast.success('Home project created successfully');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('home_projects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Home project deleted successfully');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openModal = (project?: any) => {
    if (project) {
      setFormData({
        id: project.id,
        title: project.title,
        image_url: project.image_url || '',
        aspect_ratio: project.aspect_ratio || 'square'
      });
    } else {
      setFormData({ id: '', title: '', image_url: '', aspect_ratio: 'square' });
    }
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Home Projects</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Home Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-900">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Aspect Ratio</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{project.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize">
                    {project.aspect_ratio || 'square'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openModal(project)}
                        className="p-2 text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                    No home projects found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {formData.id ? 'Edit Home Project' : 'Add Home Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                <select
                  value={formData.aspect_ratio}
                  onChange={(e) => setFormData({ ...formData, aspect_ratio: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="square">Square (1:1)</option>
                  <option value="landscape">Landscape (16:9)</option>
                  <option value="portrait">Portrait (4:5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                <div className="flex items-center space-x-4">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Project" className="h-16 w-16 object-cover rounded" />
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-lg border border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {(isSubmitting || uploading) && <Loader2 size={18} className="animate-spin" />}
                  {formData.id ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
