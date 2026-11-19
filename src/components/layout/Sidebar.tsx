import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import {
  LayoutDashboard,
  MapPin,
  Route,
  Bus,
  Users,
  GraduationCap,
  PieChart,
  Bell,
  BarChart3,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Car,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenProfile,
}) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { userRole, setUserRole } = useSimulation();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live-map', label: 'Live Map', icon: MapPin },
    { id: 'routes', label: 'Route Management', icon: Route },
    { id: 'fleet', label: 'Shuttle Fleet', icon: Bus },
    { id: 'drivers', label: 'Drivers', icon: Car },
    { id: 'students', label: 'Student Hub', icon: GraduationCap },
    { id: 'occupancy', label: 'Passenger Occupancy', icon: PieChart },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <button
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 text-left focus:outline-none overflow-hidden"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Bus className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                ShuttleSync
                <span className="text-[10px] font-bold text-blue-400 bg-blue-900/50 px-1.5 py-0.5 rounded border border-blue-700/50">2.0</span>
              </span>
              <span className="text-[10px] text-slate-400 block tracking-tight truncate">
                LPU Transit System
              </span>
            </div>
          )}
        </button>

        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors focus:outline-none"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill Switcher (If not collapsed) */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/60">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Current Workspace Role
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['student', 'driver', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`py-1 text-[11px] font-semibold rounded capitalize transition-all ${
                  userRole === role
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'live-map' && activeTab === 'tracking') ||
            (item.id === 'students' && activeTab === 'dashboard');

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-800 text-blue-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip on Collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 rounded bg-slate-950 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-slate-800">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}

        {/* Design Thinking Link */}
        <div className="pt-3 mt-3 border-t border-slate-800/60">
          <button
            onClick={() => onSelectTab('design-thinking')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
              activeTab === 'design-thinking'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/70'
            }`}
            title={isCollapsed ? 'INT335 Design Thinking' : undefined}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-emerald-400" />
            {!isCollapsed && <span className="flex-1 text-left truncate">Design Thinking P05</span>}
          </button>
        </div>
      </nav>

      {/* User / Session Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity"
              title="View Account Profile"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
                {user.fullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
                  <div className="text-[10px] text-slate-400 truncate">ID: {user.studentId || 'LPU-STD'}</div>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <button
                onClick={signOut}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div>
            {!isCollapsed ? (
              <button
                onClick={onOpenProfile}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={onOpenProfile}
                className="w-full p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
                title="Sign In"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
