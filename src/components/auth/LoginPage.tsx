import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bus,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSwitchToRegister,
  onForgotPassword,
  onSuccess,
  onClose,
}) => {
  const { signIn, isLiveSupabase } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your University Email or Student ID.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    const result = await signIn(identifier, password, rememberMe);
    setLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(result.error || 'Invalid credentials. Please verify your details.');
    }
  };

  const handleDemoFill = () => {
    setIdentifier('student@lpu.in');
    setPassword('Student@123');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-7 md:p-8 border border-sky-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-slate-100 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md text-sm font-bold"
          >
            ✕
          </button>
        )}
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/25 mb-1">
          <div className="w-full h-full bg-[#070d1e] rounded-[14px] flex items-center justify-center">
            <Bus className="w-7 h-7 text-sky-400" />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Sign In to ShuttleSync</h2>
        <p className="text-xs text-slate-400 font-medium">
          Lovely Professional University • Campus Mobility Portal
        </p>
      </div>

      {/* Backend Status Pill */}
      <div className="mb-4 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px]">
        <span className="text-slate-400 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isLiveSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`} />
          {isLiveSupabase ? 'Supabase Auth Backend: Live' : 'Persistent Offline Auth Active'}
        </span>
        <button
          type="button"
          onClick={handleDemoFill}
          className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" /> Quick Demo Fill
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifier (Email or Student ID) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            Email Address or Student ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. student@lpu.in or 12214589"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-3.5 py-3 border border-slate-700/80 focus:outline-none focus:border-sky-400 placeholder-slate-500"
              autoComplete="username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-10 py-3 border border-slate-700/80 focus:outline-none focus:border-sky-400 placeholder-slate-500"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-sky-500"
            />
            <span>Remember login on this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Authenticating...
            </span>
          ) : (
            <>
              Sign In to Dashboard <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Registration */}
      <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
        <span>Don't have an LPU student account? </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sky-400 hover:text-sky-300 font-bold transition-colors ml-1"
        >
          Create Account
        </button>
      </div>
      </div>
    </div>
  );
};
