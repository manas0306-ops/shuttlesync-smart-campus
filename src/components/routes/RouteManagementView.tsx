import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import {
  Route,
  Clock,
  MapPin,
  Bus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface RouteManagementViewProps {
  onNavigateTab: (tab: string) => void;
}

export const RouteManagementView: React.FC<RouteManagementViewProps> = ({ onNavigateTab }) => {
  const { shuttles, setSelectedShuttleId } = useSimulation();
  const [selectedRouteId, setSelectedRouteId] = useState(SHUTTLE_ROUTES[0].id);

  const selectedRoute = SHUTTLE_ROUTES.find(r => r.id === selectedRouteId) || SHUTTLE_ROUTES[0];
  const assignedShuttles = shuttles.filter(s => s.routeId === selectedRoute.id);

  const routeStops = selectedRoute.stops.map(stopId =>
    CAMPUS_STOPS.find(s => s.id === stopId)
  ).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Campus Route Management
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configured university transit corridors, stop sequences, headways, and operational schedules
        </p>
      </div>

      {/* Route Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SHUTTLE_ROUTES.map(route => {
          const isSelected = selectedRouteId === route.id;
          const activeCount = shuttles.filter(s => s.routeId === route.id).length;

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`bg-white rounded-xl border p-4.5 cursor-pointer transition-all shadow-xs ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2.5 py-1 rounded text-xs font-black text-white shadow-2xs"
                  style={{ backgroundColor: route.color }}
                >
                  {route.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5 text-blue-600" />
                  {activeCount} Active Shuttles
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{route.name}</h3>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block">Frequency:</span>
                  <strong className="text-slate-800">Every {route.frequencyMinutes} min</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Roundtrip:</span>
                  <strong className="text-slate-800">~{route.loopDurationMinutes} min</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Route Detailed Blueprint */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-black text-white shadow-2xs"
              style={{ backgroundColor: selectedRoute.color }}
            >
              {selectedRoute.code}
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {selectedRoute.name}
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                Operating Hours: {selectedRoute.operatingHours} • Headway: {selectedRoute.frequencyMinutes} minutes
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('live-map')}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            Track Route on Live Map
          </button>
        </div>

        {/* Assigned Shuttles Strip */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active Assigned Shuttles ({assignedShuttles.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {assignedShuttles.map(shuttle => (
              <div
                key={shuttle.id}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{shuttle.name}</div>
                  <div className="text-[11px] text-slate-500">Driver: {shuttle.driverName}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      shuttle.status === 'On Time'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {shuttle.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {shuttle.passengerCount}/{shuttle.capacity} Pax
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stop Progression Sequence Timeline */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Ordered Stop Progression Sequence ({routeStops.length} Stops)
          </div>

          <div className="space-y-2">
            {routeStops.map((stop, idx) => (
              <div
                key={stop!.id}
                className="flex items-center gap-3 p-3 bg-slate-50/70 hover:bg-slate-50 rounded-lg border border-slate-200/80 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ backgroundColor: selectedRoute.color }}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {stop!.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {stop!.landmarkSnippet || stop!.description}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {stop!.code}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Avg Wait: ~{stop!.avgWaitMinutes} min
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
