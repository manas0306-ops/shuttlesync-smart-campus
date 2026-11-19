import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ShuttleCursor } from './components/common/ShuttleCursor';
import { FleetDashboardView } from './components/fleet/FleetDashboardView';
import { VehicleManagementView } from './components/fleet/VehicleManagementView';
import { DriverManagementView } from './components/drivers/DriverManagementView';
import { RouteManagementView } from './components/routes/RouteManagementView';
import { StudentManagementView } from './components/students/StudentManagementView';
import { PassengerOccupancyView } from './components/occupancy/PassengerOccupancyView';
import { NotificationListView } from './components/notifications/NotificationListView';
import { AnalyticsDashboardView } from './components/analytics/AnalyticsDashboardView';
import { SimulationSettingsView } from './components/settings/SimulationSettingsView';
import { RoutePlannerView } from './components/planner/RoutePlannerView';
import { DesignThinkingDocView } from './components/designThinking/DesignThinkingDocView';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { ProfileModal } from './components/auth/ProfileModal';
import { Compass, Bus } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userRole } = useSimulation();

  // Collapsible sidebar state (default: expanded on desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Hash-based navigation for single-page app robustness
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'overview';
  });

  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveTab(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    setAuthModalMode(null);
    handleSelectTab('overview');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-200">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg animate-spin">
            <Bus className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-300 tracking-wider uppercase">Loading ShuttleSync Fleet Control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Desktop Animated Shuttle Cursor */}
      <ShuttleCursor />

      {/* Fixed Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onOpenProfile={() => {
          if (isAuthenticated) setProfileModalOpen(true);
          else setAuthModalMode('login');
        }}
      />

      {/* Main Content Area (Offset by Sidebar Width) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-18' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenAuth={mode => setAuthModalMode(mode)}
          onOpenProfile={() => {
            if (isAuthenticated) setProfileModalOpen(true);
            else setAuthModalMode('login');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* 1. OVERVIEW & LIVE MAP (Core Fleet Management Dashboard) */}
          {(activeTab === 'overview' || activeTab === 'live-map' || activeTab === 'tracking') && (
            <FleetDashboardView onNavigateTab={handleSelectTab} />
          )}

          {/* 2. SHUTTLE FLEET MANAGEMENT TABLE */}
          {activeTab === 'fleet' && (
            <VehicleManagementView onNavigateTab={handleSelectTab} />
          )}

          {/* 3. DRIVERS MANAGEMENT */}
          {activeTab === 'drivers' && <DriverManagementView />}

          {/* 4. ROUTE MANAGEMENT */}
          {activeTab === 'routes' && (
            <RouteManagementView onNavigateTab={handleSelectTab} />
          )}

          {/* 5. STUDENT TRANSIT HUB & DIRECTORY */}
          {(activeTab === 'students' || activeTab === 'dashboard') && (
            <StudentManagementView
              onNavigateTab={handleSelectTab}
              onOpenProfile={() => setProfileModalOpen(true)}
            />
          )}

          {/* 6. PASSENGER OCCUPANCY */}
          {activeTab === 'occupancy' && <PassengerOccupancyView />}

          {/* 7. NOTIFICATIONS & BROADCASTS */}
          {activeTab === 'notifications' && <NotificationListView />}

          {/* 8. ANALYTICS & CARBON SAVINGS */}
          {activeTab === 'analytics' && <AnalyticsDashboardView />}

          {/* 9. SETTINGS & SIMULATION CONTROLS */}
          {activeTab === 'settings' && <SimulationSettingsView />}

          {/* 10. MULTI-MODAL ROUTE PLANNER */}
          {activeTab === 'planner' && <RoutePlannerView />}

          {/* 11. INT335 DESIGN THINKING DOSSIER */}
          {activeTab === 'design-thinking' && <DesignThinkingDocView />}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ShuttleSync 2.0</span>
            <span>•</span>
            <span>Lovely Professional University, Phagwara, Punjab</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectTab('design-thinking')}
              className="text-blue-600 hover:underline font-semibold"
            >
              INT335 Design Thinking (P05)
            </button>
            <span>•</span>
            <span>Lead: Maanas Pandey (12214589)</span>
          </div>
        </footer>
      </div>

      {/* AUTHENTICATION MODALS */}
      {authModalMode === 'login' && (
        <LoginPage
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={() => setAuthModalMode('register')}
          onForgotPassword={() => {
            setAuthModalMode(null);
            setForgotPasswordOpen(true);
          }}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {authModalMode === 'register' && (
        <RegisterPage
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setAuthModalMode('login')}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {forgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
          onBackToLogin={() => {
            setForgotPasswordOpen(false);
            setAuthModalMode('login');
          }}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SimulationProvider>
        <AppContent />
      </SimulationProvider>
    </AuthProvider>
  );
};

export default App;
