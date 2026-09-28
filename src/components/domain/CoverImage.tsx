import React, { useState } from 'react';
import { ToothArcMark } from '../ui/Icons';
import { MagazineCover } from './MagazineCover';

interface CoverImageProps {
  photoUrl: string;
  name: string;
  isDistinguished?: boolean;
  specialty?: string;
  city?: string;
  palette?: 'teal' | 'ink' | 'sage' | 'paper';
  className?: string;
}

export function CoverImage({
  photoUrl,
  name,
  isDistinguished = false,
  specialty,
  city,
  palette = 'teal',
  className = '',
}: CoverImageProps) {
  const [hasError, setHasError] = useState(false);

  // If distinguished and photo is 'cover', render the typographic MagazineCover
  if (isDistinguished && (photoUrl === 'cover' || (!hasError && !photoUrl.startsWith('http') && !photoUrl.startsWith('headshot')))) {
    return (
      <MagazineCover
        name={name}
        specialty={specialty}
        city={city}
        palette={palette}
        className={className}
      />
    );
  }

  // If photo is a generated local headshot
  if (!hasError && photoUrl.startsWith('headshot-')) {
    const headshotIndex = parseInt(photoUrl.replace('headshot-', ''), 10) || 1;
    const colors = [
      { bg: '#E6EDE8', fg: '#1F4A4F' },
      { bg: '#E4ECEA', fg: '#173B3F' },
      { bg: '#F1E8D7', fg: '#7D5F2E' },
      { bg: '#E1EBF2', fg: '#345C7A' },
      { bg: '#EBE5D8', fg: '#4A5A61' },
      { bg: '#E3F0E8', fg: '#2F6B4F' },
    ];
    const theme = colors[(headshotIndex - 1) % colors.length];

    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-sage-t select-none ${className}`}
        style={{ backgroundColor: theme.bg }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          {/* Subtle background arc */}
          <circle cx="50" cy="50" r="46" stroke={theme.fg} strokeWidth="0.8" opacity="0.25" />
          {/* Duotone head/shoulders silhouette */}
          <ellipse cx="50" cy="40" rx="16" ry="19" fill={theme.fg} opacity="0.75" />
          <path
            d="M24 88 C24 64, 34 58, 50 58 C66 58, 76 64, 76 88 Z"
            fill={theme.fg}
            opacity="0.8"
          />
          {/* Minimal collar */}
          <path d="M42 62 L50 72 L58 62" stroke={theme.bg} strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // If valid external photo URL and no error has occurred
  if (!hasError && photoUrl && photoUrl.trim() !== '' && photoUrl.startsWith('http')) {
    return (
      <img
        src={photoUrl}
        alt={`Portrait of ${name}`}
        onError={() => setHasError(true)}
        loading="lazy"
        decoding="async"
        className={`object-cover object-center ${className}`}
      />
    );
  }

  // Branded fallback placeholder per PRD §1.10: sage-tint bg, DNN tooth-arc mark centered at 40% opacity
  return (
    <div
      className={`relative flex items-center justify-center bg-sage-t select-none text-sage overflow-hidden ${className}`}
      title="Dental News Network Verified Listing"
    >
      <div className="flex flex-col items-center justify-center p-2 text-center opacity-40">
        <ToothArcMark className="w-8 h-8 text-primary" strokeWidth={1.8} />
        <span className="mt-1 text-[9px] font-semibold tracking-wider uppercase text-primary">
          DNN
        </span>
      </div>
    </div>
  );
}
