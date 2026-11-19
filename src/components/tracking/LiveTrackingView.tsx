import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { GoogleCampusMap } from '../map/GoogleCampusMap';
import { CampusMap as FallbackSVGMap } from '../map/CampusMap';
import { ShuttleDetailCard } from './ShuttleDetailCard';
import { Badge } from '../common/Badge';
import {
  Bus,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Info,
  Layers,
  Map,
} from 'lucide-react';

export const LiveTrackingView: React.FC = () => {
  const {
    shuttles,
    selectedShuttleId,
    selectedStopId,
    setSelectedShuttleId,
    setSelectedStopId,
  } = useSimulation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [useGoogleMap, setUseGoogleMap] = useState<boolean>(true);

  const selectedShuttle = shuttles.find(s => s.id === selectedShuttleId) || shuttles[0];
  const selectedStop = CAMPUS_STOPS.find(s => s.id === selectedStopId) || CAMPUS_STOPS[0];

  const filteredShuttles = shuttles.filter(s => {
    const route = SHUTTLE_ROUTES.find(r => r.id === s.routeId);
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route && route.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
            Active Fleet Radar • Lovely Professional University (LPU)
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Live LPU Campus Shuttle Radar</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time GPS telemetry, live passenger occupancy, and turn-by-turn route headway across LPU campus.
          </p>
        </div>

        {/* Quick Actions: Stop Switcher & Map Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Map Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <button
              onClick={() => setUseGoogleMap(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                useGoogleMap
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Google Maps
            </button>
            <button
              onClick={() => setUseGoogleMap(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                !useGoogleMap
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Campus Vector
            </button>
          </div>

          {/* Quick Stop Switcher */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <select
              value={selectedStopId || ''}
              onChange={e => setSelectedStopId(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {CAMPUS_STOPS.map(stop => (
                <option key={stop.id} value={stop.id}>
                  {stop.code} - {stop.name.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Map + Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {useGoogleMap ? (
            <GoogleCampusMap heightClass="h-[540px]" />
          ) : (
            <FallbackSVGMap heightClass="h-[540px]" />
          )}

          {/* Map Guidance Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>On Time (Green)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ml-2" />
              <span>Approaching (Sky)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-2" />
              <span>Crowded (Yellow)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 ml-2" />
              <span>Delayed (Red)</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Lovely Professional University, Phagwara, Punjab
            </div>
          </div>
        </div>

        {/* Right Column: Shuttle Inspector & List (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Detailed Inspector Card */}
          {selectedShuttle && (
            <ShuttleDetailCard shuttle={selectedShuttle} />
          )}

          {/* Shuttle Selector Cards List */}
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Bus className="w-4 h-4 text-sky-400" />
                Active LPU Fleet ({shuttles.length})
              </h3>
              <span className="text-[11px] text-slate-400">Select to inspect</span>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search vehicle or route..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-700/80 focus:outline-none focus:border-sky-500 placeholder-slate-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="all">All</option>
                <option value="On Time">On Time</option>
                <option value="Approaching">Approaching</option>
                <option value="Crowded">Crowded</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {filteredShuttles.map(shuttle => {
                const isSelected = selectedShuttleId === shuttle.id;
                const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
                const nextStop = CAMPUS_STOPS.find(s => s.id === shuttle.nextStopId);

                return (
                  <div
                    key={shuttle.id}
                    onClick={() => setSelectedShuttleId(shuttle.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/50 shadow-md shadow-sky-500/10'
                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: route?.color || '#0284c7' }}
                        />
                        <span className="text-xs font-bold text-white">{shuttle.name}</span>
                        {shuttle.isRealGPS && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            LIVE GPS
                          </span>
                        )}
                      </div>
                      <Badge status={shuttle.status} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1 truncate max-w-[65%]">
                        <span className="text-slate-500">Next:</span>
                        <span className="text-slate-300 font-medium truncate">{nextStop?.name}</span>
                      </div>
                      <div className="font-semibold text-sky-400">
                        ~{Math.ceil(shuttle.estimatedTimeToNextStop / 60)} min
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
