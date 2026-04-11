import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

interface ContactProps {
  sectionBgColor?: string;
  sectionBorderColor?: string;
  tagText?: string;
  tagColor?: string;
  headingText?: string;
  headingColor?: string;
  headingSize?: string;
  descText?: string;
  descColor?: string;
  descSize?: string;
  iconBgColor?: string;
  iconColor?: string;
  labelColor?: string;
  infoTextColor?: string;
  formBgColor?: string;
  formBorderColor?: string;
  inputBgColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  labelText_color?: string; // Corrected naming
  btnBgColor?: string;
  btnTextColor?: string;
  btnHoverBgColor?: string;
  btnRadius?: string;
  formNamePlaceholder?: string;
  formEmailPlaceholder?: string;
  formPhonePlaceholder?: string;
  formMessagePlaceholder?: string;
  formButtonText?: string;
  initialContactInfo?: any;
}

export default function Contact(props: ContactProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [contactInfo, setContactInfo] = useState<any>(props.initialContactInfo || {
    email: 'hello@eternaventures.com',
    phone: '+1 (555) 123-4567',
    address: '100 Innovation Drive, Suite 300, New York, NY 10001',
    business_hours: 'Mon - Fri, 9am - 6pm EST'
  });

  React.useEffect(() => {
    if (!props.initialContactInfo) {
      async function fetchContactInfo() {
        const { data } = await supabase.from('contact_page_content').select('*').order('created_at', { ascending: false }).limit(1).single();
        if (data) setContactInfo(data);
      }
      fetchContactInfo();
    } else {
      setContactInfo(props.initialContactInfo);
    }
  }, [props.initialContactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('leads').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }
      ]);

      if (error) throw error;

      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const p = props;

  return (
    <section 
      id="contact" 
      className="py-24 relative border-t" 
      style={{ backgroundColor: p.sectionBgColor || '#000000', borderColor: p.sectionBorderColor || '#111827' }}
    >
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {p.tagText && p.tagText.trim() !== "" && (
              <h2 className="font-bold tracking-widest uppercase text-sm mb-3" style={{ color: p.tagColor || '#2596be' }}>
                {p.tagText}
              </h2>
            )}
            {p.headingText && p.headingText.trim() !== "" && (
              <h3 
                className={`${p.headingSize || 'text-5xl md:text-7xl'} font-display font-black uppercase tracking-tighter mb-6 leading-none`}
                style={{ color: p.headingColor || '#ffffff' }}
              >
                {p.headingText}
              </h3>
            )}
            {p.descText && p.descText.trim() !== "" && (
              <p 
                className={`${p.descSize || 'text-lg'} mb-10 max-w-md`}
                style={{ color: p.descColor || '#9ca3af' }}
              >
                {p.descText}
              </p>
            )}

            <div className="space-y-6 flex flex-col gap-4">
              {contactInfo.email && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: p.iconBgColor || '#111827' }}>
                    <MessageSquare className="w-5 h-5" style={{ color: p.iconColor || '#2596be' }} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider font-bold" style={{ color: p.labelColor || '#6b7280' }}>Email</p>
                    <p className="font-medium" style={{ color: p.infoTextColor || '#ffffff' }}>{contactInfo.email}</p>
                  </div>
                </div>
              )}

              {contactInfo.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: p.iconBgColor || '#111827' }}>
                    <span className="font-bold text-xl" style={{ color: p.iconColor || '#2596be' }}>#</span>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider font-bold" style={{ color: p.labelColor || '#6b7280' }}>Phone</p>
                    <p className="font-medium" style={{ color: p.infoTextColor || '#ffffff' }}>{contactInfo.phone}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.address && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: p.iconBgColor || '#111827' }}>
                    <span className="font-bold text-xl" style={{ color: p.iconColor || '#2596be' }}>@</span>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider font-bold" style={{ color: p.labelColor || '#6b7280' }}>Address</p>
                    <p className="font-medium max-w-[250px]" style={{ color: p.infoTextColor || '#ffffff' }}>{contactInfo.address}</p>
                  </div>
                </div>
              )}

              {contactInfo.business_hours && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: p.iconBgColor || '#111827' }}>
                    <span className="font-bold text-xl" style={{ color: p.iconColor || '#2596be' }}>⏰</span>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider font-bold" style={{ color: p.labelColor || '#6b7280' }}>Business Hours</p>
                    <p className="font-medium" style={{ color: p.infoTextColor || '#ffffff' }}>{contactInfo.business_hours}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 md:p-10 rounded-2xl border"
            style={{ backgroundColor: p.formBgColor || '#111', borderColor: p.formBorderColor || '#1f2937' }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: p.labelText_color || '#9ca3af' }}>Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-colors"
                    style={{ 
                      backgroundColor: p.inputBgColor || '#000', 
                      borderColor: p.inputBorderColor || '#1f2937',
                      color: p.inputTextColor || '#fff'
                    }}
                    placeholder={p.formNamePlaceholder || "John Doe"}
                    onFocus={(e) => e.target.style.borderColor = p.btnBgColor || '#2596be'}
                    onBlur={(e) => e.target.style.borderColor = p.inputBorderColor || '#1f2937'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: p.labelText_color || '#9ca3af' }}>Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-colors"
                    style={{ 
                      backgroundColor: p.inputBgColor || '#000', 
                      borderColor: p.inputBorderColor || '#1f2937',
                      color: p.inputTextColor || '#fff'
                    }}
                    placeholder={p.formEmailPlaceholder || "john@example.com"}
                    onFocus={(e) => e.target.style.borderColor = p.btnBgColor || '#2596be'}
                    onBlur={(e) => e.target.style.borderColor = p.inputBorderColor || '#1f2937'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: p.labelText_color || '#9ca3af' }}>Phone (Optional)</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-colors"
                  style={{ 
                    backgroundColor: p.inputBgColor || '#000', 
                    borderColor: p.inputBorderColor || '#1f2937',
                    color: p.inputTextColor || '#fff'
                  }}
                  placeholder={p.formPhonePlaceholder || "+1 (555) 000-0000"}
                  onFocus={(e) => e.target.style.borderColor = p.btnBgColor || '#2596be'}
                  onBlur={(e) => e.target.style.borderColor = p.inputBorderColor || '#1f2937'}
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: p.labelText_color || '#9ca3af' }}>Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-colors resize-none"
                  style={{ 
                    backgroundColor: p.inputBgColor || '#000', 
                    borderColor: p.inputBorderColor || '#1f2937',
                    color: p.inputTextColor || '#fff'
                  }}
                  placeholder={p.formMessagePlaceholder || "Tell us about your current challenges and goals..."}
                  onFocus={(e) => e.target.style.borderColor = p.btnBgColor || '#2596be'}
                  onBlur={(e) => e.target.style.borderColor = p.inputBorderColor || '#1f2937'}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full font-bold uppercase tracking-wider py-4 ${p.btnRadius || 'rounded-lg'} flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
                style={{ 
                  backgroundColor: p.btnBgColor || '#2596be', 
                  color: p.btnTextColor || '#ffffff' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = p.btnHoverBgColor || '#1e7a9b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = p.btnBgColor || '#2596be'}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <> {p.formButtonText || "Submit Request"} <Send size={20} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
