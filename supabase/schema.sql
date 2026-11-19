-- ==============================================================================
-- SHUTTLESYNC 2.0 — SUPABASE PRODUCTION DATABASE SCHEMA
-- Smart Campus Mobility, Real-Time LPU Mapping & Persistent Authentication
-- Lovely Professional University (INT335 Design Thinking Project P05)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  student_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'driver', 'admin')),
  avatar_url TEXT,
  favorite_stops TEXT[] DEFAULT ARRAY[]::TEXT[],
  saved_routes TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SHUTTLE ROUTES TABLE
CREATE TABLE IF NOT EXISTS public.shuttle_routes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  operating_hours TEXT NOT NULL,
  loop_duration_minutes INT NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROUTE STOPS TABLE (Geographical LPU Campus Stops)
CREATE TABLE IF NOT EXISTS public.route_stops (
  id TEXT PRIMARY KEY,
  route_id TEXT REFERENCES public.shuttle_routes(id) ON DELETE CASCADE,
  stop_name TEXT NOT NULL,
  stop_code TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  sequence_order INT NOT NULL DEFAULT 1,
  avg_wait_minutes NUMERIC(4, 1) NOT NULL DEFAULT 5.0,
  is_sheltered BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  is_on_duty BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. VEHICLES TABLE (Campus Shuttle Fleet)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  route_id TEXT REFERENCES public.shuttle_routes(id) ON DELETE SET NULL,
  capacity INT NOT NULL DEFAULT 28,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'On Time' CHECK (status IN ('On Time', 'Delayed', 'Crowded', 'Approaching', 'Boarding', 'Out of Service')),
  battery_percent INT NOT NULL DEFAULT 85 CHECK (battery_percent BETWEEN 0 AND 100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. VEHICLE LOCATIONS TABLE (Real-time telemetry stream)
CREATE TABLE IF NOT EXISTS public.vehicle_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id TEXT NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed_kmh NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
  heading_angle NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
  current_stop_id TEXT REFERENCES public.route_stops(id) ON DELETE SET NULL,
  next_stop_id TEXT REFERENCES public.route_stops(id) ON DELETE SET NULL,
  is_real_gps BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PASSENGER OCCUPANCY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.passenger_occupancy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id TEXT NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  stop_id TEXT REFERENCES public.route_stops(id) ON DELETE SET NULL,
  passenger_count INT NOT NULL DEFAULT 0,
  capacity INT NOT NULL DEFAULT 28,
  crowd_level TEXT NOT NULL CHECK (crowd_level IN ('Low', 'Moderate', 'High', 'Full')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('approaching', 'delay', 'crowd', 'route', 'system')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'alert', 'success')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SAVED ROUTES TABLE (Student Favorites)
CREATE TABLE IF NOT EXISTS public.saved_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  origin_stop_id TEXT NOT NULL REFERENCES public.route_stops(id) ON DELETE CASCADE,
  destination_stop_id TEXT NOT NULL REFERENCES public.route_stops(id) ON DELETE CASCADE,
  preferred_route_id TEXT REFERENCES public.shuttle_routes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. JOURNEY HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.journey_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  origin_name TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  route_name TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttle_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passenger_occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all basic profiles, but only update their own
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Routes & Stops: Public readable
CREATE POLICY "Routes viewable by everyone"
  ON public.shuttle_routes FOR SELECT
  USING (true);

CREATE POLICY "Stops viewable by everyone"
  ON public.route_stops FOR SELECT
  USING (true);

CREATE POLICY "Vehicles viewable by everyone"
  ON public.vehicles FOR SELECT
  USING (true);

CREATE POLICY "Vehicle locations readable by everyone"
  ON public.vehicle_locations FOR SELECT
  USING (true);

-- Drivers can update vehicle locations
CREATE POLICY "Drivers and admins can update vehicle locations"
  ON public.vehicle_locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('driver', 'admin')
    )
  );

-- Notifications: Users only see their own notifications or broadcast notifications
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Saved Routes: User restricted
CREATE POLICY "Users manage own saved routes"
  ON public.saved_routes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Journey History: User restricted
CREATE POLICY "Users manage own journey history"
  ON public.journey_history FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGN UP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, student_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'LPU Student'),
    COALESCE(NEW.raw_user_meta_data->>'student_id', '12200000'),
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.passenger_occupancy;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
