import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/spaces';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch {
      setError('Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#111,black)]" />
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-30" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4">
            <Zap size={32} className="text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">EtherAgent OS</h1>
          <p className="text-white/40 text-sm mt-2">Secure Access Portal</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/10 p-8">
          <div className="flex items-center gap-2 mb-6 text-emerald-400/80">
            <Shield size={16} />
            <span className="text-xs font-medium uppercase tracking-widest">Authentication Required</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
                placeholder="davicho4522@gmail.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access System'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-[10px] text-white/20 text-center">
              C-Suite Access: davicho4522@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
