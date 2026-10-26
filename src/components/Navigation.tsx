import React, { useState } from 'react';
import { 
  Network, 
  Play, 
  BarChart2, 
  History, 
  Home, 
  Menu, 
  X, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { ActivePage } from '../types';

interface NavigationProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  runCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onNavigate,
  runCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'landing', label: 'Home Page', icon: Home },
    { id: 'architectures', label: 'Architecture Topologies', icon: Network },
    { id: 'simulation', label: 'Simulation Studio', icon: Play },
    { 
      id: 'benchmarks', 
      label: 'Comparative Benchmarks', 
      icon: BarChart2,
      badge: runCount > 0 ? `${runCount}` : undefined
    },
    { 
      id: 'history', 
      label: 'Experiment History', 
      icon: History,
      badge: runCount > 0 ? `${runCount}` : undefined
    },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0D12]/95 backdrop-blur-md border-b border-[#29313F]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Laboratory Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 group focus:outline-none"
            title="Return to AI Laboratory Landing"
          >
            <img 
              src="/logo.png" 
              alt="AI Laboratory" 
              className="brand-logo-dissolved h-8 w-auto max-w-[145px] object-contain mix-blend-screen transition-transform group-hover:scale-105" 
            />

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono font-medium rounded bg-[#FF6A1A]/15 border border-[#FF6A1A]/30 text-[#FF8A32]">
                  Lab
                </span>
              </div>
              <span className="text-[11px] text-[#B6AAA0] font-normal tracking-tight hidden sm:inline">
                Comparative Agent Architecture Laboratory
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#1D2430] text-[#F5F6FA] border border-[#29313F] shadow-sm'
                    : 'text-[#A7B0C0] hover:text-[#F5F6FA] hover:bg-[#171C25]/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8CB8FF]' : 'text-[#6E798E]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#8CB8FF]/15 text-[#8CB8FF] border border-[#8CB8FF]/30">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-[#8CB8FF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Indicator & Fast Action */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171C25] border border-[#29313F] text-[11px] text-[#A7B0C0]">
            <span className="w-2 h-2 rounded-full bg-[#22C997] animate-pulse" />
            <span className="font-mono">Engine 2.5 Active</span>
          </div>

          <button
            onClick={() => handleNavClick('simulation')}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8CB8FF]" />
            <span>Launch Simulation</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#171C25] border border-[#29313F] text-[#A7B0C0] hover:text-[#F5F6FA]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#171C25] border-b border-[#29313F] px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-[#1D2430] text-[#F5F6FA] border border-[#29313F]'
                    : 'text-[#A7B0C0] hover:bg-[#1D2430]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8CB8FF]' : 'text-[#6E798E]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#8CB8FF]/15 text-[#8CB8FF]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
