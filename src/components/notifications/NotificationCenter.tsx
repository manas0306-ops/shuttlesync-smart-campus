import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SystemNotification } from '../../types';
import {
  Bell,
  CheckCheck,
  Navigation2,
  AlertTriangle,
  Users,
  Info,
  Clock,
  Trash2,
  Send,
  Sparkles,
} from 'lucide-react';

interface NotificationCenterProps {
  onNavigateToTarget?: (shuttleId?: string, stopId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigateToTarget,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    triggerNotification,
    setSelectedShuttleId,
    setSelectedStopId,
  } = useSimulation();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.category === activeFilter;
  });

  const handleActionClick = (notif: SystemNotification) => {
    markNotificationRead(notif.id);
    if (notif.shuttleId) setSelectedShuttleId(notif.shuttleId);
    if (notif.stopId) setSelectedStopId(notif.stopId);
    if (onNavigateToTarget) onNavigateToTarget(notif.shuttleId, notif.stopId);
  };

  const sendTestAlert = (type: 'approaching' | 'delay' | 'crowd' | 'route') => {
    switch (type) {
      case 'approaching':
        triggerNotification({
          title: 'Shuttle S-101 Approaching',
          message: 'Blue Express is 40 seconds away from Engineering Tower Stop.',
          category: 'approaching',
          severity: 'info',
          shuttleId: 'shuttle-s101',
          stopId: 'stop-engg-block',
        });
        break;
      case 'delay':
        triggerNotification({
          title: 'Traffic Delay Notice',
          message: 'Campus loop facing 6 min congestion near North Metro Gate.',
          category: 'delay',
          severity: 'alert',
          stopId: 'stop-north-gate',
        });
        break;
      case 'crowd':
        triggerNotification({
          title: 'Shuttle S-201 Capacity Full',
          message: 'CampusMaxi has reached 34/34 capacity. Please consider walking or Route 303.',
          category: 'crowd',
          severity: 'warning',
          shuttleId: 'shuttle-s201',
        });
        break;
      case 'route':
        triggerNotification({
          title: 'Smart Stop Advisory',
          message: 'Save 8 mins: Walk 200m to Library Stop instead of waiting at SAC.',
          category: 'route',
          severity: 'success',
          stopId: 'stop-central-lib',
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5" />
            Live Dispatch Feeds
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Campus Notifications & Alert Center</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time advisory broadcasts for approaching shuttles, high crowd density, delays, and smart routes.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'approaching', label: 'Approaching' },
          { id: 'delay', label: 'Delays' },
          { id: 'crowd', label: 'Crowd Warnings' },
          { id: 'route', label: 'Route Advisories' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-4 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No notifications matching this filter category.
          </div>
        ) : (
          filteredNotifications.map(notif => {
            let Icon = Info;
            let iconBg = 'bg-slate-800 text-slate-300';

            if (notif.category === 'approaching') {
              Icon = Navigation2;
              iconBg = 'bg-sky-500/20 text-sky-400';
            } else if (notif.category === 'delay') {
              Icon = AlertTriangle;
              iconBg = 'bg-rose-500/20 text-rose-400';
            } else if (notif.category === 'crowd') {
              Icon = Users;
              iconBg = 'bg-amber-500/20 text-amber-400';
            } else if (notif.category === 'route') {
              Icon = Sparkles;
              iconBg = 'bg-emerald-500/20 text-emerald-400';
            }

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  notif.read
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
                    : 'bg-slate-800/60 border-sky-500/30 shadow-md shadow-sky-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 animate-ping" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">{notif.timestamp}</span>
                  </div>
                </div>

                {(notif.shuttleId || notif.stopId) && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleActionClick(notif);
                    }}
                    className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation2 className="w-3.5 h-3.5" />
                    Inspect on Map
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Simulation Broadcast Sandbox */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-sky-400" />
            Dispatch Broadcast Test Sandbox (Faculty / Evaluator Testing)
          </div>
          <span className="text-[10px] text-slate-500">Tap to fire dynamic alerts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => sendTestAlert('approaching')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold border border-slate-700 transition-colors"
          >
            ⚡ Approaching Alert
          </button>
          <button
            onClick={() => sendTestAlert('delay')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold border border-slate-700 transition-colors"
          >
            ⚠️ Delay Alert
          </button>
          <button
            onClick={() => sendTestAlert('crowd')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition-colors"
          >
            👥 Full Capacity Alert
          </button>
          <button
            onClick={() => sendTestAlert('route')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors"
          >
            💡 Stop Recommendation
          </button>
        </div>
      </div>
    </div>
  );
};
