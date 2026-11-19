import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import { OccupancyBar } from '../common/OccupancyBar';
import { ShuttleStatus } from '../../types';
import {
  Car,
  Bus,
  CheckCircle,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  BatteryCharging,
  Gauge,
  Navigation,
  MapPin,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const DriverPortalView: React.FC = () => {
  const {
    shuttles,
    updateShuttleStatus,
    updatePassengerCount,
    updateShuttleDelay,
    markStopReached,
    triggerNotification,
  } = useSimulation();

  const [activeShuttleId, setActiveShuttleId] = useState<string>('shuttle-s101');
  const [hazardNote, setHazardNote] = useState<string>('');

  const assignedShuttle = shuttles.find(s => s.id === activeShuttleId) || shuttles[0];
  const route = SHUTTLE_ROUTES.find(r => r.id === assignedShuttle.routeId);
  const nextStop = CAMPUS_STOPS.find(s => s.id === assignedShuttle.nextStopId);
  const currentStop = CAMPUS_STOPS.find(s => s.id === assignedShuttle.currentStopId);

  const handleReportHazard = () => {
    if (!hazardNote.trim()) return;
    triggerNotification({
      title: `Driver Hazard Broadcast (${assignedShuttle.name})`,
      message: hazardNote,
      category: 'delay',
      severity: 'warning',
      shuttleId: assignedShuttle.id,
      stopId: assignedShuttle.currentStopId,
    });
    setHazardNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
            <Car className="w-3.5 h-3.5" />
            Operator In-Cab Console
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Driver Control Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">
            Tactile touch console for real-time passenger counts, waypoint arrivals, and route headway reporting.
          </p>
        </div>

        {/* Assigned Vehicle Selector */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400 font-medium ml-2">Active Vehicle:</span>
          <select
            value={activeShuttleId}
            onChange={e => setActiveShuttleId(e.target.value)}
            className="bg-slate-900 text-sky-400 font-bold text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none cursor-pointer"
          >
            {shuttles.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.driverName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Touch Cockpit Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Waypoint & Live Passenger Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Large Reached Stop Action */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 rounded-3xl p-6 border border-sky-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-sky-400 font-bold uppercase tracking-wider">
                <Navigation className="w-4 h-4 animate-pulse" />
                Current Waypoint En Route
              </span>
              <span>Next Scheduled Destination</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">From: {currentStop?.name}</div>
                <div className="text-2xl font-black text-white mt-1">
                  {nextStop?.name || 'Next Terminal'}
                </div>
              </div>
              <div className="text-right">
                <Badge status={assignedShuttle.status} />
                <div className="text-xs text-slate-400 mt-1">
                  Speed: <strong className="text-white">{assignedShuttle.speedKmh} km/h</strong>
                </div>
              </div>
            </div>

            {/* Big Touch Button to Mark Reached */}
            <button
              onClick={() => markStopReached(assignedShuttle.id)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 transition-all active:scale-95"
            >
              <CheckCircle className="w-5 h-5 text-slate-950" />
              TAP WHEN ARRIVED AT {nextStop?.code} ({nextStop?.name.slice(0, 15)}...)
            </button>
          </div>

          {/* Passenger Boarding / Alighting Tactile Pad */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Passenger Count Touchpad
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Max Capacity: <strong className="text-white">{assignedShuttle.capacity} seats</strong>
              </span>
            </div>

            <OccupancyBar
              current={assignedShuttle.passengerCount}
              capacity={assignedShuttle.capacity}
              size="lg"
            />

            {/* Massive Quick Tap Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                onClick={() => updatePassengerCount(assignedShuttle.id, 1)}
                disabled={assignedShuttle.passengerCount >= assignedShuttle.capacity}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-emerald-400 font-black text-sm border border-slate-700 flex items-center justify-center gap-1 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> 1 Boarding
              </button>
              <button
                onClick={() => updatePassengerCount(assignedShuttle.id, 5)}
                disabled={assignedShuttle.passengerCount >= assignedShuttle.capacity}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-emerald-400 font-black text-sm border border-slate-700 flex items-center justify-center gap-1 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> 5 Boarding
              </button>
              <button
                onClick={() => updatePassengerCount(assignedShuttle.id, -1)}
                disabled={assignedShuttle.passengerCount <= 0}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-rose-400 font-black text-sm border border-slate-700 flex items-center justify-center gap-1 active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4" /> 1 Alighting
              </button>
              <button
                onClick={() => updatePassengerCount(assignedShuttle.id, -5)}
                disabled={assignedShuttle.passengerCount <= 0}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-rose-400 font-black text-sm border border-slate-700 flex items-center justify-center gap-1 active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4" /> 5 Alighting
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Delay Updates (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Status Switches */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Vehicle Operating Status
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { status: 'On Time' as ShuttleStatus, color: 'hover:border-emerald-500' },
                { status: 'Delayed' as ShuttleStatus, color: 'hover:border-rose-500' },
                { status: 'Crowded' as ShuttleStatus, color: 'hover:border-amber-500' },
                { status: 'Boarding' as ShuttleStatus, color: 'hover:border-indigo-500' },
                { status: 'Approaching' as ShuttleStatus, color: 'hover:border-sky-500' },
                { status: 'Out of Service' as ShuttleStatus, color: 'hover:border-slate-500' },
              ].map(item => (
                <button
                  key={item.status}
                  onClick={() => updateShuttleStatus(assignedShuttle.id, item.status)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    assignedShuttle.status === item.status
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                      : `bg-slate-800/60 border-slate-700 text-slate-300 ${item.color}`
                  }`}
                >
                  <span>{item.status}</span>
                  {assignedShuttle.status === item.status && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  )}
                </button>
              ))}
            </div>

            {/* Delay Quick Adjust */}
            <div className="pt-2">
              <label className="text-xs text-slate-400 font-semibold block mb-2">
                Report Schedule Delay (Minutes):
              </label>
              <div className="flex items-center gap-2">
                {[0, 2, 5, 10].map(mins => (
                  <button
                    key={mins}
                    onClick={() => updateShuttleDelay(assignedShuttle.id, mins)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      assignedShuttle.delayMinutes === mins
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {mins === 0 ? 'No Delay' : `+${mins} min`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Incident / Hazard Broadcast */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Broadcast Road Hazard to Dispatch
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Tree fallen near Library turn, slowing down..."
                value={hazardNote}
                onChange={e => setHazardNote(e.target.value)}
                className="flex-1 bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleReportHazard}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
