import React from 'react';

interface MagazineCoverProps {
  name: string;
  specialty?: string;
  city?: string;
  palette?: 'teal' | 'ink' | 'sage' | 'paper';
  className?: string;
}

export function MagazineCover({
  name,
  specialty = 'Distinguished Practitioner',
  city = 'Clinical Excellence',
  palette = 'teal',
  className = '',
}: MagazineCoverProps) {
  // Palettes per PRD §27: primary, ink, sage, paper
  const themes = {
    teal: {
      bg: '#1F4A4F',
      surface: '#173B3F',
      text: '#F6F3EC',
      accent: '#A8834A',
      subtext: '#8FA89B',
      silhouette: '#112E31',
    },
    ink: {
      bg: '#12252A',
      surface: '#16242B',
      text: '#F6F3EC',
      accent: '#A8834A',
      subtext: '#CFC8B9',
      silhouette: '#0B171A',
    },
    sage: {
      bg: '#3B5951',
      surface: '#2C453E',
      text: '#FBF9F5',
      accent: '#A8834A',
      subtext: '#D2DDD7',
      silhouette: '#243732',
    },
    paper: {
      bg: '#EBE5D8',
      surface: '#DFD8C9',
      text: '#16242B',
      accent: '#A8834A',
      subtext: '#4A5A61',
      silhouette: '#D4CCBA',
    },
  };

  const t = themes[palette] || themes.teal;

  // Clean name for cover display
  const displayName = name.replace(/^(Dr\.\s*)/i, '').replace(/,\s*(DDS|DMD|BDS|BDSc|MS|PhD).*$/i, '');

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden select-none transition-transform duration-300 ${className}`}
      style={{ backgroundColor: t.bg }}
    >
      <svg
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        {/* Background layer */}
        <rect width="300" height="400" fill={t.bg} />

        {/* Subtle geometric contour lines */}
        <path
          d="M-50 120 C50 80, 200 160, 350 110"
          stroke={t.surface}
          strokeWidth="1.2"
          opacity="0.6"
        />
        <path
          d="M-30 200 C70 160, 220 250, 340 180"
          stroke={t.surface}
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Minimalist duotone clinical silhouette */}
        <g opacity="0.85">
          <ellipse cx="150" cy="225" rx="52" ry="62" fill={t.silhouette} />
          <path
            d="M80 370 C80 295, 110 270, 150 270 C190 270, 220 295, 220 370 Z"
            fill={t.silhouette}
          />
          {/* Subtle clinical collar/lapel lines */}
          <path d="M125 275 L150 320 L175 275" stroke={t.accent} strokeWidth="1.2" opacity="0.7" />
        </g>

        {/* Brass hairline border */}
        <rect
          x="12"
          y="12"
          width="276"
          height="376"
          stroke={t.accent}
          strokeWidth="1"
          opacity="0.9"
        />
        <rect
          x="15"
          y="15"
          width="270"
          height="370"
          stroke={t.accent}
          strokeWidth="0.5"
          opacity="0.4"
        />

        {/* Masthead: DENTAL NEWS NETWORK */}
        <text
          x="150"
          y="42"
          textAnchor="middle"
          fill={t.text}
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.22em"
          fontFamily="Hanken Grotesk, system-ui, sans-serif"
        >
          DENTAL NEWS NETWORK
        </text>

        {/* Brass rule */}
        <line x1="30" y1="52" x2="270" y2="52" stroke={t.accent} strokeWidth="1" />

        {/* Issue Line */}
        <text
          x="150"
          y="66"
          textAnchor="middle"
          fill={t.accent}
          fontSize="7.5"
          fontWeight="600"
          letterSpacing="0.16em"
          fontFamily="Hanken Grotesk, system-ui, sans-serif"
        >
          DISTINGUISHED DENTISTS · 2026
        </text>

        {/* Feature practitioner name */}
        <text
          x="26"
          y="315"
          fill={t.accent}
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.12em"
          fontFamily="Hanken Grotesk, system-ui, sans-serif"
        >
          SPECIAL PROFILE
        </text>

        <text
          x="25"
          y="342"
          fill={t.text}
          fontSize="22"
          fontWeight="500"
          letterSpacing="-0.02em"
          fontFamily="Newsreader, Georgia, serif"
        >
          {displayName}
        </text>

        <text
          x="26"
          y="364"
          fill={t.subtext}
          fontSize="9.5"
          fontWeight="400"
          fontFamily="Hanken Grotesk, system-ui, sans-serif"
        >
          {specialty} · {city}
        </text>
      </svg>
    </div>
  );
}
