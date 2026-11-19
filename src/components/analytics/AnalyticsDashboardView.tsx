import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  HOURLY_WAIT_TIMES,
  STOP_POPULARITY_DATA,
  ROUTE_EFFICIENCY_METRICS,
} from '../../data/analyticsData';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  Leaf,
  Layers,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const { simulation } = useSimulation();
  const [selectedMetric, setSelectedMetric] = useState<'today' | 'week'>('today');

  // Traffic multiplier affects the displayed wait times dynamically
  let trafficMod = 1.0;
  if (simulation.traffic === 'Heavy') trafficMod = 1.4;
  else if (simulation.traffic === 'Moderate') trafficMod = 1.2;
  else if (simulation.traffic === 'Light') trafficMod = 0.85;

  if (simulation.isRaining) trafficMod *= 1.15;

  const dynamicWaitData = HOURLY_WAIT_TIMES.map(d => ({
    ...d,
    currentSimulatedWait: Number((d.currentSimulatedWait * trafficMod).toFixed(1)),
  }));

  const avgWait = (
    dynamicWaitData.reduce((acc, d) => acc + d.currentSimulatedWait, 0) / dynamicWaitData.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Mobility & Fleet Intelligence Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical wait curves, fleet load factors, bottleneck choke points, and carbon offset analytics
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs text-xs">
          <button
            onClick={() => setSelectedMetric('today')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              selectedMetric === 'today'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Today
          </button>
          <button
            onClick={() => setSelectedMetric('week')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              selectedMetric === 'week'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Aggregate
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Average Campus Wait</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {avgWait} <span className="text-xs font-semibold text-slate-500">mins</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> 32% lower than uncoordinated shuttles
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>On-Time Arrival Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 tabular-nums">
            94.2%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Within ±90 sec of scheduled arrival
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Daily Commuters Moved</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            3,480
          </div>
          <div className="text-[11px] text-blue-600 font-medium">
            Across 142 total daily shuttle loops
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>CO₂ Emission Offset</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            1.8 <span className="text-xs font-semibold text-slate-500">tons</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Saved vs individual personal vehicles
          </div>
        </div>
      </div>

      {/* Primary Chart: Hourly Waiting Time Trend Curve (Custom Responsive SVG) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Hourly Passenger Waiting Time Trends (07:30 to 20:30)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing historical uncoordinated wait times against ShuttleSync dynamic predictive dispatch
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-1 bg-slate-400 rounded" /> Historical Unmanaged
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-3 h-1 bg-blue-600 rounded" /> ShuttleSync Live
            </span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full h-60 relative pt-2">
          <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="curveGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 4, 8, 12, 16].map((val, i) => {
              const y = 180 - (val / 16) * 150;
              return (
                <g key={i}>
                  <line x1="30" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="20" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="9">
                    {val}m
                  </text>
                </g>
              );
            })}

            {/* Historical Baseline Line */}
            <path
              d={dynamicWaitData
                .map((d, i) => {
                  const x = 40 + i * (620 / (dynamicWaitData.length - 1));
                  const y = 180 - (d.historicalWait / 16) * 150;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* ShuttleSync Area Fill */}
            <path
              d={
                dynamicWaitData
                  .map((d, i) => {
                    const x = 40 + i * (620 / (dynamicWaitData.length - 1));
                    const y = 180 - (d.currentSimulatedWait / 16) * 150;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ') + ` L ${660} 180 L 40 180 Z`
              }
              fill="url(#curveGradientLight)"
            />

            {/* ShuttleSync Live Line */}
            <path
              d={dynamicWaitData
                .map((d, i) => {
                  const x = 40 + i * (620 / (dynamicWaitData.length - 1));
                  const y = 180 - (d.currentSimulatedWait / 16) * 150;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
            />

            {/* Data Dots & X Labels */}
            {dynamicWaitData.map((d, i) => {
              const x = 40 + i * (620 / (dynamicWaitData.length - 1));
              const y = 180 - (d.currentSimulatedWait / 16) * 150;

              return (
                <g key={i} className="group cursor-pointer">
                  <circle cx={x} cy={y} r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                  <text
                    x={x}
                    y="196"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontWeight="500"
                  >
                    {d.hour}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Lower Row: Stop Popularity & Route Efficiency Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stop Popularity Leaderboard */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Stop Boarding Volume & Density</h3>
            <p className="text-xs text-slate-500">Most frequented pickup and drop-off hubs across LPU campus</p>
          </div>

          <div className="space-y-3">
            {STOP_POPULARITY_DATA.map((stop, i) => {
              const maxVol = Math.max(...STOP_POPULARITY_DATA.map(s => s.passengerFlow));
              const pct = Math.round((stop.passengerFlow / maxVol) * 100);

              return (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{stop.stopName}</span>
                    <span className="font-mono text-slate-600 font-semibold">{stop.passengerFlow} riders/day</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Route Efficiency Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Corridor Performance & Reliability</h3>
            <p className="text-xs text-slate-500">On-time adherence and average loop cycle durations</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">On-Time</th>
                  <th className="py-2.5 px-3">Load Factor</th>
                  <th className="py-2.5 px-3 text-right">Trips Done</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ROUTE_EFFICIENCY_METRICS.map((route, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{route.name} ({route.routeCode})</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {route.onTimeRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{route.avgLoadFactor}%</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-600 font-bold">{route.tripsCompleted} trips</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
