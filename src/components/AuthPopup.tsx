import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, LogOut, Loader2, LayoutDashboard, ChevronRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  styling: {
    link_color: string;
    link_active_color: string;
    navbar_bg: string;
  };
}

export default function AuthPopup({ isOpen, onClose, styling }: AuthPopupProps) {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'login' | 'signup' | 'profile' | 'forgot-password'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  
  // Dynamic Settings
  const [authSettings, setAuthSettings] = useState<any>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>(['abhidagar6319@gmail.com']);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setView('profile');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setView('profile');
      else setView('login');
    });

    // Fetch Dynamic Settings
    const fetchSettings = async () => {
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');
      
      if (settingsData) {
        const auth = settingsData.find(s => s.setting_key === 'auth_settings')?.setting_value;
        const admins = settingsData.find(s => s.setting_key === 'admin_emails')?.setting_value;
        if (auth) setAuthSettings(auth);
        if (admins) setAdminEmails(admins);
      }
    };
    fetchSettings();

    return () => subscription.unsubscribe();
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
    setInlineError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInlineError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('password') || error.message.toLowerCase().includes('invalid')) {
        setInlineError('Incorrect email or password');
      }
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      resetForm();
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else if (data.session) {
      toast.success('Registration successful! Click the profile icon to see your info.');
      resetForm();
    } else {
      toast.success('Check your email for verification!');
      resetForm();
      setView('login');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    setLoading(true);
    const origin = window.location.origin.includes('localhost') 
      ? 'http://localhost:3000' 
      : 'https://eternaventures.vercel.app';
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset link sent to your email!');
      setView('login');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    onClose();
  };

  const isAdmin = session?.user?.email && adminEmails.includes(session.user.email);
  const displayName = session?.user?.user_metadata?.full_name || (isAdmin ? 'Admin' : 'User');

  if (!isOpen) return null;

  const currentSettings = view === 'login' ? authSettings?.login : authSettings?.signup;
  const primaryColor = authSettings?.styling?.primaryColor || '#2596be';
  const buttonTextColor = authSettings?.styling?.buttonTextColor || '#ffffff';
  const popupBg = authSettings?.styling?.popupBg || 'bg-black/95';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className={`absolute top-full mt-4 w-[calc(100vw-2rem)] md:w-80 -right-4 md:right-0 ${popupBg} backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]`}
        style={{ 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
          maxWidth: '320px'
        }}
      >
        <div className="p-6">
          {view === 'profile' && session ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}30` }}>
                  <User style={{ color: primaryColor }} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Hi, {displayName}</h3>
                  <p className="text-gray-400 text-xs truncate max-w-[150px]">{session.user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                {isAdmin && (
                  <button
                    onClick={() => { window.location.href = '/admin'; onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm tracking-wide transition-all transform active:scale-95 shadow-lg"
                    style={{ 
                      backgroundColor: primaryColor, 
                      color: buttonTextColor,
                      boxShadow: `0 10px 15px -3px ${primaryColor}40` 
                    }}
                  >
                    <div className="flex items-center">
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      Go to Dashboard
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 rounded-xl border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-400" />
                  Logout
                </button>
              </div>
            </div>
          ) : view === 'forgot-password' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Reset Password</h3>
                <p className="text-gray-400 text-xs mt-1">Enter your email and we'll send you a link</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center"
                  style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
              <div className="text-center">
                <button
                  onClick={() => setView('login')}
                  className="text-gray-400 text-xs hover:text-white transition-colors underline underline-offset-4"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  {currentSettings?.title || (view === 'login' ? 'Welcome Back' : 'Join Us')}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {currentSettings?.subtitle || (view === 'login' ? 'Access your dashboard & settings' : 'Create an account to get started')}
                </p>
              </div>

              <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
                {view === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white text-sm focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {inlineError && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1 -mt-2">
                    {inlineError}
                  </p>
                )}
                
                {view === 'login' && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setView('forgot-password')}
                      className="text-[10px] text-gray-500 hover:text-white transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
                  style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (currentSettings?.buttonText || (view === 'login' ? 'Sign In' : 'Create Account'))}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => { setView(view === 'login' ? 'signup' : 'login'); resetForm(); }}
                  className="text-gray-400 text-xs hover:text-white transition-colors underline underline-offset-4"
                >
                  {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white/5 px-6 py-3 border-t border-white/5">
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
            Eterna Ventures Auth System
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
