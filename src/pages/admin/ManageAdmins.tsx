import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Loader2, 
  ShieldCheck, 
  Palette,
  Type,
  UserPlus,
  AlertTriangle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageAdmins() {
  const [activeTab, setActiveTab] = useState<'admins' | 'styling'>('admins');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [authSettings, setAuthSettings] = useState<any>(null);
  
  // New Admin Form
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Deletion Confirmation Modal
  const [targetToDelete, setTargetToDelete] = useState<string | null>(null);
  const [confirmCreds, setConfirmCreds] = useState({ email: '', password: '' });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value');
    
    if (data) {
      const admins = data.find(s => s.setting_key === 'admin_emails')?.setting_value;
      const auth = data.find(s => s.setting_key === 'auth_settings')?.setting_value;
      if (admins) setAdminEmails(admins);
      if (auth) setAuthSettings(auth);
    }
    setLoading(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { 
          action: 'create',
          email: newAdmin.email, 
          password: newAdmin.password, 
          full_name: newAdmin.name 
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Admin created successfully!');
      setNewAdmin({ name: '', email: '', password: '' });
      await fetchSettings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetToDelete) return;
    
    setConfirming(true);
    try {
      // 1. Re-authenticate current admin session
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: confirmCreds.email,
        password: confirmCreds.password,
      });

      if (authError) {
        throw new Error('Authentication failed: Invalid credentials');
      }

      // 2. Proceed with Deletion via Edge Function
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { 
          action: 'delete',
          email: targetToDelete
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Admin permanently deleted');
      setTargetToDelete(null);
      setConfirmCreds({ email: '', password: '' });
      await fetchSettings();
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setConfirming(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: authSettings })
      .eq('setting_key', 'auth_settings');

    if (error) {
      toast.error('Failed to save settings');
    } else {
      toast.success('Auth settings updated!');
    }
    setLoading(false);
  };

  const handleResetForDelete = async () => {
    if (!confirmCreds.email) return toast.error('Please enter your email address first');
    setConfirming(true);
    const origin = window.location.origin.includes('localhost') 
      ? 'http://localhost:3000' 
      : 'https://eternaventures.vercel.app';
      
    const { error } = await supabase.auth.resetPasswordForEmail(confirmCreds.email, {
      redirectTo: `${origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset link sent to your email!');
    }
    setConfirming(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShieldCheck className="mr-3 text-blue-600" />
            Admin & Auth Controls
          </h1>
          <p className="text-gray-600 mt-1">Manage administrators and customize the authentication experience.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('admins')}
          className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'admins' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Manage Admins
        </button>
        <button
          onClick={() => setActiveTab('styling')}
          className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'styling' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <Palette className="w-4 h-4 mr-2" />
          Auth Customization
        </button>
      </div>

      {activeTab === 'admins' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Admin Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <UserPlus className="mr-2 text-blue-600" />
              Create New Admin
            </h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newAdmin.password}
                    onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-500/10 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Create Admin Account'}
              </button>
            </form>
          </div>

          {/* Admin List */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ShieldCheck className="mr-2 text-green-600" />
              Authorized Emails
            </h2>
            <div className="space-y-3">
              {adminEmails.map(email => (
                <div key={email} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{email}</span>
                  </div>
                  {email !== session?.user?.email && (
                    <button
                      onClick={() => setTargetToDelete(email)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Auth Customization code stays the same... */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Type className="mr-2 text-purple-600" />
                Form Content
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Login View</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="Login Title"
                      value={authSettings?.login?.title || ''}
                      onChange={e => setAuthSettings({...authSettings, login: {...authSettings.login, title: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                      placeholder="Login Subtitle"
                      value={authSettings?.login?.subtitle || ''}
                      onChange={e => setAuthSettings({...authSettings, login: {...authSettings.login, subtitle: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 h-20"
                    />
                    <input
                      placeholder="Button Text"
                      value={authSettings?.login?.buttonText || ''}
                      onChange={e => setAuthSettings({...authSettings, login: {...authSettings.login, buttonText: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-4">Signup View</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="Signup Title"
                      value={authSettings?.signup?.title || ''}
                      onChange={e => setAuthSettings({...authSettings, signup: {...authSettings.signup, title: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                      placeholder="Signup Subtitle"
                      value={authSettings?.signup?.subtitle || ''}
                      onChange={e => setAuthSettings({...authSettings, signup: {...authSettings.signup, subtitle: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 h-20"
                    />
                    <input
                      placeholder="Button Text"
                      value={authSettings?.signup?.buttonText || ''}
                      onChange={e => setAuthSettings({...authSettings, signup: {...authSettings.signup, buttonText: e.target.value}})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Palette className="mr-2 text-pink-600" />
                Visual Styles
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input type="color" value={authSettings?.styling?.primaryColor || '#2596be'} onChange={e => setAuthSettings({...authSettings, styling: {...authSettings.styling, primaryColor: e.target.value}})} className="w-10 h-10 bg-transparent rounded cursor-pointer border-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input type="color" value={authSettings?.styling?.buttonTextColor || '#ffffff'} onChange={e => setAuthSettings({...authSettings, styling: {...authSettings.styling, buttonTextColor: e.target.value}})} className="w-10 h-10 bg-transparent rounded cursor-pointer border-none" />
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5 mr-3" /> Save All Settings</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {targetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                <AlertTriangle size={32} />
              </div>
              <button onClick={() => setTargetToDelete(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Account Deletion</h3>
            <p className="text-gray-500 mb-8 font-medium">
              You are deleting <span className="text-red-600 font-bold">{targetToDelete}</span>. 
              Please verify your admin credentials to proceed.
            </p>

            <form onSubmit={handleConfirmDelete} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Admin Email</label>
                <input
                  type="email"
                  required
                  value={confirmCreds.email}
                  onChange={e => setConfirmCreds({...confirmCreds, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="verify your identity"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Admin Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmCreds.password}
                    onChange={e => setConfirmCreds({...confirmCreds, password: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-1 text-right">
                  <button 
                    type="button" 
                    onClick={handleResetForDelete}
                    className="text-[10px] text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTargetToDelete(null)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirming}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-600/20 flex items-center justify-center disabled:opacity-50"
                >
                  {confirming ? <Loader2 className="animate-spin" /> : 'Confirm Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
