'use client';

import React, { useId } from 'react';

interface VizzyLogoProps {
  size?: number;
  showTail?: boolean;
}

/**
 * VizzyChat brand logo — a colorful pinwheel/swirl SVG icon with an optional
 * chat-bubble tail. Uses unique IDs per render to avoid SVG gradient collisions.
 */
export default function VizzyLogo({ size = 40, showTail = true }: VizzyLogoProps) {
  const uid = useId().replace(/:/g, '');

  const height = showTail ? Math.round(size * 1.12) : size;
  const viewH = showTail ? 112 : 100;

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 100 ${viewH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VizzyChat logo"
      style={{ flexShrink: 0 }}
    >
      <defs>
        {/* Sector gradients — tangential from start-edge to end-edge of each 72° slice */}
        <linearGradient
          id={`${uid}g0`}
          x1="50" y1="6" x2="91.8" y2="36.4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>

        <linearGradient
          id={`${uid}g1`}
          x1="91.8" y1="36.4" x2="75.9" y2="85.6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>

        <linearGradient
          id={`${uid}g2`}
          x1="75.9" y1="85.6" x2="24.1" y2="85.6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>

        <linearGradient
          id={`${uid}g3`}
          x1="24.1" y1="85.6" x2="8.2" y2="36.4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>

        <linearGradient
          id={`${uid}g4`}
          x1="8.2" y1="36.4" x2="50" y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient
          id={`${uid}tail`}
          x1="14" y1="86" x2="24" y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>

        <filter id={`${uid}drop`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(124,58,237,0.5)" />
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(236,72,153,0.35)" />
        </filter>
      </defs>

      <g filter={`url(#${uid}drop)`}>
        {/* ── 5 pinwheel sectors (72° each, clockwise from top) ── */}
        {/* Sector 0 · violet → blue   (270° → 342°) */}
        <path d="M50,50 L50,6 A44,44 0 0,1 91.8,36.4 Z" fill={`url(#${uid}g0)`} />
        {/* Sector 1 · blue → cyan     (342° →  54°) */}
        <path d="M50,50 L91.8,36.4 A44,44 0 0,1 75.9,85.6 Z" fill={`url(#${uid}g1)`} />
        {/* Sector 2 · cyan → pink     ( 54° → 126°) */}
        <path d="M50,50 L75.9,85.6 A44,44 0 0,1 24.1,85.6 Z" fill={`url(#${uid}g2)`} />
        {/* Sector 3 · pink → orange   (126° → 198°) */}
        <path d="M50,50 L24.1,85.6 A44,44 0 0,1 8.2,36.4 Z" fill={`url(#${uid}g3)`} />
        {/* Sector 4 · orange → violet (198° → 270°) */}
        <path d="M50,50 L8.2,36.4 A44,44 0 0,1 50,6 Z" fill={`url(#${uid}g4)`} />

        {/* Subtle divider lines between sectors */}
        <line x1="50" y1="6"    x2="50"   y2="50"   stroke="rgba(255,255,255,0.22)" strokeWidth="1.1" />
        <line x1="91.8" y1="36.4" x2="50" y2="50"   stroke="rgba(255,255,255,0.22)" strokeWidth="1.1" />
        <line x1="75.9" y1="85.6" x2="50" y2="50"   stroke="rgba(255,255,255,0.22)" strokeWidth="1.1" />
        <line x1="24.1" y1="85.6" x2="50" y2="50"   stroke="rgba(255,255,255,0.22)" strokeWidth="1.1" />
        <line x1="8.2"  y1="36.4" x2="50" y2="50"   stroke="rgba(255,255,255,0.22)" strokeWidth="1.1" />

        {/* Outer boundary ring */}
        <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" fill="none" />

        {/* Center highlight — hides the busy meeting point of all sectors */}
        <circle cx="50" cy="50" r="14" fill="rgba(255,255,255,0.16)" />
        <circle cx="50" cy="50" r="7"  fill="rgba(255,255,255,0.26)" />

        {/* Chat-bubble tail */}
        {showTail && (
          <path d="M18,84 L8,110 L36,88 Z" fill={`url(#${uid}tail)`} />
        )}
      </g>
    </svg>
  );
}
