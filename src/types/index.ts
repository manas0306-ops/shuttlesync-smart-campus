export type ShuttleStatus = 'On Time' | 'Delayed' | 'Crowded' | 'Approaching' | 'Out of Service' | 'Boarding';

export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Full';

export type UserRole = 'student' | 'driver' | 'admin';

export type TrafficCondition = 'Light' | 'Normal' | 'Moderate' | 'Heavy';

export type WeatherCondition = 'Clear' | 'Rainy' | 'Foggy';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface CampusStop {
  id: string;
  name: string;
  code: string;
  x: number; // SVG coordinate fallback
  y: number;
  lat: number; // Real geographical latitude (LPU)
  lng: number; // Real geographical longitude (LPU)
  type: 'academic' | 'hostel' | 'gate' | 'amenity' | 'library';
  description: string;
  facilities: string[];
  currentCrowdCount: number;
  avgWaitMinutes: number;
  sheltered: boolean;
  landmarkSnippet?: string;
}

export interface ShuttleRoute {
  id: string;
  name: string;
  code: string;
  color: string;
  badgeBg: string;
  stops: string[]; // stop IDs in order
  pathPoints: { x: number; y: number }[]; // SVG coordinates
  geoCoordinates: LatLng[]; // Real geographical polyline coordinates (LPU)
  loopDurationMinutes: number;
  operatingHours: string;
  frequencyMinutes: number;
}

export interface ShuttleVehicle {
  id: string;
  name: string;
  routeId: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  passengerCount: number;
  currentStopId: string;
  nextStopId: string;
  speedKmh: number;
  batteryPercent: number;
  status: ShuttleStatus;
  progressPercent: number; // 0-100% between stops
  x: number; // SVG coordinate fallback
  y: number;
  lat: number; // Real GPS latitude
  lng: number; // Real GPS longitude
  headingAngle: number; // 0-360 degrees
  delayMinutes: number;
  estimatedTimeToNextStop: number; // in seconds
  lastUpdated: string;
  isRealGPS?: boolean; // True if broadcasting from real device GPS
}

export interface SmartRecommendation {
  stopId: string;
  score: number; // 1-100
  walkingTimeMinutes: number;
  walkingDistanceMeters: number;
  nextShuttleETA: number;
  totalTimeMinutes: number;
  crowdLevel: CrowdLevel;
  primaryReason: string;
  savingsMinutes: number;
  isBestChoice: boolean;
}

export interface RouteJourney {
  id: string;
  routeName: string;
  routeColor: string;
  shuttleId: string;
  departureTime: string;
  arrivalTime: string;
  totalDurationMinutes: number;
  walkMinutes: number;
  shuttleMinutes: number;
  stopsCount: number;
  stopsList: string[];
  crowdLevel: CrowdLevel;
  carbonSavedKg: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'approaching' | 'delay' | 'crowd' | 'route' | 'system';
  severity: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  shuttleId?: string;
  stopId?: string;
}

export interface SimulationState {
  speedMultiplier: number; // 1x, 2x, 5x, 0 (paused)
  traffic: TrafficCondition;
  weather: WeatherCondition;
  isPeakHour: boolean;
  activeShuttlesCount: number;
  isRaining: boolean;
  isDriverGPSActive: boolean;
  useGoogleMaps: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: UserRole;
  avatarUrl?: string;
  favoriteStopIds: string[];
  savedRouteIds: string[];
  createdAt: string;
}

export interface SavedRoute {
  id: string;
  title: string;
  originStopId: string;
  destinationStopId: string;
  preferredRouteId?: string;
  addedAt: string;
}

export interface JourneyHistoryEntry {
  id: string;
  originName: string;
  destinationName: string;
  routeName: string;
  durationMinutes: number;
  timestamp: string;
}


export interface DriverRecord {
  id: string;
  name: string;
  driverCode: string;
  assignedVehicleId: string;
  assignedRouteId: string;
  phone: string;
  dutyStatus: 'On Duty' | 'On Break' | 'Off Duty';
  shiftHours: string;
  rating: number;
  totalTripsToday: number;
  lastLocationUpdate: string;
  licenseNumber: string;
  emergencyContact: string;
}

export interface StudentTransitRecord {
  id: string;
  name: string;
  registrationId: string;
  email: string;
  department: string;
  hostelOrDayScholar: string;
  primaryRoute: string;
  passStatus: 'Active Pass' | 'Semester Pass' | 'Special Permit';
  totalTripsThisMonth: number;
  carbonCreditsKg: number;
  lastRideDate: string;
}
