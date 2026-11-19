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
    <div className={`relative w-full ${heightClass} bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm shuttle-cursor-zone select-none`}>
      {/* Top Map Status Bar & Route Filter Pills */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Route Filter Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm pointer-events-auto">
          <button
            onClick={() => setActiveRouteFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeRouteFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Routes
          </button>
          {SHUTTLE_ROUTES.map(route => (
            <button
              key={route.id}
              onClick={() => setActiveRouteFilter(route.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                activeRouteFilter === route.id
                  ? 'text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 pointer-events-auto shadow-sm text-xs font-medium text-slate-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-900 font-semibold">LPU LIVE TELEMETRY</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-semibold">{shuttles.length} Active Shuttles</span>
          {simulation.isRaining && (
            <span className="flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <CloudRain className="w-3 h-3 text-amber-600 animate-bounce" /> Rain Active
            </span>
          )}
        </div>
      </div>

      {/* Map Control Buttons (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.7))}
          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-all"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowLandmarks(prev => !prev)}
          className={`p-2.5 rounded-lg border shadow-sm transition-all ${
            showLandmarks
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Campus Landmarks"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Campus Landmark Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-[11px] text-slate-600 pointer-events-auto shadow-sm">
        <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
          <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '18s' }} />
          LPU Campus Fleet Radar
        </span>
        <span className="text-slate-300">•</span>
        <span>Click vehicle or stop marker to inspect</span>
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
            <linearGradient id="lawnGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="lakeGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.6" />
            </linearGradient>
            <pattern id="gridPatternLight" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="850" height="540" fill="#f8fafc" />
          <rect width="850" height="540" fill="url(#gridPatternLight)" />

          {/* Campus Landscape & Greenery */}
          {showLandmarks && (
            <g className="landmarks-layer">
              {/* Central Green Quad */}
              <rect x="370" y="160" width="180" height="85" rx="12" fill="url(#lawnGradientLight)" stroke="#86efac" strokeWidth="1" strokeDasharray="3 3" />
              <text x="460" y="206" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="600">
                Central Quad & Lawns
              </text>

              {/* Eco Lake / Retention Pond */}
              <path
                d="M 620 330 Q 660 300 700 340 T 730 400 Q 690 430 640 400 Z"
                fill="url(#lakeGradientLight)"
                stroke="#93c5fd"
                strokeWidth="1.2"
              />
              <text x="670" y="365" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="600">
                Lotus Lake
              </text>

              {/* Sports Oval */}
              <ellipse cx="260" cy="455" rx="55" ry="32" fill="#dcfce7" stroke="#86efac" strokeWidth="1" strokeDasharray="4 3" />
              <text x="260" y="458" textAnchor="middle" fill="#16a34a" fontSize="10" fontWeight="600">
                Sports Arena
              </text>

              {/* Campus Building Blocks */}
              <rect x="70" y="45" width="105" height="40" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="122" y="69" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="600">Gate 1 NH-44</text>

              <rect x="305" y="55" width="115" height="42" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="362" y="79" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="600">Block 32-34 Library</text>

              <rect x="585" y="75" width="110" height="45" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="640" y="100" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="600">Block 36-38 Tech Quad</text>

              <rect x="425" y="275" width="115" height="45" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="482" y="300" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="600">Uni-Mall Food Square</text>

              <rect x="165" y="275" width="110" height="45" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="220" y="300" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="600">Boys Hostel BH 1-7</text>

              <rect x="525" y="440" width="110" height="40" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="580" y="464" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="600">Girls Hostel GH 1-6</text>
            </g>
          )}

          {/* Road Asphalt Networks */}
          <g className="roads-layer">
            <path
              d="M 120 80 L 360 90 L 640 110 L 720 280 L 580 430 L 260 440 L 220 310 Z"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="20"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 120 80 L 360 90 L 640 110 L 720 280 L 580 430 L 260 440 L 220 310 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="16"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 120 80 L 360 90 L 640 110 L 720 280 L 580 430 L 260 440 L 220 310 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeLinejoin="round"
            />

            {/* Cross Arterial Roads */}
            <path
              d="M 360 90 L 480 270 L 580 430 M 220 310 L 480 270 L 640 110"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="16"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 360 90 L 480 270 L 580 430 M 220 310 L 480 270 L 640 110"
              fill="none"
              stroke="#ffffff"
              strokeWidth="12"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 360 90 L 480 270 L 580 430 M 220 310 L 480 270 L 640 110"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
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
                  <path
                    d={pointsStr}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="4"
                    strokeOpacity="0.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d={pointsStr}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    strokeLinejoin="round"
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
                  {/* Outer Stop Ring */}
                  <circle
                    r={isSelected ? '14' : isHovered ? '12' : '10'}
                    fill="#0f172a"
                    stroke={isSelected ? '#2563eb' : isHovered ? '#60a5fa' : '#64748b'}
                    strokeWidth={isSelected ? '3' : '2'}
                  />
                  <circle
                    r={isSelected ? '6' : '4.5'}
                    fill={isSelected ? '#2563eb' : '#ffffff'}
                  />

                  {/* Stop Label Tag */}
                  <g transform="translate(0, 20)">
                    <rect
                      x="-38"
                      y="-7"
                      width="76"
                      height="16"
                      rx="4"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {stop.code}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Shuttles Layer */}
          <g className="shuttles-layer">
            {shuttles.map(shuttle => {
              const isSelected = selectedShuttleId === shuttle.id;
              const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
              const routeColor = route?.color || '#2563eb';

              return (
                <g
                  key={shuttle.id}
                  transform={`translate(${shuttle.x}, ${shuttle.y})`}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => handleShuttleClick(shuttle.id)}
                >
                  {/* Pulse Ring if selected */}
                  {isSelected && (
                    <circle
                      r="22"
                      fill="none"
                      stroke={routeColor}
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                    />
                  )}

                  {/* Vehicle Body Base */}
                  <circle
                    r="16"
                    fill="#ffffff"
                    stroke={routeColor}
                    strokeWidth="3"
                  />
                  <rect
                    x="-9"
                    y="-9"
                    width="18"
                    height="18"
                    rx="3"
                    fill={routeColor}
                  />
                  <rect
                    x="-6"
                    y="-6"
                    width="4"
                    height="4"
                    rx="1"
                    fill="#ffffff"
                  />
                  <rect
                    x="2"
                    y="-6"
                    width="4"
                    height="4"
                    rx="1"
                    fill="#ffffff"
                  />

                  {/* Vehicle Identifier Tag */}
                  <g transform="translate(0, -22)">
                    <rect
                      x="-26"
                      y="-8"
                      width="52"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      stroke={routeColor}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {shuttle.name.split(' ')[1] || shuttle.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
