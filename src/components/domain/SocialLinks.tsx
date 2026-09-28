import React from 'react';
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from '../ui/Icons';

interface SocialLinksProps {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  className?: string;
  itemClassName?: string;
}

export function SocialLinks({
  facebook,
  instagram,
  linkedin,
  x,
  className = '',
  itemClassName = '',
}: SocialLinksProps) {
  // Collect only valid, non-empty links
  const links: { type: string; url: string; icon: React.ReactNode; label: string }[] = [];

  if (facebook && facebook.trim() !== '') {
    links.push({
      type: 'facebook',
      url: facebook,
      icon: <FacebookIcon className="w-4 h-4" />,
      label: 'Facebook',
    });
  }
  if (instagram && instagram.trim() !== '') {
    links.push({
      type: 'instagram',
      url: instagram,
      icon: <InstagramIcon className="w-4 h-4" />,
      label: 'Instagram',
    });
  }
  if (linkedin && linkedin.trim() !== '') {
    links.push({
      type: 'linkedin',
      url: linkedin,
      icon: <LinkedInIcon className="w-4 h-4" />,
      label: 'LinkedIn',
    });
  }
  if (x && x.trim() !== '') {
    links.push({
      type: 'x',
      url: x,
      icon: <XIcon className="w-3.5 h-3.5" />,
      label: 'X (formerly Twitter)',
    });
  }

  // If no social links exist, render NOTHING (no empty DOM wrappers per PRD §1.11)
  if (links.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {links.map((link) => (
        <a
          key={link.type}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className={`flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] rounded-sm text-ink-2 hover:text-primary hover:bg-primary-t/50 transition-colors duration-140 ${itemClassName}`}
        >
          {link.icon}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
