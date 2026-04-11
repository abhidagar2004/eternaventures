import React, { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { 
  Trash2, 
  Loader2, 
  Image as ImageIcon, 
  File, 
  Calendar, 
  HardDrive, 
  Search, 
  Copy, 
  Check, 
  X,
  CheckSquare,
  Square,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ManageMedia() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [copying, setCopying] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Images' | 'Videos' | 'PDFs'>('Images');

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        throw error;
      }

      const validFiles = data?.filter((f) => f.id || f.metadata?.size > 0) || [];

      const filesWithUrls = validFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(file.name);
        return {
          ...file,
          publicUrl
        };
      });

      setFiles(filesWithUrls);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Are you sure you want to delete this file? This will break any pages using this image!')) return;
    
    setDeleting(fileName);
    try {
      const { error } = await supabase.storage
        .from('uploads')
        .remove([fileName]);

      if (error) throw error;

      toast.success('File deleted successfully');
      setSelectedFiles(prev => prev.filter(f => f !== fileName));
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) return;

    setLoading(true);
    try {
      const { error } = await supabase.storage
        .from('uploads')
        .remove(selectedFiles);

      if (error) throw error;

      toast.success(`${selectedFiles.length} files deleted successfully`);
      setSelectedFiles([]);
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete selected files');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) 
        ? prev.filter(f => f !== fileName) 
        : [...prev, fileName]
    );
  };

  const handleSelectAll = (filteredFiles: any[]) => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.name));
    }
  };

  const copyToClipboard = async (url: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopying(fileName);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopying(null), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const results = { success: 0, error: 0 };

    for (const file of Array.from(files)) {
      try {
        await uploadImage(file);
        results.success++;
      } catch (err: any) {
        console.error(err);
        results.error++;
      }
    }

    if (results.error === 0) {
      toast.success(`Successfully uploaded ${results.success} files`);
    } else {
      toast.error(`Uploaded ${results.success} files, but ${results.error} failed`);
    }

    fetchFiles();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (mimetype: string) => mimetype?.startsWith('image/');
  const isVideo = (mimetype: string) => mimetype?.startsWith('video/');
  const isPDF = (mimetype: string) => mimetype === 'application/pdf';

  const getFilteredFiles = () => {
    return files.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const mimetype = f.metadata?.mimetype || '';
      
      let matchesTab = false;
      if (activeTab === 'Images') matchesTab = isImage(mimetype);
      else if (activeTab === 'Videos') matchesTab = isVideo(mimetype);
      else if (activeTab === 'PDFs') matchesTab = isPDF(mimetype);
      
      return matchesSearch && matchesTab;
    });
  };

  const filteredFiles = getFilteredFiles();

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and organize your brand assets with ease.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assets by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm"
            />
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                onChange={handleUpload}
                id="file-upload"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Assets
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {selectedFiles.length}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {(['Images', 'Videos', 'PDFs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedFiles([]);
              }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleSelectAll(filteredFiles)}
            className="flex items-center text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
          >
            {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 ? (
              <CheckSquare className="w-5 h-5 mr-2 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 mr-2" />
            )}
            {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
          <p className="text-sm font-bold text-gray-400">
            {filteredFiles.length} {activeTab}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-bold">Loading your library...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900">No {activeTab.toLowerCase()} found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or upload new assets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredFiles.map((file) => {
            const isSelected = selectedFiles.includes(file.name);
            const mimetype = file.metadata?.mimetype || '';
            const isImg = isImage(mimetype);
            const isVid = isVideo(mimetype);
            
            return (
              <div 
                key={file.id || file.name} 
                className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-lg' : 'border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Select Checkbox (Corner) */}
                <button
                  onClick={() => toggleSelect(file.name)}
                  className={`absolute top-3 left-3 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white/90 border-gray-200 opacity-0 group-hover:opacity-100 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>

                {/* Media Preview */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {isImg ? (
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : isVid ? (
                    <video
                      src={file.publicUrl}
                      className="w-full h-full object-cover"
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => e.currentTarget.pause()}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       <File className="w-10 h-10 text-gray-300" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase">{mimetype.split('/')[1] || 'FILE'}</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                      onClick={() => copyToClipboard(file.publicUrl, file.name)}
                      className="p-3 bg-white text-gray-900 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform animate-in fade-in zoom-in duration-200"
                      title="Copy Public Link"
                    >
                      {copying === file.name ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(file.name)}
                      disabled={deleting === file.name}
                      className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all transform animate-in fade-in zoom-in duration-300"
                      title="Delete Permanently"
                    >
                      {deleting === file.name ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs font-bold text-gray-900 truncate mb-1" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                    <span className="flex items-center">
                      <HardDrive className="w-3 h-3 mr-1" />
                      {formatBytes(file.metadata?.size || 0)}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {file.created_at ? format(new Date(file.created_at), 'MM/dd') : '??'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
