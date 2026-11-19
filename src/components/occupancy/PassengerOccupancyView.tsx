import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import {
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const PassengerOccupancyView: React.FC = () => {
  const { shuttles, updatePassengerCount, simulation } = useSimulation();

  // Hourly Crowd Distribution Profile (LPU Commute Trends)
  const hourlyCrowdData = [
    { hour: '07:00 AM', volume: 22, rushLevel: 'Low' },
    { hour: '08:00 AM', volume: 88, rushLevel: 'Peak Morning Rush' },
    { hour: '09:00 AM', volume: 94, rushLevel: 'Peak Class Start' },
    { hour: '10:00 AM', volume: 55, rushLevel: 'Moderate' },
    { hour: '11:00 AM', volume: 48, rushLevel: 'Moderate' },
    { hour: '12:00 PM', volume: 82, rushLevel: 'Lunch Hour Surge' },
    { hour: '01:00 PM', volume: 76, rushLevel: 'Lunch Hour Surge' },
    { hour: '02:00 PM', volume: 50, rushLevel: 'Moderate' },
    { hour: '03:00 PM', volume: 64, rushLevel: 'Lab Transitions' },
    { hour: '04:00 PM', volume: 92, rushLevel: 'Evening Class Exit' },
    { hour: '05:00 PM', volume: 96, rushLevel: 'Peak Hostel Return' },
    { hour: '06:00 PM', volume: 68, rushLevel: 'Market & Library' },
  ];

  const totalCapacity = shuttles.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shuttles.reduce((acc, s) => acc + s.passengerCount, 0);
  const totalAvailableSeats = totalCapacity - totalOccupancy;
  const avgOccupancyRate = Math.round((totalOccupancy / (totalCapacity || 1)) * 100);

  const getCrowdLevel = (percent: number) => {
    if (percent >= 90) return { label: 'Full Capacity', color: 'bg-rose-50 text-rose-700 border-rose-200', tag: 'Full' };
    if (percent >= 70) return { label: 'High Crowd', color: 'bg-amber-50 text-amber-700 border-amber-200', tag: 'High' };
    if (percent >= 40) return { label: 'Moderate Crowd', color: 'bg-blue-50 text-blue-700 border-blue-200', tag: 'Moderate' };
    return { label: 'Low Crowd', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', tag: 'Low' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Passenger Occupancy & Crowd Radar
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time vehicle passenger headcounts, capacity utilization, and historical peak-hour commute distributions
        </p>
      </div>

      {/* Fleet Occupancy Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total In-Transit Commuters
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalOccupancy} <span className="text-xs font-normal text-slate-500">passengers</span>
          </div>
          <div className="text-xs font-medium text-blue-600 mt-1">
            Across 5 operational vehicles
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Available Free Seats
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {totalAvailableSeats} <span className="text-xs font-normal text-slate-500">seats open</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Fleet total capacity: {totalCapacity}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Average Utilization
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {avgOccupancyRate}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${avgOccupancyRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Crowd Density Category
          </div>
          <div className="text-base font-black text-amber-700 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-600" /> Moderate-High
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Morning academic block transitions
          </div>
        </div>
      </div>

      {/* Vehicle-by-Vehicle Live Occupancy Indicators */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Vehicle Occupancy Indicators
            </h3>
            <p className="text-xs text-slate-500">
              Interactive simulator: test passenger boardings and alightings using +/- buttons
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (0-40%)
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2" /> Moderate (41-70%)
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" /> High (71-90%)
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-2" /> Full (91-100%)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {shuttles.map(shuttle => {
            const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
            const percent = Math.round((shuttle.passengerCount / shuttle.capacity) * 100);
            const badge = getCrowdLevel(percent);
            const freeSeats = shuttle.capacity - shuttle.passengerCount;

            return (
              <div
                key={shuttle.id}
                className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 space-y-3 hover:border-slate-300 transition-all shadow-2xs"
              >
                {/* Vehicle header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: route?.color || '#2563eb' }}
                    />
                    <strong className="text-xs text-slate-900 font-bold">{shuttle.name}</strong>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Big Headcount */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {shuttle.passengerCount} <span className="text-sm font-semibold text-slate-400">/ {shuttle.capacity}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {freeSeats} seats available ({percent}% occupied)
                    </div>
                  </div>

                  {/* Simulator Controls */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => updatePassengerCount(shuttle.id, -1)}
                      disabled={shuttle.passengerCount <= 0}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center disabled:opacity-40 transition-colors"
                      title="Simulate Passenger Alighting (-1)"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-700 font-mono">
                      {shuttle.passengerCount}
                    </span>
                    <button
                      onClick={() => updatePassengerCount(shuttle.id, 1)}
                      disabled={shuttle.passengerCount >= shuttle.capacity}
                      className="w-6 h-6 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center disabled:opacity-40 transition-colors"
                      title="Simulate Passenger Boarding (+1)"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      percent >= 90
                        ? 'bg-rose-500'
                        : percent >= 70
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-[10px] text-slate-400 font-medium pt-1 flex items-center justify-between border-t border-slate-200/60">
                  <span>Driver: {shuttle.driverName}</span>
                  <span>{route?.code || 'BUS'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Peak Hour Demand Visual Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Campus Hourly Commute Volume Profile
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated daily passenger boardings across LPU academic and hostel corridors
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            LPU Transit Operations Telemetry
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="pt-4">
          <div className="h-44 flex items-end gap-2 sm:gap-4 border-b border-slate-200 pb-2">
            {hourlyCrowdData.map((d, i) => {
              const heightPercent = Math.round((d.volume / 100) * 100);
              const isPeak = d.volume >= 85;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-md z-10">
                    <strong>{d.volume} Riders</strong> • {d.rushLevel}
                  </div>

                  <div className="w-full bg-slate-100 rounded-t-sm flex items-end h-36 overflow-hidden">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ${
                        isPeak ? 'bg-amber-500' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono tracking-tighter truncate w-full text-center">
                    {d.hour.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Regular Service
              <span className="w-2.5 h-2.5 rounded bg-amber-500 ml-3" /> Class Transition Rush (08:00 AM, 09:00 AM, 05:00 PM)
            </span>
            <span>Recorded over 1,420 semester transit cycles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
