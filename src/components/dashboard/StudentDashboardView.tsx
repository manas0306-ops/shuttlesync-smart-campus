import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { GoogleCampusMap } from '../map/GoogleCampusMap';
import { Badge } from '../common/Badge';
import { OccupancyBar } from '../common/OccupancyBar';
import {
  Compass,
  Zap,
  Users,
  MapPin,
  Clock,
  Bookmark,
  History,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Bell,
  Navigation,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface StudentDashboardViewProps {
  onNavigateTab: (tabId: string) => void;
  onOpenProfile: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onNavigateTab,
  onOpenProfile,
}) => {
  const { user } = useAuth();
  const {
    shuttles,
    simulation,
    selectedStopId,
    setSelectedStopId,
    setSelectedShuttleId,
    notifications,
  } = useSimulation();

  const [savedFavorites, setSavedFavorites] = useState([
    {
      id: 'fav-1',
      title: 'Hostel BH-3 to Block 34 Library',
      from: 'Boys Hostel Residential Zone (BH 1-7)',
      to: 'Central Library & CS Block (Block 32-34)',
      route: 'Route 101: GT Road Express',
      estTime: '7 mins',
    },
    {
      id: 'fav-2',
      title: 'Block 38 Labs to Uni-Mall Food Court',
      from: 'Block 36-38 Engineering Quad & Robotics',
      to: 'Uni-Mall & Central Student Square',
      route: 'Route 303: Hostel-Academics Link',
      estTime: '5 mins',
    },
  ]);

  const recentJourneys = [
    {
      id: 'rec-1',
      date: 'Today, 09:15 AM',
      from: 'LPU Main Gate 1',
      to: 'Block 34 Library',
      shuttle: 'Shuttle S-101',
      status: 'Completed',
    },
    {
      id: 'rec-2',
      date: 'Yesterday, 05:40 PM',
      from: 'Uni-Mall & Central Student Square',
      to: 'Boys Hostel Complex (BH 1-7)',
      shuttle: 'Shuttle S-301',
      status: 'Completed',
    },
  ];

  // Next arriving shuttle to the user's selected or favorite stop
  const favoriteStop = CAMPUS_STOPS.find(s => s.id === selectedStopId) || CAMPUS_STOPS[1];
  const incomingShuttles = shuttles
    .map(shuttle => {
      const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
      if (!route?.stops.includes(favoriteStop.id)) return null;
      return {
        shuttle,
        route,
        etaMinutes: Math.max(1, Math.ceil(shuttle.estimatedTimeToNextStop / 60)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.etaMinutes - b!.etaMinutes) as Array<{
      shuttle: typeof shuttles[0];
      route: typeof SHUTTLE_ROUTES[0];
      etaMinutes: number;
    }>;

  const nextShuttle = incomingShuttles[0];

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0b1b3d] via-[#09152e] to-[#06263b] rounded-3xl p-6 md:p-8 border border-sky-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>LOVELY PROFESSIONAL UNIVERSITY • STUDENT COMMUTER HUB</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.fullName || 'LPU Commuter'}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              Registration ID: <strong className="text-sky-400 font-mono">{user?.studentId || '12214589'}</strong> • Active Transit Pass Verified
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('planner')}
              className="py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4" /> Plan Campus Route
            </button>
            <button
              onClick={onOpenProfile}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              My Profile
            </button>
          </div>
        </div>

        {/* Live Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Arriving Bus</span>
            <span className="text-xl font-black text-white">
              {nextShuttle ? `~${nextShuttle.etaMinutes} min` : '5 min'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Favorite Stop</span>
            <span className="text-sm font-bold text-sky-400 truncate block">{favoriteStop.name.slice(0, 18)}...</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Campus Fleet</span>
            <span className="text-xl font-black text-emerald-400">{shuttles.length} Shuttles Active</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Traffic</span>
            <span className="text-sm font-bold text-white capitalize">{simulation.traffic} Congestion</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive LPU Map + Next Arrival Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live LPU Google Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              Live Campus Map & Vehicle Telemetry
            </h3>
            <button
              onClick={() => onNavigateTab('tracking')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              Full Screen Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <GoogleCampusMap heightClass="h-[460px]" />
        </div>

        {/* Right Column: Next Arrival Spotlight & Saved Favorites (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Next Arriving Spotlight */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-sky-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Next Arrival Spotlight
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {nextShuttle ? (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white tabular-nums">
                    {nextShuttle.etaMinutes} <span className="text-sm font-semibold text-slate-400">minutes</span>
                  </span>
                  <Badge status={nextShuttle.shuttle.status} />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-white">{nextShuttle.shuttle.name}</div>
                  <div className="text-sky-400 font-semibold">{nextShuttle.route.name}</div>
                  <div className="text-slate-400 text-[11px]">Approaching: {favoriteStop.name}</div>
                </div>

                <OccupancyBar
                  current={nextShuttle.shuttle.passengerCount}
                  capacity={nextShuttle.shuttle.capacity}
                  size="sm"
                />

                <button
                  onClick={() => {
                    setSelectedShuttleId(nextShuttle.shuttle.id);
                    onNavigateTab('tracking');
                  }}
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95"
                >
                  Track This Shuttle on Map
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No incoming shuttles scheduled in next 10 mins.</p>
            )}
          </div>

          {/* Saved Favorite Routes */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-sky-400" />
                Favorite Commute Routes
              </h3>
              <span className="text-[10px] text-slate-500">{savedFavorites.length} Saved</span>
            </div>

            <div className="space-y-2">
              {savedFavorites.map(fav => (
                <div
                  key={fav.id}
                  onClick={() => onNavigateTab('planner')}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{fav.title}</span>
                    <span className="text-sky-400">{fav.estTime}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>{fav.route}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Journeys & Notification Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Journeys History */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            Recent Campus Rides History
          </h3>

          <div className="space-y-2.5">
            {recentJourneys.map(j => (
              <div
                key={j.id}
                className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-200">
                    {j.from} → {j.to}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {j.shuttle} • {j.date}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications Quick Feed */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              Live Campus Transit Bulletins
            </h3>
            <button
              onClick={() => onNavigateTab('notifications')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.slice(0, 2).map(n => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/50 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>{n.title}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{n.timestamp}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
