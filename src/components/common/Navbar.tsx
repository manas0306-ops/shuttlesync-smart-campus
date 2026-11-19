import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { UserRole } from '../../types';
import {
  Bus,
  Compass,
  Zap,
  Users,
  Sparkles,
  MapPin,
  Bell,
  BarChart3,
  Car,
  ShieldAlert,
  Volume2,
  VolumeX,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const {
    shuttles,
    userRole,
    setUserRole,
    notifications,
    soundEnabled,
    toggleSound,
  } = useSimulation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'tracking', label: 'Live Radar', icon: Compass },
    { id: 'prediction', label: 'ETA Forecast', icon: Zap },
    { id: 'crowd', label: 'Crowd Monitor', icon: Users },
    { id: 'recommendations', label: 'Smart Stops', icon: Sparkles },
    { id: 'planner', label: 'Route Planner', icon: MapPin },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'designThinking', label: 'Design Thinking', icon: Sparkles },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'driver') onSelectTab('driver');
    else if (role === 'admin') onSelectTab('admin');
    else onSelectTab('tracking');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#070d1e]/90 backdrop-blur-xl border-b border-sky-500/15 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070d1e] rounded-[10px] flex items-center justify-center">
                <Bus className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white tracking-tight">ShuttleSync</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 rounded">
                  P05
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium -mt-0.5">
                Know Before You Go
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && link.badge > 0 ? (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                      {link.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Role Switcher, Sound & Notifications */}
          <div className="hidden md:flex items-center gap-2">
            {/* Role Switcher Pill */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold">
              <button
                onClick={() => handleRoleChange('student')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  userRole === 'student'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleChange('driver')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  userRole === 'driver'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Driver
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  userRole === 'admin'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
              title={soundEnabled ? 'Mute Synthetic Audio Chimes' : 'Enable Audio Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Alerts Quick Bell */}
            <button
              onClick={() => handleNavClick('notifications')}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
              title="Notification Feeds"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {/* Role selector for mobile */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Role:</span>
            <div className="flex gap-1 font-semibold">
              <button
                onClick={() => handleRoleChange('student')}
                className={`px-2.5 py-1 rounded-lg ${userRole === 'student' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleChange('driver')}
                className={`px-2.5 py-1 rounded-lg ${userRole === 'driver' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Driver
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2.5 py-1 rounded-lg ${userRole === 'admin' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border ${
                    activeTab === link.id
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                  {link.badge && link.badge > 0 ? (
                    <span className="ml-auto w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {link.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
