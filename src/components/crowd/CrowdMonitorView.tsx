import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import { OccupancyBar } from '../common/OccupancyBar';
import { CrowdLevel } from '../../types';
import {
  Users,
  AlertCircle,
  TrendingUp,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  CheckCircle,
} from 'lucide-react';

export const CrowdMonitorView: React.FC = () => {
  const {
    shuttles,
    simulation,
    togglePeakHour,
    updatePassengerCount,
  } = useSimulation();

  // Fleet wide totals
  const totalPassengers = shuttles.reduce((acc, s) => acc + s.passengerCount, 0);
  const totalCapacity = shuttles.reduce((acc, s) => acc + s.capacity, 0);
  const fleetOccupancyPercent = Math.round((totalPassengers / totalCapacity) * 100);

  const getCrowdLevel = (current: number, capacity: number): CrowdLevel => {
    const p = (current / capacity) * 100;
    if (p >= 90) return 'Full';
    if (p >= 70) return 'High';
    if (p >= 40) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Live Capacity Diagnostics
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Crowd Monitoring System</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time passenger volume tracking, boarding choke point detection, and occupancy simulations.
          </p>
        </div>

        {/* Peak Hour Surge Simulation Toggle */}
        <button
          onClick={togglePeakHour}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg active:scale-95 ${
            simulation.isPeakHour
              ? 'bg-rose-500 text-white shadow-rose-500/25 border border-rose-400'
              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600'
          }`}
        >
          <Flame className={`w-4 h-4 ${simulation.isPeakHour ? 'text-amber-200 animate-bounce' : 'text-slate-400'}`} />
          {simulation.isPeakHour ? 'Peak Hour Surge: ON (1.8x Load)' : 'Simulate Peak Hour Rush'}
        </button>
      </div>

      {/* Fleet Summary Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Fleet Passenger Count</div>
          <div className="text-3xl font-black text-white tabular-nums">
            {totalPassengers} <span className="text-sm font-semibold text-slate-500">/ {totalCapacity}</span>
          </div>
          <div className="text-[11px] text-sky-400 mt-2 font-medium">
            {totalCapacity - totalPassengers} open seats campus-wide
          </div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Fleet Occupancy Rate</div>
          <div className="text-3xl font-black text-sky-400 tabular-nums">
            {fleetOccupancyPercent}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${fleetOccupancyPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Peak-Hour Index</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-black ${simulation.isPeakHour ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simulation.isPeakHour ? 'SURGE (High)' : 'NORMAL (Off-Peak)'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {simulation.isPeakHour ? 'Lecture dispersal active' : 'Steady state flow'}
          </div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Crowd Levels Guide</div>
          <div className="grid grid-cols-2 gap-1.5 mt-1 text-[11px]">
            <span className="text-emerald-400 font-medium">● Low: Plenty seats</span>
            <span className="text-sky-400 font-medium">● Mod: Comfortable</span>
            <span className="text-amber-400 font-medium">● High: Standing</span>
            <span className="text-rose-400 font-medium">● Full: Avoid</span>
          </div>
        </div>
      </div>

      {/* Shuttle Fleet Real-Time Cards with Interactive Controls */}
      <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            Live Shuttle Occupancy Breakdown & Interactive Controls
          </h3>
          <span className="text-xs text-slate-400">
            Use <strong className="text-sky-400">+ / -</strong> to adjust passenger counts instantly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuttles.map(shuttle => {
            const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
            const crowd = getCrowdLevel(shuttle.passengerCount, shuttle.capacity);

            return (
              <div
                key={shuttle.id}
                className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/60 hover:border-slate-600 transition-all space-y-4"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: route?.color || '#0284c7' }}
                      />
                      <h4 className="text-sm font-bold text-white">{shuttle.name}</h4>
                    </div>
                    <span className="text-xs text-slate-400">{route?.name}</span>
                  </div>
                  <Badge crowdLevel={crowd} />
                </div>

                {/* Occupancy Bar */}
                <OccupancyBar
                  current={shuttle.passengerCount}
                  capacity={shuttle.capacity}
                  size="md"
                />

                {/* Interactive Simulation Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updatePassengerCount(shuttle.id, -1)}
                      disabled={shuttle.passengerCount <= 0}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 transition-colors"
                      title="Remove 1 Passenger"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updatePassengerCount(shuttle.id, 1)}
                      disabled={shuttle.passengerCount >= shuttle.capacity}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 transition-colors"
                      title="Add 1 Passenger"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updatePassengerCount(shuttle.id, 5)}
                      disabled={shuttle.passengerCount >= shuttle.capacity}
                      className="px-2 py-1 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 text-xs font-semibold transition-colors"
                      title="Add 5 Passengers"
                    >
                      +5 Boarding
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updatePassengerCount(shuttle.id, shuttle.capacity, true)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-colors"
                    >
                      Set Full
                    </button>
                    <button
                      onClick={() => updatePassengerCount(shuttle.id, 4, true)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors"
                    >
                      Empty
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campus Stops Waiting Crowd Overview */}
      <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          Physical Stop Waiting Crowd Index (Simulated Sensor Feeds)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {CAMPUS_STOPS.map(stop => {
            let crowdStatus = 'Normal';
            let badgeBg = 'bg-slate-800 text-slate-300';
            if (stop.currentCrowdCount > 50) {
              crowdStatus = 'Overcrowded';
              badgeBg = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
            } else if (stop.currentCrowdCount > 30) {
              crowdStatus = 'Busy';
              badgeBg = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
            } else {
              crowdStatus = 'Calm';
              badgeBg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
            }

            return (
              <div
                key={stop.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>{stop.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeBg}`}>
                      {crowdStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium truncate">{stop.name}</div>
                </div>
                <div className="mt-3 flex items-baseline justify-between text-xs text-slate-400">
                  <span>Waiting at stop:</span>
                  <span className="text-sm font-bold text-sky-400">{stop.currentCrowdCount} students</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
