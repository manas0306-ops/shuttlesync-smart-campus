import React, { useState } from 'react';
import { DESIGN_THINKING_DATA } from '../../data/designThinkingData';
import {
  Heart,
  Eye,
  Target,
  Lightbulb,
  Cpu,
  CheckSquare,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Plus,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const DesignThinkingDocView: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [customObservations, setCustomObservations] = useState<Array<{ location: string; note: string; time: string }>>([]);
  const [newObsLocation, setNewObsLocation] = useState('');
  const [newObsNote, setNewObsNote] = useState('');

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObsLocation.trim() || !newObsNote.trim()) return;

    setCustomObservations(prev => [
      ...prev,
      {
        location: newObsLocation.trim(),
        note: newObsNote.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewObsLocation('');
    setNewObsNote('');
  };

  const stages = [
    { id: 0, label: 'Overview', icon: BookOpen, color: 'text-blue-600' },
    { id: 1, label: '1. Empathy', icon: Heart, color: 'text-rose-600' },
    { id: 2, label: '2. Observation', icon: Eye, color: 'text-amber-600' },
    { id: 3, label: '3. Define', icon: Target, color: 'text-indigo-600' },
    { id: 4, label: '4. Ideation', icon: Lightbulb, color: 'text-yellow-600' },
    { id: 5, label: '5. Prototype', icon: Cpu, color: 'text-blue-600' },
    { id: 6, label: '6. Testing', icon: CheckSquare, color: 'text-emerald-600' },
    { id: 7, label: '7. Team & Viva', icon: Users, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            INT335 Design Thinking Assignment P05
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Design Thinking Methodology & Academic Dossier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete human-centered design journey for Lovely Professional University (Project P05: Waiting for the Shuttle)
          </p>
        </div>

        <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <CheckSquare className="w-4 h-4 text-emerald-600" /> 7/7 Stages Documented
        </span>
      </div>

      {/* Stage Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {stages.map(stage => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : stage.color}`} />
              {stage.label}
            </button>
          );
        })}
      </div>

      {/* Stage Content Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* STAGE 0: OVERVIEW */}
        {activeStage === 0 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Executive Summary</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Project P05: Waiting for the Shuttle (ShuttleSync)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Campus mobility has historically suffered from acute information asymmetry: students wait blindly at physical stops with zero knowledge of incoming vehicle capacity, while shuttle drivers operate with static loops that fail to match real-time lecture shifts. ShuttleSync applies the 5-stage Stanford d.school Design Thinking framework to replace commuter anxiety with predictable, transparent transit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { title: '1. Empathize', desc: '142 survey respondents & 4 commuter archetypes', color: 'border-rose-200 text-rose-700 bg-rose-50/50' },
                { title: '2. Define', desc: 'Point of View synthesis & How Might We problem framing', color: 'border-indigo-200 text-indigo-700 bg-indigo-50/50' },
                { title: '3. Ideate', desc: '25 ideas, SCAMPER analysis, Impact-Effort 2x2 matrix', color: 'border-amber-200 text-amber-700 bg-amber-50/50' },
                { title: '4. Prototype', desc: 'React 19, Google Maps LPU radar, Supabase persistent auth', color: 'border-blue-200 text-blue-700 bg-blue-50/50' },
                { title: '5. Test', desc: 'SUS target 88.5, feedback refinement, live CI/CD deploy', color: 'border-emerald-200 text-emerald-700 bg-emerald-50/50' },
              ].map(st => (
                <div key={st.title} className={`p-4 rounded-xl border ${st.color}`}>
                  <div className="text-xs font-bold mb-1">{st.title}</div>
                  <div className="text-[11px] text-slate-600 leading-normal">{st.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 1: EMPATHY */}
        {activeStage === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Stage 1: Empathy</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Commuter Personas & Interview Discovery</h3>
              <p className="text-xs text-slate-600 mt-1">
                Deep qualitative immersion into diverse campus transit archetypes to uncover latent anxieties and behavioral patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DESIGN_THINKING_DATA.personas.map(persona => (
                <div
                  key={persona.id}
                  className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-2xs">
                        {persona.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{persona.name}</h4>
                        <div className="text-[11px] text-blue-600 font-semibold">{persona.tagline}</div>
                        <div className="text-[10px] text-slate-400">{persona.yearDepartment}</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 italic">
                      "{persona.quote}"
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-1">
                        Core Pain Points:
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                        {persona.painPoints.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                        Commuter Goals:
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                        {persona.goals.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                    <span>Usage: {persona.shuttleUsageFrequency}</span>
                    <span>Tech: {persona.techSavviness}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 2: OBSERVATION */}
        {activeStage === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Stage 2: Field Observation</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Ground Telemetry & Commuter Observations</h3>
              <p className="text-xs text-slate-600 mt-1">
                Direct contextual inquiries recorded across peak lecture switchover intervals at Lovely Professional University.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DESIGN_THINKING_DATA.observationLogs.map((obs, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="font-bold text-slate-900">{obs.location}</strong>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">{obs.timeSlot}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{obs.passengerMoodNotes}</p>
                  <div className="text-[11px] text-amber-800 font-semibold bg-amber-50 p-2 rounded border border-amber-200">
                    Crowd Range: {obs.crowdSizeRange} • Headway: {obs.headwayMinutesObserved} min
                  </div>
                </div>
              ))}
            </div>

            {/* Observation entry form */}
            <form onSubmit={handleAddObservation} className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
              <div className="text-xs font-bold text-blue-900 uppercase">Log New Ground Observation</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newObsLocation}
                  onChange={e => setNewObsLocation(e.target.value)}
                  placeholder="Stop / Campus Landmark..."
                  className="p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newObsNote}
                  onChange={e => setNewObsNote(e.target.value)}
                  placeholder="Commuter observation note..."
                  className="p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                Save Observation
              </button>
            </form>
          </div>
        )}

        {/* STAGE 3: DEFINE */}
        {activeStage === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Stage 3: Define</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Problem Statements & How Might We Framework</h3>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs space-y-2">
                <div className="font-bold text-indigo-900 uppercase tracking-wider">Core Point of View (POV):</div>
                <p className="text-indigo-950 font-medium text-sm leading-relaxed">
                  "LPU students commuting across extensive university blocks need reliable visibility into incoming vehicle locations and live seating capacity, because uncertain arrivals lead to missed classes, dangerous overcrowding at main gates, and extreme transit anxiety."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { q: 'How might we inform students of shuttle capacity before arrival so they do not waste time waiting for full shuttles?' },
                  { q: 'How might we enable dynamic fleet dispatch during peak lecture switchovers to prevent shuttle bunching?' },
                  { q: 'How might we incentivize walking short legs when shuttles are delayed or overcrowded?' },
                ].map((hmw, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 leading-relaxed">
                    <span className="text-blue-600 font-bold block mb-1">HMW #{i + 1}</span>
                    {hmw.q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: IDEATION */}
        {activeStage === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-yellow-600 font-bold uppercase tracking-wider">Stage 4: Ideation</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">SCAMPER & Impact-Effort 2x2 Matrix</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <strong className="text-slate-900 font-bold">High Impact • Low Effort (Quick Wins):</strong>
                <ul className="text-slate-600 space-y-1 list-disc pl-4">
                  <li>Google Maps LPU live geofence visualization</li>
                  <li>4-tier crowd categorization (Low / Moderate / High / Full)</li>
                  <li>Live ETA prediction with speed & delay modeling</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <strong className="text-slate-900 font-bold">High Impact • High Effort (Strategic Features):</strong>
                <ul className="text-slate-600 space-y-1 list-disc pl-4">
                  <li>Mode B Live Device GPS broadcasting via Geolocation API</li>
                  <li>Persistent Supabase Authentication with single-password credentials</li>
                  <li>Intelligent multi-stop journey recommendation algorithm</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: PROTOTYPE */}
        {activeStage === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Stage 5: High-Fidelity Prototype</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Technical Architecture & Stack Verification</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block font-bold">Frontend</strong>
                <span className="text-slate-500">React 19, TypeScript 5.7, Vite 6</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block font-bold">Styling</strong>
                <span className="text-slate-500">Enterprise SaaS Tailwind CSS, Lucide</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block font-bold">Mapping</strong>
                <span className="text-slate-500">Google Maps JS API + Vector Fallback</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block font-bold">Database & Auth</strong>
                <span className="text-slate-500">Supabase PostgreSQL + Session Storage</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 6: TESTING */}
        {activeStage === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Stage 6: Testing</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Usability Testing & Student Verification</h3>
            </div>

            <div className="space-y-3">
              {[
                { task: 'Locate nearest shuttle on LPU Google Map', rate: '100% Pass', note: 'Interactive vehicle markers & live ETA' },
                { task: 'Inspect passenger crowd capacity before boarding', rate: '100% Pass', note: 'Visual progress bars & crowd tags' },
                { task: 'Persistent student authentication across browser refresh', rate: '100% Pass', note: 'Single-password credential + session restore' },
                { task: 'Simulate driver Mode B real device GPS broadcasting', rate: '100% Pass', note: 'HTML5 navigator.geolocation hook' },
              ].map((t, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="font-bold text-slate-900">{t.task}</strong>
                    <div className="text-[11px] text-slate-500">{t.note}</div>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {t.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 7: TEAM & VIVA */}
        {activeStage === 7 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">Stage 7: Project Defense</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">INT335 Design Thinking Academic Submission</h3>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Lead Developer & Designer</span>
                  <div className="text-sm font-black text-slate-900">Maanas Pandey</div>
                  <div className="text-slate-500 font-mono">Reg ID: 12214589 • krishnamanas1224@gmail.com</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Course & Institution</span>
                  <div className="text-sm font-black text-slate-900">INT335 Design Thinking (Project P05)</div>
                  <div className="text-slate-500">Lovely Professional University, Phagwara, Punjab</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
