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
      routeName: 'Route R-303: Hostel-Academics Direct Link',
      routeColor: '#9333ea',
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
      routeName: 'Route R-202: Green Campus Perimeter Loop',
      routeColor: '#16a34a',
      shuttleId: 'shuttle-s201',
      departureTime: 'Departs in 6 mins',
      arrivalTime: 'Arrival in 14 mins',
      totalDurationMinutes: 14,
      walkMinutes: 3,
      shuttleMinutes: 11,
      stopsCount: 4,
      stopsList: [originStop.name, 'Engineering Quad Block 38', 'Uni-Hospital Gate 2', destStop.name],
      crowdLevel: 'High',
      carbonSavedKg: 0.95,
    },
    {
      id: 'journey-3',
      routeName: 'Walk + Route R-101 Campus Express Combo',
      routeColor: '#2563eb',
      shuttleId: 'shuttle-s101',
      departureTime: 'Departs in 5 mins',
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
        particleCount: 40,
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
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Campus Journey & Route Planner
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Compare multi-modal walking transfers, EV shuttle connections, arrival durations, and carbon savings
        </p>
      </div>

      {/* Origin & Destination Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Origin */}
          <div className="flex-1 w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Starting Location (Pickup)
              </label>
              <select
                value={originId}
                onChange={e => setOriginId(e.target.value)}
                className="w-full bg-transparent text-slate-900 text-xs font-bold focus:outline-none cursor-pointer mt-0.5"
              >
                {CAMPUS_STOPS.map(stop => (
                  <option key={stop.id} value={stop.id} className="bg-white text-slate-900">
                    {stop.code} — {stop.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapStops}
            className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {/* Destination */}
          <div className="flex-1 w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Destination (Drop-off)
              </label>
              <select
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                className="w-full bg-transparent text-slate-900 text-xs font-bold focus:outline-none cursor-pointer mt-0.5"
              >
                {CAMPUS_STOPS.map(stop => (
                  <option key={stop.id} value={stop.id} className="bg-white text-slate-900">
                    {stop.code} — {stop.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Itineraries */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Suggested Route Options ({availableJourneys.length})
        </h3>

        <div className="space-y-3">
          {availableJourneys.map((journey, i) => {
            const isSelected = selectedJourneyId === journey.id;
            const isExpanded = expandedJourneyId === journey.id;

            return (
              <div
                key={journey.id}
                className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs"
                      style={{ backgroundColor: journey.routeColor }}
                    >
                      <Bus className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{journey.routeName}</h4>
                        {i === 0 && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            Fastest Option
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {journey.totalDurationMinutes} mins total
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Footprints className="w-3.5 h-3.5" />
                          {journey.walkMinutes} min walk
                        </span>
                        <span>•</span>
                        <span>{journey.stopsCount} stops</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Leaf className="w-3.5 h-3.5" />
                          {journey.carbonSavedKg} kg CO₂ saved
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-auto">
                    <button
                      onClick={() => setExpandedJourneyId(isExpanded ? null : journey.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1"
                    >
                      {isExpanded ? 'Hide Steps' : 'View Steps'}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleSelectJourney(journey)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </>
                      ) : (
                        'Select Journey'
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Steps Timeline */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Turn-by-Turn Journey Segments
                    </div>
                    <div className="space-y-2 text-xs">
                      {journey.stopsList.map((stop, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2.5 text-slate-700">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {sIdx + 1}
                          </div>
                          <span className="font-medium">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
