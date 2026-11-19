import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import { OccupancyBar } from '../common/OccupancyBar';
import {
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Zap,
  Sliders,
  ShieldAlert,
  Compass,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

export const ETAPredictionView: React.FC = () => {
  const {
    shuttles,
    simulation,
    selectedStopId,
    setSelectedStopId,
    setTraffic,
    setWeather,
    toggleRain,
  } = useSimulation();

  const [simulatedSpeed, setSimulatedSpeed] = useState<number>(22); // km/h
  const [signalQuality, setSignalQuality] = useState<'Strong' | 'Normal' | 'Weak'>('Strong');

  const activeStop = CAMPUS_STOPS.find(s => s.id === selectedStopId) || CAMPUS_STOPS[0];

  // Find all shuttles heading toward or serving this stop
  const incomingShuttles = shuttles
    .map(shuttle => {
      const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
      const servesStop = route?.stops.includes(activeStop.id);
      if (!servesStop) return null;

      // Distance calculation based on route stop sequence
      const stopIndex = route!.stops.indexOf(activeStop.id);
      const nextIndex = route!.stops.indexOf(shuttle.nextStopId);
      let stopsAway = (stopIndex - nextIndex + route!.stops.length) % route!.stops.length;
      if (stopsAway === 0) stopsAway = route!.stops.length;

      // Traffic factor
      let trafficMultiplier = 1.0;
      if (simulation.traffic === 'Light') trafficMultiplier = 0.8;
      else if (simulation.traffic === 'Moderate') trafficMultiplier = 1.35;
      else if (simulation.traffic === 'Heavy') trafficMultiplier = 1.8;

      if (simulation.isRaining) trafficMultiplier *= 1.25;

      const baseDistanceMeters = Math.max(150, stopsAway * 420);
      const baseSeconds = Math.round((baseDistanceMeters / (simulatedSpeed * (1000 / 3600))) * trafficMultiplier);

      // Add vehicle's own delay
      const totalSeconds = baseSeconds + (shuttle.delayMinutes * 60);

      // Confidence indicator
      let confidence = 96;
      if (simulation.traffic === 'Heavy') confidence -= 22;
      else if (simulation.traffic === 'Moderate') confidence -= 10;
      if (simulation.isRaining) confidence -= 12;
      if (signalQuality === 'Weak') confidence -= 15;
      confidence = Math.max(45, Math.min(99, confidence));

      return {
        shuttle,
        route: route!,
        stopsAway,
        distanceMeters: baseDistanceMeters,
        etaSeconds: totalSeconds,
        confidence,
        delayMinutes: shuttle.delayMinutes,
        historicalAvgMinutes: activeStop.avgWaitMinutes,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.etaSeconds - b!.etaSeconds) as Array<{
      shuttle: typeof shuttles[0];
      route: typeof SHUTTLE_ROUTES[0];
      stopsAway: number;
      distanceMeters: number;
      etaSeconds: number;
      confidence: number;
      delayMinutes: number;
      historicalAvgMinutes: number;
    }>;

  const nextArrival = incomingShuttles[0];

  const formatETA = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s} sec`;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            Dynamic Arrival Forecasting
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Smart Arrival Prediction (ETA)</h2>
          <p className="text-sm text-slate-400 mt-1">
            Predictive time engine factoring headway, vehicle velocity, weather, and campus corridor congestion.
          </p>
        </div>

        {/* Stop Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium">Select Pickup Stop:</span>
          <select
            value={selectedStopId || ''}
            onChange={e => setSelectedStopId(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {CAMPUS_STOPS.map(stop => (
              <option key={stop.id} value={stop.id}>
                {stop.code} - {stop.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Top Feature Card: Nearest Arrival Spotlight */}
      {nextArrival ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0c1e3f] p-6 md:p-8 rounded-3xl border border-sky-500/30 shadow-[0_12px_40px_rgba(2,132,199,0.15)]">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Primary Countdown (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Next Approaching Vehicle</span>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tight tabular-nums">
                    {formatETA(nextArrival.etaSeconds)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">estimated wait</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  for {nextArrival.shuttle.name} ({nextArrival.route.name})
                </p>
              </div>

              {/* Confidence Badge */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  {nextArrival.confidence}% Prediction Confidence
                </div>
                {nextArrival.delayMinutes > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    +{nextArrival.delayMinutes}m Traffic Delay
                  </span>
                )}
              </div>
            </div>

            {/* Metrics Breakdown (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Historical Avg
                </div>
                <div className="text-xl font-bold text-white tabular-nums">
                  {nextArrival.historicalAvgMinutes} min
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Based on 14-day log</div>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Distance to Stop
                </div>
                <div className="text-xl font-bold text-white tabular-nums">
                  {nextArrival.distanceMeters} m
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{nextArrival.stopsAway} stops away</div>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  Occupancy
                </div>
                <div className="text-xl font-bold text-white tabular-nums">
                  {nextArrival.shuttle.passengerCount} / {nextArrival.shuttle.capacity}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {nextArrival.shuttle.capacity - nextArrival.shuttle.passengerCount} seats open
                </div>
              </div>

              {/* Progress bar spans full width below */}
              <div className="col-span-2 sm:col-span-3 bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40">
                <OccupancyBar
                  current={nextArrival.shuttle.passengerCount}
                  capacity={nextArrival.shuttle.capacity}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
          No active shuttles currently routing toward this stop.
        </div>
      )}

      {/* Interactive Simulation Controls Matrix */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-sky-500/20 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">Live Environmental Simulator</h3>
              <p className="text-xs text-slate-400">
                Dynamically alter campus road conditions to observe instantaneous ETA adjustments.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
            Prototype Demo Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Traffic Condition Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Corridor Traffic Congestion:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Light', 'Normal', 'Moderate', 'Heavy'] as const).map(condition => (
                <button
                  key={condition}
                  onClick={() => setTraffic(condition)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    simulation.traffic === condition
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Shuttle Average Speed Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Shuttle Velocity:</span>
              <span className="font-bold text-sky-400 tabular-nums">{simulatedSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={simulatedSpeed}
              onChange={e => setSimulatedSpeed(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 km/h (Slow)</span>
              <span>25 km/h (Standard)</span>
              <span>40 km/h (Max)</span>
            </div>
          </div>

          {/* Weather & Rain Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Weather Conditions:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWeather('Clear')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  simulation.weather === 'Clear'
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ☀️ Clear Skies
              </button>
              <button
                onClick={() => setWeather('Rainy')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  simulation.isRaining
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                🌧️ Monsoon Rain
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Shuttles Queue at this Stop */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          Subsequent Arrivals Queue for {activeStop.name}
        </h3>

        <div className="space-y-3">
          {incomingShuttles.map(({ shuttle, route, etaSeconds, distanceMeters, confidence, stopsAway }) => (
            <div
              key={shuttle.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/70 transition-all gap-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: `${route.color}25`, color: route.color }}
                >
                  {route.code}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{shuttle.name}</span>
                    <Badge status={shuttle.status} />
                  </div>
                  <div className="text-xs text-slate-400">
                    {stopsAway} stop{stopsAway > 1 ? 's' : ''} away ({distanceMeters}m) • Driver: {shuttle.driverName}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-left sm:text-right">
                  <div className="text-lg font-extrabold text-sky-400 tabular-nums">
                    {formatETA(etaSeconds)}
                  </div>
                  <div className="text-[11px] text-slate-400">{confidence}% Confidence</div>
                </div>

                <div className="w-24 sm:w-32">
                  <OccupancyBar
                    current={shuttle.passengerCount}
                    capacity={shuttle.capacity}
                    showDetails={false}
                    size="sm"
                  />
                  <div className="text-[10px] text-slate-400 text-right mt-1">
                    {shuttle.passengerCount}/{shuttle.capacity} seats
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
