import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, KeyRound, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your registered student email address.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message || 'Password reset link sent to your registered email.');
    } else {
      setErrorMsg(result.error || 'Failed to dispatch password recovery link.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl p-6 md:p-8 border border-sky-500/30 shadow-2xl space-y-5 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-white">Reset Password</h3>
          <p className="text-xs text-slate-400">
            Enter your registered university email to receive a password recovery link.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Registered Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="student@lpu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl pl-10 pr-3.5 py-3 border border-slate-700/80 focus:outline-none focus:border-sky-400 placeholder-slate-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
          >
            {loading ? 'Sending Recovery Link...' : 'Send Password Reset Link'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs font-semibold text-slate-400 hover:text-sky-300 transition-colors"
          >
            Remembered your password? Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
