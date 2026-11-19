import React, { useEffect, useRef, useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useSimulation } from '../../context/SimulationContext';
import { CAMPUS_STOPS, SHUTTLE_ROUTES, LPU_CAMPUS_CENTER } from '../../data/campusData';
import { CampusMap as FallbackSVGMap } from './CampusMap';
import {
  Compass,
  MapPin,
  Crosshair,
  Layers,
  Sparkles,
  AlertCircle,
  Key,
  ExternalLink,
  RotateCcw,
  Navigation2,
  Bus,
  CheckCircle2,
} from 'lucide-react';

interface GoogleCampusMapProps {
  onSelectShuttle?: (id: string) => void;
  onSelectStop?: (id: string) => void;
  heightClass?: string;
}

// Custom dark mobility theme for Google Maps
const GOOGLE_MAPS_DARK_THEME: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#070d1e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#070d1e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#042f2e' }],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#0284c7' }, { lightness: -40 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f8fafc' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#0284c7' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#082f49' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#0284c7' }],
  },
];

export const GoogleCampusMap: React.FC<GoogleCampusMapProps> = ({
  onSelectShuttle,
  onSelectStop,
  heightClass = 'h-[540px]',
}) => {
  const {
    shuttles,
    simulation,
    selectedShuttleId,
    selectedStopId,
    setSelectedShuttleId,
    setSelectedStopId,
  } = useSimulation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const shuttleMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const stopMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [activeRouteFilter, setActiveRouteFilter] = useState<string>('all');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Initialize Google Maps
  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || apiKey.includes('placeholder')) {
      setApiKeyMissing(true);
      return;
    }

    setOptions({
      key: apiKey,
      v: 'weekly',
      libraries: ['places', 'geometry'],
    });

    importLibrary('maps')
      .then(() => {
        if (!mapContainerRef.current) return;

        const map = new google.maps.Map(mapContainerRef.current, {
          center: LPU_CAMPUS_CENTER,
          zoom: 16,
          styles: GOOGLE_MAPS_DARK_THEME,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        setMapLoaded(true);
      })
      .catch(err => {
        console.warn('Google Maps failed to load (falling back to high-detail vector campus map):', err);
        setApiKeyMissing(true);
      });
  }, [apiKey]);

  // Render Route Polylines on Google Map
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    // Clear old polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    const filtered = SHUTTLE_ROUTES.filter(
      r => activeRouteFilter === 'all' || r.id === activeRouteFilter
    );

    filtered.forEach(route => {
      const polyline = new google.maps.Polyline({
        path: route.geoCoordinates,
        geodesic: true,
        strokeColor: route.color,
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map: mapInstanceRef.current!,
      });
      polylinesRef.current.push(polyline);
    });
  }, [mapLoaded, activeRouteFilter]);

  // Render Stops on Google Map
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    CAMPUS_STOPS.forEach(stop => {
      if (stopMarkersRef.current.has(stop.id)) return;

      const stopSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
          <path d="M17 0C7.6 0 0 7.6 0 17c0 11.9 17 25 17 25s17-13.1 17-25C34 7.6 26.4 0 17 0z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="17" cy="17" r="7" fill="#0284c7"/>
          <text x="17" y="20" font-size="8" font-family="sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">${stop.code.replace('ST-', '')}</text>
        </svg>
      `)}`;

      const marker = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: mapInstanceRef.current!,
        title: stop.name,
        icon: {
          url: stopSvg,
          scaledSize: new google.maps.Size(34, 42),
          anchor: new google.maps.Point(17, 42),
        },
      });

      marker.addListener('click', () => {
        setSelectedStopId(stop.id);
        if (onSelectStop) onSelectStop(stop.id);

        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(`
            <div style="color:#0f172a; font-family:sans-serif; padding:4px; max-width:220px;">
              <strong style="font-size:13px; color:#0284c7;">${stop.code}: ${stop.name}</strong>
              <p style="font-size:11px; margin:4px 0; color:#475569;">${stop.description}</p>
              <div style="font-size:10px; font-weight:bold; color:#10b981;">
                Average Wait: ~${stop.avgWaitMinutes} min • Waiting Crowd: ${stop.currentCrowdCount}
              </div>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      stopMarkersRef.current.set(stop.id, marker);
    });
  }, [mapLoaded, onSelectStop, setSelectedStopId]);

  // Update Shuttle Markers on Google Map
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    shuttles.forEach(shuttle => {
      let marker = shuttleMarkersRef.current.get(shuttle.id);
      const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
      const routeColor = route?.color || '#0284c7';

      const shuttleSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
          <circle cx="19" cy="19" r="18" fill="#0f172a" stroke="${routeColor}" stroke-width="2.5"/>
          <rect x="10" y="11" width="18" height="15" rx="3" fill="${routeColor}"/>
          <rect x="12" y="13" width="5" height="5" rx="1" fill="#e0f2fe"/>
          <rect x="21" y="13" width="5" height="5" rx="1" fill="#e0f2fe"/>
          <circle cx="13" cy="27" r="2.5" fill="#e2e8f0"/>
          <circle cx="25" cy="27" r="2.5" fill="#e2e8f0"/>
        </svg>
      `)}`;

      if (!marker) {
        marker = new google.maps.Marker({
          position: { lat: shuttle.lat, lng: shuttle.lng },
          map: mapInstanceRef.current!,
          title: shuttle.name,
          icon: {
            url: shuttleSvg,
            scaledSize: new google.maps.Size(38, 38),
            anchor: new google.maps.Point(19, 19),
          },
        });

        marker.addListener('click', () => {
          setSelectedShuttleId(shuttle.id);
          if (onSelectShuttle) onSelectShuttle(shuttle.id);

          if (infoWindowRef.current && mapInstanceRef.current) {
            infoWindowRef.current.setContent(`
              <div style="color:#0f172a; font-family:sans-serif; padding:4px; max-width:220px;">
                <strong style="font-size:13px; color:#0284c7;">${shuttle.name}</strong>
                <div style="font-size:11px; margin:3px 0;">Route: ${route?.name || 'LPU Transit'}</div>
                <div style="font-size:11px; font-weight:bold; color:${shuttle.status === 'On Time' ? '#10b981' : '#f59e0b'};">
                  Status: ${shuttle.status} • Occupancy: ${shuttle.passengerCount}/${shuttle.capacity}
                </div>
                <div style="font-size:10px; color:#64748b; margin-top:2px;">
                  Speed: ${shuttle.speedKmh} km/h • Battery: ${shuttle.batteryPercent}%
                </div>
              </div>
            `);
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }
        });

        shuttleMarkersRef.current.set(shuttle.id, marker);
      } else {
        // Smoothly pan position
        marker.setPosition({ lat: shuttle.lat, lng: shuttle.lng });
      }
    });
  }, [shuttles, mapLoaded, onSelectShuttle, setSelectedShuttleId]);

  // Recenter map on LPU Campus
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(LPU_CAMPUS_CENTER);
      mapInstanceRef.current.setZoom(16);
    }
  };

  // Locate Current Commuter
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocating(false);
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userPos);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(userPos);
          mapInstanceRef.current.setZoom(17);

          new google.maps.Marker({
            position: userPos,
            map: mapInstanceRef.current,
            title: 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#38bdf8',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });
        }
      },
      err => {
        setLocating(false);
        alert('Could not determine your current position. Defaulting to LPU Main Campus.');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // If Google Maps API key is missing, render the high-detail interactive LPU SVG campus map with API key setup banner
  if (apiKeyMissing) {
    return (
      <div className="space-y-3">
        {/* API Key Setup Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                Google Maps Platform Ready • LPU Phagwara Punjab
              </span>
              <span className="text-slate-400 text-[11px]">
                Showing high-detail interactive vector map. Add <code className="text-sky-300">VITE_GOOGLE_MAPS_API_KEY</code> in <code className="text-slate-300">.env</code> to activate live Google Satellite & Street Maps.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md"
          >
            Google Maps Setup Guide
          </button>
        </div>

        {/* Fallback Vector Map */}
        <FallbackSVGMap
          heightClass={heightClass}
          onSelectShuttle={onSelectShuttle}
          onSelectStop={onSelectStop}
        />

        {/* Configuration Guide Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl p-6 md:p-8 border border-sky-500/30 shadow-2xl space-y-5 text-slate-100 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-black text-sm text-white">
                  <Key className="w-4 h-4 text-sky-400" />
                  Configuring Google Maps for ShuttleSync
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>
                  To render the live satellite and road views of Lovely Professional University (LPU), enable the following APIs in your Google Cloud Console:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300 font-medium">
                  <li><strong>Maps JavaScript API</strong> (Loads interactive campus tiles)</li>
                  <li><strong>Places API (New)</strong> (Enables landmark searching & geocoding)</li>
                  <li><strong>Routes API</strong> (Calculates turn-by-turn road waypoints)</li>
                </ol>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-sky-300">
                  VITE_GOOGLE_MAPS_API_KEY=AIzaSy...<br />
                  VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                  VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
                </div>

                <p className="text-[11px] text-slate-400">
                  Best Practice: In Google Cloud Console, restrict your API key to "HTTP referrers" targeting your deployment domains (<code className="text-sky-300">https://manas0306-ops.github.io/*</code> and <code className="text-sky-300">http://localhost:*</code>).
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Google Maps View
  return (
    <div className={`relative w-full ${heightClass} bg-[#070d1e] rounded-2xl overflow-hidden border border-sky-500/20 shadow-2xl select-none`}>
      {/* Top Map Status Bar & Route Filter */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Route Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg pointer-events-auto">
          <button
            onClick={() => setActiveRouteFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeRouteFilter === 'all'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All LPU Routes
          </button>
          {SHUTTLE_ROUTES.map(route => (
            <button
              key={route.id}
              onClick={() => setActiveRouteFilter(route.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeRouteFilter === route.id
                  ? 'text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: activeRouteFilter === route.id ? route.color : 'transparent',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }} />
              {route.code}
            </button>
          ))}
        </div>

        {/* Live GPS Telemetry Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 pointer-events-auto text-xs shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-white font-bold">LPU CAMPUS RADAR</span>
          <span className="text-slate-500">|</span>
          <span className="text-sky-400 font-semibold">{shuttles.length} Active EV Shuttles</span>
        </div>
      </div>

      {/* Floating Action Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
          title="Recenter on LPU Campus"
        >
          <RotateCcw className="w-4 h-4 text-sky-400" />
        </button>
        <button
          onClick={handleLocateMe}
          disabled={locating}
          className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
          title="Locate Current Position"
        >
          <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin text-sky-400' : 'text-emerald-400'}`} />
        </button>
      </div>

      {/* Campus Target Watermark (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-[11px] text-slate-400 pointer-events-auto">
        <MapPin className="w-3.5 h-3.5 text-sky-400" />
        <span>Lovely Professional University, Phagwara</span>
      </div>

      {/* Google Maps Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
