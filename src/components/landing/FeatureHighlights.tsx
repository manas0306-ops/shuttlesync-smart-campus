import React from 'react';
import {
  Compass,
  Zap,
  Users,
  Sparkles,
  MapPin,
  Bell,
  BarChart3,
  Car,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface FeatureHighlightsProps {
  onNavigateTab: (tabId: string) => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({ onNavigateTab }) => {
  const features = [
    {
      id: 'tracking',
      title: 'Live Shuttle Tracking',
      desc: 'Real-time GPS kinematics across university road network with heading rotation and custom shuttle-cart cursor.',
      icon: Compass,
      tag: 'Core Telemetry',
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400',
    },
    {
      id: 'prediction',
      title: 'Smart Arrival Prediction (ETA)',
      desc: 'Predictive headway engine factoring road traffic, shuttle speed, and rain modifiers with confidence ratings.',
      icon: Zap,
      tag: 'Forecasting',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'crowd',
      title: 'Dynamic Crowd Monitoring',
      desc: 'Four-tier capacity diagnostics (Low, Moderate, High, Full) with simulated peak-hour surge triggers.',
      icon: Users,
      tag: 'Capacity Engine',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
    {
      id: 'recommendations',
      title: 'Smart Stop Recommendations',
      desc: 'Directs students to nearby alternative stops that save transit time and offer guaranteed seating.',
      icon: Sparkles,
      tag: 'AI Recommendation',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    },
    {
      id: 'planner',
      title: 'Inter-Campus Route Planner',
      desc: 'Multi-modal journey planner with walking connections, intermediate stops timeline, and carbon savings.',
      icon: MapPin,
      tag: 'Multi-Modal',
      color: 'from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-400',
    },
    {
      id: 'analytics',
      title: 'Mobility Analytics & Trends',
      desc: 'Rich SVG performance curves for hourly wait patterns, fleet load factors, and stop popularity indices.',
      icon: BarChart3,
      tag: 'Data Intelligence',
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400',
    },
    {
      id: 'driver',
      title: 'Driver Touch Cockpit',
      desc: 'Tablet-optimized console for drivers to log stop arrivals, update passenger boarding, and broadcast road delays.',
      icon: Car,
      tag: 'Operator Mode',
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    },
    {
      id: 'designThinking',
      title: 'Design Thinking Dossier',
      desc: 'Academic project portfolio covering Empathy personas, Field observation logs, Ideation matrix, and Team viva prep.',
      icon: ShieldCheck,
      tag: 'Academic Defense',
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400',
    },
  ];

  return (
    <div className="space-y-8 py-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
          Integrated Platform Modules
        </span>
        <h2 className="text-3xl font-black text-white">Full-Stack Campus Mobility Ecosystem</h2>
        <p className="text-sm text-slate-400">
          Engineered for students, operators, and campus transit management.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map(f => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              onClick={() => onNavigateTab(f.id)}
              className={`bg-gradient-to-br ${f.color} rounded-2xl p-6 border transition-all hover:scale-[1.02] cursor-pointer space-y-4 flex flex-col justify-between group shadow-lg`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                    {f.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                <span>Explore Module</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
