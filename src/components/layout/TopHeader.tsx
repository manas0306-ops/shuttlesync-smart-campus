import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import {
  Search,
  Bell,
  User,
  Shield,
  Activity,
  Compass,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface TopHeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenProfile: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuth,
  onOpenProfile,
  searchQuery,
  onSearchChange,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { shuttles, userRole } = useSimulation();

  // Tab Title Formatting
  const getBreadcrumbTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Fleet Operations Center';
      case 'live-map':
      case 'tracking':
        return 'LPU Real-Time Live Radar';
      case 'routes':
        return 'Campus Route Management';
      case 'fleet':
        return 'Vehicle Fleet Directory';
      case 'drivers':
        return 'Driver Roster & Telemetry';
      case 'students':
      case 'dashboard':
        return 'Student Transit Hub';
      case 'occupancy':
        return 'Passenger Occupancy & Crowd Radar';
      case 'notifications':
        return 'System Dispatch & Announcements';
      case 'analytics':
        return 'Performance Analytics & Carbon Metrics';
      case 'settings':
        return 'Fleet Simulation & API Config';
      case 'design-thinking':
        return 'INT335 Design Thinking Dossier (P05)';
      default:
        return 'Fleet Management';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">
          ShuttleSync
        </div>
        <span className="text-slate-300 hidden sm:block">/</span>
        <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
          {getBreadcrumbTitle(activeTab)}
        </h1>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search shuttles, routes, stops, drivers... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: Operational Status, Role, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Live Operational Status */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{shuttles.length} Vehicles Online</span>
        </div>

        {/* Role Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 capitalize">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{userRole} Mode</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => onSelectTab('notifications')}
          className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
          title="View Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
        </button>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* User Account Capsule */}
        {isAuthenticated && user ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1 pl-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all focus:outline-none"
          >
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold text-slate-900">{user.fullName}</div>
              <div className="text-[10px] text-slate-500 font-mono">{user.studentId || user.email}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md shadow-xs transition-colors"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
