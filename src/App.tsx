import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Navbar } from './components/common/Navbar';
import { ShuttleCursor } from './components/common/ShuttleCursor';
import { LandingHero } from './components/landing/LandingHero';
import { ProblemSolution } from './components/landing/ProblemSolution';
import { FeatureHighlights } from './components/landing/FeatureHighlights';
import { StudentDashboardView } from './components/dashboard/StudentDashboardView';
import { LiveTrackingView } from './components/tracking/LiveTrackingView';
import { ETAPredictionView } from './components/prediction/ETAPredictionView';
import { CrowdMonitorView } from './components/crowd/CrowdMonitorView';
import { StopRecommendationsView } from './components/recommendations/StopRecommendationsView';
import { RoutePlannerView } from './components/planner/RoutePlannerView';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { AnalyticsDashboardView } from './components/analytics/AnalyticsDashboardView';
import { DriverPortalView } from './components/driver/DriverPortalView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { DesignThinkingDocView } from './components/designThinking/DesignThinkingDocView';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { ProfileModal } from './components/auth/ProfileModal';
import {
  Bus,
  Compass,
  Zap,
  Users,
  Sparkles,
  MapPin,
  Bell,
  BarChart3,
  Car,
  ShieldAlert,
  Heart,
  ExternalLink,
  ShieldCheck,
  Award,
  X,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userRole } = useSimulation();

  // Hash-based navigation for single-page app robustness
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'overview';
  });

  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveTab(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: string) => {
    // Protected route check: if user attempts to access student dashboard without login, prompt login
    if (tab === 'dashboard' && !isAuthenticated) {
      setAuthModalMode('login');
      return;
    }

    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    setAuthModalMode(null);
    handleSelectTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070d1e] flex items-center justify-center text-slate-200">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/30 animate-spin">
            <Compass className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-sky-400 tracking-wider uppercase">Loading ShuttleSync 2.0...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Animated Desktop Shuttle Cursor */}
      <ShuttleCursor />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={mode => setAuthModalMode(mode)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* STUDENT DASHBOARD (AUTHENTICATED HOME) */}
        {activeTab === 'dashboard' && (
          <StudentDashboardView
            onNavigateTab={handleSelectTab}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {/* OVERVIEW / WELCOME LANDING */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <LandingHero
              onStartTracking={() => handleSelectTab('tracking')}
              onExplorePlanner={() => handleSelectTab('planner')}
              onViewDesignThinking={() => handleSelectTab('designThinking')}
            />

            {/* Live Interactive Map Sneak-Peek */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    LPU Campus Geographic Radar
                  </span>
                  <h3 className="text-2xl font-black text-white">Live LPU Campus Transit Preview</h3>
                </div>
                <button
                  onClick={() => handleSelectTab('tracking')}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
                >
                  Expand Full Radar <Compass className="w-4 h-4" />
                </button>
              </div>

              <LiveTrackingView />
            </div>

            <ProblemSolution />

            <FeatureHighlights onNavigateTab={handleSelectTab} />
          </div>
        )}

        {/* LIVE TRACKING VIEW */}
        {activeTab === 'tracking' && <LiveTrackingView />}

        {/* ETA PREDICTION VIEW */}
        {activeTab === 'prediction' && <ETAPredictionView />}

        {/* CROWD MONITORING VIEW */}
        {activeTab === 'crowd' && <CrowdMonitorView />}

        {/* SMART STOP RECOMMENDATIONS */}
        {activeTab === 'recommendations' && <StopRecommendationsView />}

        {/* ROUTE PLANNER VIEW */}
        {activeTab === 'planner' && <RoutePlannerView />}

        {/* NOTIFICATIONS & ALERTS */}
        {activeTab === 'notifications' && (
          <NotificationCenter
            onNavigateToTarget={() => {
              handleSelectTab('tracking');
            }}
          />
        )}

        {/* ANALYTICS VIEW */}
        {activeTab === 'analytics' && <AnalyticsDashboardView />}

        {/* DRIVER PORTAL */}
        {activeTab === 'driver' && <DriverPortalView />}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin' && <AdminDashboardView />}

        {/* DESIGN THINKING DOSSIER */}
        {activeTab === 'designThinking' && <DesignThinkingDocView />}
      </main>

      {/* Auth Modal (Login / Register) */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setAuthModalMode(null)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {authModalMode === 'login' ? (
              <LoginPage
                onSwitchToRegister={() => setAuthModalMode('register')}
                onForgotPassword={() => {
                  setAuthModalMode(null);
                  setForgotPasswordOpen(true);
                }}
                onSuccess={handleAuthSuccess}
              />
            ) : (
              <RegisterPage
                onSwitchToLogin={() => setAuthModalMode('login')}
                onSuccess={handleAuthSuccess}
              />
            )}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onBackToLogin={() => {
          setForgotPasswordOpen(false);
          setAuthModalMode('login');
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-10 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">ShuttleSync 2.0</span>
                <span className="text-[11px] text-slate-500 block">
                  Project P05: Waiting for the Shuttle • INT335 Design Thinking • Lovely Professional University (LPU)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <button
                onClick={() => handleSelectTab('overview')}
                className="hover:text-white transition-colors"
              >
                Overview
              </button>
              <button
                onClick={() => handleSelectTab('tracking')}
                className="hover:text-white transition-colors"
              >
                Live Radar
              </button>
              <button
                onClick={() => handleSelectTab('designThinking')}
                className="hover:text-white transition-colors"
              >
                Design Thinking Viva
              </button>
              <a
                href="https://github.com/manas0306-ops/shuttlesync-smart-campus"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub Repository
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              Designed & Built with <Heart className="w-3 h-3 inline text-rose-500 mx-0.5" /> by{' '}
              <strong className="text-slate-300">Maanas Pandey (manas0306-ops)</strong> for Lovely Professional University.
            </div>
            <div className="flex items-center gap-4">
              <span>Google Maps Platform & Supabase Enabled</span>
              <span>•</span>
              <span>LPU Phagwara Punjab</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <AppContent />
      </SimulationProvider>
    </AuthProvider>
  );
}

export default App;
