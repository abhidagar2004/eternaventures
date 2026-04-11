import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Save, Settings, Menu, Palette, Type, MousePointer2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface NavLink {
  id: string;
  name: string;
  href: string;
}

interface NavButton {
  id: string;
  name: string;
  href: string;
  bgColor: string;
  textColor: string;
}

interface LogoConfig {
  type: 'text' | 'image';
  text1?: string;
  color1?: string;
  text2?: string;
  color2?: string;
  imageUrl?: string;
  height?: number;
  width?: number;
}

interface StylingConfig {
  navbar_bg: string;
  link_color: string;
  link_hover_color: string;
  link_active_color: string;
}

interface NavbarConfig {
  logo: LogoConfig;
  styling: StylingConfig;
  links: NavLink[];
  buttons: NavButton[];
}

export default function ManageNavbar() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [config, setConfig] = useState<NavbarConfig>({
    logo: {
      type: 'text',
      text1: 'Eterna',
      color1: '#ffffff',
      text2: 'Ventures',
      color2: '#2596be',
      height: 40,
      width: 150
    },
    styling: {
      navbar_bg: 'bg-black/90',
      link_color: '#d1d5db',
      link_hover_color: '#ffffff',
      link_active_color: '#2596be'
    },
    links: [
      { id: '1', name: 'Services', href: '/services' },
      { id: '2', name: 'Projects', href: '/projects' },
      { id: '3', name: 'About', href: '/about' },
      { id: '4', name: 'Blogs', href: '/blogs' },
    ],
    buttons: [
      { id: 'b1', name: 'Book a Call', href: '/contact', bgColor: 'bg-white', textColor: 'text-black' }
    ]
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'navbar_config')
        .single();
        
      if (data?.setting_value) {
        setConfig(data.setting_value as NavbarConfig);
      }
    } catch (err) {
      console.error('No config found or error fetching', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          setting_key: 'navbar_config', 
          setting_value: config
        }, { onConflict: 'setting_key' });
        
      if (error) throw error;
      toast.success('Navbar configuration saved!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for Links array
  const moveLink = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= config.links.length) return;
    const newLinks = [...config.links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[index + direction];
    newLinks[index + direction] = temp;
    setConfig({ ...config, links: newLinks });
  };

  const updateLink = (index: number, field: keyof NavLink, value: string) => {
    const newLinks = [...config.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setConfig({ ...config, links: newLinks });
  };

  const addLink = () => {
    setConfig({
      ...config,
      links: [...config.links, { id: Date.now().toString(), name: 'New Link', href: '/' }]
    });
  };

  const removeLink = (index: number) => {
    const newLinks = config.links.filter((_, i) => i !== index);
    setConfig({ ...config, links: newLinks });
  };

  // Helper functions for Buttons array
  const moveButton = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= config.buttons.length) return;
    const newBtns = [...config.buttons];
    const temp = newBtns[index];
    newBtns[index] = newBtns[index + direction];
    newBtns[index + direction] = temp;
    setConfig({ ...config, buttons: newBtns });
  };

  const updateButton = (index: number, field: keyof NavButton, value: string) => {
    const newBtns = [...config.buttons];
    newBtns[index] = { ...newBtns[index], [field]: value };
    setConfig({ ...config, buttons: newBtns });
  };

  const addButton = () => {
    setConfig({
      ...config,
      buttons: [...config.buttons, { id: Date.now().toString(), name: 'New Button', href: '/', bgColor: 'bg-[#2596be]', textColor: 'text-white' }]
    });
  };

  const removeButton = (index: number) => {
    const newBtns = config.buttons.filter((_, i) => i !== index);
    setConfig({ ...config, buttons: newBtns });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#2596be]" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Navbar</h1>
          <p className="text-gray-500 mt-2">Fully customize your site's navigation bar.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2596be] hover:bg-[#1a7a9c] text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Save Navbar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Branding & Styling */}
        <div className="space-y-8">
          {/* Logo Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Type size={20} /></div>
              <h2 className="text-xl font-bold text-gray-900">Logo Branding</h2>
            </div>
            
            {/* Logo Type Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button 
                onClick={() => setConfig({...config, logo: {...config.logo, type: 'text'}})}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${config.logo.type === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                Text Logo
              </button>
              <button 
                onClick={() => setConfig({...config, logo: {...config.logo, type: 'image'}})}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${config.logo.type === 'image' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                Image Logo
              </button>
            </div>

            {config.logo.type === 'text' ? (
              <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-500 mb-1">PART 1 TEXT</label>
                  <input type="text" value={config.logo.text1} onChange={e => setConfig({...config, logo: {...config.logo, text1: e.target.value}})} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">PART 1 COLOR</label>
                  <div className="flex gap-2">
                    <input type="color" value={config.logo.color1} onChange={e => setConfig({...config, logo: {...config.logo, color1: e.target.value}})} className="h-9 w-12 border rounded cursor-pointer" />
                    <input type="text" value={config.logo.color1} onChange={e => setConfig({...config, logo: {...config.logo, color1: e.target.value}})} className="flex-grow border rounded p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">PART 2 TEXT</label>
                  <input type="text" value={config.logo.text2} onChange={e => setConfig({...config, logo: {...config.logo, text2: e.target.value}})} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">PART 2 COLOR</label>
                  <div className="flex gap-2">
                    <input type="color" value={config.logo.color2} onChange={e => setConfig({...config, logo: {...config.logo, color2: e.target.value}})} className="h-9 w-12 border rounded cursor-pointer" />
                    <input type="text" value={config.logo.color2} onChange={e => setConfig({...config, logo: {...config.logo, color2: e.target.value}})} className="flex-grow border rounded p-2 text-sm" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Logo Image URL</label>
                  <input 
                    type="text" 
                    value={config.logo.imageUrl || ''} 
                    onChange={e => setConfig({...config, logo: {...config.logo, imageUrl: e.target.value}})} 
                    placeholder="https://example.com/logo.png"
                    className="w-full border rounded p-2 text-sm font-mono" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Height ({config.logo.height}px)</label>
                    <input 
                      type="range" 
                      min="20" 
                      max="150" 
                      value={config.logo.height || 40} 
                      onChange={e => setConfig({...config, logo: {...config.logo, height: parseInt(e.target.value)}})} 
                      className="w-full" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Width ({config.logo.width}px)</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="400" 
                      value={config.logo.width || 150} 
                      onChange={e => setConfig({...config, logo: {...config.logo, width: parseInt(e.target.value)}})} 
                      className="w-full" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-gray-900 rounded-xl flex items-center justify-center min-h-[80px]">
              {config.logo.type === 'text' ? (
                <>
                  <span className="text-xl font-bold" style={{ color: config.logo.color1 }}>{config.logo.text1}</span>
                  <span className="text-xl font-bold" style={{ color: config.logo.color2 }}>{config.logo.text2}</span>
                </>
              ) : (
                <img 
                  src={config.logo.imageUrl || 'https://via.placeholder.com/150x40?text=Logo'} 
                  alt="Preview" 
                  style={{ 
                    height: `${config.logo.height}px`, 
                    width: `${config.logo.width}px`,
                    objectFit: 'contain'
                  }} 
                />
              )}
            </div>
          </section>

          {/* Styling Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Palette size={20} /></div>
              <h2 className="text-xl font-bold text-gray-900">Styling & Colors</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Background (Tailwind Class)</label>
                <input type="text" value={config.styling.navbar_bg} onChange={e => setConfig({...config, styling: {...config.styling, navbar_bg: e.target.value}})} className="w-full border rounded p-2.5 text-sm font-mono bg-gray-50" />
                <p className="text-[10px] text-gray-400 mt-1">Example: bg-black/90, bg-slate-900, bg-[#2596be]</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Link Normal</label>
                   <input type="color" value={config.styling.link_color} onChange={e => setConfig({...config, styling: {...config.styling, link_color: e.target.value}})} className="w-full h-10 border rounded cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Link Hover</label>
                  <input type="color" value={config.styling.link_hover_color} onChange={e => setConfig({...config, styling: {...config.styling, link_hover_color: e.target.value}})} className="w-full h-10 border rounded cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Link Active</label>
                  <input type="color" value={config.styling.link_active_color} onChange={e => setConfig({...config, styling: {...config.styling, link_active_color: e.target.value}})} className="w-full h-10 border rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Links & Buttons */}
        <div className="space-y-8">
          {/* Navigation Links */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Menu size={20} /></div>
                <h2 className="text-xl font-bold text-gray-900">Menu Links</h2>
              </div>
              <button onClick={addLink} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                <Plus size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              {config.links.map((link, index) => (
                <div key={link.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveLink(index, -1)} disabled={index === 0} className="p-1 hover:bg-white rounded transition-colors disabled:opacity-0"><ArrowUp size={12} /></button>
                    <button onClick={() => moveLink(index, 1)} disabled={index === config.links.length - 1} className="p-1 hover:bg-white rounded transition-colors disabled:opacity-0"><ArrowDown size={12} /></button>
                  </div>
                  <div className="flex-grow grid grid-cols-2 gap-2">
                    <input type="text" value={link.name} onChange={e => updateLink(index, 'name', e.target.value)} placeholder="Link Name" className="border rounded p-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
                    <input type="text" value={link.href} onChange={e => updateLink(index, 'href', e.target.value)} placeholder="URL Path" className="border rounded p-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <button onClick={() => removeLink(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><MousePointer2 size={20} /></div>
                <h2 className="text-xl font-bold text-gray-900">CTA Buttons</h2>
              </div>
              <button onClick={addButton} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors">
                <Plus size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              {config.buttons.map((btn, index) => (
                <div key={btn.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 relative group">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Button Text</label>
                      <input type="text" value={btn.name} onChange={e => updateButton(index, 'name', e.target.value)} className="w-full border rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">URL Link</label>
                      <input type="text" value={btn.href} onChange={e => updateButton(index, 'href', e.target.value)} className="w-full border rounded p-2 text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">BG Class</label>
                      <input type="text" value={btn.bgColor} onChange={e => updateButton(index, 'bgColor', e.target.value)} placeholder="e.g. bg-white" className="w-full border rounded p-2 text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Text Class</label>
                      <input type="text" value={btn.textColor} onChange={e => updateButton(index, 'textColor', e.target.value)} placeholder="e.g. text-black" className="w-full border rounded p-2 text-xs font-mono" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                       <button onClick={() => moveButton(index, -1)} disabled={index === 0} className="p-1 hover:bg-white rounded transition-colors disabled:opacity-0"><ArrowUp size={12} /></button>
                       <button onClick={() => moveButton(index, 1)} disabled={index === config.buttons.length - 1} className="p-1 hover:bg-white rounded transition-colors disabled:opacity-0"><ArrowDown size={12} /></button>
                    </div>
                    <button onClick={() => removeButton(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
