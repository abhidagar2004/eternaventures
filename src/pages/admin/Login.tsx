import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authSettings, setAuthSettings] = useState<any>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'auth_settings')
        .single();
      if (data) setAuthSettings(data.setting_value);
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInlineError(null);
    try {
      if (isLogin === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully');
        navigate('/');
      } else if (isLogin === 'register') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          toast.success('Registration successful!');
          navigate('/');
        } else {
          toast.success('Check your email for verification!');
          setIsLogin('login');
        }
      } else {
        const origin = window.location.origin.includes('localhost') 
          ? 'http://localhost:3000' 
          : 'https://eternaventures.vercel.app';
          
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/reset-password`,
        });
        if (error) throw error;
        toast.success('Reset link sent to your email!');
        setIsLogin('login');
      }
    } catch (error: any) {
      if (isLogin === 'login' && (error.message.toLowerCase().includes('password') || error.message.toLowerCase().includes('invalid'))) {
        setInlineError('Incorrect email or password');
      }
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = authSettings?.styling?.primaryColor || '#2596be';
  const buttonTextColor = authSettings?.styling?.buttonTextColor || '#ffffff';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin === 'login' ? 'Sign In' : isLogin === 'register' ? 'Create an Account' : 'Reset Password'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border text-gray-900"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {isLogin !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required={isLogin !== 'reset'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                {inlineError && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {inlineError}
                  </p>
                )}
                {isLogin === 'login' && (
                  <div className="mt-1 text-right">
                    <button type="button" onClick={() => setIsLogin('reset')} className="text-xs text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{ backgroundColor: primaryColor, color: buttonTextColor }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin === 'login' ? 'Sign in' : isLogin === 'register' ? 'Register' : 'Send reset link')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(isLogin === 'login' ? 'register' : 'login');
                setInlineError(null);
              }}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {isLogin === 'login' ? "Don't have an account? Register here" : isLogin === 'register' ? "Already have an account? Sign in" : "Back to sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
