import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({
    tag_bg_color: '#fdf2f8',
    tag_text_color: '#db2777',
    read_article_color: '#059669'
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const [blogsRes, settingsRes] = await Promise.all([
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_settings').select('*').limit(1).single()
      ]);

      if (blogsRes.error) throw blogsRes.error;
      setBlogs(blogsRes.data || []);

      if (settingsRes.data) {
        setSettings(settingsRes.data);
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('blog_settings')
        .update({
          tag_bg_color: settings.tag_bg_color,
          tag_text_color: settings.tag_text_color,
          read_article_color: settings.read_article_color
        })
        .match({ id: settings.id });

      if (error) throw error;
      toast.success('Blog settings updated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Blog deleted successfully');
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
        <button
          onClick={() => navigate('/admin/blogs/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Blog
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" />
          Blog Card Global Styling
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag Background</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={settings.tag_bg_color}
                onChange={(e) => setSettings({...settings, tag_bg_color: e.target.value})}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
              />
              <input 
                type="text" 
                value={settings.tag_bg_color}
                onChange={(e) => setSettings({...settings, tag_bg_color: e.target.value})}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag Text Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={settings.tag_text_color}
                onChange={(e) => setSettings({...settings, tag_text_color: e.target.value})}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
              />
              <input 
                type="text" 
                value={settings.tag_text_color}
                onChange={(e) => setSettings({...settings, tag_text_color: e.target.value})}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Read Article Text Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={settings.read_article_color}
                onChange={(e) => setSettings({...settings, read_article_color: e.target.value})}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
              />
              <input 
                type="text" 
                value={settings.read_article_color}
                onChange={(e) => setSettings({...settings, read_article_color: e.target.value})}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold flex items-center hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Save Global Styling
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {blog.thumbnail_url ? (
                      <img className="h-10 w-10 rounded-lg object-cover border border-gray-200" src={blog.thumbnail_url} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[250px]">{blog.title}</div>
                      <div className="text-sm text-gray-500">{blog.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${blog.visibility === 'hidden' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                    {blog.visibility === 'hidden' ? 'Hidden' : 'Visible'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(blog.created_at), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => navigate(`/admin/blogs/${blog.id}`)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="text-gray-400 mb-2 font-medium">No blogs found</div>
                  <button onClick={() => navigate('/admin/blogs/new')} className="text-blue-600 hover:underline">Create your first blog</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
