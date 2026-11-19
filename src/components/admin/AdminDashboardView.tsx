import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import { OccupancyBar } from '../common/OccupancyBar';
import {
  ShieldAlert,
  Activity,
  Sliders,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  CloudRain,
  Flame,
  AlertOctagon,
  Users,
  Bus,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    shuttles,
    simulation,
    setSpeedMultiplier,
    setTraffic,
    togglePeakHour,
    toggleRain,
    resetSimulation,
    triggerNotification,
  } = useSimulation();

  const totalPassengers = shuttles.reduce((a, b) => a + b.passengerCount, 0);
  const totalCapacity = shuttles.reduce((a, b) => a + b.capacity, 0);
  const overcrowdedStops = CAMPUS_STOPS.filter(s => s.currentCrowdCount > 40);

  const handleTriggerEmergencyDiversion = () => {
    triggerNotification({
      title: 'EMERGENCY FLEET DIVERSION',
      message: 'Route 101 shuttles temporarily diverted via Central Library perimeter.',
      category: 'route',
      severity: 'alert',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Campus Transit Authority (Admin Mode)
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fleet Command & Simulation Controls</h2>
          <p className="text-sm text-slate-400 mt-1">
            Global monitoring of vehicle health, overcrowding alarms, and master simulation rate orchestration.
          </p>
        </div>

        <button
          onClick={resetSimulation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-sky-400" />
          Reset Simulation Engine
        </button>
      </div>

      {/* Master Simulation Orchestration Matrix */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0e2246] rounded-3xl p-6 border border-sky-500/30 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Master Simulation Telemetry Controls
          </h3>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
            Engine Heartbeat: Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Speed Multiplier */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="text-xs text-slate-400 font-semibold">Simulation Speed:</div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'Pause', val: 0, icon: Pause },
                { label: '1x', val: 1, icon: Play },
                { label: '2x', val: 2, icon: FastForward },
                { label: '5x', val: 5, icon: FastForward },
              ].map(s => (
                <button
                  key={s.val}
                  onClick={() => setSpeedMultiplier(s.val)}
                  className={`py-2 text-xs font-bold rounded-xl border flex flex-col items-center justify-center transition-all ${
                    simulation.speedMultiplier === s.val
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Traffic Density */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="text-xs text-slate-400 font-semibold">Global Traffic Congestion:</div>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Normal', 'Moderate', 'Heavy', 'Light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTraffic(t)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all ${
                    simulation.traffic === t
                      ? 'bg-sky-500 text-white border-sky-400'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Weather Toggle */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="text-xs text-slate-400 font-semibold">Monsoon & Weather:</div>
            <button
              onClick={toggleRain}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                simulation.isRaining
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              {simulation.isRaining ? 'Rain Active (-15% Speed)' : 'Toggle Rain Conditions'}
            </button>
          </div>

          {/* Peak Rush Toggle */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="text-xs text-slate-400 font-semibold">Campus Peak Flow:</div>
            <button
              onClick={togglePeakHour}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                simulation.isPeakHour
                  ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/25'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              {simulation.isPeakHour ? 'Peak Surge Active' : 'Activate Peak Surge'}
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Overview Table */}
      <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bus className="w-4 h-4 text-sky-400" />
            Live Fleet Status Grid ({shuttles.length} Vehicles)
          </h3>
          <span className="text-xs text-slate-400">
            Total Passengers: <strong className="text-white">{totalPassengers} / {totalCapacity}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Vehicle</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Next Stop</th>
                <th className="py-3 px-4">Load Factor</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {shuttles.map(shuttle => {
                const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
                const nextStop = CAMPUS_STOPS.find(s => s.id === shuttle.nextStopId);

                return (
                  <tr key={shuttle.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{shuttle.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold" style={{ color: route?.color }}>
                        {route?.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{shuttle.driverName}</td>
                    <td className="py-3.5 px-4 font-medium">{nextStop?.name}</td>
                    <td className="py-3.5 px-4 w-44">
                      <OccupancyBar
                        current={shuttle.passengerCount}
                        capacity={shuttle.capacity}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {shuttle.batteryPercent}%
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={shuttle.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Chokepoints & Bottleneck Alarms */}
      <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          Stop Congestion Bottleneck Alarms ({overcrowdedStops.length} Flagged)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {overcrowdedStops.map(stop => (
            <div
              key={stop.id}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span>{stop.code}</span>
                <span className="bg-rose-500/20 px-2 py-0.5 rounded-full">High Wait Time</span>
              </div>
              <div className="text-sm font-bold text-white">{stop.name}</div>
              <div className="text-xs text-slate-300">
                Current Queue: <strong className="text-rose-400">{stop.currentCrowdCount} students</strong>
              </div>
              <button
                onClick={handleTriggerEmergencyDiversion}
                className="w-full mt-2 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Dispatch Standby Shuttle S-302
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
