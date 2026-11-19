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
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface GoogleCampusMapProps {
  onSelectShuttle?: (id: string) => void;
  onSelectStop?: (id: string) => void;
  heightClass?: string;
}

// Enterprise clean light mobility theme for Google Maps
const GOOGLE_MAPS_LIGHT_THEME: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 3 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#0f172a' }, { weight: 6 }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#475569' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e2f5ea' }],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [{ color: '#f1f5f9' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#cbd5e1' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#bfdbfe' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#60a5fa' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1e3a8a' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#e0f2fe' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#dbeafe' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#2563eb' }],
  },
];

export const GoogleCampusMap: React.FC<GoogleCampusMapProps> = ({
  onSelectShuttle,
  onSelectStop,
  heightClass = 'h-[560px]',
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
  const mapWrapperRef = useRef<HTMLDivElement>(null);
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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
          styles: GOOGLE_MAPS_LIGHT_THEME,
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

    const routesToRender = SHUTTLE_ROUTES.filter(
      r => activeRouteFilter === 'all' || r.id === activeRouteFilter
    );

    routesToRender.forEach(route => {
      const polyline = new google.maps.Polyline({
        path: route.geoCoordinates,
        geodesic: true,
        strokeColor: route.color,
        strokeOpacity: 0.85,
        strokeWeight: 5,
        map: mapInstanceRef.current!,
      });

      polylinesRef.current.push(polyline);
    });
  }, [mapLoaded, activeRouteFilter]);

  // Render Stop Markers on Google Map
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    stopMarkersRef.current.forEach(m => m.setMap(null));
    stopMarkersRef.current.clear();

    CAMPUS_STOPS.forEach(stop => {
      const stopSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
          <path d="M17 0 C7.6 0 0 7.6 0 17 C0 29.8 17 42 17 42 C17 42 34 29.8 34 17 C34 7.6 26.4 0 17 0 Z" fill="#0f172a" stroke="#2563eb" stroke-width="2"/>
          <circle cx="17" cy="16" r="9" fill="#2563eb"/>
          <text x="17" y="20" font-size="9" font-family="Arial, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">${stop.code.replace('ST-', '')}</text>
        </svg>
      `)}`;

      const marker = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: mapInstanceRef.current!,
        title: stop.name,
        icon: {
          url: stopSvg,
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40),
        },
      });

      marker.addListener('click', () => {
        setSelectedStopId(stop.id);
        if (onSelectStop) onSelectStop(stop.id);

        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(`
            <div style="color:#0f172a; font-family:Inter, sans-serif; padding:6px; max-width:240px;">
              <div style="font-size:11px; font-weight:bold; color:#2563eb; text-transform:uppercase; letter-spacing:0.5px;">${stop.code}</div>
              <strong style="font-size:13px; color:#0f172a; display:block; margin:2px 0 4px 0;">${stop.name}</strong>
              <p style="font-size:11px; margin:0 0 6px 0; color:#64748b; line-height:1.3;">${stop.description}</p>
              <div style="display:flex; justify-content:space-between; font-size:11px; background:#f1f5f9; padding:4px 6px; border-radius:4px; font-weight:600;">
                <span style="color:#16a34a;">Wait: ~${stop.avgWaitMinutes} min</span>
                <span style="color:#2563eb;">Crowd: ${stop.currentCrowdCount} commuters</span>
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
      const routeColor = route?.color || '#2563eb';
      const isSelected = selectedShuttleId === shuttle.id;

      const shuttleSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
          ${isSelected ? `<circle cx="22" cy="22" r="21" fill="none" stroke="${routeColor}" stroke-width="2.5" stroke-dasharray="4,2"/>` : ''}
          <circle cx="22" cy="22" r="18" fill="#ffffff" stroke="${routeColor}" stroke-width="3"/>
          <rect x="13" y="14" width="18" height="15" rx="3" fill="${routeColor}"/>
          <rect x="15" y="16" width="5" height="5" rx="1" fill="#ffffff"/>
          <rect x="24" y="16" width="5" height="5" rx="1" fill="#ffffff"/>
          <circle cx="16" cy="30" r="2" fill="#0f172a"/>
          <circle cx="28" cy="30" r="2" fill="#0f172a"/>
        </svg>
      `)}`;

      if (!marker) {
        marker = new google.maps.Marker({
          position: { lat: shuttle.lat, lng: shuttle.lng },
          map: mapInstanceRef.current!,
          title: shuttle.name,
          icon: {
            url: shuttleSvg,
            scaledSize: new google.maps.Size(42, 42),
            anchor: new google.maps.Point(21, 21),
          },
        });

        marker.addListener('click', () => {
          setSelectedShuttleId(shuttle.id);
          if (onSelectShuttle) onSelectShuttle(shuttle.id);

          if (infoWindowRef.current && mapInstanceRef.current) {
            infoWindowRef.current.setContent(`
              <div style="color:#0f172a; font-family:Inter, sans-serif; padding:6px; max-width:240px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="font-size:13px; color:#0f172a;">${shuttle.name}</strong>
                  <span style="font-size:10px; font-weight:700; color:#ffffff; background:${routeColor}; padding:2px 6px; border-radius:4px;">${route?.code || 'BUS'}</span>
                </div>
                <div style="font-size:11px; color:#475569; margin-bottom:6px;">Driver: ${shuttle.driverName}</div>
                <div style="display:flex; justify-content:space-between; font-size:11px; background:#f8fafc; border:1px solid #e2e8f0; padding:6px; border-radius:6px;">
                  <div>
                    <div style="font-size:9px; color:#64748b; text-transform:uppercase;">Status</div>
                    <div style="font-weight:700; color:${shuttle.status === 'On Time' ? '#16a34a' : '#d97706'};">${shuttle.status}</div>
                  </div>
                  <div>
                    <div style="font-size:9px; color:#64748b; text-transform:uppercase;">Occupancy</div>
                    <div style="font-weight:700; color:#0f172a;">${shuttle.passengerCount}/${shuttle.capacity}</div>
                  </div>
                  <div>
                    <div style="font-size:9px; color:#64748b; text-transform:uppercase;">Speed</div>
                    <div style="font-weight:700; color:#0f172a;">${shuttle.speedKmh} km/h</div>
                  </div>
                </div>
              </div>
            `);
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }
        });

        shuttleMarkersRef.current.set(shuttle.id, marker);
      } else {
        marker.setPosition({ lat: shuttle.lat, lng: shuttle.lng });
      }
    });
  }, [shuttles, mapLoaded, selectedShuttleId, onSelectShuttle, setSelectedShuttleId]);

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
              fillColor: '#2563eb',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });
        }
      },
      err => {
        setLocating(false);
        alert('Could not retrieve GPS location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // If Google Maps API key is missing, show the clean vector campus map with setup helper
  if (apiKeyMissing) {
    return (
      <div className="relative">
        <FallbackSVGMap
          onSelectShuttle={onSelectShuttle}
          onSelectStop={onSelectStop}
          heightClass={heightClass}
        />

        {/* API Key Banner Pill */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LPU Geographic Coordinates Active</span>
          <button
            onClick={() => setShowConfigModal(true)}
            className="ml-2 font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 underline"
          >
            <Key className="w-3.5 h-3.5" /> Google Maps API Key
          </button>
        </div>

        {/* Setup Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Google Maps Platform Setup</h4>
                    <p className="text-xs text-slate-500">Configure Maps JavaScript API for Lovely Professional University</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <p>
                  ShuttleSync features real geographic coordinates for LPU campus landmarks:
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                  <div>• Center: 31.2530° N, 75.7037° E (LPU Campus)</div>
                  <div>• Main Gate 1 (NH-44): 31.2558° N, 75.6968° E</div>
                  <div>• Block 32-34 Central Library: 31.2542° N, 75.7018° E</div>
                  <div>• Uni-Mall Student Square: 31.2522° N, 75.7042° E</div>
                </div>
                <p>
                  To load the live Google Maps vector tiles, set the following in your environment:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-xs">
                  VITE_GOOGLE_MAPS_API_KEY=your_key_here
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <a
                  href="https://console.cloud.google.com/google/maps-apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  Get Google Maps Key <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={mapWrapperRef}
      className={`relative w-full ${heightClass} bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm select-none`}
    >
      {/* Top Map Toolbar: Route Filter Pills */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 shadow-sm pointer-events-auto">
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

      {/* Top Right Live Telemetry Badge */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-semibold text-slate-900">{shuttles.length} Active Shuttles</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500">LPU Campus Geofence</span>
      </div>

      {/* Floating Map Action Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-all"
          title="Recenter on LPU Campus"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleLocateMe}
          disabled={locating}
          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50"
          title="Locate My Position"
        >
          <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-all"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Google Maps Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
