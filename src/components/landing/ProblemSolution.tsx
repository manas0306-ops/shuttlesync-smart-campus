import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  EyeOff,
  Navigation,
  Compass,
  Zap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  const problems = [
    {
      icon: Clock,
      title: 'Uncertain Shuttle Arrival Times',
      desc: 'Students stand for 20-35 minutes guessing if a vehicle is on route, causing academic tardiness and anxiety.',
    },
    {
      icon: Users,
      title: 'Shuttle Bunching & Overcrowding',
      desc: 'Two buses arrive back-to-back, followed by a 30-minute void. Downstream stops are left stranded with 100% full vehicles.',
    },
    {
      icon: EyeOff,
      title: 'Zero Live Telemetry Visibility',
      desc: 'No campus transit GPS feed exists. Commuters have no way to verify whether a shuttle has broken down or altered routes.',
    },
    {
      icon: AlertTriangle,
      title: 'Suboptimal Stop Selection',
      desc: 'Students pack into the primary gate stop while an adjacent sheltered stop 200m away sits with an empty shuttle.',
    },
  ];

  const solutions = [
    {
      icon: Compass,
      title: 'Predictive Live Fleet Radar',
      desc: 'Turn-by-turn SVG tracking with heading angles, dynamic speed, and second-by-second countdown ETAs.',
    },
    {
      icon: Zap,
      title: 'Real-Time Crowd Telemetry',
      desc: 'Color-coded Low, Moderate, High, and Full capacity indicators with seat availability before stepping outside.',
    },
    {
      icon: Sparkles,
      title: 'Smart Stop Recommendations',
      desc: 'Proprietary algorithm directs students to the fastest, least crowded pickup stop within walking radius.',
    },
    {
      icon: ShieldCheck,
      title: 'Driver-Student Sync Console',
      desc: 'Tactile driver tablet dashboard for one-tap waypoint logging, passenger counts, and instant hazard alerts.',
    },
  ];

  return (
    <div className="space-y-10 py-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
          The Campus Transportation Gap
        </span>
        <h2 className="text-3xl font-black text-white">Why Campus Transit Needs ShuttleSync</h2>
        <p className="text-sm text-slate-400">
          From arbitrary waiting chaos to synchronized, predictable university mobility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Problem Card */}
        <div className="bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 border border-rose-500/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">The Waiting Dilemma</h3>
              <p className="text-xs text-rose-300">The current status quo facing university commuters</p>
            </div>
          </div>

          <div className="space-y-4">
            {problems.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <Icon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solution Card */}
        <div className="bg-gradient-to-b from-sky-950/20 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 border border-sky-500/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">The ShuttleSync Architecture</h3>
              <p className="text-xs text-sky-300">Predictable, transparent smart-campus mobility</p>
            </div>
          </div>

          <div className="space-y-4">
            {solutions.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <Icon className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
