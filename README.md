# 🚌 ShuttleSync 2.0 — Know Before You Go
### Smart Campus Mobility, Real-Time LPU Mapping & Persistent Student Transport Platform

[![Deploy ShuttleSync to GitHub Pages](https://github.com/manas0306-ops/shuttlesync-smart-campus/actions/workflows/deploy.yml/badge.svg)](https://github.com/manas0306-ops/shuttlesync-smart-campus/actions/workflows/deploy.yml)
[![Live Application](https://img.shields.io/badge/Live%20App-GitHub%20Pages-38bdf8?style=flat&logo=github)](https://manas0306-ops.github.io/shuttlesync-smart-campus/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Live Production URL:** [https://manas0306-ops.github.io/shuttlesync-smart-campus/](https://manas0306-ops.github.io/shuttlesync-smart-campus/)  
> **GitHub Repository:** [https://github.com/manas0306-ops/shuttlesync-smart-campus](https://github.com/manas0306-ops/shuttlesync-smart-campus)  
> **Course / Project:** INT335 Design Thinking — Project P05 (Waiting for the Shuttle)  
> **Institution:** Lovely Professional University (LPU), Phagwara, Punjab, India  
> **Lead Developer & Designer:** Maanas Pandey ([@manas0306-ops](https://github.com/manas0306-ops) / krishnamanas1224@gmail.com)

---

## 🌟 Executive Summary

**ShuttleSync 2.0** transforms campus mobility at Lovely Professional University (LPU) into a transparent, predictable, and student-centered experience. Conceived during the INT335 Design Thinking course, ShuttleSync tackles the critical pain points of intra-campus commuting: erratic waiting times, shuttle bunching, sudden overcrowding at academic peak hours, and safety concerns during late-evening hostel transit.

Upgraded to **Version 2.0**, ShuttleSync introduces:
1. **Real LPU Geographical Google Maps Platform Integration** centered on `31.2530° N, 75.7037° E` with custom dark-mode mobility styling, high-accuracy road polylines, and interactive stop landmarks.
2. **Persistent Student Authentication Architecture (Supabase Auth)** with university email verification, single-password credential security, session persistence across browser restarts, and offline storage failover.
3. **Personalized Student Transit Hub** featuring real-time arrival countdowns, favorite saved commute corridors, and carbon-savings analytics.
4. **Dual-Mode Driver Telemetry Console** allowing drivers to broadcast live device GPS via the browser Geolocation API (Mode B) alongside physics-modeled synthetic campus simulation (Mode A).

---

## 🗺️ Real LPU Campus Landmark Coverage

ShuttleSync coordinates correspond directly to real Lovely Professional University infrastructure:
- **Main Gate 1 (NH-44 / GT Road)** — `(31.2558, 75.7042)`: Primary gateway connecting external buses, auto stands, and highway transit.
- **Block 32–34 (Central Library & Student Center)** — `(31.2536, 75.7028)`: High-traffic academic hub with heavy morning and evening demand.
- **Uni-Mall & Food Square** — `(31.2520, 75.7050)`: Social and dining core with peak lunch and dinner traffic.
- **Block 36–38 (Engineering & Technology Quad)** — `(31.2512, 75.7015)`: Tech campus zone with frequent lab switchovers.
- **Boys Hostel Complex (BH 1–7)** — `(31.2575, 75.6990)`: High-density residential zone on the north perimeter.
- **Girls Hostel Complex (GH 1–6)** — `(31.2490, 75.7065)`: Residential quad with prioritized evening safety and lighting.
- **LPU Sports Stadium & Gymnasium** — `(31.2550, 75.7075)`: Major campus event and athletics center.
- **Uni-Hospital & Gate 2** — `(31.2475, 75.7030)`: 24/7 medical and emergency campus entrance.

---

## 🚀 Key Modules & Capabilities

### 1. 🔐 Persistent Student Authentication
- **Registration with Student ID & Strength Meter:** Validates university email format (`@lpu.in` or personal email), Student Registration ID (e.g., `12214589`), password entropy meter, and match validation.
- **Dual Identifier Login:** Students can authenticate using either their University Email OR Student ID alongside their secure password.
- **Single-Password Credential Security:** Every student identity has exactly one current password. Changing passwords inside the Profile Modal immediately updates the single credential.
- **Persistent Session State:** Uses Supabase Auth session tokens combined with offline fallback storage (`shuttlesync_active_session`), ensuring users remain signed in across browser restarts when "Remember Me" is selected.
- **Route Guard:** Authenticated features (Student Hub, Saved Routes) redirect unauthenticated visitors to login seamlessly.

### 2. 🗺️ Google Maps Campus Tracking & Fallback Engine
- Loaded via `@googlemaps/js-api-loader` with asynchronous `importLibrary('maps')`.
- Styled with high-contrast `#070d1e` dark mobility theme highlighting roads in `#1e293b` and university landmarks in `#38bdf8`.
- Interactive stop markers with real-time crowd metrics and shuttle cards with occupancy badges.
- **Zero-Crash Graceful Fallback:** If a user runs the project without a Google Maps API key, the system automatically surfaces the interactive high-detail vector campus map and offers a one-click API key configuration modal.

### 3. ⏱️ Smart Arrival & Crowd Prediction
- Real-time ETA forecasting computing speed, weather friction, traffic congestion, and distance.
- Dynamic 4-tier crowd classification: Low (0–40%), Moderate (41–70%), High (71–90%), Full (91–100%).
- Smart Stop Recommendation Engine calculating composite scores based on walking time, wait time, and crowd congestion to recommend the optimal pickup point.

### 4. 🧭 Multi-Modal Journey Planner
- Select starting point and destination among LPU campus stops.
- Automatic routing across Route 1 (Campus Express Loop), Route 2 (Academic Ring Line), and Route 3 (Hostel Connector).
- Step-by-step breakdown with walking distance, shuttle segment duration, transfer points, and estimated carbon offset (g CO₂ saved vs petrol auto-rickshaw).

### 5. 🧑‍✈️ Driver Cockpit & Real GPS Broadcast
- **Mode A (Simulation):** Physics simulation updating shuttle position, speed, and passenger count along route waypoints.
- **Mode B (Real GPS):** One-click toggle activating `navigator.geolocation.watchPosition` to broadcast the actual physical smartphone or laptop GPS coordinates to the campus fleet.
- One-touch stop arrival progression and instant passenger count +/- controls.

### 6. 📊 Admin Fleet Telemetry & Simulation Controls
- Real-time fleet health monitor: On Time, Delayed, Approaching, Maintenance.
- Global traffic density slider (Low, Moderate, Heavy, Congested).
- Weather condition toggle (Clear, Rainy, Foggy, Peak Sun).
- Fleet-wide occupancy heatmaps and historical waiting time distributions.

### 7. 🎓 Design Thinking Dossier (INT335)
Interactive 6-phase Design Thinking journey modal built into the header:
- **Phase 1: Empathize** — 142 student commute surveys, 4 empathy maps (first-year student, day scholar, hostel resident, campus security).
- **Phase 2: Define** — Problem statements, "How Might We" frameworks, student journey friction points.
- **Phase 3: Ideate** — 25 brainstormed mobility solutions, Eisenhower matrix prioritization, SCAMPER methodology.
- **Phase 4: Prototype** — Low-fidelity wireframes to interactive high-fidelity digital twin.
- **Phase 5: Test** — User feedback metrics, SUS (System Usability Scale) target of 88.5, iteration logs.
- **Phase 6: Implementation** — Architecture, Supabase schema, deployment CI/CD pipeline.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript 5.7, Vite 6 |
| **Styling & UI** | Tailwind CSS v4, Lucide React icons, Glassmorphism CSS |
| **Mapping Engine** | Google Maps Platform JavaScript API (`@googlemaps/js-api-loader`), Custom SVG Canvas Fallback |
| **Backend & Auth** | Supabase (PostgreSQL, GoTrue Auth, Row Level Security, Realtime Publications) |
| **Persistence** | Supabase Session Storage + Persistent Local Storage Fallback Engine |
| **Animations & FX** | CSS Keyframes, Dynamic cursor follower, Canvas Confetti |
| **CI / CD & Hosting** | GitHub Actions, GitHub Pages |

---

## 🗄️ Database Architecture (Supabase)

The complete SQL schema is located in [`supabase/schema.sql`](supabase/schema.sql). It contains 10 normalized tables with full Row Level Security (RLS) policies:
1. `profiles` — Student details, registration IDs, university email, role (`student`, `driver`, `admin`).
2. `shuttles` — Vehicle IDs, license plates, models, capacity, status, driver assignments.
3. `routes` — Route name, code, color, polyline coordinates, operational hours.
4. `stops` — Physical stop coordinates, landmarks, shelters, lighting ratings.
5. `route_stops` — Ordered sequence and arrival offsets between routes and stops.
6. `shuttle_locations` — Real-time telemetry log (`latitude`, `longitude`, `speed`, `heading`, `passenger_count`, `is_real_gps`).
7. `saved_routes` — Student favorite routes with custom labels and notification preferences.
8. `ride_history` — Student commute logs with boarding/alighting stops and carbon offset.
9. `notifications` — Dynamic student alerts (delay warnings, shuttle full alerts, arrival pings).
10. `system_settings` — Global campus traffic parameters, weather simulation, and operational hours.

---

## ⚙️ Local Setup & Development

### 1. Clone Repository
```bash
git clone https://github.com/manas0306-ops/shuttlesync-smart-campus.git
cd shuttlesync-smart-campus
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your credentials:
```env
# Google Maps API Key with Maps JavaScript API enabled
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Project Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
> *Note:* If environment variables are omitted, ShuttleSync automatically activates its offline demonstration engines (built-in interactive vector campus map and persistent local auth storage), providing an immediate out-of-the-box working experience.

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🚢 Continuous Deployment (GitHub Actions)

Every push to the `main` branch automatically triggers the `.github/workflows/deploy.yml` pipeline:
1. Checks out repository.
2. Sets up Node.js 20 environment with npm cache.
3. Installs dependencies (`npm ci --legacy-peer-deps`).
4. Executes TypeScript compiler checks and Vite production build (`npm run build`).
5. Injects `404.html` fallback for single-page application routing on GitHub Pages.
6. Deploys optimized static bundle to GitHub Pages.

---

## 👤 Author & Contribution

Developed with ❤️ by **Maanas Pandey**  
- **GitHub:** [@manas0306-ops](https://github.com/manas0306-ops)  
- **Email:** [krishnamanas1224@gmail.com](mailto:krishnamanas1224@gmail.com)  
- **Assignment:** INT335 Design Thinking (Project P05 — Waiting for the Shuttle)  
- **Institution:** Lovely Professional University, Punjab, India  

© 2026 ShuttleSync Platform. Released under the MIT License.
