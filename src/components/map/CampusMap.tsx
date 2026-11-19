import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../../data/campusData';
import { Badge } from '../common/Badge';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  MapPin,
  Clock,
  Compass,
  CloudRain,
  Eye,
  Info,
} from 'lucide-react';

interface CampusMapProps {
  onSelectShuttle?: (id: string) => void;
  onSelectStop?: (id: string) => void;
  heightClass?: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  onSelectShuttle,
  onSelectStop,
  heightClass = 'h-[520px]',
}) => {
  const {
    shuttles,
    simulation,
    selectedShuttleId,
    selectedStopId,
    setSelectedShuttleId,
    setSelectedStopId,
  } = useSimulation();

  const [activeRouteFilter, setActiveRouteFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);

  const handleStopClick = (stopId: string) => {
    setSelectedStopId(stopId);
    if (onSelectStop) onSelectStop(stopId);
  };

  const handleShuttleClick = (shuttleId: string) => {
    setSelectedShuttleId(shuttleId);
    if (onSelectShuttle) onSelectShuttle(shuttleId);
  };

  const filteredRoutes = SHUTTLE_ROUTES.filter(
    r => activeRouteFilter === 'all' || r.id === activeRouteFilter
  );

  return (
    <div className={`relative w-full ${heightClass} bg-[#070d1e] rounded-2xl overflow-hidden border border-sky-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.6)] shuttle-cursor-zone select-none`}>
      {/* Top Map Status Bar & Route Filter Pills */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Route Filter Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            onClick={() => setActiveRouteFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeRouteFilter === 'all'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Routes
          </button>
          {SHUTTLE_ROUTES.map(route => (
            <button
              key={route.id}
              onClick={() => setActiveRouteFilter(route.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeRouteFilter === route.id
                  ? 'text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              style={{
                backgroundColor: activeRouteFilter === route.id ? route.color : 'transparent',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: route.color }}
              />
              {route.code}
            </button>
          ))}
        </div>

        {/* Live Simulation Indicator Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 pointer-events-auto shadow-lg text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200 font-medium">LIVE TELEMETRY</span>
          <span className="text-slate-500">|</span>
          <span className="text-sky-400 font-semibold">{shuttles.length} Active Shuttles</span>
          {simulation.isRaining && (
            <span className="flex items-center gap-1 text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
              <CloudRain className="w-3 h-3 animate-bounce" /> Rain Active
            </span>
          )}
        </div>
      </div>

      {/* Map Control Buttons (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
          className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.7))}
          className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowLandmarks(prev => !prev)}
          className={`p-2.5 rounded-xl backdrop-blur-md border shadow-lg transition-all ${
            showLandmarks
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
              : 'bg-slate-900/85 text-slate-400 border-slate-700/70 hover:bg-slate-800'
          }`}
          title="Toggle Campus Landmarks"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Prototype Environment Watermark / Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-400 pointer-events-auto">
        <span className="flex items-center gap-1.5 text-sky-300 font-medium">
          <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '18s' }} />
          Smart Campus Simulation
        </span>
        <span className="text-slate-600">•</span>
        <span>Click shuttle or stop to inspect</span>
      </div>

      {/* SVG Canvas Map */}
      <div
        className="w-full h-full transition-transform duration-300 flex items-center justify-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 850 540"
          className="w-full h-full"
          style={{ maxHeight: '100%' }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="lawnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.15" />
            </linearGradient>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            {/* Glow filters for active routes */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="850" height="540" fill="#070d1e" />
          <rect width="850" height="540" fill="url(#gridPattern)" />

          {/* Campus Landscape & Greenery */}
          {showLandmarks && (
            <g className="landmarks-layer opacity-90 transition-opacity duration-300">
              {/* Central Green Quad */}
              <rect x="370" y="160" width="180" height="85" rx="16" fill="url(#lawnGradient)" stroke="#059669" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
              <text x="460" y="206" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600" opacity="0.6">
                Central Quad & Botanical Lawn
              </text>

              {/* Eco Lake / Retention Pond */}
              <path
                d="M 620 330 Q 660 300 700 340 T 730 400 Q 690 430 640 400 Z"
                fill="url(#lakeGradient)"
                stroke="#0284c7"
                strokeWidth="1"
                opacity="0.6"
              />
              <text x="670" y="365" textAnchor="middle" fill="#38bdf8" fontSize="10" opacity="0.6">
                Lotus Lake
              </text>

              {/* Sports Oval */}
              <ellipse cx="260" cy="455" rx="55" ry="32" fill="#064e3b" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
              <text x="260" y="458" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="500" opacity="0.7">
                Sports Arena Oval
              </text>

              {/* Architectural Campus Building Blocks */}
              {/* North Gate Terminal Block */}
              <rect x="70" y="45" width="100" height="40" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <text x="120" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">North Metro Plaza</text>

              {/* Engineering Complex */}
              <rect x="310" y="55" width="105" height="42" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <text x="362" y="79" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Engineering Complex</text>

              {/* Central Library Dome */}
              <rect x="590" y="75" width="100" height="45" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <text x="640" y="100" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Central Library</text>

              {/* Biotech & Science Complex */}
              <rect x="680" y="240" width="95" height="48" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <text x="727" y="267" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Biotech Hub</text>

              {/* Student Activity Center */}
              <rect x="430" y="280" width="105" height="45" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <text x="482" y="305" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">SAC & Food Court</text>

              {/* Hostel Clusters */}
              <rect x="170" y="275" width="100" height="45" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <text x="220" y="300" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Hostel Clusters A-D</text>

              {/* South Gate Terminus */}
              <rect x="530" y="445" width="100" height="40" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <text x="580" y="468" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">South Gate Bus Hub</text>
            </g>
          )}

          {/* Road Asphalt Networks */}
          <g className="roads-layer" opacity="0.85">
            {/* Road Base 1: North Outer Highway */}
            <path
              d="M 120 80 L 360 90 L 640 110 L 720 280 L 580 430 L 260 440 L 220 310 Z"
              fill="none"
              stroke="#1e293b"
              strokeWidth="18"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Road Center Dotted Line */}
            <path
              d="M 120 80 L 360 90 L 640 110 L 720 280 L 580 430 L 260 440 L 220 310 Z"
              fill="none"
              stroke="#475569"
              strokeWidth="1.2"
              strokeDasharray="6 6"
              strokeLinejoin="round"
            />

            {/* Cross Arterial Roads */}
            <path
              d="M 360 90 L 480 270 L 580 430 M 220 310 L 480 270 L 640 110"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 360 90 L 480 270 L 580 430 M 220 310 L 480 270 L 640 110"
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="5 5"
              strokeLinejoin="round"
            />
          </g>

          {/* Active Shuttle Route Paths */}
          <g className="routes-layer">
            {filteredRoutes.map(route => {
              const pointsStr = route.pathPoints
                .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
                .join(' ') + ' Z';

              return (
                <g key={route.id}>
                  {/* Glowing Route Trace */}
                  <path
                    d={pointsStr}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="4"
                    strokeOpacity="0.4"
                    strokeLinejoin="round"
                    filter="url(#routeGlow)"
                  />
                  {/* Animated Dashed Pulse Line */}
                  <path
                    d={pointsStr}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="2.5"
                    strokeDasharray="8 8"
                    strokeLinejoin="round"
                    className="transition-all"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-64"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}
          </g>

          {/* Campus Stops Layer */}
          <g className="stops-layer">
            {CAMPUS_STOPS.map(stop => {
              const isSelected = selectedStopId === stop.id;
              const isHovered = hoveredStopId === stop.id;

              return (
                <g
                  key={stop.id}
                  transform={`translate(${stop.x}, ${stop.y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => handleStopClick(stop.id)}
                  onMouseEnter={() => setHoveredStopId(stop.id)}
                  onMouseLeave={() => setHoveredStopId(null)}
                >
                  {/* Pulsing Aura if selected */}
                  {isSelected && (
                    <circle
                      r="22"
                      fill="#0284c7"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Stop Ring */}
                  <circle
                    r={isSelected ? '14' : isHovered ? '12' : '10'}
                    fill="#0f172a"
                    stroke={isSelected ? '#38bdf8' : isHovered ? '#7dd3fc' : '#475569'}
                    strokeWidth={isSelected ? '3' : '2'}
                    className="transition-all duration-200 shadow-md"
                  />

                  {/* Center Dot */}
                  <circle
                    r={isSelected ? '6' : '4'}
                    fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                  />

                  {/* Stop Code Badge */}
                  <rect
                    x="-18"
                    y={isSelected ? '-32' : '-26'}
                    width="36"
                    height="16"
                    rx="4"
                    fill="#0284c7"
                    opacity={isSelected ? 1 : 0.85}
                  />
                  <text
                    x="0"
                    y={isSelected ? '-21' : '-15'}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="700"
                    letterSpacing="0.5"
                  >
                    {stop.code}
                  </text>

                  {/* Tooltip on Hover or Selection */}
                  {(isSelected || isHovered) && (
                    <g transform="translate(0, 20)">
                      <rect
                        x="-70"
                        y="4"
                        width="140"
                        height="38"
                        rx="6"
                        fill="#0b132b"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        className="shadow-xl"
                      />
                      <text
                        x="0"
                        y="18"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {stop.name.length > 20 ? stop.name.slice(0, 18) + '...' : stop.name}
                      </text>
                      <text
                        x="0"
                        y="32"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                      >
                        Wait: ~{stop.avgWaitMinutes}m • Crowd: {stop.currentCrowdCount}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Dynamic Moving Shuttles Layer */}
          <g className="shuttles-layer">
            {shuttles.map(shuttle => {
              const isSelected = selectedShuttleId === shuttle.id;
              const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
              const routeColor = route?.color || '#0284c7';

              return (
                <g
                  key={shuttle.id}
                  transform={`translate(${shuttle.x}, ${shuttle.y})`}
                  className="cursor-pointer transition-transform duration-500 ease-linear"
                  onClick={() => handleShuttleClick(shuttle.id)}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r="20"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ animationDuration: '6s' }}
                    />
                  )}

                  {/* Shuttle Directional Body */}
                  <g transform={`rotate(${shuttle.headingAngle})`}>
                    {/* Shadow */}
                    <rect
                      x="-14"
                      y="-9"
                      width="28"
                      height="18"
                      rx="5"
                      fill="#000000"
                      opacity="0.5"
                      transform="translate(2, 2)"
                    />
                    {/* Main Vehicle Chassis */}
                    <rect
                      x="-14"
                      y="-9"
                      width="28"
                      height="18"
                      rx="5"
                      fill="#0f172a"
                      stroke={routeColor}
                      strokeWidth="2"
                    />
                    {/* Front Cab / Windshield */}
                    <rect
                      x="4"
                      y="-7"
                      width="8"
                      height="14"
                      rx="2"
                      fill="#38bdf8"
                      opacity="0.8"
                    />
                    {/* Passenger Windows */}
                    <rect
                      x="-5"
                      y="-7"
                      width="6"
                      height="14"
                      rx="1"
                      fill="#e0f2fe"
                      opacity="0.6"
                    />
                    <rect
                      x="-12"
                      y="-7"
                      width="5"
                      height="14"
                      rx="1"
                      fill="#e0f2fe"
                      opacity="0.6"
                    />
                    {/* Headlights */}
                    <circle cx="14" cy="-5" r="1.5" fill="#fef08a" />
                    <circle cx="14" cy="5" r="1.5" fill="#fef08a" />
                  </g>

                  {/* Shuttle ID Tag Pill above vehicle */}
                  <g transform="translate(0, -18)">
                    <rect
                      x="-22"
                      y="-8"
                      width="44"
                      height="16"
                      rx="4"
                      fill="#0b132b"
                      stroke={isSelected ? '#facc15' : routeColor}
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="700"
                    >
                      {shuttle.name.split(' ')[1] || 'S-BUS'}
                    </text>
                  </g>

                  {/* Live Status Indicator Dot */}
                  <circle
                    cx="14"
                    cy="-14"
                    r="4"
                    fill={
                      shuttle.status === 'On Time'
                        ? '#10b981'
                        : shuttle.status === 'Delayed'
                        ? '#ef4444'
                        : shuttle.status === 'Crowded'
                        ? '#f59e0b'
                        : '#0ea5e9'
                    }
                    stroke="#0b132b"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                </g>
              );
            })}
          </g>

          {/* Rain Overlay Animation */}
          {simulation.isRaining && (
            <g className="rain-layer pointer-events-none opacity-40">
              {[...Array(30)].map((_, i) => (
                <line
                  key={i}
                  x1={(i * 31) % 850}
                  y1={(i * 19) % 500}
                  x2={((i * 31) % 850) - 8}
                  y2={((i * 19) % 500) + 20}
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="4 12"
                />
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
