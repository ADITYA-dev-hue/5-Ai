import React, { useState } from 'react';
import { ActivePage } from '../types';
import { X, Lock, Mail, Eye, EyeOff, Key, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface FastshotLandingProps {
  onEnterLab: (page: ActivePage) => void;
  isExiting?: boolean;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const FastshotLanding: React.FC<FastshotLandingProps> = ({ 
  onEnterLab,
  isExiting = false,
  onShowToast,
}) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const handleGetStarted = () => {
    if (onShowToast) {
      onShowToast(
        'Laboratory Initialized',
        'Welcome to the Comparative Agent Architecture Laboratory.',
        'info'
      );
    }
    onEnterLab('dashboard');
  };

  const handleOpenLogin = () => {
    setError(null);
    setDemoNotice(null);
    setShowLoginModal(true);
  };

  const handleUseDemoCredentials = () => {
    setEmail('researcher@lab.ai');
    setPassword('quantum2026');
    setError(null);
    setDemoNotice('Demo credentials configured: researcher@lab.ai');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid researcher email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setShowLoginModal(false);
    if (onShowToast) {
      onShowToast(
        'Researcher Authenticated',
        `Welcome back, ${email.split('@')[0]}! Laboratory session active.`,
        'success'
      );
    }
    onEnterLab('dashboard');
  };

  return (
    <div className="stage relative overflow-hidden bg-[#090603]">
      {/* Background Video — Source of truth preserved */}
      <video className="stage-video" autoPlay muted loop playsInline preload="auto">
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_124724_bc041163-d651-425f-aea3-2acc1efc2c96.mp4"
          type="video/mp4"
        />
      </video>

      {/* Cinematic Warm Orange Ambient Overhead Illumination */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255, 106, 26, 0.16), transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className={`frame landing-content-wrap ${isExiting ? 'transition-exiting' : 'transition-entering'} relative z-[2]`}>
        {/* Header Navigation: Brand Logo on Left, Login & Get Started on Upper-Right */}
        <header className="nav flex items-center justify-between w-full">
          {/* Brand Logo */}
          <a 
            href="#landing" 
            onClick={(e) => { e.preventDefault(); }} 
            className="brand flex items-center text-white text-decoration-none select-none group" 
            aria-label="AI Laboratory home"
          >
            <img 
              src="/logo.png" 
              alt="AI Laboratory" 
              className="brand-logo-dissolved h-9 sm:h-11 w-auto max-w-[200px] object-contain mix-blend-screen transition-transform duration-250 group-hover:scale-105 drop-shadow-[0_0_18px_rgba(255,106,26,0.5)]" 
            />
          </a>

          {/* Upper-Right Corner: Get Started CTA (Login / Signup) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenLogin}
              className="cta"
              aria-label="Get Started — Login or Sign Up"
            >
              <span>Get Started</span>
            </button>
          </div>
        </header>

        {/* Centerpiece Hero Title: Cognivac AI */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 select-none z-10">
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto flex flex-col items-center">
            {/* Laboratory Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17100B]/80 backdrop-blur-md border border-[rgba(255,138,50,0.3)] shadow-[0_0_20px_rgba(255,106,26,0.18)]">
              <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
              <span className="text-xs sm:text-[13px] font-mono tracking-widest uppercase text-[#FF8A32] font-semibold">
                Autonomous Agent Laboratory
              </span>
            </div>

            {/* Main Title: Cognivac AI */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-extrabold tracking-tight text-[#F8F3EF] leading-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              Cognivac{' '}
              <span className="bg-gradient-to-r from-[#FF6A1A] via-[#FF8A32] to-[#FFA057] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,106,26,0.6)]">
                AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#B6AAA0] font-normal max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Comparative Agent Architecture Simulation & Empirical Evaluation Studio
            </p>
          </div>
        </main>

        {/* Footer Logos — Exact original preserved */}
        <footer className="proof">
          <p className="by text-[#B6AAA0]">Built by engineers from</p>
          <div className="logos">
            {/* Google wordmark */}
            <svg className="logo-google text-[#B6AAA0] hover:text-[#F8F3EF] transition-colors" viewBox="0 0 272 92" fill="currentColor">
              <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
              <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
              <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13.01v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.39 21c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
              <path d="M225 3v65h-9.5V3h9.5z" />
              <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.22 9.16 19.07 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.84-6.14zm-23.27-8.15l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
              <path d="M35.29 41.41V32.7h33.17c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-25.49 9.66C16.14 70.05 0 54.34 0 35.03 0 15.71 16.14 0 35.29 0c10.42 0 17.73 4.09 23.36 9.47l-6.55 6.55c-3.99-3.75-9.36-6.63-16.8-6.63-13.61 0-24.31 11.09-24.31 24.7 0 13.61 10.7 24.7 24.31 24.7 8.82 0 13.84-3.53 17.06-6.75 1.76-1.76 2.94-4.29 3.44-7.63H35.29z" />
            </svg>

            {/* Cisco wordmark */}
            <svg className="logo-cisco text-[#B6AAA0] hover:text-[#F8F3EF] transition-colors" viewBox="0 0 100 52" fill="currentColor">
              <rect x="7" y="16" width="4.5" height="12" rx="2.25" />
              <rect x="17" y="10" width="4.5" height="18" rx="2.25" />
              <rect x="27" y="3" width="4.5" height="25" rx="2.25" />
              <rect x="37" y="10" width="4.5" height="18" rx="2.25" />
              <rect x="47.7" y="16" width="4.5" height="12" rx="2.25" />
              <rect x="58.5" y="10" width="4.5" height="18" rx="2.25" />
              <rect x="68.5" y="3" width="4.5" height="25" rx="2.25" />
              <rect x="78.5" y="10" width="4.5" height="18" rx="2.25" />
              <rect x="88.5" y="16" width="4.5" height="12" rx="2.25" />
              <path d="M19 43.5c-1.3 1.1-3 1.7-4.8 1.7-4.3 0-7.2-3.1-7.2-7.2 0-4.1 2.9-7.2 7.2-7.2 1.8 0 3.5.6 4.8 1.7l-1.8 2.2c-.8-.7-1.8-1.1-3-1.1-2.6 0-4.4 1.9-4.4 4.4s1.8 4.4 4.4 4.4c1.2 0 2.2-.4 3-1.1l1.8 2.2zM24 31.2h2.8v13.6H24V31.2zm1.4-4.4c1 0 1.7.7 1.7 1.7s-.7 1.7-1.7 1.7-1.7-.7-1.7-1.7.7-1.7 1.7-1.7zm13.8 10.6c0-2.4-1.7-3.6-4.6-4.2-2.1-.4-2.8-.8-2.8-1.7 0-.8.8-1.4 2.2-1.4 1.3 0 2.4.4 3.3 1.1l1.4-2c-1.2-1-2.9-1.6-4.7-1.6-3 0-5 1.7-5 4 0 2.4 1.6 3.5 4.5 4.1 2.2.4 2.9.9 2.9 1.8 0 1-.9 1.5-2.5 1.5-1.6 0-3-.6-4.1-1.5l-1.5 2.1c1.5 1.2 3.4 1.9 5.6 1.9 3.3 0 5.4-1.7 5.4-4.2zm17.6 1.7c-1.3 1.1-3 1.7-4.8 1.7-4.3 0-7.2-3.1-7.2-7.2 0-4.1 2.9-7.2 7.2-7.2 1.8 0 3.5.6 4.8 1.7l-1.8 2.2c-.8-.7-1.8-1.1-3-1.1-2.6 0-4.4 1.9-4.4 4.4s1.8 4.4 4.4 4.4c1.2 0 2.2-.4 3-1.1l1.8 2.2zM14.6-7.1c0 4.2-3.1 7.2-7.3 7.2s-7.3-3-7.3-7.2c0-4.2 3.1-7.2 7.3-7.2s7.3 3 7.3 7.2zm-2.8 0c0-2.6-1.8-4.4-4.5-4.4s-4.5 1.8-4.5 4.4c0 2.6 1.8 4.4 4.5 4.4s4.5-1.8 4.5-4.4z" />
            </svg>

            {/* Adobe wordmark */}
            <svg className="logo-adobe text-[#B6AAA0] hover:text-[#F8F3EF] transition-colors" viewBox="0 0 120 30" fill="currentColor">
              <path d="M0 0h17.8L9.2 26.8H0V0zm24 0h17.8v26.8h-9.2L24 0zm-5.4 17.6L24.8 2.6 31 17.6H18.6z" />
              <path d="M54.5 6.5h3.2v20.3h-3.2v-2.7c-1.3 2-3.3 3-5.6 3-4.9 0-8.5-3.8-8.5-8.9 0-5.1 3.6-8.9 8.5-8.9 2.3 0 4.3 1 5.6 3V6.5zm-5.4 17.9c3.3 0 5.6-2.6 5.6-6.1s-2.3-6.1-5.6-6.1-5.6 2.6-5.6 6.1 2.3 6.1 5.6 6.1zM69.8 9.3c5 0 8.9 3.8 8.9 8.9s-3.9 8.9-8.9 8.9-8.9-3.8-8.9-8.9 3.9-8.9 8.9-8.9zm0 15c3.3 0 5.7-2.6 5.7-6.1s-2.4-6.1-5.7-6.1-5.7 2.6-5.7 6.1 2.4 6.1 5.7 6.1zM93.8 18.2c0 5.1-3.6 8.9-8.5 8.9-2.3 0-4.3-1-5.6-3v2.7h-3.2V6.5h3.2v8.9c1.3-2 3.3-3 5.6-3 4.9 0 8.5 3.8 8.5 8.9zm-3.2 0c0-3.5-2.3-6.1-5.6-6.1s-5.6 2.6-5.6 6.1 2.3 6.1 5.6 6.1 5.6-2.6 5.6-6.1zM113.8 19.4h-14.5c.5 3 2.8 4.9 5.8 4.9 2 0 3.7-.8 4.7-2.3l2.6 1.6c-1.6 2.3-4.2 3.5-7.3 3.5-5.2 0-9-3.8-9-8.9s3.8-8.9 8.9-8.9c5.3 0 8.8 3.8 8.8 8.9v1.2zm-3.2-2.5c-.4-2.8-2.6-4.8-5.6-4.8s-5.2 2-5.6 4.8h11.2z" />
            </svg>
          </div>
        </footer>
      </div>

      {/* =========================================================================
          AUTHENTICATION MODAL: RESEARCHER SIGN IN
          ========================================================================= */}
      {showLoginModal && (
        <div 
          className="auth-overlay animate-fadeIn"
          onClick={() => setShowLoginModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
        >
          <div 
            className="auth-card animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Top */}
            <div className="auth-header-top">
              <div className="flex items-center gap-2.5">
                <div className="auth-icon-wrap">
                  <Lock className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="auth-badge">
                  Laboratory Access
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="auth-close-btn"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Typography */}
            <h2 id="login-title" className="auth-title">
              Sign In to Laboratory
            </h2>
            <p className="auth-subtitle">
              Enter your research credentials or use the one-click demo configuration.
            </p>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#FF6262]/15 border border-[#FF6262]/35 text-[#FF6262] text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {demoNotice && (
              <div className="mb-4 p-3 rounded-xl bg-[#55D6A2]/15 border border-[#55D6A2]/35 text-[#55D6A2] text-xs flex items-center gap-2 animate-fadeIn font-mono">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{demoNotice}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="auth-field-group">
                <label className="auth-label">Researcher Email</label>
                <div className="auth-input-container">
                  <Mail className="auth-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@lab.ai"
                    required
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-container">
                  <Lock className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="auth-input has-toggle"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-toggle-pwd"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Button */}
              <button
                type="button"
                onClick={handleUseDemoCredentials}
                className="auth-demo-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-fill Demo Credentials (researcher@lab.ai)</span>
              </button>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit-btn w-full"
              >
                Enter Laboratory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
