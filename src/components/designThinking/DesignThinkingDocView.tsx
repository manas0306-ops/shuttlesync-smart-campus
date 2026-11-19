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
  Download,
  Share2,
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
    { id: 0, label: 'Overview', icon: BookOpen, color: 'text-sky-400' },
    { id: 1, label: '1. Empathy', icon: Heart, color: 'text-rose-400' },
    { id: 2, label: '2. Observation', icon: Eye, color: 'text-amber-400' },
    { id: 3, label: '3. Define', icon: Target, color: 'text-indigo-400' },
    { id: 4, label: '4. Ideation', icon: Lightbulb, color: 'text-yellow-400' },
    { id: 5, label: '5. Prototype', icon: Cpu, color: 'text-sky-400' },
    { id: 6, label: '6. Testing', icon: CheckSquare, color: 'text-emerald-400' },
    { id: 7, label: '7. Team & Viva', icon: Users, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            Academic Viva & Project Defense Dossier
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Design Thinking Methodology & Validation</h2>
          <p className="text-sm text-slate-400 mt-1">
            Complete human-centered design journey for Project P05: Waiting for the Shuttle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" /> 7/7 Stages Documented
          </span>
        </div>
      </div>

      {/* Stage Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {stages.map(stage => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : stage.color}`} />
              {stage.label}
            </button>
          );
        })}
      </div>

      {/* Stage Content */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
        {/* STAGE 0: OVERVIEW */}
        {activeStage === 0 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">Executive Summary</span>
              <h3 className="text-xl font-black text-white mt-1">
                Project P05: Waiting for the Shuttle (ShuttleSync)
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Campus mobility has historically suffered from acute information asymmetry: students wait blindly at physical stops with zero knowledge of incoming vehicle capacity, while shuttle drivers operate with static loops that fail to match real-time lecture shifts. ShuttleSync applies the 5-stage Stanford d.school Design Thinking framework to replace commuter anxiety with predictable, transparent transit.
              </p>
            </div>

            {/* Framework Graphic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { title: '1. Empathize', desc: 'User persona interviews & commuter pain mapping', color: 'border-rose-500/40 text-rose-400' },
                { title: '2. Define', desc: 'POV synthesis & How Might We framing', color: 'border-indigo-500/40 text-indigo-400' },
                { title: '3. Ideate', desc: 'SCAMPER & Impact-Effort 2x2 matrix evaluation', color: 'border-yellow-500/40 text-yellow-400' },
                { title: '4. Prototype', desc: 'Real-time telemetry, crowd & ETA web architecture', color: 'border-sky-500/40 text-sky-400' },
                { title: '5. Test', desc: 'Task usability checklist & feedback refinement', color: 'border-emerald-500/40 text-emerald-400' },
              ].map(st => (
                <div key={st.title} className={`p-4 rounded-xl bg-slate-800/40 border ${st.color}`}>
                  <div className="text-sm font-bold mb-1">{st.title}</div>
                  <div className="text-xs text-slate-400 leading-normal">{st.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 1: EMPATHY */}
        {activeStage === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Stage 1: Empathy</span>
              <h3 className="text-xl font-black text-white mt-1">Commuter Personas & Interview Discovery</h3>
              <p className="text-sm text-slate-300 mt-1">
                Deep qualitative immersion into diverse campus transit archetypes to uncover latent anxieties and behavioral patterns.
              </p>
            </div>

            {/* Personas Carousel / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {DESIGN_THINKING_DATA.personas.map(persona => (
                <div
                  key={persona.id}
                  className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/60 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${persona.avatarBg} flex items-center justify-center font-bold text-white text-base shadow-md`}>
                        {persona.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{persona.name}</h4>
                        <div className="text-xs text-sky-400 font-semibold">{persona.tagline}</div>
                        <div className="text-[11px] text-slate-400">{persona.yearDepartment}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 italic">
                      {persona.quote}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                        Core Pain Points:
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                        {persona.painPoints.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        Commuter Goals:
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                        {persona.goals.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex justify-between">
                    <span>Usage: {persona.shuttleUsageFrequency}</span>
                    <span>Tech: {persona.techSavviness}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interview Question Templates */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Semi-Structured Commuter Interview Questionnaire (Sample Evidence)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DESIGN_THINKING_DATA.interviewQuestions.map(q => (
                  <div key={q.questionNumber} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                      <span>Question #{q.questionNumber}</span>
                      <span className="text-slate-500">• Target Insight: {q.targetInsight}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">"{q.questionText}"</div>
                    <div className="p-2.5 rounded-lg bg-slate-950/50 text-xs text-slate-400 italic border border-slate-800">
                      <strong className="text-slate-300 not-italic">Sample Response: </strong>
                      {q.sampleStudentResponse}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: OBSERVATION */}
        {activeStage === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Stage 2: Observation</span>
              <h3 className="text-xl font-black text-white mt-1">Field Observation Logs & Commuter Chokepoints</h3>
              <p className="text-sm text-slate-300 mt-1">
                Real-world ethnographic logging of shuttle bunching, passenger queue behaviors, and peak interval headway.
              </p>
            </div>

            {/* Existing Field Logs */}
            <div className="space-y-3">
              {DESIGN_THINKING_DATA.observationLogs.map(log => (
                <div
                  key={log.id}
                  className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        {log.location}
                      </span>
                      <span className="text-xs text-slate-400">{log.timeSlot}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      {log.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Crowd Density Observed</span>
                      <span className="font-bold text-white">{log.crowdSizeRange}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Headway Gap</span>
                      <span className="font-bold text-sky-400">{log.headwayMinutesObserved} minutes</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Vehicle Bunching</span>
                      <span className={`font-bold ${log.bunchingObserved ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {log.bunchingObserved ? 'Yes (2 Shuttles Arrived Together)' : 'No (Normal Interval)'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                    <strong className="text-slate-400">Observer Notes: </strong> {log.passengerMoodNotes}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Blank Observation Log Form for Live Field Testing */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Record New Field Observation (Interactive Template)
              </h4>

              <form onSubmit={handleAddObservation} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Stop Location (e.g., Central Library South Gate)"
                    value={newObsLocation}
                    onChange={e => setNewObsLocation(e.target.value)}
                    className="bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="text"
                    placeholder="Observed Crowd & Queue Behavior notes..."
                    value={newObsNote}
                    onChange={e => setNewObsNote(e.target.value)}
                    className="bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Save Observation Entry
                </button>
              </form>

              {customObservations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-400">Newly Appended Field Entries:</div>
                  {customObservations.map((obs, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-xs text-slate-300 flex justify-between">
                      <div>
                        <strong className="text-white">{obs.location}:</strong> {obs.note}
                      </div>
                      <span className="text-[10px] text-slate-500">{obs.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 3: DEFINE */}
        {activeStage === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Stage 3: Define</span>
              <h3 className="text-xl font-black text-white mt-1">Problem Synthesis & Core Challenge Statement</h3>
              <p className="text-sm text-slate-300 mt-1">
                Distilling observations and empathy interviews into an actionable, bounded design point-of-view.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-sky-950/40 p-6 md:p-8 rounded-3xl border border-indigo-500/30 space-y-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Synthesized Problem Statement
              </span>
              <p className="text-base md:text-lg font-bold text-white leading-relaxed">
                "{DESIGN_THINKING_DATA.problemStatement.statement}"
              </p>
            </div>

            {/* How Might We Callout */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-sky-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <Target className="w-4 h-4" />
                The Guiding "How Might We" (HMW) Question
              </div>
              <p className="text-base font-bold text-white">
                "{DESIGN_THINKING_DATA.problemStatement.howMightWe}"
              </p>
            </div>

            {/* Root Causes (5 Whys Breakdown) */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Underlying Root Causes Identified:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DESIGN_THINKING_DATA.problemStatement.rootCauses.map((rc, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 font-medium">{rc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: IDEATION */}
        {activeStage === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Stage 4: Ideation</span>
              <h3 className="text-xl font-black text-white mt-1">Multi-Solution Brainstorming & Evaluation Matrix</h3>
              <p className="text-sm text-slate-300 mt-1">
                Comparative analysis of digital, infrastructural, and policy interventions against feasibility, capital expenditure, and student impact.
              </p>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DESIGN_THINKING_DATA.ideationMatrix.map(idea => (
                <div
                  key={idea.id}
                  className={`p-6 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
                    idea.selected
                      ? 'bg-sky-950/20 border-sky-400 shadow-xl shadow-sky-500/10'
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {idea.category} Solution
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{idea.title}</h4>
                      </div>
                      {idea.selected ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-md">
                          SELECTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          Discarded
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Feasibility</span>
                        <span className="font-bold text-white">{idea.feasibility}/10</span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Impact</span>
                        <span className="font-bold text-sky-400">{idea.impact}/10</span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Cost</span>
                        <span className="font-bold text-amber-400">{idea.cost}</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-slate-300 font-semibold">Pros:</div>
                      <ul className="text-slate-400 list-disc pl-4 space-y-0.5 text-[11px]">
                        {idea.pros.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-slate-300 font-semibold">Cons:</div>
                      <ul className="text-slate-400 list-disc pl-4 space-y-0.5 text-[11px]">
                        {idea.cons.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 text-xs text-slate-300">
                    <strong className="text-sky-400">Verdict: </strong> {idea.selectionRationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 5: PROTOTYPE */}
        {activeStage === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">Stage 5: Prototype</span>
              <h3 className="text-xl font-black text-white mt-1">ShuttleSync Functional Architecture</h3>
              <p className="text-sm text-slate-300 mt-1">
                Interactive high-fidelity software prototype integrating live kinematics, crowd forecasting, and driver console.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="text-sm font-bold text-white">Live Tracking & Map Engine</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interpolates vehicle coordinates across SVG campus road geometry, displaying directional headings, live status badges, and animated desktop cart cursor.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="text-sm font-bold text-white">Dynamic Arrival Forecasting (ETA)</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time arrival prediction computing headway and vehicle speed while responding instantaneously to simulated road congestion and rain conditions.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="text-sm font-bold text-white">Crowd Density Diagnostics</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Multi-tier occupancy progress bars (Low, Moderate, High, Full) paired with smart stop recommendation to divert stranded commuters to empty shuttles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 6: TESTING */}
        {activeStage === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Stage 6: Testing</span>
              <h3 className="text-xl font-black text-white mt-1">Usability Verification & Post-Feedback Iterations</h3>
              <p className="text-sm text-slate-300 mt-1">
                Rigorous testing across commuter scenarios with documented user feedback and corrective design implementations.
              </p>
            </div>

            <div className="space-y-3">
              {DESIGN_THINKING_DATA.testingChecklist.map(tc => (
                <div
                  key={tc.taskNumber}
                  className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                        {tc.taskNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white">{tc.taskDescription}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {tc.testedStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-300">Expected Outcome:</strong> {tc.expectedOutcome}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">User Feedback Recorded</span>
                      <span className="text-slate-300 italic">{tc.userFeedbackSummary}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold">Product Iteration Made</span>
                      <span className="text-emerald-300 font-semibold">{tc.improvementImplemented}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 7: TEAM & VIVA */}
        {activeStage === 7 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Stage 7: Team & Defense</span>
              <h3 className="text-xl font-black text-white mt-1">Team Roles, Contributions & Viva Prep</h3>
              <p className="text-sm text-slate-300 mt-1">
                Transparent attribution of project responsibilities, technical deliverables, and defense notes for academic evaluators.
              </p>
            </div>

            {/* Member Profiles */}
            <div className="space-y-4">
              {DESIGN_THINKING_DATA.teamMembers.map(member => (
                <div
                  key={member.name}
                  className="p-6 rounded-2xl bg-slate-800/50 border border-purple-500/30 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-black text-white">{member.name}</h4>
                      <div className="text-xs text-purple-400 font-semibold">{member.role}</div>
                      <div className="text-[11px] text-slate-400">{member.rollNumber}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block">Contribution Weight</span>
                      <span className="text-2xl font-black text-emerald-400">{member.contributionPercent}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-white mb-2">Core Technical Responsibilities:</div>
                      <ul className="text-slate-300 space-y-1 list-disc pl-4 text-[11px]">
                        {member.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-white mb-2">Primary Project Deliverables:</div>
                      <ul className="text-emerald-400 space-y-1 list-disc pl-4 text-[11px]">
                        {member.primaryDeliverables.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Viva Q&A Cheat Sheet for Project Evaluation */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Frequently Asked Viva Questions (Evaluation Readiness)
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-400">Q: Why not just buy more buses to fix overcrowding?</div>
                  <div className="text-slate-300">
                    A: In our Ideation matrix, we proved that adding more buses on uncoordinated schedules causes worse bunching and doubles operational fuel expenses without fixing information asymmetry. Dynamic load balancing and smart stop recommendations solve crowd distribution without expensive capital fleet expenditure.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-400">Q: How does ShuttleSync ensure driver adoption?</div>
                  <div className="text-slate-300">
                    A: The Driver Portal features oversized touch targets with single-tap "+1/+5 Boarding" and "Arrived at Stop" buttons designed specifically for dashboard-mounted tablets, eliminating typing while driving.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
