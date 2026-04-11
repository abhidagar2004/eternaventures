import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Loader2, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Settings, 
  Type, 
  Palette, 
  Share2, 
  Layout, 
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FooterLink {
  id: string;
  label: string;
  href: string;
}

interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
  active: boolean;
}

interface FooterConfig {
  styling: {
    bg_color: string;
    text_color: string;
    border_color: string;
    accent_color: string;
    link_color: string;
    link_hover_color: string;
  };
  branding: {
    logo_type: 'text' | 'image';
    text1: string;
    color1: string;
    text2: string;
    color2: string;
    logo_url: string;
    logo_height: number;
    description: string;
  };
  socials: SocialLink[];
  columns: FooterColumn[];
  cta: {
    text: string;
    href: string;
    active: boolean;
    bg_color: string;
    text_color: string;
    hover_bg_color: string;
    hover_text_color: string;
    border_color: string;
    border_radius: string;
  };
  bottom_text: string;
}

export default function ManageFooter() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'footer_config')
        .single();
        
      if (data?.setting_value) {
        const val = data.setting_value as Partial<FooterConfig>;
        setConfig({
          ...val,
          styling: {
            bg_color: '#111111', text_color: '#ffffff', border_color: '#1f2937', accent_color: '#2596be',
            link_color: '#9ca3af', link_hover_color: '#ffffff',
            ...(val.styling || {})
          },
          branding: {
            logo_type: 'text', text1: 'Eterna', color1: '#ffffff', text2: 'Ventures', color2: '#2596be',
            logo_url: '', logo_height: 40, description: '',
            ...(val.branding || {})
          },
          cta: {
            text: 'Connect With Us', href: '/contact', active: true,
            bg_color: '#ffffff', text_color: '#000000', hover_bg_color: 'transparent', hover_text_color: '#ffffff',
            border_color: '#ffffff', border_radius: 'rounded-none',
            ...(val.cta || {})
          },
          socials: val.socials || [],
          columns: val.columns || [],
          bottom_text: val.bottom_text || ''
        });
      }
    } catch (err) {
      console.error('Error fetching footer config', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          setting_key: 'footer_config', 
          setting_value: config
        }, { onConflict: 'setting_key' });
        
      if (error) throw error;
      toast.success('Footer configuration saved!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addColumn = () => {
    if (!config || config.columns.length >= 4) {
      toast.error('Limit of 4 columns reached');
      return;
    }
    setConfig({
      ...config,
      columns: [...config.columns, { id: Date.now().toString(), title: 'New Column', links: [] }]
    });
  };

  const removeColumn = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      columns: config.columns.filter(c => c.id !== id)
    });
  };

  const addLink = (columnId: string) => {
    if (!config) return;
    setConfig({
      ...config,
      columns: config.columns.map(c => 
        c.id === columnId 
          ? { ...c, links: [...c.links, { id: Date.now().toString(), label: 'New Link', href: '#' }] }
          : c
      )
    });
  };

  const removeLink = (columnId: string, linkId: string) => {
    if (!config) return;
    setConfig({
      ...config,
      columns: config.columns.map(c => 
        c.id === columnId 
          ? { ...c, links: c.links.filter(l => l.id !== linkId) }
          : c
      )
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (!config) return null;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Footer</h1>
          <p className="text-gray-500 mt-2 font-medium">Fully customize your site's bottom navigation and branding.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-blue-500/10 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Save Footer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Branding & Socials */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <Layout className="text-blue-600 w-5 h-5" />
              <h2 className="text-xl font-bold text-gray-900">Branding</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex bg-gray-50 p-1 rounded-xl">
                <button
                  onClick={() => setConfig({...config, branding: {...config.branding, logo_type: 'text'}})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${config.branding.logo_type === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                  Text Logo
                </button>
                <button
                  onClick={() => setConfig({...config, branding: {...config.branding, logo_type: 'image'}})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${config.branding.logo_type === 'image' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                  Image Logo
                </button>
              </div>

              {config.branding.logo_type === 'text' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">PART 1</label>
                    <input
                      placeholder="Part 1 Text"
                      value={config.branding.text1}
                      onChange={e => setConfig({...config, branding: {...config.branding, text1: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                    />
                    <input 
                      type="color" 
                      value={config.branding.color1} 
                      onChange={e => setConfig({...config, branding: {...config.branding, color1: e.target.value}})}
                      className="w-full h-8 rounded cursor-pointer border border-gray-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">PART 2</label>
                    <input
                      placeholder="Part 2 Text"
                      value={config.branding.text2}
                      onChange={e => setConfig({...config, branding: {...config.branding, text2: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                    />
                    <input 
                      type="color" 
                      value={config.branding.color2} 
                      onChange={e => setConfig({...config, branding: {...config.branding, color2: e.target.value}})}
                      className="w-full h-8 rounded cursor-pointer border border-gray-100" 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                   <input
                    placeholder="Logo URL"
                    value={config.branding.logo_url}
                    onChange={e => setConfig({...config, branding: {...config.branding, logo_url: e.target.value}})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">HEIGHT: {config.branding.logo_height}PX</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={config.branding.logo_height}
                      onChange={e => setConfig({...config, branding: {...config.branding, logo_height: parseInt(e.target.value)}})}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Logo Preview */}
              <div className="p-6 bg-gray-900 rounded-xl flex items-center justify-center min-h-[100px]" style={{ backgroundColor: config.styling.bg_color }}>
                {config.branding.logo_type === 'text' ? (
                  <div className="text-3xl font-display font-black uppercase tracking-tighter">
                    <span style={{ color: config.branding.color1 }}>{config.branding.text1}</span>
                    <span style={{ color: config.branding.color2 }}>{config.branding.text2}</span>
                  </div>
                ) : (
                  <img 
                    src={config.branding.logo_url || 'https://via.placeholder.com/150x40?text=Logo'} 
                    alt="Preview" 
                    style={{ height: `${config.branding.logo_height}px` }} 
                    className="object-contain"
                  />
                )}
              </div>

              <textarea
                placeholder="Agency Description"
                value={config.branding.description}
                onChange={e => setConfig({...config, branding: {...config.branding, description: e.target.value}})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <Share2 className="text-emerald-600 w-5 h-5" />
              <h2 className="text-xl font-bold text-gray-900">Socials</h2>
            </div>
            
            <div className="space-y-4">
              {config.socials.map((social, index) => (
                <div key={social.platform} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    {social.platform === 'twitter' && <Twitter size={14} />}
                    {social.platform === 'instagram' && <Instagram size={14} />}
                    {social.platform === 'facebook' && <Facebook size={14} />}
                    {social.platform === 'youtube' && <Youtube size={14} />}
                    {social.platform === 'linkedin' && <Linkedin size={14} />}
                  </div>
                  <input
                    type="text"
                    value={social.url}
                    onChange={e => {
                      const newSocials = [...config.socials];
                      newSocials[index].url = e.target.value;
                      setConfig({...config, socials: newSocials});
                    }}
                    className="flex-grow bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    onClick={() => {
                      const newSocials = [...config.socials];
                      newSocials[index].active = !newSocials[index].active;
                      setConfig({...config, socials: newSocials});
                    }}
                    className={`w-10 h-6 rounded-full transition-all relative ${social.active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${social.active ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <Palette className="text-purple-600 w-5 h-5" />
              <h2 className="text-xl font-bold text-gray-900">Styling</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Background</label>
                  <input 
                    type="color" 
                    value={config.styling.bg_color} 
                    onChange={e => setConfig({...config, styling: {...config.styling, bg_color: e.target.value}})}
                    className="w-full h-10 rounded cursor-pointer border border-gray-100" 
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Text Color</label>
                  <input 
                    type="color" 
                    value={config.styling.text_color} 
                    onChange={e => setConfig({...config, styling: {...config.styling, text_color: e.target.value}})}
                    className="w-full h-10 rounded cursor-pointer border border-gray-100" 
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Link Color</label>
                  <input 
                    type="color" 
                    value={config.styling.link_color} 
                    onChange={e => setConfig({...config, styling: {...config.styling, link_color: e.target.value}})}
                    className="w-full h-10 rounded cursor-pointer border border-gray-100" 
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Link Hover Color</label>
                  <input 
                    type="color" 
                    value={config.styling.link_hover_color} 
                    onChange={e => setConfig({...config, styling: {...config.styling, link_hover_color: e.target.value}})}
                    className="w-full h-10 rounded cursor-pointer border border-gray-100" 
                  />
               </div>
               <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Accent (Social/Icons Hover)</label>
                  <input 
                    type="color" 
                    value={config.styling.accent_color} 
                    onChange={e => setConfig({...config, styling: {...config.styling, accent_color: e.target.value}})}
                    className="w-full h-10 rounded cursor-pointer border border-gray-100" 
                  />
               </div>
            </div>
          </section>
        </div>

        {/* Right Columns: Menu Rows */}
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
               <div className="flex items-center gap-3">
                 <Layout className="text-amber-600 w-5 h-5" />
                 <h2 className="text-xl font-bold text-gray-900">Menu Columns</h2>
               </div>
               <button 
                 onClick={addColumn}
                 disabled={config.columns.length >= 4}
                 className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 font-bold rounded-lg hover:bg-amber-100 transition-all disabled:opacity-50"
               >
                 <Plus size={16} />
                 Add Column
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.columns.map((column, colIndex) => (
                  <div key={column.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative group">
                    <button 
                      onClick={() => removeColumn(column.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <input
                      value={column.title}
                      onChange={e => {
                        const newCols = [...config.columns];
                        newCols[colIndex].title = e.target.value;
                        setConfig({...config, columns: newCols});
                      }}
                      className="bg-transparent text-sm font-bold text-gray-900 mb-4 underline decoration-amber-500/30 underline-offset-4 outline-none block w-full"
                    />

                    <div className="space-y-2">
                      {column.links.map((link, linkIndex) => (
                        <div key={link.id} className="flex gap-2 items-center">
                          <input
                            placeholder="Label"
                            value={link.label}
                            onChange={e => {
                              const newCols = [...config.columns];
                              newCols[colIndex].links[linkIndex].label = e.target.value;
                              setConfig({...config, columns: newCols});
                            }}
                            className="flex-1 bg-white border border-gray-100 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <input
                            placeholder="Path"
                            value={link.href}
                            onChange={e => {
                              const newCols = [...config.columns];
                              newCols[colIndex].links[linkIndex].href = e.target.value;
                              setConfig({...config, columns: newCols});
                            }}
                            className="flex-1 bg-white border border-gray-100 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                          />
                          <button 
                            onClick={() => removeLink(column.id, link.id)}
                            className="text-gray-300 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addLink(column.id)}
                        className="w-full py-2 mt-2 bg-white border border-dashed border-gray-200 text-gray-400 text-[10px] font-bold uppercase rounded-lg hover:border-amber-400 hover:text-amber-500 transition-all"
                      >
                        + Add Line
                      </button>
                    </div>
                  </div>
                ))}
             </div>
           </section>

           <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
               <ExternalLink className="text-pink-600 w-5 h-5" />
               <h2 className="text-xl font-bold text-gray-900">CTA & Bottom Text</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-pink-50/30 rounded-2xl border border-pink-100/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-pink-600 uppercase tracking-widest">Action Button</h3>
                    <button
                      onClick={() => setConfig({...config, cta: {...config.cta, active: !config.cta.active}})}
                      className={`w-10 h-6 rounded-full transition-all relative ${config.cta.active ? 'bg-pink-600' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.cta.active ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      placeholder="Button Text"
                      value={config.cta.text}
                      onChange={e => setConfig({...config, cta: {...config.cta, text: e.target.value}})}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm"
                    />
                    <input
                      placeholder="Button Link"
                      value={config.cta.href}
                      onChange={e => setConfig({...config, cta: {...config.cta, href: e.target.value}})}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono"
                    />
                    
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-pink-100">
                      <div>
                        <label className="block text-[10px] font-bold text-pink-500 mb-1">BG COLOR</label>
                        <input type="color" value={config.cta.bg_color} onChange={e => setConfig({...config, cta: {...config.cta, bg_color: e.target.value}})} className="w-full h-8 rounded cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-pink-500 mb-1">TEXT COLOR</label>
                        <input type="color" value={config.cta.text_color} onChange={e => setConfig({...config, cta: {...config.cta, text_color: e.target.value}})} className="w-full h-8 rounded cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-pink-500 mb-1">HOVER BG</label>
                        <input type="color" value={config.cta.hover_bg_color} onChange={e => setConfig({...config, cta: {...config.cta, hover_bg_color: e.target.value}})} className="w-full h-8 rounded cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-pink-500 mb-1">HOVER TEXT</label>
                        <input type="color" value={config.cta.hover_text_color} onChange={e => setConfig({...config, cta: {...config.cta, hover_text_color: e.target.value}})} className="w-full h-8 rounded cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-pink-500 mb-1">BORDER COLOR</label>
                        <input type="color" value={config.cta.border_color} onChange={e => setConfig({...config, cta: {...config.cta, border_color: e.target.value}})} className="w-full h-8 rounded cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-pink-500 mb-1">SHAPE</label>
                        <select 
                          value={config.cta.border_radius} 
                          onChange={e => setConfig({...config, cta: {...config.cta, border_radius: e.target.value}})}
                          className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs text-gray-700 h-8"
                        >
                          <option value="rounded-none">Square</option>
                          <option value="rounded">Slight Curve</option>
                          <option value="rounded-xl">Rounded</option>
                          <option value="rounded-full">Pill (Full)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Copyright Info</h3>
                  <textarea
                    value={config.bottom_text}
                    onChange={e => setConfig({...config, bottom_text: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm min-h-[110px]"
                    placeholder="© 2026 EternaVentures..."
                  />
                </div>
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}

const X = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
