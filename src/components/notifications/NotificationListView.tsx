import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Bell,
  AlertTriangle,
  Clock,
  Radio,
  CheckCircle2,
  Trash2,
  Send,
  Users,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const NotificationListView: React.FC = () => {
  const { userRole, shuttles } = useSimulation();

  const [filter, setFilter] = useState<'all' | 'delays' | 'crowd' | 'broadcasts'>('all');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 'alt-1',
      type: 'delay',
      title: 'Shuttle S-301 Delay Notice',
      message: 'Experiencing 5 min traffic delay near Boys Hostel BH-4 central lawns due to morning gate congestion.',
      time: '3 mins ago',
      read: false,
      route: 'R-303 Hostel Connector',
    },
    {
      id: 'alt-2',
      type: 'crowd',
      title: 'High Crowd Density at Uni-Mall Square',
      message: 'Uni-Mall Stop (ST-03) has 58 waiting passengers. Consider boarding at Block 34 Central Library for faster seating.',
      time: '12 mins ago',
      read: false,
      route: 'R-101 Campus Express',
    },
    {
      id: 'alt-3',
      type: 'broadcast',
      title: 'Examination Schedule Special Transit Service',
      message: 'Peak frequency active: all shuttles running at 5-minute intervals between Gate 1 NH-44 and Block 38 Engineering Quad.',
      time: '35 mins ago',
      read: true,
      route: 'All Routes',
    },
    {
      id: 'alt-4',
      type: 'delay',
      title: 'Rain Weather Advisory Active',
      message: 'Wet asphalt protocol active. Vehicle speeds capped at 22 km/h for student commute safety.',
      time: '1 hour ago',
      read: true,
      route: 'All Routes',
    },
  ]);

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    const newAlert = {
      id: `alt-${Date.now()}`,
      type: 'broadcast' as const,
      title: broadcastTitle,
      message: broadcastMessage,
      time: 'Just now',
      read: false,
      route: 'All Routes',
    };

    setAlerts([newAlert, ...alerts]);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setShowBroadcastForm(false);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'delays') return a.type === 'delay';
    if (filter === 'crowd') return a.type === 'crowd';
    if (filter === 'broadcasts') return a.type === 'broadcast';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            System Notifications & Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational transit advisories, shuttle delays, crowd warnings, and university dispatch messages
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole !== 'student' && (
            <button
              onClick={() => setShowBroadcastForm(!showBroadcastForm)}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {showBroadcastForm ? 'Cancel Dispatch' : 'New Dispatch Broadcast'}
            </button>
          )}

          <button
            onClick={handleMarkAllRead}
            className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Broadcast Form (If opened by Admin or Driver) */}
      {showBroadcastForm && (
        <form
          onSubmit={handleSendBroadcast}
          className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
            <Radio className="w-4 h-4 text-blue-600" />
            Dispatch New Campus Advisory
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={broadcastTitle}
              onChange={e => setBroadcastTitle(e.target.value)}
              placeholder="Advisory Title (e.g., Heavy Traffic near Block 38)"
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              placeholder="Advisory message body for commuters..."
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBroadcastForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs"
            >
              Send Campus Broadcast
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
        {(['all', 'delays', 'crowd', 'broadcasts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`py-1 px-3 text-xs font-bold rounded-md capitalize transition-all ${
              filter === tab
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 flex items-start gap-3.5 transition-colors ${
                !alert.read ? 'bg-blue-50/30' : 'hover:bg-slate-50/60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  alert.type === 'delay'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : alert.type === 'crowd'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}
              >
                {alert.type === 'delay' ? (
                  <Clock className="w-4 h-4" />
                ) : alert.type === 'crowd' ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    {alert.title}
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                    {alert.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {alert.message}
                </p>
                <div className="text-[10px] font-semibold text-blue-600 mt-2">
                  Corridor: {alert.route}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};
