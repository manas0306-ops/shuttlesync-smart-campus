import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_DRIVERS } from '../../data/driversData';
import { SHUTTLE_ROUTES } from '../../data/campusData';
import { DriverRecord } from '../../types';
import {
  Car,
  Search,
  Phone,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Lock,
} from 'lucide-react';

export const DriverManagementView: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { userRole } = useSimulation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverRecord | null>(CAMPUS_DRIVERS[0]);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDrivers = CAMPUS_DRIVERS.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.dutyStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isAuthorized = userRole === 'admin' || userRole === 'driver';

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Driver Roster & Telemetry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active transit operators, duty shifts, ratings, and verified emergency dispatch records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search driver by name or ID..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 shadow-2xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="all">All Shifts</option>
            <option value="On Duty">On Duty</option>
            <option value="On Break">On Break</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Drivers Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drivers Roster Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Driver Details</th>
                  <th className="py-3 px-4">Assigned Shuttle</th>
                  <th className="py-3 px-4">Shift Hours</th>
                  <th className="py-3 px-4">Duty Status</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-6 text-right">Trips Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDrivers.map(driver => {
                  const isSelected = selectedDriver?.id === driver.id;
                  const route = SHUTTLE_ROUTES.find(r => r.id === driver.assignedRouteId);

                  return (
                    <tr
                      key={driver.id}
                      onClick={() => setSelectedDriver(driver)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3 px-6">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {driver.name.charAt(0)}
                          </div>
                          <div>
                            <div>{driver.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{driver.driverCode}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          {driver.assignedVehicleId.replace('shuttle-', 'S-').toUpperCase()}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {route?.code || 'Route'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {driver.shiftHours.split('(')[0]}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            driver.dutyStatus === 'On Duty'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {driver.dutyStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {driver.rating}
                        </span>
                      </td>

                      <td className="py-3 px-6 text-right font-bold text-slate-900">
                        {driver.totalTripsToday} trips
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Driver Information Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          {selectedDriver ? (
            <>
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                  {selectedDriver.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {selectedDriver.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedDriver.driverCode} • License: {selectedDriver.licenseNumber}
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {selectedDriver.rating} / 5.0 (284 Commuter Reviews)
                  </div>
                </div>
              </div>

              {/* Assignment & Shift Information */}
              <div className="space-y-2.5 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned Vehicle:</span>
                    <strong className="text-blue-600 font-bold">
                      {selectedDriver.assignedVehicleId.replace('shuttle-', 'S-').toUpperCase()}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Operating Route:</span>
                    <strong className="text-slate-800">
                      {selectedDriver.assignedRouteId === 'route-blue-express'
                        ? 'R-101 Campus Express'
                        : selectedDriver.assignedRouteId === 'route-green-loop'
                        ? 'R-202 Academic Ring'
                        : 'R-303 Hostel Connector'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duty Shift:</span>
                    <strong className="text-slate-800">{selectedDriver.shiftHours}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">
                    Last Telemetry Ping
                  </div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {selectedDriver.lastLocationUpdate}
                  </div>
                </div>

                {/* Contact Information (Privacy-Protected) */}
                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/80 space-y-2">
                  <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Authorized Contact Record</span>
                    {isAuthorized ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                        <Lock className="w-3 h-3" /> Masked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Mobile Phone:</span>
                    <a
                      href={`tel:${selectedDriver.phone}`}
                      className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {isAuthorized ? selectedDriver.phone : '+91 98765 •••••'}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Emergency Dispatch:</span>
                    <strong className="text-slate-800 font-mono">
                      {isAuthorized ? selectedDriver.emergencyContact : '+91 98140 •••••'}
                    </strong>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a driver from the roster table to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
