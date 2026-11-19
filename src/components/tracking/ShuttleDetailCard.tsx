import React from 'react';
import { ShuttleVehicle } from '../../types';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import { OccupancyBar } from '../common/OccupancyBar';
import {
  Bus,
  User,
  Phone,
  Gauge,
  BatteryCharging,
  Clock,
  ArrowRight,
  BellRing,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface ShuttleDetailCardProps {
  shuttle: ShuttleVehicle;
  onClose?: () => void;
}

export const ShuttleDetailCard: React.FC<ShuttleDetailCardProps> = ({ shuttle }) => {
  const { triggerNotification } = useSimulation();
  const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
  const currentStop = CAMPUS_STOPS.find(s => s.id === shuttle.currentStopId);
  const nextStop = CAMPUS_STOPS.find(s => s.id === shuttle.nextStopId);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleSetAlert = () => {
    triggerNotification({
      title: `Alert Set for ${shuttle.name}`,
      message: `You will be notified when this shuttle is 1 minute from ${nextStop?.name || 'next stop'}.`,
      category: 'approaching',
      severity: 'success',
      shuttleId: shuttle.id,
      stopId: shuttle.nextStopId,
    });
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-5 shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl border flex items-center justify-center shadow-md"
            style={{
              backgroundColor: `${route?.color || '#0284c7'}15`,
              borderColor: `${route?.color || '#0284c7'}40`,
            }}
          >
            <Bus className="w-6 h-6" style={{ color: route?.color || '#38bdf8' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">{shuttle.name}</h3>
              <Badge status={shuttle.status} />
            </div>
            <p className="text-xs text-sky-400 font-medium">{route?.name || 'Campus Transit'}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">ETA to Next Stop</span>
          <span className="text-lg font-black text-sky-400 tabular-nums">
            {formatSeconds(shuttle.estimatedTimeToNextStop)}
          </span>
        </div>
      </div>

      {/* Transit Path Segment */}
      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 truncate max-w-[45%]">
            <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
            <span className="truncate">{currentStop?.name || 'Current Stop'}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-sky-500 shrink-0 mx-2 animate-pulse" />
          <div className="flex items-center gap-1.5 truncate max-w-[45%] text-slate-200 font-semibold justify-end">
            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
            <span className="truncate">{nextStop?.name || 'Next Stop'}</span>
          </div>
        </div>

        {/* Progress Bar Between Stops */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${shuttle.progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>Departed</span>
          <span>{Math.round(shuttle.progressPercent)}% En Route</span>
          <span>Approaching</span>
        </div>
      </div>

      {/* Occupancy Progress */}
      <div className="mb-4">
        <OccupancyBar current={shuttle.passengerCount} capacity={shuttle.capacity} size="md" />
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] mb-1">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            Speed
          </div>
          <div className="text-sm font-bold text-white tabular-nums">{shuttle.speedKmh} km/h</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] mb-1">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            EV Battery
          </div>
          <div className="text-sm font-bold text-white tabular-nums">{shuttle.batteryPercent}%</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Schedule Delay
          </div>
          <div className={`text-sm font-bold tabular-nums ${shuttle.delayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {shuttle.delayMinutes > 0 ? `+${shuttle.delayMinutes} min` : 'On Time'}
          </div>
        </div>
      </div>

      {/* Driver Information */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200 flex items-center gap-1">
              {shuttle.driverName}
              <span title="Verified Campus Staff">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">Campus Mobility Staff</div>
          </div>
        </div>
        <a
          href={`tel:${shuttle.driverPhone}`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-sky-400 hover:bg-slate-700 hover:text-sky-300 font-medium transition-colors"
        >
          <Phone className="w-3.5 h-3.5" /> Call Driver
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSetAlert}
          className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
        >
          <BellRing className="w-4 h-4" />
          Set Arrival Notification
        </button>
        <button
          onClick={() => {
            triggerNotification({
              title: 'Driver Notified',
              message: 'Campus transport dispatch notified of capacity request.',
              category: 'system',
              severity: 'info',
            });
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          title="Flag Overcrowding"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
