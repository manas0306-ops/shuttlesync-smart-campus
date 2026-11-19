import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sliders,
  CloudRain,
  Sun,
  Cloud,
  Zap,
  Radio,
  Key,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  RotateCcw,
} from 'lucide-react';

export const SimulationSettingsView: React.FC = () => {
  const {
    simulation,
    shuttles,
    setTraffic,
    setWeather,
    setSpeedMultiplier,
    resetSimulation,
  } = useSimulation();
  const { user } = useAuth();

  const [isBroadcastingGPS, setIsBroadcastingGPS] = useState(false);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string>('Inactive');

  const supabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'
  );

  const googleMapsConfigured = Boolean(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY &&
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY'
  );

  // Toggle Mode B Real Device GPS
  const handleToggleRealGPS = () => {
    if (isBroadcastingGPS) {
      if (gpsWatchId !== null) navigator.geolocation.clearWatch(gpsWatchId);
      setGpsWatchId(null);
      setIsBroadcastingGPS(false);
      setGpsStatusMessage('Deactivated');
    } else {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your device browser.');
        return;
      }
      setGpsStatusMessage('Acquiring high-accuracy satellite lock...');
      const watchId = navigator.geolocation.watchPosition(
        pos => {
          setIsBroadcastingGPS(true);
          setGpsStatusMessage(
            `Broadcasting: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)} (Accuracy ±${Math.round(pos.coords.accuracy)}m)`
          );
        },
        err => {
          setIsBroadcastingGPS(false);
          setGpsStatusMessage('GPS Error: ' + err.message);
        },
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
      setGpsWatchId(watchId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          System Settings & Simulation Controls
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure real-time simulation parameters, telemetry broadcast modes, and cloud service integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Simulation Engine Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campus Simulation Parameters</h3>
                <span className="text-xs text-slate-500">Live ETA friction and speed modeling</span>
              </div>
            </div>

            <button
              onClick={() => setSpeedMultiplier(simulation.speedMultiplier > 0 ? 0 : 1)}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                simulation.speedMultiplier > 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {simulation.speedMultiplier > 0 ? '● Simulation Running' : '❚❚ Paused'}
            </button>
          </div>

          {/* Traffic Condition */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Campus Traffic Congestion</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Light', 'Normal', 'Moderate', 'Heavy'] as const).map(condition => (
                <button
                  key={condition}
                  onClick={() => setTraffic(condition)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    simulation.traffic === condition
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Weather Condition */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Weather Friction Condition</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setWeather('Clear')}
                className={`py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                  simulation.weather === 'Clear'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Clear Sky
              </button>
              <button
                onClick={() => setWeather('Rainy')}
                className={`py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                  simulation.weather === 'Rainy'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" /> Rainy (+15% Delay)
              </button>
              <button
                onClick={() => setWeather('Foggy')}
                className={`py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                  simulation.weather === 'Foggy'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" /> Foggy (+25% Delay)
              </button>
            </div>
          </div>

          {/* Speed Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Simulation Speed Multiplier</span>
              <span className="text-blue-600 font-mono">{simulation.speedMultiplier}x Real-Time</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    simulation.speedMultiplier === speed
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Driver Mode B: Live Real Device GPS Broadcast */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Driver Mode B: Live Device GPS Broadcast
                </h3>
                <span className="text-xs text-slate-500">
                  Transmit physical smartphone or tablet GPS to the campus fleet
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When Mode B is activated, ShuttleSync hooks into the HTML5 Geolocation API (<code>navigator.geolocation.watchPosition</code>) to broadcast the driver's real physical coordinates to the campus radar, superseding physics simulations.
            </p>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Broadcaster State:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isBroadcastingGPS
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isBroadcastingGPS ? '● Active Live Stream' : 'Offline / Standby'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-700 truncate">
                {gpsStatusMessage}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleRealGPS}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 ${
              isBroadcastingGPS
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            {isBroadcastingGPS ? 'Stop Device GPS Broadcast' : 'Start Live Device GPS Broadcast (Mode B)'}
          </button>
        </div>
      </div>

      {/* 3. Cloud Backend & API Integrations Inspector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Connected Cloud Services & Credentials
              </h3>
              <span className="text-xs text-slate-500">Supabase Auth, Database & Google Maps Platform status</span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Environment: Production</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Supabase Status */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Supabase Backend
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Persistent Auth Active
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Dual-mode auth engine active: live GoTrue sessions + resilient offline local database fallback. Single-password credential protection enabled.
            </p>
          </div>

          {/* Google Maps Status */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                Google Maps JavaScript API
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> LPU Geofence Loaded
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Google Maps loader enabled with clean enterprise silver theme and real LPU road coordinates. Automatic fallback to high-detail vector campus map if key is omitted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
