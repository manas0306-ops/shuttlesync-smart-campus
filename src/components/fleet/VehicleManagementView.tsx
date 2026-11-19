import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { CAMPUS_DRIVERS } from '../../data/driversData';
import {
  Bus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Eye,
  Navigation,
  SlidersHorizontal,
  ChevronRight,
  Radio,
} from 'lucide-react';

interface VehicleManagementViewProps {
  onNavigateTab: (tab: string) => void;
}

export const VehicleManagementView: React.FC<VehicleManagementViewProps> = ({ onNavigateTab }) => {
  const { shuttles, setSelectedShuttleId } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredShuttles = shuttles.filter(shuttle => {
    const matchesSearch =
      shuttle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shuttle.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoute = routeFilter === 'all' || shuttle.routeId === routeFilter;
    const matchesStatus = statusFilter === 'all' || shuttle.status === statusFilter;
    return matchesSearch && matchesRoute && matchesStatus;
  });

  const handleTrackOnMap = (shuttleId: string) => {
    setSelectedShuttleId(shuttleId);
    onNavigateTab('live-map');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Shuttle Fleet Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status, driver assignments, and passenger occupancy across Lovely Professional University
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search vehicle or driver..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 shadow-2xs"
            />
          </div>

          <select
            value={routeFilter}
            onChange={e => setRouteFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="all">All Routes</option>
            {SHUTTLE_ROUTES.map(route => (
              <option key={route.id} value={route.id}>
                {route.code} — {route.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="all">All Statuses</option>
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Crowded">Crowded</option>
            <option value="Approaching">Approaching</option>
          </select>
        </div>
      </div>

      {/* Structured Fleet Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Vehicle ID</th>
                <th className="py-3 px-4">Route Assignment</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Current Stop</th>
                <th className="py-3 px-6">Occupancy / Capacity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Next Stop & ETA</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShuttles.map(shuttle => {
                const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
                const currentStop = CAMPUS_STOPS.find(s => s.id === shuttle.currentStopId);
                const nextStop = CAMPUS_STOPS.find(s => s.id === shuttle.nextStopId);
                const driver = CAMPUS_DRIVERS.find(d => d.assignedVehicleId === shuttle.id);
                const occupancyPercent = Math.round((shuttle.passengerCount / shuttle.capacity) * 100);

                return (
                  <tr key={shuttle.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Vehicle ID */}
                    <td className="py-3 px-6">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: route?.color || '#2563eb' }}
                        />
                        {shuttle.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Speed: {shuttle.speedKmh} km/h • Bat: {shuttle.batteryPercent}%
                        {shuttle.isRealGPS && (
                          <span className="text-emerald-600 font-bold ml-1.5">● Live GPS</span>
                        )}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="py-3 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-2xs"
                        style={{ backgroundColor: route?.color || '#2563eb' }}
                      >
                        {route?.code || 'BUS'}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                        {route?.name}
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{shuttle.driverName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {driver?.driverCode || 'DRV'} • {driver?.phone}
                      </div>
                    </td>

                    {/* Current Stop */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {currentStop?.code || 'ST'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {currentStop?.name}
                      </div>
                    </td>

                    {/* Occupancy & Progress Bar */}
                    <td className="py-3 px-6">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className="text-slate-900">{shuttle.passengerCount} / {shuttle.capacity}</span>
                        <span className="text-slate-500">{occupancyPercent}%</span>
                      </div>
                      <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            occupancyPercent >= 90
                              ? 'bg-rose-500'
                              : occupancyPercent >= 70
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          shuttle.status === 'On Time'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : shuttle.status === 'Delayed'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : shuttle.status === 'Crowded'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {shuttle.status}
                      </span>
                    </td>

                    {/* Next Stop & ETA */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-blue-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{Math.round(shuttle.estimatedTimeToNextStop / 60)} min
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {nextStop?.name || 'Central Library'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleTrackOnMap(shuttle.id)}
                        className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 transition-colors shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        Track
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
