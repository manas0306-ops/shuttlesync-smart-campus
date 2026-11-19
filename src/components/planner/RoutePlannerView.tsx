import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import { RouteJourney, CrowdLevel } from '../../types';
import {
  Compass,
  ArrowUpDown,
  Navigation,
  Clock,
  Footprints,
  Bus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Leaf,
  Sparkles,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoutePlannerView: React.FC = () => {
  const { shuttles, setSelectedStopId, triggerNotification } = useSimulation();

  const [originId, setOriginId] = useState<string>('stop-bh-hostel');
  const [destinationId, setDestinationId] = useState<string>('stop-block-34-lib');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>('journey-1');
  const [expandedJourneyId, setExpandedJourneyId] = useState<string | null>('journey-1');

  const originStop = CAMPUS_STOPS.find(s => s.id === originId) || CAMPUS_STOPS[4];
  const destStop = CAMPUS_STOPS.find(s => s.id === destinationId) || CAMPUS_STOPS[1];

  const handleSwapStops = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  // Find candidate routes connecting origin and destination in LPU
  const availableJourneys: RouteJourney[] = [
    {
      id: 'journey-1',
      routeName: 'Route 303: Hostel-Academics Direct Link',
      routeColor: '#a855f7',
      shuttleId: 'shuttle-s301',
      departureTime: 'Departs in 3 mins',
      arrivalTime: 'Arrival in 9 mins',
      totalDurationMinutes: 9,
      walkMinutes: 2,
      shuttleMinutes: 7,
      stopsCount: 3,
      stopsList: [originStop.name, 'Uni-Mall & Central Student Square', destStop.name],
      crowdLevel: 'Moderate',
      carbonSavedKg: 0.85,
    },
    {
      id: 'journey-2',
      routeName: 'Route 202: Green Campus Perimeter Loop',
      routeColor: '#10b981',
      shuttleId: 'shuttle-s201',
      departureTime: 'Departs in 5 mins',
      arrivalTime: 'Arrival in 14 mins',
      totalDurationMinutes: 14,
      walkMinutes: 2,
      shuttleMinutes: 12,
      stopsCount: 4,
      stopsList: [originStop.name, 'Girls Hostel Quad (GH 1-6)', 'Sports Stadium', destStop.name],
      crowdLevel: 'Low',
      carbonSavedKg: 0.95,
    },
    {
      id: 'journey-3',
      routeName: 'Uni-Mall Walk & Route 101 Transfer',
      routeColor: '#0284c7',
      shuttleId: 'shuttle-s101',
      departureTime: 'Departs in 2 mins',
      arrivalTime: 'Arrival in 11 mins',
      totalDurationMinutes: 11,
      walkMinutes: 5,
      shuttleMinutes: 6,
      stopsCount: 2,
      stopsList: ['Walk to Uni-Mall Courtyard', 'Board GT Road Express S-101', destStop.name],
      crowdLevel: 'Low',
      carbonSavedKg: 1.15,
    },
  ];

  const handleSelectJourney = (journey: RouteJourney) => {
    setSelectedJourneyId(journey.id);
    setSelectedStopId(originId);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Fallback
    }

    triggerNotification({
      title: 'LPU Campus Journey Confirmed',
      message: `Navigating via ${journey.routeName}. Head to ${originStop.name} for departure.`,
      category: 'route',
      severity: 'success',
      stopId: originId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            LPU Campus Transit Routing Engine
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Smart Campus Route Planner</h2>
          <p className="text-sm text-slate-400 mt-1">
            Compare walking transfers, EV shuttle connections, arrival durations, and carbon savings across LPU campus.
          </p>
        </div>

        <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-3 py-1 rounded-full font-semibold">
          Lovely Professional University, Phagwara
        </span>
      </div>

      {/* Origin & Destination Bar */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Origin */}
          <div className="flex-1 w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Starting Location (Pickup)
              </label>
              <select
                value={originId}
                onChange={e => setOriginId(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer mt-0.5"
              >
                {CAMPUS_STOPS.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapStops}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-90"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-4 h-4 text-sky-400" />
          </button>

          {/* Destination */}
          <div className="flex-1 w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Target Destination (Dropoff)
              </label>
              <select
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer mt-0.5"
              >
                {CAMPUS_STOPS.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Available Journeys Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-sky-400" />
          Recommended Routes ({availableJourneys.length} Options Available)
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {availableJourneys.map(journey => {
            const isSelected = selectedJourneyId === journey.id;
            const isExpanded = expandedJourneyId === journey.id;

            return (
              <div
                key={journey.id}
                className={`bg-slate-900/80 rounded-2xl border transition-all p-5 ${
                  isSelected
                    ? 'border-sky-500/60 shadow-lg shadow-sky-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Journey Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{
                        backgroundColor: `${journey.routeColor}20`,
                        color: journey.routeColor,
                        border: `1px solid ${journey.routeColor}40`,
                      }}
                    >
                      <Bus className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{journey.routeName}</h4>
                        <Badge crowdLevel={journey.crowdLevel} />
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span className="text-emerald-400 font-semibold">{journey.departureTime}</span>
                        <span>•</span>
                        <span>{journey.arrivalTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                          -{journey.carbonSavedKg} kg CO₂ offset
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <div className="text-2xl font-black text-white tabular-nums">
                        {journey.totalDurationMinutes} min
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {journey.walkMinutes}m walk + {journey.shuttleMinutes}m transit
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectJourney(journey)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        isSelected
                          ? 'bg-sky-500 text-white shadow-sky-500/25'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {isSelected ? 'Selected' : 'Choose Journey'}
                    </button>
                  </div>
                </div>

                {/* Waypoint Preview Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium overflow-x-auto pb-1">
                      <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Footprints className="w-3.5 h-3.5 text-sky-400" /> {journey.walkMinutes}m walk
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Bus className="w-3.5 h-3.5" style={{ color: journey.routeColor }} />
                        {journey.stopsCount} stops ({journey.shuttleMinutes}m)
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg font-semibold">
                        Arrive at Destination
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedJourneyId(isExpanded ? null : journey.id)}
                      className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold ml-2 shrink-0"
                    >
                      {isExpanded ? 'Hide Stops' : 'View Waypoints'}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expanded Stops Timeline */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                      <div className="text-xs font-semibold text-slate-400 mb-2">Transit Stops Timeline:</div>
                      {journey.stopsList.map((stopName, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-400 shrink-0">
                            {idx + 1}
                          </div>
                          <div className="text-slate-200 font-medium">{stopName}</div>
                          {idx === 0 && <span className="text-[10px] text-emerald-400 font-semibold">(Boarding)</span>}
                          {idx === journey.stopsList.length - 1 && (
                            <span className="text-[10px] text-sky-400 font-semibold">(Dropoff)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
