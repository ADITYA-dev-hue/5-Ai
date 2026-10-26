import React, { useState, useEffect } from 'react';
import { FastshotLanding } from './components/FastshotLanding';
import { CinematicBackground } from './components/CinematicBackground';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { SimulationGridPage } from './pages/SimulationGridPage';
import { AgentsPage } from './pages/AgentsPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { PEASPage } from './pages/PEASPage';
import { ExperimentsPage } from './pages/ExperimentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DEFAULT_ENVIRONMENT } from './lib/grid-simulation';
import { 
  ActivePage, 
  AgentRunResult, 
  AgentType, 
  EnvironmentConfig, 
  ToastMessage 
} from './types';
import { Menu, Bot, House, PlayCircle } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  
  // Persist sidebar collapsed state in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('agent_lab_sidebar_collapsed');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<
    'idle' | 'landing-exiting' | 'lab-entering' | 'lab-exiting' | 'landing-entering'
  >('idle');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Sync sidebar preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agent_lab_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
    } catch (err) {
      console.error('Failed to save sidebar state to localStorage:', err);
    }
  }, [isSidebarCollapsed]);

  // Responsive tablet check: collapse automatically when screen space is limited
  useEffect(() => {
    const handleAutoCollapse = () => {
      if (window.innerWidth >= 1024 && window.innerWidth < 1240) {
        const saved = localStorage.getItem('agent_lab_sidebar_collapsed');
        if (saved === null) {
          setIsSidebarCollapsed(true);
        }
      }
    };
    handleAutoCollapse();
    window.addEventListener('resize', handleAutoCollapse);
    return () => window.removeEventListener('resize', handleAutoCollapse);
  }, []);

  // Shared Environment Config
  const [environment, setEnvironment] = useState<EnvironmentConfig>(DEFAULT_ENVIRONMENT);

  // Selected agent for simulation
  const [selectedAgentId, setSelectedAgentId] = useState<AgentType>('goal_based');

  // Real empirical runs only (no fabricated data)
  const [runs, setRuns] = useState<AgentRunResult[]>([]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRecordRun = (run: AgentRunResult) => {
    setRuns((prev) => [run, ...prev]);
  };

  const handleEnterLabFromLanding = (page: ActivePage = 'dashboard') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionPhase('landing-exiting');

    // 480ms exit animation matching cubic-bezier(0.16, 1, 0.3, 1)
    setTimeout(() => {
      setActivePage(page);
      setTransitionPhase('lab-entering');

      // 520ms entrance animation
      setTimeout(() => {
        setTransitionPhase('idle');
        setIsTransitioning(false);
      }, 520);
    }, 480);
  };

  const handleReturnToLanding = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionPhase('lab-exiting');

    setTimeout(() => {
      setActivePage('landing');
      setTransitionPhase('landing-entering');

      setTimeout(() => {
        setTransitionPhase('idle');
        setIsTransitioning(false);
      }, 520);
    }, 450);
  };

  const handleNavigate = (page: ActivePage) => {
    if (page === 'landing') {
      handleReturnToLanding();
    } else {
      setActivePage(page);
    }
  };

  return (
    <div className="min-h-screen bg-[#090603] text-[#F8F3EF] flex flex-col font-sans selection:bg-[#FF6A1A]/30 selection:text-[#FFFFFF]">
      {/* Toast Notification Annunciator */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Visual Source of Truth: Fastshot Landing Page */}
      {activePage === 'landing' ? (
        <FastshotLanding 
          onEnterLab={handleEnterLabFromLanding} 
          isExiting={transitionPhase === 'landing-exiting'}
          onShowToast={showToast}
        />
      ) : (
        /* Dynamic CSS Grid Application Shell with Shared Cinematic Mountain & Lake Video Background */
        <>
          <CinematicBackground />

          <div 
            className={`app-shell theme-black-orange relative z-[1] ${
              isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
            } ${
              transitionPhase === 'lab-entering' 
                ? 'transition-entering' 
                : transitionPhase === 'lab-exiting' 
                ? 'transition-exiting' 
                : ''
            }`}
          >
          {/* Collapsible Sticky Sidebar */}
          <Sidebar
            activePage={activePage}
            onNavigate={handleNavigate}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            runCount={runs.length}
          />

          {/* Main Workspace (Grid Column 2: minmax(0, 1fr)) */}
          <div className="main-workspace ambient-glow-top">
            {/* Top Workspace Header (Mobile menu trigger & Laboratory Context) */}
            <header className="lab-top-header">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 rounded-lg bg-[#17100B] border border-[rgba(255,138,50,0.22)] text-[#B6AAA0] hover:text-[#F8F3EF] hover:border-[#FF6A1A]/40 transition-colors"
                  aria-label="Open sidebar drawer"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#55D6A2] animate-pulse" />
                  <span className="text-[13px] font-mono font-medium text-[#B6AAA0] uppercase tracking-wide">
                    Agent Lab v2.4 • Ready
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReturnToLanding}
                  disabled={isTransitioning}
                  className="btn-secondary text-sm flex items-center gap-2 min-h-[38px] px-3.5"
                  title="Return to Home Page"
                >
                  <House className="w-4 h-4 text-[#FF8A32]" />
                  <span className="hidden sm:inline">Home Page</span>
                </button>

                <button
                  onClick={() => setActivePage('simulation')}
                  className="btn-accent text-sm flex items-center gap-2 min-h-[38px] px-4 font-semibold"
                >
                  <PlayCircle className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Run Arena</span>
                </button>
              </div>
            </header>

            {/* Dynamic Page Views Container */}
            <main className="main-content flex-1">
              {activePage === 'dashboard' && (
                <DashboardPage
                  runs={runs}
                  environment={environment}
                  onNavigate={setActivePage}
                  onSelectAgentForSim={(id) => setSelectedAgentId(id as AgentType)}
                />
              )}

              {activePage === 'simulation' && (
                <SimulationGridPage
                  environmentConfig={environment}
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={setSelectedAgentId}
                  onRecordRun={handleRecordRun}
                  onNavigateToComparison={() => setActivePage('comparison')}
                  onShowToast={showToast}
                />
              )}

              {activePage === 'agents' && (
                <AgentsPage
                  onSelectAgentForSim={setSelectedAgentId}
                  onNavigate={setActivePage}
                />
              )}

              {activePage === 'environment' && (
                <EnvironmentPage
                  environment={environment}
                  onUpdateEnvironment={setEnvironment}
                  onNavigateToSimulation={() => setActivePage('simulation')}
                  onShowToast={showToast}
                />
              )}

              {activePage === 'comparison' && (
                <ComparisonPage
                  runs={runs}
                  environment={environment}
                  onRecordRun={handleRecordRun}
                  onNavigateToSimulation={() => setActivePage('simulation')}
                  onShowToast={showToast}
                />
              )}

              {activePage === 'peas' && (
                <PEASPage />
              )}

              {activePage === 'experiments' && (
                <ExperimentsPage
                  environment={environment}
                  onRecordRun={handleRecordRun}
                  onNavigateToAnalytics={() => setActivePage('analytics')}
                  onShowToast={showToast}
                />
              )}

              {activePage === 'analytics' && (
                <AnalyticsPage
                  runs={runs}
                  onNavigateToSimulation={() => setActivePage('simulation')}
                />
              )}

              {activePage === 'reports' && (
                <ReportsPage
                  runs={runs}
                  environment={environment}
                  onNavigateToSimulation={() => setActivePage('simulation')}
                  onShowToast={showToast}
                />
              )}
            </main>

            {/* Cohesive Laboratory Global Footer */}
            <footer className="border-t border-[rgba(255,138,50,0.16)] bg-[#090603]/85 backdrop-blur-md py-4 text-xs text-[#B6AAA0]">
              <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#F8F3EF]">Comparative Agent Architecture Laboratory</span>
                  <span className="text-[#81756C]">•</span>
                  <span className="text-[#B6AAA0]">Russell & Norvig AI Foundations</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[13px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                    <span>#FF6A1A</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF8A32]" />
                    <span>#FF8A32</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#55D6A2]" />
                    <span>#55D6A2</span>
                  </span>
                  <span className="text-[#81756C]">•</span>
                  <button
                    onClick={() => setActivePage('landing')}
                    className="text-[#FF8A32] hover:text-[#FFA057] transition-colors"
                  >
                    Visual Truth
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
