import React, { useRef, useEffect } from 'react';

/**
 * Shared Cinematic Background for all internal laboratory pages.
 * Reuses the authentic Fastshot mountain-and-lake cinematic video asset with an
 * atmospheric dark gradient overlay to guarantee 100% chart and typography contrast.
 */
export const CinematicBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {
        // Fallback gracefully if browser policy restricts autoplay
      });
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-[#090603]" 
      aria-hidden="true"
    >
      {/* 1. Authentic Mountain & Lake Background Video */}
      <video
        ref={videoRef}
        className="cinematic-bg-video w-full h-full object-cover select-none"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_124724_bc041163-d651-425f-aea3-2acc1efc2c96.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Atmospheric Dark Readability Gradient Overlay */}
      <div 
        className="cinematic-dark-overlay absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(9, 6, 3, 0.76) 0%, rgba(9, 6, 3, 0.84) 50%, rgba(9, 6, 3, 0.91) 100%)',
        }}
      />

      {/* 3. Subtle Warm Orange Overhead Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255, 106, 26, 0.12), transparent 75%)',
        }}
      />
    </div>
  );
};
