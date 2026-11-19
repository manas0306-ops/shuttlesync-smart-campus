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
  Sparkles,
  Leaf,
  Layers,
} from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const { simulation } = useSimulation();
  const [selectedMetric, setSelectedMetric] = useState<'today' | 'week'>('today');

  // Traffic multiplier affects the displayed wait times dynamically
  let trafficMod = 1.0;
  if (simulation.traffic === 'Heavy') trafficMod = 1.5;
  else if (simulation.traffic === 'Moderate') trafficMod = 1.25;
  else if (simulation.traffic === 'Light') trafficMod = 0.85;

  if (simulation.isRaining) trafficMod *= 1.2;

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
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Campus Mobility Intelligence
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mobility & Crowd Analytics</h2>
          <p className="text-sm text-slate-400 mt-1">
            Historical wait curves, fleet load factors, bottleneck choke points, and ecological impact.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setSelectedMetric('today')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedMetric === 'today'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Today
          </button>
          <button
            onClick={() => setSelectedMetric('week')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedMetric === 'week'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Aggregate
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Avg Campus Wait Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white tabular-nums">
            {avgWait} <span className="text-sm font-semibold text-slate-500">min</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            ↓ 32% lower than uncoordinated shuttles
          </div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>On-Time Arrival Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 tabular-nums">
            87.4%
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Within ±90 sec of predicted schedule
          </div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Daily Commuters Moved</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white tabular-nums">
            3,480
          </div>
          <div className="text-[11px] text-sky-400 font-medium">
            Across 142 total daily shuttle loops
          </div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>CO₂ Emission Offset</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white tabular-nums">
            1.8 <span className="text-sm font-semibold text-slate-500">tons</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Saved vs individual personal vehicles
          </div>
        </div>
      </div>

      {/* Primary Chart: Hourly Waiting Time Trend Curve (Custom Responsive SVG) */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              Hourly Passenger Waiting Time Trends (07:30 to 20:30)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing historical unoptimized wait curves against ShuttleSync predictive dispatch (dynamically responsive to simulation traffic).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-1 bg-slate-600 rounded" /> Historical Unmanaged
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-1 bg-sky-400 rounded" /> ShuttleSync Live
            </span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full h-64 relative pt-4">
          <svg viewBox="0 0 700 220" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 4, 8, 12, 16].map((val, i) => {
              const y = 190 - (val / 16) * 160;
              return (
                <g key={i}>
                  <line x1="30" y1={y} x2="680" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  <text x="20" y={y + 4} textAnchor="end" fill="#64748b" fontSize="9">
                    {val}m
                  </text>
                </g>
              );
            })}

            {/* Historical Baseline Line */}
            {(() => {
              const pts = dynamicWaitData.map((d, i) => {
                const x = 50 + i * (620 / (dynamicWaitData.length - 1));
                const y = 190 - (d.historicalWait / 16) * 160;
                return `${x},${y}`;
              });
              return (
                <polyline
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  points={pts.join(' ')}
                />
              );
            })()}

            {/* Live ShuttleSync Area Fill & Line */}
            {(() => {
              const coords = dynamicWaitData.map((d, i) => {
                const x = 50 + i * (620 / (dynamicWaitData.length - 1));
                const y = 190 - (d.currentSimulatedWait / 16) * 160;
                return { x, y, wait: d.currentSimulatedWait, hour: d.hour };
              });

              const areaPath = `M ${coords[0].x} 190 ` +
                coords.map(c => `L ${c.x} ${c.y}`).join(' ') +
                ` L ${coords[coords.length - 1].x} 190 Z`;

              const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

              return (
                <g>
                  <path d={areaPath} fill="url(#curveGradient)" />
                  <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  {coords.map((c, idx) => (
                    <g key={idx} className="cursor-pointer group">
                      <circle cx={c.x} cy={c.y} r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        x={c.x}
                        y="208"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                      >
                        {c.hour}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Grid: Most Frequently Used Stops & Route Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Frequent Stops (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            Campus Stop Footfall & Demand Volume
          </h3>

          <div className="space-y-3">
            {STOP_POPULARITY_DATA.map(item => {
              const maxFlow = 1500;
              const percent = Math.round((item.passengerFlow / maxFlow) * 100);

              return (
                <div key={item.stopName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.stopName}</span>
                    <span className="text-slate-400 tabular-nums">
                      <strong className="text-white">{item.passengerFlow}</strong> riders/day (~{item.avgWaitMins}m wait)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Route Efficiency & Load Factor (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Route Fleet Load & Reliability
          </h3>

          <div className="space-y-4">
            {ROUTE_EFFICIENCY_METRICS.map(r => (
              <div
                key={r.routeCode}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {r.routeCode} ({r.name})
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {r.onTimeRate}% On-Time
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                  <div>
                    Avg Load Factor: <strong className="text-sky-400">{r.avgLoadFactor}%</strong>
                  </div>
                  <div className="text-right">
                    Loops Run: <strong className="text-white">{r.tripsCompleted}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
