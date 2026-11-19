# 🚌 ShuttleSync 2.0 — Know Before You Go
### Enterprise Fleet Management & Smart Campus Mobility Platform
**Lovely Professional University (LPU), Phagwara, Punjab, India**  
**INT335 Design Thinking Assignment (Project P05: Waiting for the Shuttle)**

[![Deploy ShuttleSync to GitHub Pages](https://github.com/manas0306-ops/shuttlesync-smart-campus/actions/workflows/deploy.yml/badge.svg)](https://github.com/manas0306-ops/shuttlesync-smart-campus/actions/workflows/deploy.yml)
[![Live Application](https://img.shields.io/badge/Live%20App-GitHub%20Pages-2563eb?style=flat&logo=github)](https://manas0306-ops.github.io/shuttlesync-smart-campus/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Live Production URL:** [https://manas0306-ops.github.io/shuttlesync-smart-campus/](https://manas0306-ops.github.io/shuttlesync-smart-campus/)  
> **GitHub Repository:** [https://github.com/manas0306-ops/shuttlesync-smart-campus](https://github.com/manas0306-ops/shuttlesync-smart-campus)  
> **Course / Project:** INT335 Design Thinking — Project P05 (Waiting for the Shuttle)  
> **Institution:** Lovely Professional University (LPU), Phagwara, Punjab, India  
> **Lead Full-Stack Developer & Product Architect:** Maanas Pandey ([@manas0306-ops](https://github.com/manas0306-ops) / krishnamanas1224@gmail.com)

---

## 🌟 Overview & Enterprise Design Philosophy

**ShuttleSync 2.0** has been redesigned as a **genuine enterprise SaaS fleet management and campus transportation control system**, transforming university transit at Lovely Professional University (LPU) from an unorganized daily friction point into a predictable, transparent, and student-centered experience.

### 🎨 Enterprise UI/UX Design System
- **Clean white / light-slate workspace (`#f8fafc` / `#ffffff`)** with structured borders (`#e2e8f0`) and subtle shadows.
- **Fixed, collapsible dark navy navigation sidebar (`#0f172a`)** with quick workspace role switching (Student, Driver, Admin).
- **Multi-panel fleet monitoring dashboard** with top operational KPI metrics, left-side vehicle telemetry panel, large central Google Maps view, and bottom operational logs.
- **Real geographical Google Maps Platform integration** centered on Lovely Professional University (`31.2530° N, 75.7037° E`) with custom light silver mobility styling, live route polylines, and interactive markers.
- **Subtle desktop animated shuttle cursor** with standard pointer and touch fallback for mobile devices.

---

## 🏛️ Application Architecture & Navigation Modules

The platform is organized into 10 dedicated enterprise transit modules:

| Module | Route / Tab | Description |
|---|---|---|
| **Overview** | `#overview` | Executive fleet overview with KPI metric cards, active telemetry panel, central map, and live activity feed. |
| **Live Map** | `#live-map` | Fullscreen-capable Google Maps fleet radar with LPU campus geofence, vehicle selector, and route filters. |
| **Route Management** | `#routes` | Corridor manager for R-101 (Blue), R-202 (Green), R-303 (Purple) with stop progressions, headways, and schedules. |
| **Shuttle Fleet** | `#fleet` | Structured fleet table with Vehicle ID, model, driver, current location, occupancy progress bars, status, and ETA. |
| **Drivers** | `#drivers` | Driver roster with code (`DRV-801` to `DRV-805`), shift hours, rating, duty status, and privacy-masked emergency contact. |
| **Student Hub** | `#students` | Personalized commuter hub (next shuttle countdown, saved routes, carbon savings) + Admin Student Directory. |
| **Passenger Occupancy** | `#occupancy` | Visual occupancy indicators (`32 / 50 Pax`), free seats counter, crowd levels, and hourly distribution chart. |
| **Notifications** | `#notifications` | Real-time transit alerts, delay warnings, crowd spikes, and university dispatch broadcast composer. |
| **Analytics** | `#analytics` | Historical wait curves, fleet load factors, bottleneck choke points, and carbon offset metrics. |
| **Settings** | `#settings` | Simulation engine parameters (speed multiplier, traffic congestion, weather friction) + Mode B Real Device GPS broadcast. |
| **Design Thinking** | `#design-thinking` | INT335 Design Thinking academic dossier covering all 7 stages (Empathy, Observation, Define, Ideate, Prototype, Test, Defense). |

---

## 🗺️ Real LPU Campus Landmark Coverage

All stop coordinates and route polylines directly correspond to real Lovely Professional University infrastructure:
- **Main Gate 1 (NH-44 / GT Road)** — `(31.2558, 75.6968)`: Primary highway gate with auto stand and bus interchange.
- **Block 32–34 (Central Library & CS Block)** — `(31.2542, 75.7018)`: Academic core with high morning rush.
- **Uni-Mall & Food Square** — `(31.2522, 75.7042)`: Central social square, food courts, and ATMs.
- **Block 36–38 (Engineering & Robotics Quad)** — `(31.2552, 75.7058)`: Workshop and technology complex.
- **Boys Hostel Complex (BH 1–7)** — `(31.2505, 75.6998)`: High-density residential zone on northern perimeter.
- **Girls Hostel Complex (GH 1–6)** — `(31.2492, 75.7062)`: Residential quad with prioritized evening transit safety.
- **LPU Sports Stadium & Gymnasium** — `(31.2550, 75.7075)`: Athletics arena and university grounds.
- **Uni-Hospital & Gate 2** — `(31.2475, 75.7030)`: 24/7 medical facility and southern entrance.

### 🚏 Active Campus Corridors
- **Route R-101 (Campus Express Loop - Blue `#2563eb`):** NH-44 Gate 1 ↔ Block 32–34 ↔ Uni-Mall ↔ BH 1–7. Headway: 8 mins.
- **Route R-202 (Academic Ring Line - Green `#16a34a`):** Block 32–34 ↔ Uni-Mall ↔ Block 36–38 ↔ Uni-Hospital. Headway: 10 mins.
- **Route R-303 (Hostel Connector - Purple `#9333ea`):** BH 1–7 Hostels ↔ Uni-Mall ↔ GH 1–6 Hostels. Headway: 6 mins.

---

## 🔐 Authentication & Security

- **Dual-Mode Backend:** Seamlessly integrates with live Supabase GoTrue Auth when environment variables are supplied, with automatic failover to an offline persistent database (`shuttlesync_registered_users_db` & `shuttlesync_active_session`).
- **Single-Password Credential Security:** One account = one registered identity = one current password credential. Changing passwords in the Profile Modal immediately updates the active credential.
- **Persistent Sessions:** Stored in browser storage with automatic session restore on page refresh and browser restart.
- **Demo Quick-Fill:** One-tap demo authentication using `12214589` / `student@lpu.in` with password `Student@123`.

---

## 📡 Dual-Mode Telemetry & Driver GPS

- **Mode A (Campus Physics Simulation):** Automated realistic movement along route waypoints with configurable traffic density and weather friction.
- **Mode B (Live Device GPS Broadcast):** Drivers can toggle Mode B in Settings or Driver Portal, activating `navigator.geolocation.watchPosition` to broadcast their physical smartphone GPS coordinates directly to the campus fleet radar.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript 5.7, Vite 6 |
| **Styling & Theme** | Tailwind CSS v4, Lucide React Icons, Enterprise Light Silver Theme |
| **Mapping Engine** | Google Maps Platform JavaScript API (`@googlemaps/js-api-loader`), Interactive Vector Fallback |
| **Backend & Database** | Supabase (PostgreSQL, GoTrue Auth, Row Level Security) |
| **CI / CD Pipeline** | GitHub Actions (`.github/workflows/deploy.yml`), GitHub Pages |

---

## 🚀 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/manas0306-ops/shuttlesync-smart-campus.git
cd shuttlesync-smart-campus

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start local development server
npm run dev

# 4. Production build & typecheck
npm run build
```

---

## 👤 Author & Contribution

Developed with ❤️ by **Maanas Pandey**  
- **GitHub Profile:** [@manas0306-ops](https://github.com/manas0306-ops)  
- **Email:** [krishnamanas1224@gmail.com](mailto:krishnamanas1224@gmail.com)  
- **Registration ID:** 12214589  
- **Assignment:** INT335 Design Thinking (Project P05 — Waiting for the Shuttle)  
- **Institution:** Lovely Professional University, Punjab, India  

© 2026 ShuttleSync Platform. Released under the MIT License.
