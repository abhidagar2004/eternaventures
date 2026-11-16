import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Video, 
  Youtube, 
  ExternalLink, 
  Sparkles, 
  Save, 
  X, 
  Layers, 
  Clock, 
  ListOrdered,
  Eye,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail_url: string;
  youtube_playlist_id?: string;
  youtube_playlist_url?: string;
  level: string;
  duration: string;
  lessons_count: number;
  is_published: boolean;
  order_index: number;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  youtube_video_id: string;
  duration: string;
  order_index: number;
}

// Helper to extract YouTube playlist ID
function extractPlaylistId(url: string): string {
  if (!url) return '';
  const match = url.match(/[?&]list=([^#&?]+)/);
  if (match && match[1]) return match[1];
  return url.trim();
}

// Helper to extract YouTube Video ID
function extractVideoId(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  return url.trim();
}

export default function ManageCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Lesson management modal state
  const [managingLessonsCourse, setManagingLessonsCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState<{ title: string; youtube_video_id: string; duration: string }>({
    title: '',
    youtube_video_id: '',
    duration: '15:00'
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Brand Strategy',
    description: '',
    thumbnail_url: '',
    youtube_playlist_id: '',
    youtube_playlist_url: '',
    level: 'Founder / Advanced',
    duration: '2h 30m',
    lessons_count: 5,
    is_published: true,
    order_index: 0
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Fetch courses error:', error);
      } else {
        setCourses(data || []);
      }
    } catch (err: any) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Brand Strategy',
      description: '',
      thumbnail_url: '',
      youtube_playlist_id: '',
      youtube_playlist_url: '',
      level: 'Founder / Advanced',
      duration: '2h 30m',
      lessons_count: 5,
      is_published: true,
      order_index: courses.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      slug: course.slug,
      category: course.category || 'Brand Strategy',
      description: course.description || '',
      thumbnail_url: course.thumbnail_url || '',
      youtube_playlist_id: course.youtube_playlist_id || '',
      youtube_playlist_url: course.youtube_playlist_url || '',
      level: course.level || 'Founder / Advanced',
      duration: course.duration || '2h 30m',
      lessons_count: course.lessons_count || 1,
      is_published: course.is_published ?? true,
      order_index: course.order_index || 0
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingCourse) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title, slug }));
    } else {
      setFormData(prev => ({ ...prev, title }));
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error('Title and Slug are required');
      return;
    }

    const playlistId = extractPlaylistId(formData.youtube_playlist_url || formData.youtube_playlist_id);

    const payload = {
      ...formData,
      youtube_playlist_id: playlistId
    };

    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([payload]);

        if (error) throw error;
        toast.success('Course created successfully');
      }

      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Error saving course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and all its lessons?')) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast.success('Course deleted');
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete course');
    }
  };

  // Lessons management
  const openLessonsManager = async (course: Course) => {
    setManagingLessonsCourse(course);
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (err: any) {
      toast.error('Error fetching lessons');
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingLessonsCourse) return;
    if (!newLesson.title || !newLesson.youtube_video_id) {
      toast.error('Lesson title and YouTube Video ID/URL are required');
      return;
    }

    const videoId = extractVideoId(newLesson.youtube_video_id);

    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .insert([{
          course_id: managingLessonsCourse.id,
          title: newLesson.title,
          youtube_video_id: videoId,
          duration: newLesson.duration || '15:00',
          order_index: lessons.length + 1
        }])
        .select();

      if (error) throw error;
      toast.success('Lesson added!');
      setLessons(prev => [...prev, ...(data || [])]);
      setNewLesson({ title: '', youtube_video_id: '', duration: '15:00' });

      // Update lessons_count in course
      await supabase
        .from('courses')
        .update({ lessons_count: lessons.length + 1 })
        .eq('id', managingLessonsCourse.id);
      
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Error adding lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase.from('course_lessons').delete().eq('id', lessonId);
      if (error) throw error;
      toast.success('Lesson deleted');
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      if (managingLessonsCourse) {
        await supabase
          .from('courses')
          .update({ lessons_count: Math.max(0, lessons.length - 1) })
          .eq('id', managingLessonsCourse.id);
        fetchCourses();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete lesson');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              LMS & Video Portal
            </span>
          </div>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight">
            Manage Courses & Playlists
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Add YouTube playlists and individual video lessons. Website views officially count towards your YouTube channel.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#121212] border border-[#222] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gray-700 transition-all"
          >
            <div>
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600'}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-blue-400 text-[11px] font-mono font-bold uppercase border border-blue-500/30">
                  {course.category}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[11px] font-mono">
                  {course.duration}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 pt-3 border-t border-[#222]">
                  <span className="flex items-center gap-1">
                    <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
                    {course.lessons_count} Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    {course.youtube_playlist_id ? 'Playlist Linked' : 'Single Videos'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0d0d0d] border-t border-[#1f1f1f] flex items-center justify-between gap-2">
              <a
                href={`/courses/${course.slug}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 hover:text-white transition-colors"
                title="View on site"
              >
                <Eye className="w-4 h-4" />
              </a>

              <button
                onClick={() => openLessonsManager(course)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider transition-colors border border-blue-500/20 text-center"
              >
                Manage Lessons ({course.lessons_count})
              </button>

              <button
                onClick={() => openEditModal(course)}
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 hover:text-white transition-colors"
                title="Edit Course"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-16 bg-[#121212] border border-[#222] rounded-2xl">
          <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No courses created yet</h3>
          <p className="text-gray-400 text-sm mb-4">Click below to add your first YouTube playlist course.</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider"
          >
            Add Course
          </button>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#282828] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-[#282828] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Zero to 1M Brand Architecture Masterclass"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Slug (URL path)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="brand-architecture-masterclass"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Brand Strategy, Paid Ads, etc."
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Summary of what viewers will learn in this masterclass..."
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  YouTube Playlist Link or ID
                </label>
                <div className="relative">
                  <Youtube className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.youtube_playlist_url || formData.youtube_playlist_id}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        youtube_playlist_url: val,
                        youtube_playlist_id: extractPlaylistId(val)
                      }));
                    }}
                    placeholder="Paste link: https://www.youtube.com/playlist?list=PL..."
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  You can paste the entire YouTube Playlist URL. We will extract the ID automatically.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  placeholder="https://images.unsplash.com/... or Supabase storage URL"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Level</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    placeholder="Founder / Advanced"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="2h 45m"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Order Index</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#282828] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#2a2a2a] text-gray-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCourse ? 'Save Changes' : 'Create Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Lessons Drawer / Modal */}
      {managingLessonsCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#282828] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-[#282828] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase font-bold">Curriculum Manager</span>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                  {managingLessonsCourse.title}
                </h2>
              </div>
              <button onClick={() => setManagingLessonsCourse(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add New Lesson Form */}
              <form onSubmit={handleAddLesson} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#333] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-blue-400">Add Video Lesson to Course</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Lesson Title (e.g. 01: Core Architecture)"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[#121212] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="YouTube Video URL or ID"
                      value={newLesson.youtube_video_id}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, youtube_video_id: e.target.value }))}
                      className="flex-1 bg-[#121212] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Duration (15:00)"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-24 bg-[#121212] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-xs text-center"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>
                </div>
              </form>

              {/* Lessons List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Current Lessons ({lessons.length})</h4>
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center text-xs font-mono font-bold text-gray-300">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="text-sm font-bold text-white">{lesson.title}</h5>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                          <Youtube className="w-3 h-3 text-red-500" />
                          <span>ID: {lesson.youtube_video_id}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {lessons.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    No individual lessons added yet. If you provided a playlist ID, viewers can also watch the full playlist directly.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#282828] bg-[#101010] flex justify-end">
              <button
                onClick={() => setManagingLessonsCourse(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
