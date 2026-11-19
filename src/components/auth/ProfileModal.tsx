import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Hash,
  Lock,
  KeyRound,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Star,
  Bookmark,
  Calendar,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, signOut, updatePassword, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'details' | 'security' | 'preferences'>('details');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !user) return null;

  const initials = user.fullName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySuccess('');
    setSecurityError('');

    if (newPassword.length < 8) {
      setSecurityError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError('New password and confirmation do not match.');
      return;
    }

    setUpdating(true);
    const result = await updatePassword(newPassword);
    setUpdating(false);

    if (result.success) {
      setSecuritySuccess('Password successfully updated for your account!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSecurityError(result.error || 'Failed to update password.');
    }
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl p-6 md:p-8 border border-sky-500/30 shadow-2xl space-y-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-xl shadow-sky-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-sky-400">
              {initials}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">{user.fullName}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {user.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Reg ID: {user.studentId}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'details'
                ? 'bg-sky-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-sky-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preferences'
                ? 'bg-sky-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Favorites & Settings
          </button>
        </div>

        {/* Tab 1: Details */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">University</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">Lovely Professional University</span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Campus Transit Pass</span>
                <span className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
                </span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Registered Student ID</span>
                <span className="text-slate-200 font-mono font-bold mt-0.5 block">{user.studentId}</span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Member Since</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Session Persistence:</span>
              <span className="text-sky-400 font-semibold">Active (Token Auto-Refreshed)</span>
            </div>
          </div>
        )}

        {/* Tab 2: Security (Change Password) */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
            <p className="text-slate-400">
              Update your account's single password credential. Changing your password updates your existing student profile.
            </p>

            {securityError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{securityError}</span>
              </div>
            )}
            {securitySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{securitySuccess}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-300 block">New Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-700/80 focus:outline-none focus:border-sky-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 block">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950/70 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-700/80 focus:outline-none focus:border-sky-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
            >
              {updating ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {/* Tab 3: Preferences */}
        {activeTab === 'preferences' && (
          <div className="space-y-3 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-slate-300 block flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-sky-400" /> Favorite Pickup Stops
              </label>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>● Block 32-34 Central Library (ST-02)</span>
                  <span className="text-[10px] text-emerald-400">Primary Pickup</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>● Uni-Mall Central Food Square (ST-03)</span>
                  <span className="text-[10px] text-sky-400">Evening Stop</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-slate-400">
              <span>Arrival SMS / Push Alerts</span>
              <span className="text-emerald-400 font-semibold">Enabled</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
