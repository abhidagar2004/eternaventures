import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, uploadImage } from '../../lib/supabase';
import { Loader2, ArrowLeft, Image as ImageIcon, Save, X, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
import RichTextEditor from '../../components/admin/RichTextEditor';

export default function AddEditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    thumbnail_url: '',
    visibility: 'visible',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    author: '',
    theme_template: 'default',
    tags: [] as string[],
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').eq('entity_type', 'blog');
      if (data) setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBlog = async (blogId: string) => {
    try {
      const { data, error } = await supabase.from('blogs').select('*').eq('id', blogId).single();
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          thumbnail_url: data.thumbnail_url || '',
          visibility: data.visibility || 'visible',
          excerpt: data.excerpt || '',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          author: data.author || '',
          theme_template: data.theme_template || 'default',
          tags: data.tags || [],
        });
      }
    } catch (err: any) {
      toast.error('Failed to load blog');
      navigate('/admin/blogs');
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setFormData({ ...formData, thumbnail_url: url });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    
    setLoading(true);
    let finalSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const payload = {
      title: formData.title,
      slug: finalSlug,
      content: formData.content,
      thumbnail_url: formData.thumbnail_url,
      visibility: formData.visibility,
      excerpt: formData.excerpt,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      author: formData.author,
      theme_template: formData.theme_template,
      tags: formData.tags,
    };

    try {
      if (id) {
        const { error } = await supabase.from('blogs').update(payload).eq('id', id);
        if (error) throw error;
        toast.success('Blog updated successfully');
      } else {
        const { error } = await supabase.from('blogs').insert([payload]);
        if (error) throw error;
        toast.success('Blog created successfully');
      }
      navigate('/admin/blogs');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagName: string) => {
    if (formData.tags.includes(tagName)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagName) });
    } else {
      setFormData({ ...formData, tags: [...formData.tags, tagName] });
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/blogs')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit blog post' : 'Add blog post'}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Blog about your latest products or deals"
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <p className="text-xs text-gray-500 mb-3">Add a summary of the post to appear on your home page or blog overview.</p>
            <textarea
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 outline-none"
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Visibility</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="visible"
                  checked={formData.visibility === 'visible'}
                  onChange={() => setFormData({ ...formData, visibility: 'visible' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Visible</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="hidden"
                  checked={formData.visibility === 'hidden'}
                  onChange={() => setFormData({ ...formData, visibility: 'hidden' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Hidden</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Thumbnail Image</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="Paste image URL from media library..."
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400 font-bold">Or Upload</span>
                </div>
              </div>

              {formData.thumbnail_url ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                  <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-auto aspect-video object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded-lg text-sm font-medium">
                      Change
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <button onClick={() => setFormData({ ...formData, thumbnail_url: '' })} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition relative">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <label className="cursor-pointer">
                        <span className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Add image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      <p className="text-xs text-gray-500 mt-4">or drop an image to upload</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
            <h3 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-100 pb-3">Organization</h3>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Theme template</label>
              <select
                value={formData.theme_template}
                onChange={e => setFormData({ ...formData, theme_template: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="default">Default template</option>
                <option value="compact">Compact layout</option>
                <option value="fullwidth">Full width layout</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Categories/Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(cat.name)}
                      onChange={() => toggleTag(cat.name)}
                      className="peer hidden"
                    />
                    <div className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:border-blue-300 transition">
                      {cat.name}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
