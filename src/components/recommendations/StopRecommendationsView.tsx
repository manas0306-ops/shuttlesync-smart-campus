import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import { SmartRecommendation, CrowdLevel } from '../../types';
import {
  Sparkles,
  MapPin,
  Clock,
  Footprints,
  ArrowRight,
  CheckCircle2,
  ThumbsUp,
  Award,
  Zap,
  Umbrella,
} from 'lucide-react';

export const StopRecommendationsView: React.FC = () => {
  const {
    shuttles,
    simulation,
    selectedStopId,
    setSelectedStopId,
    triggerNotification,
  } = useSimulation();

  const [currentLocationId, setCurrentLocationId] = useState<string>('stop-hostel-zone');
  const [destinationId, setDestinationId] = useState<string>('stop-engg-block');

  const currentStop = CAMPUS_STOPS.find(s => s.id === currentLocationId) || CAMPUS_STOPS[0];
  const destStop = CAMPUS_STOPS.find(s => s.id === destinationId) || CAMPUS_STOPS[1];

  // Calculate recommendation metrics for candidate pickup stops
  const recommendations: SmartRecommendation[] = CAMPUS_STOPS.filter(
    s => s.id !== destinationId
  ).map((candidateStop, index) => {
    // Distance from current location in meters
    const dx = candidateStop.x - currentStop.x;
    const dy = candidateStop.y - currentStop.y;
    const euclideanDistance = Math.round(Math.sqrt(dx * dx + dy * dy) * 1.8);
    const walkingDistanceMeters = candidateStop.id === currentStop.id ? 0 : Math.max(120, euclideanDistance);
    const walkingTimeMinutes = Math.round(walkingDistanceMeters / 75); // ~4.5 km/h walk

    // Find incoming shuttles to this candidate stop that can take user toward destination
    const relevantShuttles = shuttles.filter(shuttle => {
      const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
      return route?.stops.includes(candidateStop.id) && route?.stops.includes(destStop.id);
    });

    const bestShuttle = relevantShuttles[0] || shuttles[0];
    const nextShuttleETA = Math.max(1, Math.ceil(bestShuttle.estimatedTimeToNextStop / 60));

    // Crowd at stop
    let crowdLevel: CrowdLevel = 'Low';
    if (candidateStop.currentCrowdCount > 50) crowdLevel = 'Full';
    else if (candidateStop.currentCrowdCount > 30) crowdLevel = 'High';
    else if (candidateStop.currentCrowdCount > 15) crowdLevel = 'Moderate';

    // Total journey time
    const totalTimeMinutes = walkingTimeMinutes + nextShuttleETA + 6; // +6 mins ride

    // Scoring logic (higher is better)
    let score = 100 - (totalTimeMinutes * 3.5);
    if (crowdLevel === 'Full') score -= 30;
    else if (crowdLevel === 'High') score -= 15;
    if (simulation.isRaining && !candidateStop.sheltered) score -= 25;
    if (simulation.isRaining && candidateStop.sheltered) score += 10;
    if (bestShuttle.passengerCount < bestShuttle.capacity * 0.6) score += 15;

    score = Math.max(20, Math.min(99, Math.round(score)));

    // Generate rationale
    let primaryReason = 'Nearest physical stop to your current location.';
    let savingsMinutes = 0;

    if (candidateStop.id !== currentStop.id && score > 75) {
      primaryReason = `Walk ${walkingTimeMinutes}m to beat ${currentStop.name}'s crowd. Shuttle has guaranteed seating.`;
      savingsMinutes = 5;
    } else if (candidateStop.sheltered && simulation.isRaining) {
      primaryReason = 'Fully sheltered stop during active rain showers with covered boarding canopy.';
      savingsMinutes = 3;
    } else if (bestShuttle.passengerCount < 12) {
      primaryReason = 'Low vehicle occupancy (~70% seats empty). Board comfortably with zero line.';
      savingsMinutes = 4;
    }

    return {
      stopId: candidateStop.id,
      score,
      walkingTimeMinutes,
      walkingDistanceMeters,
      nextShuttleETA,
      totalTimeMinutes,
      crowdLevel,
      primaryReason,
      savingsMinutes,
      isBestChoice: false,
    };
  })
  .sort((a, b) => b.score - a.score);

  // Mark best choice
  if (recommendations.length > 0) {
    recommendations[0].isBestChoice = true;
  }

  const handleSelectRecommendedStop = (rec: SmartRecommendation) => {
    setSelectedStopId(rec.stopId);
    triggerNotification({
      title: 'Stop Route Selected',
      message: `Navigating to ${CAMPUS_STOPS.find(s => s.id === rec.stopId)?.name}. ETA: ~${rec.nextShuttleETA} min.`,
      category: 'route',
      severity: 'success',
      stopId: rec.stopId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Smart Pickup Recommendation
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Smart Stop Recommendations</h2>
          <p className="text-sm text-slate-400 mt-1">
            Intelligent alternative stop discovery balancing walking distance, wait queue, vehicle crowding, and total journey duration.
          </p>
        </div>

        {/* Origin / Destination Pickers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800 rounded-xl px-3 py-2 border border-slate-700">
            <span className="text-[11px] text-slate-400">From:</span>
            <select
              value={currentLocationId}
              onChange={e => setCurrentLocationId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {CAMPUS_STOPS.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-4 h-4 text-sky-400 hidden sm:block" />

          <div className="flex items-center gap-1.5 bg-slate-800 rounded-xl px-3 py-2 border border-slate-700">
            <span className="text-[11px] text-slate-400">To:</span>
            <select
              value={destinationId}
              onChange={e => setDestinationId(e.target.value)}
              className="bg-transparent text-xs font-bold text-sky-400 focus:outline-none cursor-pointer"
            >
              {CAMPUS_STOPS.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top Best Choice Spotlight */}
      {recommendations[0] && (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/40 rounded-3xl p-6 md:p-8 border border-emerald-500/40 shadow-[0_12px_40px_rgba(16,185,129,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
              <Award className="w-4 h-4" />
              RECOMMENDED BEST PICKUP CHOICE
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Smart Score</span>
              <span className="text-2xl font-black text-emerald-400">{recommendations[0].score}/100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <h3 className="text-xl md:text-2xl font-black text-white">
                {CAMPUS_STOPS.find(s => s.id === recommendations[0].stopId)?.name}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                💡 <strong className="text-emerald-400">Why this stop:</strong> {recommendations[0].primaryReason}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-sky-400" />
                  {recommendations[0].walkingDistanceMeters > 0
                    ? `${recommendations[0].walkingDistanceMeters}m walk (~${recommendations[0].walkingTimeMinutes} min)`
                    : 'At your current stop'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Shuttle arriving in ~{recommendations[0].nextShuttleETA} mins
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Total Journey: ~{recommendations[0].totalTimeMinutes} mins
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col justify-center items-start md:items-end gap-3">
              <button
                onClick={() => handleSelectRecommendedStop(recommendations[0])}
                className="w-full md:w-auto py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Select This Stop & View on Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Candidate Stops Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-sky-400" />
          Alternative Nearby Stop Comparisons
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.slice(1).map(rec => {
            const stop = CAMPUS_STOPS.find(s => s.id === rec.stopId);
            if (!stop) return null;

            return (
              <div
                key={rec.stopId}
                className="bg-slate-900/70 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                        {stop.code}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{stop.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-300">{rec.score} pts</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2">{rec.primaryReason}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-slate-800/50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Walk Time</span>
                      <span className="font-semibold text-slate-200">
                        {rec.walkingTimeMinutes > 0 ? `${rec.walkingTimeMinutes} min` : '0 min'}
                      </span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Shuttle Wait</span>
                      <span className="font-semibold text-sky-400">~{rec.nextShuttleETA} min</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRecommendedStop(rec)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  Choose {stop.code}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
