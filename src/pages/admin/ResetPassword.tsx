import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, Loader2, KeyRound } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <KeyRound className="text-blue-500 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Update Password</h1>
            <p className="text-gray-400 mt-2 text-sm">Secure your account with a new password</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Confirm New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
