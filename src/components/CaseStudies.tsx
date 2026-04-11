import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import { FileDown, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CaseStudies({
  bgColor = "#000000",
  tag = "Our Work",
  tagColor = "#2596be",
  tagSize = "text-sm",
  heading = "Results speak louder than promises.",
  headingColor = "#ffffff",
  headingSize = "text-5xl md:text-7xl",
  ctaText = "Start a Project",
  ctaColor = "#ffffff",
  ctaSize = "text-base",
  categoryBtnColor = "#111111",
  categoryBtnActiveColor = "#2596be",
  categoryTextColor = "#9ca3af",
  categoryTextActiveColor = "#ffffff"
}: {
  bgColor?: string,
  tag?: string,
  tagColor?: string,
  tagSize?: string,
  heading?: string,
  headingColor?: string,
  headingSize?: string,
  ctaText?: string,
  ctaColor?: string,
  ctaSize?: string,
  categoryBtnColor?: string,
  categoryBtnActiveColor?: string,
  categoryTextColor?: string,
  categoryTextActiveColor?: string
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [cases, setCases] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    country_code: '+91',
    message: ''
  });
  const [formSettings, setFormSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, settingsRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('contact_page_content').select('*').limit(1).single()
        ]);
        
        if (projectsRes.error) {
          console.error("Error fetching projects:", projectsRes.error);
          setError(projectsRes.error.message);
        } else if (projectsRes.data) {
          setCases(projectsRes.data);
          const allCategories = new Set<string>();
          projectsRes.data.forEach(project => {
            if (project.category_names && Array.isArray(project.category_names)) {
              project.category_names.forEach((cat: string) => allCategories.add(cat));
            }
          });
          setCategories(['All', ...Array.from(allCategories)]);
        }

        if (settingsRes.data) {
          setFormSettings(settingsRes.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setLeadForm({ ...leadForm, phone: value });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    setSubmittingLead(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        country_code: leadForm.country_code,
        message: leadForm.message || `Brochure request for ${selectedProject.title}`,
        project_title: selectedProject.title
      }]);

      if (error) throw error;

      toast.success('Inquiry submitted! Downloading brochure...');
      
      // Trigger download
      if (selectedProject.brochure_url) {
        window.open(selectedProject.brochure_url, '_blank');
      }
      
      setSelectedProject(null);
      setLeadForm({ name: '', email: '', phone: '', country_code: '+91', message: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmittingLead(false);
    }
  };

  const filteredCases = activeFilter === 'All' 
    ? cases 
    : cases.filter(c => c.category_names && c.category_names.includes(activeFilter));

  const countryCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+971', name: 'UAE' },
    { code: '+61', name: 'Australia' },
    { code: '+1', name: 'Canada' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+65', name: 'Singapore' },
    { code: '+41', name: 'Switzerland' },
    { code: '+31', name: 'Netherlands' },
    { code: '+39', name: 'Italy' },
    { code: '+34', name: 'Spain' },
    { code: '+7', name: 'Russia' },
    { code: '+55', name: 'Brazil' },
    { code: '+27', name: 'South Africa' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+90', name: 'Turkey' },
    { code: '+62', name: 'Indonesia' },
    { code: '+60', name: 'Malaysia' },
    { code: '+64', name: 'New Zealand' },
    { code: '+353', name: 'Ireland' },
    { code: '+46', name: 'Sweden' },
    { code: '+47', name: 'Norway' },
    { code: '+45', name: 'Denmark' },
    { code: '+358', name: 'Finland' },
    { code: '+32', name: 'Belgium' },
    { code: '+43', name: 'Austria' },
    { code: '+351', name: 'Portugal' },
    { code: '+30', name: 'Greece' },
    { code: '+48', name: 'Poland' },
    { code: '+420', name: 'Czech Republic' },
    { code: '+36', name: 'Hungary' },
    { code: '+40', name: 'Romania' },
    { code: '+66', name: 'Thailand' },
    { code: '+84', name: 'Vietnam' },
    { code: '+63', name: 'Philippines' },
    { code: '+92', name: 'Pakistan' },
    { code: '+880', name: 'Bangladesh' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+977', name: 'Nepal' },
    { code: '+972', name: 'Israel' },
    { code: '+20', name: 'Egypt' },
    { code: '+234', name: 'Nigeria' },
    { code: '+KEN', name: 'Kenya' },
    { code: '+52', name: 'Mexico' },
    { code: '+54', name: 'Argentina' },
    { code: '+56', name: 'Chile' },
    { code: '+57', name: 'Colombia' },
    { code: '+51', name: 'Peru' },
  ];

  return (
    <section id="work" className="py-24 relative border-t border-gray-900" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className={`${tagSize} font-bold tracking-widest uppercase mb-3`} style={{ color: tagColor }}>{tag}</h2>
            <h3 className={`${headingSize} font-display font-black uppercase tracking-tighter leading-none`} style={{ color: headingColor }}>
              {heading}
            </h3>
          </div>
          <Link to="/contact" className={`${ctaSize} font-bold uppercase tracking-wider flex items-center gap-2 transition-colors group`} style={{ color: ctaColor }}>
            {ctaText}
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all border border-gray-800 hover:border-gray-600`}
              style={{
                backgroundColor: activeFilter === filter ? categoryBtnActiveColor : categoryBtnColor,
                color: activeFilter === filter ? categoryTextActiveColor : categoryTextColor
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#2596be]" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>Error loading projects: {error}</p>
          </div>
        ) : filteredCases.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCases.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group rounded-2xl overflow-hidden bg-[#111] border border-gray-800 hover:border-[#2596be]/50 transition-colors flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={item.image_url || 'https://picsum.photos/seed/project/800/600'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {item.category_names && item.category_names.length > 0 && (
                      <div className="absolute top-4 left-4 z-20 bg-black/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-gray-800">
                        {item.category_names[0]}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-2xl font-bold text-white uppercase tracking-wide">{item.title}</h4>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="max-h-[3.75rem] overflow-y-auto hide-scrollbar mb-6">
                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                      
                      {item.brochure_url && (
                        <button 
                          onClick={() => setSelectedProject(item)}
                          className="w-full py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all mt-auto"
                          style={{
                            backgroundColor: item.brochure_btn_bg_color || '#ffffff',
                            color: item.brochure_btn_text_color || '#000000',
                            borderRadius: item.brochure_btn_radius || '8px'
                          }}
                        >
                          <FileDown size={14} /> {item.brochure_btn_text || 'Download Brochure'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">No projects found</h3>
            <p className="text-gray-400">Check back later for updates.</p>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-20 pt-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden relative z-[101]"
              style={{ backgroundColor: formSettings?.brochure_form_bg_color || '#111111' }}
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    {formSettings?.brochure_form_title || 'Brochure Request'}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">{selectedProject?.title}</p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleLeadSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Your Name</label>
                      <input 
                        required
                        type="text" 
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2596be] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2596be] transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Contact Number</label>
                    <div className="flex gap-2">
                      <select 
                        value={leadForm.country_code}
                        onChange={(e) => setLeadForm({...leadForm, country_code: e.target.value})}
                        className="bg-black border border-gray-800 rounded-lg px-3 py-3 text-white outline-none focus:border-[#2596be] text-sm overflow-y-auto"
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                        ))}
                      </select>
                      <input 
                        required
                        type="text" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={leadForm.phone}
                        onChange={handlePhoneChange}
                        className="flex-1 bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2596be] transition-colors"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Message (Optional)</label>
                    <textarea 
                      rows={3}
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2596be] transition-colors resize-none"
                      placeholder="Tell us more about your interests..."
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={submittingLead}
                  className="w-full py-4 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
                  style={{
                    backgroundColor: formSettings?.brochure_form_btn_bg_color || '#2596be',
                    color: formSettings?.brochure_form_btn_text_color || '#ffffff',
                    borderRadius: formSettings?.brochure_form_btn_radius || '0.75rem'
                  }}
                >
                  {submittingLead ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>{formSettings?.brochure_form_btn_text || 'Submit inquiry & Download'} <FileDown size={18} /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
