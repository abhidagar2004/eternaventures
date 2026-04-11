import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    content: '',
    image_url: '',
    rating: 5,
  });

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (error) {
        toast.error(error.message);
        setError(error.message);
      } else {
        setTestimonials(data || []);
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

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
    setLoading(true);
    
    const payload = {
      name: formData.name,
      role: formData.role,
      content: formData.content,
      image_url: formData.image_url,
      rating: formData.rating,
    };

    try {
      if (formData.id) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast.success('Testimonial updated successfully');
      } else {
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) throw error;
        toast.success('Testimonial created successfully');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    }
  };

  const openModal = (testimonial?: any) => {
    if (testimonial) {
      setFormData({
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role || '',
        content: testimonial.content,
        image_url: testimonial.image_url || '',
        rating: testimonial.rating || 5,
      });
    } else {
      setFormData({ id: '', name: '', role: '', content: '', image_url: '', rating: 5 });
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Testimonials</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && testimonials.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {testimonial.image_url ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={testimonial.image_url} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testimonial.rating} / 5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(testimonial.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(testimonial)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(testimonial.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && !error && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No testimonials found. Create one to get started.
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
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Company</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Image (URL or Upload)</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Paste image URL here..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm outline-none focus:border-blue-500"
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-400 font-bold">Or Upload</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Client" className="h-16 w-16 object-cover rounded-full border" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {uploading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                  disabled={loading || uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
