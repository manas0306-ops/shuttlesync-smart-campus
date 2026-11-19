import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bus,
  Lock,
  Mail,
  User,
  Hash,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSwitchToLogin,
  onSuccess,
  onClose,
}) => {
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-sky-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please provide a valid email format (e.g. name@lpu.in).');
      return;
    }
    if (!studentId.trim() || studentId.trim().length < 6) {
      setErrorMsg('Please enter a valid LPU Student Registration Number (min 6 digits).');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters with numbers and letters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, fullName, studentId);
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Account created successfully! Session established.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      setErrorMsg(result.error || 'Failed to create student account.');
    }
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
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/25 mb-1">
          <div className="w-full h-full bg-[#070d1e] rounded-[14px] flex items-center justify-center">
            <Bus className="w-6 h-6 text-sky-400" />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Create Student Account</h2>
        <p className="text-xs text-slate-400 font-medium">
          Register with Lovely Professional University ID
        </p>
      </div>

      {/* Error & Success Alerts */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-3.5 py-2.5 border border-slate-700/80 focus:outline-none focus:border-sky-400 placeholder-slate-500"
              required
            />
          </div>
        </div>

        {/* University Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">University Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="e.g. aarav.12214589@lpu.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-3.5 py-2.5 border border-slate-700/80 focus:outline-none focus:border-sky-400 placeholder-slate-500"
              required
            />
          </div>
        </div>

        {/* Student ID */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">Student Registration ID</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. 12214589"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-3.5 py-2.5 border border-slate-700/80 focus:outline-none focus:border-sky-400 placeholder-slate-500"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <span className="text-[10px] text-slate-400">
              Strength: <strong className="text-sky-400">{strength.label}</strong>
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 chars"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-10 py-2.5 border border-slate-700/80 focus:outline-none focus:border-sky-400 placeholder-slate-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength Bar */}
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-3.5 py-2.5 border focus:outline-none placeholder-slate-500 ${
                confirmPassword && confirmPassword !== password
                  ? 'border-rose-500/80 focus:border-rose-400'
                  : 'border-slate-700/80 focus:border-sky-400'
              }`}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Creating Student Profile...
            </span>
          ) : (
            <>
              Register & Access ShuttleSync <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sky-400 hover:text-sky-300 font-bold transition-colors ml-1"
        >
          Sign In
        </button>
      </div>
      </div>
    </div>
  );
};
