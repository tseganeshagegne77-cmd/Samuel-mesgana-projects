import React from 'react';
import { ScenicView } from '../types';

interface ScenicBackgroundProps {
  activeView: ScenicView;
  blur: number; // in px, e.g. 0 to 8
  dim: number; // 0 to 90 %
  isImmersive: boolean;
}

export const ScenicBackground: React.FC<ScenicBackgroundProps> = ({
  activeView,
  blur,
  dim,
  isImmersive,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-stone-950">
      {/* Fallback graceful gradient container */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-neutral-900" />

      {/* Scenic View Image */}
      <img
        key={activeView.id}
        src={activeView.imageSrc}
        alt={activeView.name}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-all duration-1000 ease-out transform scale-105"
        style={{
          filter: isImmersive
            ? 'blur(0px) brightness(0.95)'
            : `blur(${blur}px) brightness(${Math.max(0.2, (100 - dim) / 100)})`,
        }}
      />

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isImmersive
            ? 'linear-gradient(to top, rgba(11, 15, 23, 0.4) 0%, transparent 40%, rgba(11, 15, 23, 0.3) 100%)'
            : `radial-gradient(ellipse at center, rgba(11, 15, 23, ${dim * 0.008}) 0%, rgba(11, 15, 23, ${Math.min(0.95, dim * 0.012)}) 100%)`,
        }}
      />
    </div>
  );
};
