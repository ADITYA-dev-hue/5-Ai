import React, { useEffect } from 'react';
import { 
  House, 
  LayoutDashboard, 
  PlayCircle, 
  Bot, 
  SlidersHorizontal, 
  ChartNoAxesCombined, 
  Layers, 
  FlaskConical, 
  ChartLine, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from 'lucide-react';
import { ActivePage } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  runCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  runCount,
}) => {
  // Navigation list strictly matching required 10-item hierarchy
  const navItems: { id: ActivePage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'landing', label: 'Home', icon: House },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulation', label: 'Simulation Grid', icon: PlayCircle },
    { id: 'agents', label: 'Agent Profiles', icon: Bot },
    { id: 'environment', label: 'Environment', icon: SlidersHorizontal },
    { id: 'comparison', label: 'Comparison', icon: ChartNoAxesCombined, badge: runCount > 0 ? `${runCount}` : undefined },
    { id: 'peas', label: 'PEAS Matrix', icon: Layers },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'analytics', label: 'Analytics', icon: ChartLine },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  // Mobile Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    onCloseMobile();
  };

  const renderNavList = (collapsed: boolean) => (
    <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto" aria-label="Laboratory navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <div key={item.id} className="relative group-nav-item">
            <button
              type="button"
              onClick={() => handleNav(item.id)}
              className={`nav-item-btn ${isActive ? 'is-active' : ''} ${
                collapsed ? 'justify-center px-0' : 'px-2.5'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Interactive Glass-Themed Icon Container */}
              <div className="nav-icon" aria-hidden="true">
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>

              {/* Text Label (Smoothly hidden when collapsed) */}
              {!collapsed && (
                <span className="nav-label truncate flex-1">{item.label}</span>
              )}

              {/* Count / Status Badge */}
              {!collapsed && item.badge && (
                <span className="nav-badge ml-auto">{item.badge}</span>
              )}
            </button>

            {/* Accessible Glass Floating Tooltip when collapsed */}
            {collapsed && (
              <div role="tooltip" className="sidebar-tooltip">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-[#FF6A1A]/20 text-[#FF8A32] border border-[#FF6A1A]/35">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* =========================================================================
          DESKTOP STICKY SIDEBAR (Part of CSS Grid shell, never overlaps content)
          ========================================================================= */}
      <aside 
        className={`hidden lg:flex app-sidebar-desktop ${
          isCollapsed ? 'is-collapsed' : 'is-expanded'
        }`}
        aria-label="Sidebar navigation"
      >
        {/* 1. Brand Region */}
        <div className="h-16 px-3.5 flex items-center justify-between border-b border-[rgba(255,138,50,0.16)] flex-shrink-0">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className={`flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] rounded-xl p-1 select-none overflow-hidden ${
              isCollapsed ? 'mx-auto justify-center' : 'w-full justify-start'
            }`}
            title="AI Laboratory Home Page"
          >
            {isCollapsed ? (
              <img 
                src="/logo.png" 
                alt="AI Laboratory" 
                className="brand-logo-dissolved h-8 w-auto max-w-[48px] object-contain mix-blend-screen transition-transform duration-250 group-hover:scale-105" 
              />
            ) : (
              <div className="flex items-center gap-2 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="AI Laboratory" 
                  className="brand-logo-dissolved h-8 sm:h-9 w-auto max-w-[145px] object-contain mix-blend-screen transition-transform duration-250 group-hover:scale-105" 
                />
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-semibold rounded bg-[#FF6A1A]/15 border border-[#FF6A1A]/35 text-[#FF8A32] flex-shrink-0">
                  LAB
                </span>
              </div>
            )}
          </button>
        </div>

        {/* 2. Navigation Items List */}
        {renderNavList(isCollapsed)}

        {/* 3. Bottom Controls Region */}
        <div className="p-3 border-t border-[rgba(255,138,50,0.16)] space-y-2 mt-auto flex-shrink-0">
          {/* Status Indicator */}
          {!isCollapsed ? (
            <div className="px-2.5 py-2 rounded-xl bg-[#17100B] border border-[rgba(255,138,50,0.16)] flex items-center gap-2 select-none">
              <span className="w-2 h-2 rounded-full bg-[#55D6A2] animate-pulse flex-shrink-0" />
              <span className="text-xs sm:text-[13px] font-mono text-[#B6AAA0] truncate">Agent Lab v2.4 • Ready</span>
            </div>
          ) : (
            <div className="flex justify-center py-1" title="Agent Lab v2.4 • Ready">
              <span className="w-2.5 h-2.5 rounded-full bg-[#55D6A2] animate-pulse" />
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle Button with animated chevron */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-[#B6AAA0] hover:text-[#F8F3EF] hover:bg-[#21150E] border border-transparent hover:border-[rgba(255,138,50,0.2)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <div className="w-5 h-5 flex items-center justify-center transition-transform duration-250 group-hover:scale-110">
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-[#FF8A32]" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-[#FF8A32]" />
              )}
            </div>
            {!isCollapsed && (
              <span className="text-xs sm:text-[13px] font-medium truncate flex-1 text-left">Collapse Sidebar</span>
            )}
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE & TABLET NAVIGATION DRAWER (< 1024px)
          ========================================================================= */}
      <div 
        className={`lg:hidden transition-opacity duration-250 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Subtle Backdrop Overlay */}
        <div 
          className="mobile-drawer-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />

        {/* Slide-out Drawer Panel */}
        <div 
          className="mobile-drawer-panel"
          style={{
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
        >
          {/* Mobile Drawer Header with Close Button */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[rgba(255,138,50,0.16)] flex-shrink-0">
            <div className="flex items-center gap-2 select-none">
              <img 
                src="/logo.png" 
                alt="AI Laboratory" 
                className="brand-logo-dissolved h-8 w-auto max-w-[140px] object-contain mix-blend-screen" 
              />
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-semibold rounded bg-[#FF6A1A]/15 border border-[#FF6A1A]/35 text-[#FF8A32]">
                LAB
              </span>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#B6AAA0] hover:text-[#F8F3EF] hover:bg-[#21150E] border border-transparent hover:border-[rgba(255,138,50,0.22)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items in Mobile Drawer */}
          {renderNavList(false)}

          {/* Mobile Drawer Footer */}
          <div className="p-3 border-t border-[rgba(255,138,50,0.16)] flex-shrink-0">
            <div className="px-3 py-2 rounded-xl bg-[#17100B] border border-[rgba(255,138,50,0.16)] flex items-center gap-2 select-none">
              <span className="w-2 h-2 rounded-full bg-[#55D6A2] animate-pulse flex-shrink-0" />
              <span className="text-[11px] font-mono text-[#B6AAA0]">Agent Lab v2.4 • Ready</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
