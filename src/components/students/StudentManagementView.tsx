import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { LPU_STUDENTS_REGISTRY } from '../../data/studentsData';
import { SHUTTLE_ROUTES, CAMPUS_STOPS } from '../../data/campusData';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Leaf,
  Navigation,
  ArrowRight,
  Shield,
  Star,
  Users,
  Compass,
  Bookmark,
} from 'lucide-react';

interface StudentManagementViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  onNavigateTab,
  onOpenProfile,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { userRole, shuttles } = useSimulation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubTab, setSelectedSubTab] = useState<'hub' | 'directory'>(
    userRole === 'admin' ? 'directory' : 'hub'
  );

  const filteredStudents = LPU_STUDENTS_REGISTRY.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.registrationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Next Arriving Shuttle for student
  const nextShuttle = shuttles[0];
  const nextRoute = SHUTTLE_ROUTES.find(r => r.id === nextShuttle.routeId);

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Student Transit Hub & Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized commute dashboard, saved routes, transit passes, and university commuter registry
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
          <button
            onClick={() => setSelectedSubTab('hub')}
            className={`py-1.5 px-3 text-xs font-bold rounded-md transition-all ${
              selectedSubTab === 'hub'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Transit Hub
          </button>
          <button
            onClick={() => setSelectedSubTab('directory')}
            className={`py-1.5 px-3 text-xs font-bold rounded-md transition-all ${
              selectedSubTab === 'directory'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            University Student Directory
          </button>
        </div>
      </div>

      {/* VIEW 1: STUDENT TRANSIT HUB */}
      {selectedSubTab === 'hub' && (
        <div className="space-y-6">
          {/* Student Welcome Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                {user ? user.fullName.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Welcome back, {user ? user.fullName : 'Maanas Pandey'}!
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    Active Semester Pass
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">
                  Registration ID: {user?.studentId || '12214589'} • School of Computer Science & Engineering
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                  <span>Hostel: BH-4 Central</span>
                  <span>•</span>
                  <span>Favorite Corridors: Gate 1 ↔ Block 34 Library</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={onOpenProfile}
                className="py-2 px-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Account Profile
              </button>
              <button
                onClick={() => onNavigateTab('planner')}
                className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                Plan Journey
              </button>
            </div>
          </div>

          {/* Next Arriving Shuttle Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Next Arriving Shuttle At Your Preferred Stop</h4>
                    <span className="text-xs text-slate-500">Block 32-34 Central Library (ST-02)</span>
                  </div>
                </div>

                <span
                  className="px-2.5 py-1 rounded text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: nextRoute?.color || '#2563eb' }}
                >
                  {nextRoute?.code || 'R-101'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Arrival</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">2 mins</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● On Schedule</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Vehicle Occupancy</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {nextShuttle.passengerCount} / {nextShuttle.capacity}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Moderate crowd (seats open)</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Driver</div>
                  <div className="text-sm font-black text-slate-900 mt-2 truncate">{nextShuttle.driverName}</div>
                  <div className="text-[10px] text-amber-600 font-bold mt-0.5">★ 4.9 Rating</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Next stop after Library: <strong>Uni-Mall Food Square</strong></span>
                <button
                  onClick={() => onNavigateTab('live-map')}
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                >
                  Track Live on Map <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Eco & Sustainability Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold">
                  <Leaf className="w-4 h-4 text-emerald-200" />
                  Campus Green Mobility
                </div>
                <h4 className="text-lg font-black mt-2 leading-tight">
                  Your Commute Saved 18.4 kg CO₂
                </h4>
                <p className="text-xs text-emerald-100 mt-1.5 leading-relaxed">
                  By using electric campus shuttles over petrol auto-rickshaws across 46 rides this semester.
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-400/40 mt-4 flex items-center justify-between text-xs">
                <span>Green Commuter Rank</span>
                <strong className="text-white font-mono bg-emerald-800/40 px-2 py-0.5 rounded">Top 5% at LPU</strong>
              </div>
            </div>
          </div>

          {/* Saved Favorite Routes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Saved Commute Corridors</h4>
                <p className="text-xs text-slate-500">Quick-access routes configured for daily academic schedule</p>
              </div>
              <button
                onClick={() => onNavigateTab('planner')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                + Add Route
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Morning Gate 1 Feeder → Library Block 34
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Route R-101 • Daily 08:15 AM • Typical commute: ~6 mins
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('live-map')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 rounded-md font-bold text-xs transition-colors"
                >
                  Check ETA
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    Hostel BH 1-7 → Uni-Mall Student Square
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Route R-303 • Daily 05:30 PM • Typical commute: ~4 mins
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('live-map')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 rounded-md font-bold text-xs transition-colors"
                >
                  Check ETA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: UNIVERSITY STUDENT DIRECTORY (ADMIN VIEW) */}
      {selectedSubTab === 'directory' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by student name, registration ID, or email..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Showing {filteredStudents.length} Registered Commuters
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Student Commuter</th>
                  <th className="py-3 px-4">Registration ID</th>
                  <th className="py-3 px-4">Department / School</th>
                  <th className="py-3 px-4">Hostel / Origin</th>
                  <th className="py-3 px-4">Primary Route</th>
                  <th className="py-3 px-4">Pass Status</th>
                  <th className="py-3 px-6 text-right">Total Rides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6">
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{student.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {student.registrationId}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
                      {student.department}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {student.hostelOrDayScholar}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {student.primaryRoute}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {student.passStatus}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right font-bold text-slate-900">
                      {student.totalTripsThisMonth} rides
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
