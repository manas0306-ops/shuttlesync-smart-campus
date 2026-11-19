import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Compass,
  Zap,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface LandingHeroProps {
  onStartTracking: () => void;
  onExplorePlanner: () => void;
  onViewDesignThinking: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartTracking,
  onExplorePlanner,
  onViewDesignThinking,
}) => {
  const { shuttles } = useSimulation();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a1532] via-[#091124] to-[#070d1e] border border-sky-500/20 p-8 md:p-14 shadow-2xl">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold tracking-wide shadow-md">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>PROJECT P05 • "KNOW BEFORE YOU GO"</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Smart Campus Shuttle Tracking, Crowd Prediction & Last-Mile Mobility
        </h1>

        {/* Mission Statement Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Eliminate commuter uncertainty, vehicle bunching, and overcrowded stops. ShuttleSync delivers real-time shuttle telemetry, AI arrival forecasting, and intelligent pickup routing for universities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onStartTracking}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-sky-500/25 transition-all active:scale-95"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            Launch Live Campus Radar
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={onExplorePlanner}
            className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            Plan Journey
          </button>

          <button
            onClick={onViewDesignThinking}
            className="py-3.5 px-5 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 hover:text-white font-bold text-sm border border-purple-500/30 flex items-center gap-2 transition-all active:scale-95"
          >
            🎓 Design Thinking Dossier
          </button>
        </div>

        {/* Live Metrics Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-black text-white tabular-nums">{shuttles.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Active EV Shuttles</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-black text-sky-400 tabular-nums">8</div>
            <div className="text-[11px] text-slate-400 font-medium">Smart Sensor Stops</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-black text-emerald-400 tabular-nums">&lt; 4m</div>
            <div className="text-[11px] text-slate-400 font-medium">Average Wait Time</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-black text-amber-400 tabular-nums">98.4%</div>
            <div className="text-[11px] text-slate-400 font-medium">On-Time Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
