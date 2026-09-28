import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowUpRight, Mail, Phone, ArrowRight } from 'lucide-react';
import { DentistRecord } from '../../types/dentist';
import { CoverImage } from './CoverImage';
import { SocialLinks } from './SocialLinks';

interface DentistCardProps {
  dentist: DentistRecord;
  onNavigateToProfile?: () => void;
}

export const DentistCard = React.memo(function DentistCard({
  dentist,
  onNavigateToProfile,
}: DentistCardProps) {
  const isDistinguished = dentist.distinguished === 'Yes';
  const profileUrl = dentist.slug ? `/dentist/${dentist.slug}` : `/dentist/dr-${dentist.name.toLowerCase().replace(/[^\w]/g, '-')}`;

  return (
    <article
      className={`group relative flex flex-col justify-between p-5 rounded-md bg-surface border transition-all duration-180 hover:-translate-y-0.5 hover:shadow-sh-2 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
        isDistinguished
          ? 'border-line-2 border-l-[3px] border-l-brass'
          : 'border-line hover:border-line-2'
      }`}
    >
      <div>
        {/* Top bar for Distinguished badge */}
        {isDistinguished && (
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-line/60">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-semibold uppercase tracking-wider text-brass-ink bg-brass-t border border-brass/30">
              <Award className="w-3 h-3 text-brass" />
              DISTINGUISHED
            </span>

            <Link
              to={profileUrl}
              onClick={onNavigateToProfile}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-brass-ink hover:text-ink transition-colors"
            >
              Read profile
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* Header row with Photo and Identity */}
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="shrink-0">
            {isDistinguished ? (
              <Link
                to={profileUrl}
                onClick={onNavigateToProfile}
                tabIndex={-1}
                aria-hidden="true"
                className="block w-16 h-21 overflow-hidden rounded-xs border border-brass/50 shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
              >
                <CoverImage
                  photoUrl={dentist.photo_url}
                  name={dentist.name}
                  isDistinguished={true}
                  specialty={dentist.specialty}
                  city={dentist.city}
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <div className="w-[72px] h-[72px] overflow-hidden rounded-sm border border-line bg-sage-t">
                <CoverImage
                  photoUrl={dentist.photo_url}
                  name={dentist.name}
                  specialty={dentist.specialty}
                  city={dentist.city}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Name & Practice */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-xs bg-primary-t text-primary">
                {dentist.specialty || 'General Practice'}
              </span>
              <span className="text-[11px] text-ink-3 font-mono">
                {dentist.country}
              </span>
            </div>

            <h3 className="font-sans font-semibold text-[1.0625rem] text-ink leading-snug">
              {isDistinguished ? (
                <Link
                  to={profileUrl}
                  onClick={onNavigateToProfile}
                  className="hover:text-primary transition-colors focus:outline-none"
                >
                  {dentist.name}
                </Link>
              ) : (
                dentist.name
              )}
            </h3>

            {dentist.practice_name && (
              <p className="text-[13px] text-ink-2 truncate mt-0.5">
                {dentist.practice_name}
              </p>
            )}
          </div>
        </div>

        {/* Address and Contact details */}
        <div className="mt-4 pt-3 border-t border-line/60 space-y-1.5 text-[13px] text-ink-2">
          <p className="truncate">
            {dentist.city}
            {dentist.state_province_region ? `, ${dentist.state_province_region}` : ''}{' '}
            <span className="font-mono text-ink text-[12.5px] font-medium">
              {dentist.postal_code}
            </span>
          </p>

          {/* Plain text phone per PRD §8.2: NOT a link, user-select: text */}
          {dentist.phone && (
            <div className="flex items-center gap-1.5 text-ink-2 select-text">
              <Phone className="w-3.5 h-3.5 text-ink-3 shrink-0" aria-hidden="true" />
              <span className="font-mono text-[12.5px] select-text">
                {dentist.phone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions bottom row */}
      <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Website link */}
          {dentist.website && (
            <a
              href={dentist.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-sm border border-line-2 bg-elevated hover:bg-primary-t/40 text-ink-2 hover:text-primary transition-colors"
            >
              <span>Website</span>
              <ArrowUpRight className="w-3 h-3" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}

          {/* Contact email link - hidden if email is blank per PRD §12.2 */}
          {dentist.email && (
            <a
              href={`mailto:${dentist.email}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-sm bg-primary text-bg hover:bg-primary-h transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>Contact</span>
            </a>
          )}
        </div>

        {/* Social links (conditional per PRD §1.11) */}
        <SocialLinks
          facebook={dentist.facebook_url}
          instagram={dentist.instagram_url}
          linkedin={dentist.linkedin_url}
          x={dentist.x_url}
        />
      </div>
    </article>
  );
});

export function DentistCardSkeleton() {
  return (
    <div className="p-5 rounded-md bg-surface border border-line flex flex-col justify-between h-[230px]">
      <div>
        <div className="flex items-start gap-4">
          <div className="w-[72px] h-[72px] rounded-sm bg-line/60 animate-shimmer shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="w-20 h-3.5 bg-line/60 rounded-xs animate-shimmer" />
            <div className="w-3/4 h-5 bg-line/80 rounded-xs animate-shimmer" />
            <div className="w-1/2 h-3.5 bg-line/50 rounded-xs animate-shimmer" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-line/40 space-y-2">
          <div className="w-2/3 h-3 bg-line/50 rounded-xs animate-shimmer" />
          <div className="w-1/3 h-3 bg-line/40 rounded-xs animate-shimmer" />
        </div>
      </div>
      <div className="pt-3 border-t border-line/40 flex items-center justify-between">
        <div className="w-24 h-6 bg-line/50 rounded-sm animate-shimmer" />
        <div className="w-16 h-6 bg-line/40 rounded-sm animate-shimmer" />
      </div>
    </div>
  );
}
