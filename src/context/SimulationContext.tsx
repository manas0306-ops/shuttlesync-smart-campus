import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ShuttleVehicle,
  ShuttleStatus,
  UserRole,
  TrafficCondition,
  WeatherCondition,
  SimulationState,
  SystemNotification,
} from '../types';
import { INITIAL_SHUTTLES } from '../data/mockShuttles';
import { CAMPUS_STOPS, SHUTTLE_ROUTES } from '../data/campusData';
import { soundManager } from '../components/common/SoundEffects';

interface SimulationContextType {
  shuttles: ShuttleVehicle[];
  simulation: SimulationState;
  userRole: UserRole;
  selectedShuttleId: string | null;
  selectedStopId: string | null;
  notifications: SystemNotification[];
  soundEnabled: boolean;
  setUserRole: (role: UserRole) => void;
  setSelectedShuttleId: (id: string | null) => void;
  setSelectedStopId: (id: string | null) => void;
  setSpeedMultiplier: (mult: number) => void;
  setTraffic: (traffic: TrafficCondition) => void;
  setWeather: (weather: WeatherCondition) => void;
  togglePeakHour: () => void;
  toggleRain: () => void;
  toggleSound: () => void;
  updateShuttleStatus: (shuttleId: string, status: ShuttleStatus) => void;
  updatePassengerCount: (shuttleId: string, deltaOrValue: number, isAbsolute?: boolean) => void;
  updateShuttleDelay: (shuttleId: string, delayMins: number) => void;
  markStopReached: (shuttleId: string) => void;
  broadcastDriverGPS: (shuttleId: string, lat: number, lng: number, speed?: number, heading?: number) => void;
  toggleDriverGPS: (active: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Shuttle S-201 Approaching',
    message: 'LPU CampusMaxi is 45 seconds away from Uni-Hospital Stop.',
    timestamp: 'Just now',
    category: 'approaching',
    severity: 'info',
    read: false,
    shuttleId: 'shuttle-s201',
    stopId: 'stop-uni-hospital',
  },
  {
    id: 'notif-2',
    title: 'High Crowd Density Alert',
    message: 'Boys Hostel Residential Zone (BH 1-7) has 65 waiting students. High boarding demand.',
    timestamp: '4 mins ago',
    category: 'crowd',
    severity: 'warning',
    read: false,
    stopId: 'stop-bh-hostel',
  },
  {
    id: 'notif-3',
    title: 'Monsoon Transit Advisory',
    message: 'Rain showers on GT Road corridor. Electric shuttle speeds moderated for student safety.',
    timestamp: '12 mins ago',
    category: 'system',
    severity: 'info',
    read: true,
  },
];

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shuttles, setShuttles] = useState<ShuttleVehicle[]>(() => {
    const saved = localStorage.getItem('shuttlesync_shuttles_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SHUTTLES;
      }
    }
    return INITIAL_SHUTTLES;
  });

  const [simulation, setSimulation] = useState<SimulationState>(() => {
    return {
      speedMultiplier: 1,
      traffic: 'Normal',
      weather: 'Clear',
      isPeakHour: false,
      activeShuttlesCount: 5,
      isRaining: false,
      isDriverGPSActive: false,
      useGoogleMaps: true,
    };
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('shuttlesync_role');
    return (savedRole as UserRole) || 'student';
  });

  const [selectedShuttleId, setSelectedShuttleId] = useState<string | null>('shuttle-s101');
  const [selectedStopId, setSelectedStopId] = useState<string | null>('stop-lpu-gate1');
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('shuttlesync_role', role);
    soundManager.playClick();
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      soundManager.enabled = next;
      if (next) soundManager.playChime();
      return next;
    });
  };

  const triggerNotification = useCallback((notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
    if (notif.severity === 'alert' || notif.severity === 'warning') {
      soundManager.playAlert();
    } else {
      soundManager.playChime();
    }
  }, []);

  // Main simulation heartbeat loop (Kinematics along real LPU coordinates & SVG paths)
  useEffect(() => {
    if (simulation.speedMultiplier === 0) return; // Paused

    const intervalMs = Math.max(200, 1000 / simulation.speedMultiplier);

    const timer = setInterval(() => {
      setShuttles(prevShuttles => {
        return prevShuttles.map(shuttle => {
          // If vehicle is streaming real GPS from driver device, don't overwrite with simulation
          if (shuttle.isRealGPS) return shuttle;

          const route = SHUTTLE_ROUTES.find(r => r.id === shuttle.routeId);
          if (!route) return shuttle;

          // Compute traffic factor
          let speedFactor = 1.0;
          if (simulation.traffic === 'Heavy') speedFactor = 0.55;
          else if (simulation.traffic === 'Moderate') speedFactor = 0.8;
          else if (simulation.traffic === 'Light') speedFactor = 1.25;

          if (simulation.isRaining) speedFactor *= 0.85;

          const progressStep = (shuttle.speedKmh / 20) * speedFactor * 1.8;
          let newProgress = shuttle.progressPercent + progressStep;

          let currentStopId = shuttle.currentStopId;
          let nextStopId = shuttle.nextStopId;
          let currentDelay = shuttle.delayMinutes;
          let passengerCount = shuttle.passengerCount;

          // If reached stop, cycle to next stop along route
          if (newProgress >= 100) {
            newProgress = 0;
            const currentStopIndex = route.stops.indexOf(nextStopId);
            currentStopId = nextStopId;
            const nextStopIndex = (currentStopIndex + 1) % route.stops.length;
            nextStopId = route.stops[nextStopIndex];

            // Boarding & Alighting simulation
            const alightCount = Math.floor(Math.random() * Math.min(8, passengerCount + 1));
            const boardCapacity = shuttle.capacity - (passengerCount - alightCount);
            const boardCount = Math.floor(Math.random() * Math.min(10, boardCapacity + 1));
            passengerCount = Math.max(2, Math.min(shuttle.capacity, passengerCount - alightCount + boardCount));
          }

          // Calculate interpolated SVG (x, y)
          const path = route.pathPoints;
          const totalSegments = path.length - 1;
          const globalProgress = (newProgress / 100);
          const segmentIndex = Math.min(
            totalSegments - 1,
            Math.floor(globalProgress * totalSegments)
          );
          const segmentProgress = (globalProgress * totalSegments) - segmentIndex;

          const p1 = path[segmentIndex];
          const p2 = path[segmentIndex + 1] || path[0];

          const curX = Math.round(p1.x + (p2.x - p1.x) * segmentProgress);
          const curY = Math.round(p1.y + (p2.y - p1.y) * segmentProgress);

          // Calculate interpolated real GPS (lat, lng)
          const geoPath = route.geoCoordinates;
          const totalGeoSegments = geoPath.length - 1;
          const geoSegIdx = Math.min(totalGeoSegments - 1, Math.floor(globalProgress * totalGeoSegments));
          const geoSegProgress = (globalProgress * totalGeoSegments) - geoSegIdx;

          const g1 = geoPath[geoSegIdx];
          const g2 = geoPath[geoSegIdx + 1] || geoPath[0];

          const curLat = Number((g1.lat + (g2.lat - g1.lat) * geoSegProgress).toFixed(5));
          const curLng = Number((g1.lng + (g2.lng - g1.lng) * geoSegProgress).toFixed(5));

          // Calculate heading angle
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const headingAngle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);

          // Determine ETA in seconds to next stop
          const remainingPercent = 100 - newProgress;
          const remainingSecs = Math.max(10, Math.round((remainingPercent * 3.5) / speedFactor));

          // Determine status
          let status: ShuttleStatus = 'On Time';
          if (currentDelay > 3) {
            status = 'Delayed';
          } else if (remainingSecs <= 55) {
            status = 'Approaching';
          } else if (passengerCount >= shuttle.capacity * 0.9) {
            status = 'Crowded';
          }

          return {
            ...shuttle,
            progressPercent: newProgress,
            x: curX,
            y: curY,
            lat: curLat,
            lng: curLng,
            headingAngle,
            currentStopId,
            nextStopId,
            passengerCount,
            status,
            estimatedTimeToNextStop: remainingSecs,
            lastUpdated: 'Just now',
          };
        });
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simulation.speedMultiplier, simulation.traffic, simulation.isRaining]);

  // Persist state to localStorage occasionally
  useEffect(() => {
    localStorage.setItem('shuttlesync_shuttles_v2', JSON.stringify(shuttles));
  }, [shuttles]);

  const setSpeedMultiplier = (mult: number) => {
    setSimulation(prev => ({ ...prev, speedMultiplier: mult }));
    soundManager.playClick();
  };

  const setTraffic = (traffic: TrafficCondition) => {
    setSimulation(prev => ({ ...prev, traffic }));
    soundManager.playClick();
  };

  const setWeather = (weather: WeatherCondition) => {
    setSimulation(prev => ({ ...prev, weather, isRaining: weather === 'Rainy' }));
    soundManager.playClick();
  };

  const togglePeakHour = () => {
    setSimulation(prev => {
      const next = !prev.isPeakHour;
      if (next) {
        triggerNotification({
          title: 'Peak-Hour Surge Activated',
          message: 'Campus-wide student transit surge active (1.8x typical volume).',
          category: 'crowd',
          severity: 'warning',
        });
      }
      return { ...prev, isPeakHour: next };
    });
    soundManager.playClick();
  };

  const toggleRain = () => {
    setSimulation(prev => {
      const next = !prev.isRaining;
      return {
        ...prev,
        isRaining: next,
        weather: next ? 'Rainy' : 'Clear',
      };
    });
    soundManager.playClick();
  };

  const updateShuttleStatus = (shuttleId: string, status: ShuttleStatus) => {
    setShuttles(prev =>
      prev.map(s => (s.id === shuttleId ? { ...s, status } : s))
    );
    soundManager.playClick();
  };

  const updatePassengerCount = (shuttleId: string, deltaOrValue: number, isAbsolute = false) => {
    setShuttles(prev =>
      prev.map(s => {
        if (s.id !== shuttleId) return s;
        const newCount = isAbsolute
          ? Math.max(0, Math.min(s.capacity, deltaOrValue))
          : Math.max(0, Math.min(s.capacity, s.passengerCount + deltaOrValue));

        let status = s.status;
        if (newCount >= s.capacity) status = 'Crowded';
        return { ...s, passengerCount: newCount, status };
      })
    );
    soundManager.playClick();
  };

  const updateShuttleDelay = (shuttleId: string, delayMins: number) => {
    setShuttles(prev =>
      prev.map(s => (s.id === shuttleId ? { ...s, delayMinutes: Math.max(0, delayMins) } : s))
    );
    soundManager.playClick();
  };

  const markStopReached = (shuttleId: string) => {
    setShuttles(prev =>
      prev.map(s => {
        if (s.id !== shuttleId) return s;
        const route = SHUTTLE_ROUTES.find(r => r.id === s.routeId);
        if (!route) return s;
        const nextIndex = (route.stops.indexOf(s.nextStopId) + 1) % route.stops.length;
        return {
          ...s,
          currentStopId: s.nextStopId,
          nextStopId: route.stops[nextIndex],
          progressPercent: 5,
          status: 'Boarding',
        };
      })
    );
    soundManager.playChime();
  };

  // Real GPS broadcasting from Driver device
  const broadcastDriverGPS = (
    shuttleId: string,
    lat: number,
    lng: number,
    speed = 22,
    heading = 0
  ) => {
    setShuttles(prev =>
      prev.map(s => {
        if (s.id !== shuttleId) return s;
        return {
          ...s,
          lat,
          lng,
          speedKmh: Math.round(speed),
          headingAngle: Math.round(heading),
          isRealGPS: true,
          lastUpdated: 'Live GPS',
        };
      })
    );
  };

  const toggleDriverGPS = (active: boolean) => {
    setSimulation(prev => ({ ...prev, isDriverGPSActive: active }));
    if (!active) {
      // Revert vehicle to simulated mode
      setShuttles(prev => prev.map(s => ({ ...s, isRealGPS: false })));
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    soundManager.playClick();
  };

  const resetSimulation = () => {
    setShuttles(INITIAL_SHUTTLES);
    setSimulation({
      speedMultiplier: 1,
      traffic: 'Normal',
      weather: 'Clear',
      isPeakHour: false,
      activeShuttlesCount: 5,
      isRaining: false,
      isDriverGPSActive: false,
      useGoogleMaps: true,
    });
    setNotifications(INITIAL_NOTIFICATIONS);
    soundManager.playChime();
  };

  return (
    <SimulationContext.Provider
      value={{
        shuttles,
        simulation,
        userRole,
        selectedShuttleId,
        selectedStopId,
        notifications,
        soundEnabled,
        setUserRole,
        setSelectedShuttleId,
        setSelectedStopId,
        setSpeedMultiplier,
        setTraffic,
        setWeather,
        togglePeakHour,
        toggleRain,
        toggleSound,
        updateShuttleStatus,
        updatePassengerCount,
        updateShuttleDelay,
        markStopReached,
        broadcastDriverGPS,
        toggleDriverGPS,
        markNotificationRead,
        markAllNotificationsRead,
        triggerNotification,
        resetSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
