import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { GoogleCampusMap } from '../map/GoogleCampusMap';
import { CAMPUS_DRIVERS } from '../../data/driversData';
import {
  Bus,
  Users,
  Clock,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Star,
  MapPin,
  TrendingUp,
  Activity,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Radio,
  Sliders,
  Calendar,
  Leaf,
  Layers,
} from 'lucide-react';

interface FleetDashboardViewProps {
  onNavigateTab: (tab: string) => void;
}

export const FleetDashboardView: React.FC<FleetDashboardViewProps> = ({ onNavigateTab }) => {
  const {
    shuttles,
    simulation,
    selectedShuttleId,
    setSelectedShuttleId,
    selectedStopId,
    setSelectedStopId,
  } = useSimulation();

  const [activeBottomTab, setActiveBottomTab] = useState<'activity' | 'drivers' | 'alerts' | 'journeys'>('activity');

  // Selected Shuttle Data
  const selectedShuttle =
    shuttles.find(s => s.id === selectedShuttleId) || shuttles[0];

  const currentRoute = SHUTTLE_ROUTES.find(r => r.id === selectedShuttle?.routeId);
  const currentStop = CAMPUS_STOPS.find(s => s.id === selectedShuttle?.currentStopId);
  const nextStop = CAMPUS_STOPS.find(s => s.id === selectedShuttle?.nextStopId);
  const assignedDriver = CAMPUS_DRIVERS.find(d => d.assignedVehicleId === selectedShuttle?.id);

  // Fleet Statistics
  const totalCapacity = shuttles.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shuttles.reduce((acc, s) => acc + s.passengerCount, 0);
  const avgOccupancyPercent = Math.round((totalOccupancy / (totalCapacity || 1)) * 100);
  const onTimeCount = shuttles.filter(s => s.status === 'On Time' || s.status === 'Approaching').length;
  const delayedCount = shuttles.filter(s => s.status === 'Delayed').length;

  // Occupancy Rating
  const occupancyPercent = Math.round(
    ((selectedShuttle?.passengerCount || 0) / (selectedShuttle?.capacity || 1)) * 100
  );

  const getOccupancyBadge = (percent: number) => {
    if (percent >= 90) return { label: 'Full Capacity', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (percent >= 70) return { label: 'High Crowd', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (percent >= 40) return { label: 'Moderate', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    return { label: 'Low Crowd', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const occupancyBadge = getOccupancyBadge(occupancyPercent);

  return (
    <div className="space-y-6">
      {/* 1. TOP METRICS KPI CARDS BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fleet Online</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{shuttles.length} / {shuttles.length}</div>
            <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% Available
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Bus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In-Transit Commuters</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{totalOccupancy} Riders</div>
            <div className="text-[11px] font-medium text-blue-600 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Normal Campus Rush
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fleet Occupancy</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{avgOccupancyPercent}%</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              {totalCapacity - totalOccupancy} seats free
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">On-Time Index</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">94.2%</div>
            <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Meets SLA (≥90%)
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between col-span-2 md:col-span-1">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Delays</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{delayedCount} Vehicle</div>
            <div className="text-[11px] font-medium text-amber-600 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3 h-3" /> Minor Traffic Delay
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. MAIN SPLIT DASHBOARD: LEFT INFORMATION PANEL + MAIN MAP PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT INFORMATION PANEL (4 COLS ON LG) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Vehicle Switcher Tabs */}
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
            {shuttles.map(shuttle => {
              const isSelected = shuttle.id === selectedShuttle?.id;
              const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
              return (
                <button
                  key={shuttle.id}
                  onClick={() => setSelectedShuttleId(shuttle.id)}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: route?.color || '#2563eb' }}
                  />
                  {shuttle.name.split(' ')[1] || shuttle.name}
                </button>
              );
            })}
          </div>

          {/* Selected Vehicle Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header / ID & Status */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vehicle Telemetry
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {selectedShuttle?.name}
                </h3>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentRoute?.color }}
                  />
                  {currentRoute?.name} ({currentRoute?.code})
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                    selectedShuttle?.status === 'On Time'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedShuttle?.status === 'Delayed'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : selectedShuttle?.status === 'Crowded'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {selectedShuttle?.status}
                </span>
                {selectedShuttle?.isRealGPS && (
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-1">
                    <Radio className="w-3 h-3 animate-pulse" /> Live Device GPS
                  </div>
                )}
              </div>
            </div>

            {/* Driver Details Card */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  {selectedShuttle?.driverName
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {selectedShuttle?.driverName}
                    <span className="text-[10px] text-slate-400 font-mono">({assignedDriver?.driverCode || 'DRV-801'})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {assignedDriver?.rating || 4.9}
                    </span>
                    <span>•</span>
                    <span>Shift: {assignedDriver?.dutyStatus || 'On Duty'}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${selectedShuttle?.driverPhone}`}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg shadow-2xs transition-colors"
                title="Call Driver"
              >
                <Phone className="w-4 h-4 text-slate-600" />
              </a>
            </div>

            {/* Departure, Arrival & Next Stop Timings */}
            <div className="p-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Current Speed</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    {selectedShuttle?.speedKmh} km/h
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Estimated Next Stop</div>
                  <div className="text-sm font-bold text-blue-600 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{Math.round((selectedShuttle?.estimatedTimeToNextStop || 120) / 60)} mins
                  </div>
                </div>
              </div>

              {/* Next Stop Highlight */}
              <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200/80">
                <div className="flex items-center justify-between text-[11px] font-semibold text-blue-800">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" /> Heading To Next Stop
                  </span>
                  <span className="text-[10px] font-mono text-blue-600">{nextStop?.code}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {nextStop?.name || 'Block 32-34 Central Library'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Wait time at stop: ~{nextStop?.avgWaitMinutes || 3.5} mins • Waiting crowd: {nextStop?.currentCrowdCount || 35}
                </div>
              </div>

              {/* Passenger Capacity Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Passenger Occupancy</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {selectedShuttle?.passengerCount} / {selectedShuttle?.capacity}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${occupancyBadge.color}`}>
                      {occupancyBadge.label}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      occupancyPercent >= 90
                        ? 'bg-rose-500'
                        : occupancyPercent >= 70
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Available Seats: <strong className="text-slate-800">{selectedShuttle?.capacity - selectedShuttle?.passengerCount}</strong></span>
                  <span>Battery: <strong className="text-slate-800">{selectedShuttle?.batteryPercent}%</strong></span>
                </div>
              </div>

              {/* Journey Metrics */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block">Distance Covered:</span>
                  <strong className="text-slate-800">4.2 km (Loop 2)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Remaining Leg:</span>
                  <strong className="text-slate-800">1.8 km to Gate 1</strong>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigateTab('fleet')}
                className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Inspect Fleet Details
              </button>
              <button
                onClick={() => onNavigateTab('routes')}
                className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors text-center"
              >
                View Full Route
              </button>
            </div>
          </div>
        </div>

        {/* MAIN MAP PANEL (8 COLS ON LG) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    LPU Campus Fleet Radar — Geographical View
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Phagwara, Punjab • Lat 31.2530° N, Lng 75.7037° E
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('routes')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded bg-blue-50 border border-blue-100 transition-colors hidden sm:block"
                >
                  Manage Routes
                </button>
              </div>
            </div>

            {/* Interactive Map Component */}
            <GoogleCampusMap
              onSelectShuttle={id => setSelectedShuttleId(id)}
              onSelectStop={id => setSelectedStopId(id)}
              heightClass="h-[520px]"
            />
          </div>
        </div>
      </div>

      {/* 3. BOTTOM INFORMATION AREA: TABBED OPERATIONAL DATA TABLES & LOGS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveBottomTab('activity')}
            className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeBottomTab === 'activity'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Recent Vehicle Activity
          </button>
          <button
            onClick={() => setActiveBottomTab('drivers')}
            className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeBottomTab === 'drivers'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Driver Updates & Telemetry
          </button>
          <button
            onClick={() => setActiveBottomTab('alerts')}
            className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeBottomTab === 'alerts'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Route Alerts & Traffic
          </button>
          <button
            onClick={() => setActiveBottomTab('journeys')}
            className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeBottomTab === 'journeys'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" /> Recent Completed Journeys
          </button>
        </div>

        {/* Tab 1: Recent Activity Feed */}
        {activeBottomTab === 'activity' && (
          <div className="divide-y divide-slate-100">
            <div className="p-3.5 px-6 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-900">Shuttle S-101</span>
                <span className="text-slate-500">arrived at</span>
                <strong className="text-blue-600">Block 32-34 Central Library</strong>
                <span className="text-[11px] text-slate-400 font-mono">(ST-02)</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                <span>+8 Boarded / 4 Alighted</span>
                <span className="font-mono">Just now</span>
              </div>
            </div>

            <div className="p-3.5 px-6 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-bold text-slate-900">Shuttle S-102</span>
                <span className="text-slate-500">departed from</span>
                <strong className="text-blue-600">Uni-Mall Student Square</strong>
                <span className="text-[11px] text-slate-400 font-mono">(ST-03)</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                <span>Occupancy: 26 / 28 (92%)</span>
                <span className="font-mono">1m ago</span>
              </div>
            </div>

            <div className="p-3.5 px-6 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-bold text-slate-900">Shuttle S-301</span>
                <span className="text-slate-500">reported traffic congestion near</span>
                <strong className="text-amber-700">Boys Hostel BH 1-7 Turn</strong>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                <span className="text-amber-600 font-semibold">+5 mins delay</span>
                <span className="font-mono">3m ago</span>
              </div>
            </div>

            <div className="p-3.5 px-6 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-900">Shuttle S-201</span>
                <span className="text-slate-500">completed route inspection at</span>
                <strong className="text-blue-600">Block 36-38 Engineering Quad</strong>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                <span>Speed: 22 km/h</span>
                <span className="font-mono">5m ago</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Driver Updates */}
        {activeBottomTab === 'drivers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-6">Driver Name</th>
                  <th className="py-2.5 px-4">Code</th>
                  <th className="py-2.5 px-4">Assigned Vehicle</th>
                  <th className="py-2.5 px-4">Route</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Trips Today</th>
                  <th className="py-2.5 px-6 text-right">Last Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CAMPUS_DRIVERS.map(driver => (
                  <tr key={driver.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        {driver.name.charAt(0)}
                      </div>
                      {driver.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{driver.driverCode}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {driver.assignedVehicleId.replace('shuttle-', 'S-').toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {driver.assignedRouteId === 'route-blue-express' ? 'R-101 Express' : driver.assignedRouteId === 'route-green-loop' ? 'R-202 Academic' : 'R-303 Hostel'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${driver.dutyStatus === 'On Duty' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {driver.dutyStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{driver.totalTripsToday} trips</td>
                    <td className="py-3 px-6 text-right text-slate-500 font-mono text-[11px]">{driver.lastLocationUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Alerts */}
        {activeBottomTab === 'alerts' && (
          <div className="p-4 space-y-2 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-amber-900">Traffic Surge Notice — Uni-Mall & Food Square</div>
                <div className="text-amber-800 mt-0.5">Heavy student foot traffic between Block 34 Library and Uni-Mall. Average transit delays of 2-4 minutes expected on Route R-101 and R-303.</div>
                <div className="text-[10px] text-amber-700 mt-1">Broadcasted by Transport Control at 08:30 AM</div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Radio className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-blue-900">Morning Examination Shuttle Frequency Active</div>
                <div className="text-blue-800 mt-0.5">Shuttle headway reduced to every 5 minutes connecting Main Gate 1 to Block 36-38 Engineering Quad for mid-term exam transit.</div>
                <div className="text-[10px] text-blue-700 mt-1">Effective 08:00 AM – 11:30 AM</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Recent Journeys */}
        {activeBottomTab === 'journeys' && (
          <div className="divide-y divide-slate-100 text-xs">
            <div className="p-3.5 px-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
              <div>
                <span className="font-bold text-slate-900">Maanas Pandey (12214589)</span>
                <span className="text-slate-500"> • Main Gate 1 (NH-44) → Block 32-34 Library</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> 380g CO₂ saved
                </span>
                <span className="text-slate-400 font-mono">Today, 08:35 AM</span>
              </div>
            </div>

            <div className="p-3.5 px-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
              <div>
                <span className="font-bold text-slate-900">Ananya Sharma (12209845)</span>
                <span className="text-slate-500"> • Girls Hostel GH-2 → Uni-Mall Square</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> 240g CO₂ saved
                </span>
                <span className="text-slate-400 font-mono">Today, 09:12 AM</span>
              </div>
            </div>

            <div className="p-3.5 px-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
              <div>
                <span className="font-bold text-slate-900">Rohan Verma (12115672)</span>
                <span className="text-slate-500"> • Uni-Mall Food Square → Block 36-38 Tech Quad</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> 290g CO₂ saved
                </span>
                <span className="text-slate-400 font-mono">Today, 09:40 AM</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
