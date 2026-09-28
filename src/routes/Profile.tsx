import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  MapPin,
  Phone,
  ArrowUpRight,
  Mail,
  Maximize2,
  ArrowUp,
  AlertCircle,
} from 'lucide-react';
import { DentistRecord } from '../types/dentist';
import { getDentistBySlug } from '../api/mockApi';
import { CoverImage } from '../components/domain/CoverImage';
import { SocialLinks } from '../components/domain/SocialLinks';
import { Article } from '../components/domain/Article';
import { Lightbox } from '../components/domain/Lightbox';
import { useDemoStore } from '../store/demoStore';

export function Profile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { completeGuideStep } = useDemoStore();

  const [dentist, setDentist] = useState<DentistRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const coverButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch dentist by slug
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getDentistBySlug(slug)
      .then((res) => {
        setDentist(res);
        setLoading(false);
        if (res) {
          completeGuideStep('open-profile');
        }
      })
      .catch(() => {
        setDentist(null);
        setLoading(false);
      });
  }, [slug, completeGuideStep]);

  // Reading progress hairline listener per PRD §8.3
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
        setReadProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Back link URL from session state retention per PRD §8.2 & §8.3
  const getBackUrl = () => {
    const saved = sessionStorage.getItem('dnn_search_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return `/find-a-dentist?q=${encodeURIComponent(parsed.q || '')}&mode=${parsed.mode || 'all'}`;
      } catch {
        // fallback
      }
    }
    return '/find-a-dentist?mode=distinguished';
  };

  // 404 state if not found or not distinguished per A5
  if (!loading && !dentist) {
    return (
      <div className="bg-bg min-h-[70vh] flex flex-col items-center justify-center px-5 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center text-ink-3 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
          This profile isn’t available
        </h1>
        <p className="text-sm text-ink-2 max-w-md mt-2 mb-6">
          The requested practitioner listing is inactive or does not belong to the Distinguished editorial tier.
        </p>
        <Link
          to="/find-a-dentist"
          className="px-5 py-2.5 rounded-sm bg-primary text-bg font-sans font-semibold text-xs hover:bg-primary-h"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen relative pb-28">
      {/* 2px Brass Reading-Progress Hairline under sticky bar per PRD §8.3 */}
      <div className="fixed top-[64px] sm:top-[64px] left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-brass origin-left transition-transform duration-75"
          style={{ transform: `scaleX(${readProgress / 100})` }}
        />
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-8 pt-6">
        {/* Back Link with state retention per PRD §8.3 */}
        <div className="mb-8">
          <Link
            to={getBackUrl()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink-2 hover:text-primary transition-colors py-1 focus:outline-none focus:ring-1 focus:ring-primary rounded-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Search Results</span>
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
            <div className="lg:col-span-5 aspect-[3/4] bg-line/60 rounded-md" />
            <div className="lg:col-span-7 space-y-4">
              <div className="w-32 h-4 bg-line/60 rounded-xs" />
              <div className="w-3/4 h-12 bg-line/80 rounded-xs" />
              <div className="w-1/2 h-6 bg-line/50 rounded-xs" />
              <div className="w-full h-32 bg-line/40 rounded-sm" />
            </div>
          </div>
        )}

        {/* Profile Content */}
        {!loading && dentist && (
          <>
            {/* Split Desktop / Stacked Mobile Header per PRD §8.3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column (5/12): Digital Magazine Cover */}
              <div className="lg:col-span-5 order-1 lg:order-1 flex justify-center">
                <div className="relative w-full max-w-[360px] lg:max-w-none p-5 sm:p-7 rounded-md bg-surface border border-line shadow-sh-2">
                  <button
                    ref={coverButtonRef}
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`Expand magazine cover of ${dentist.name}`}
                    className="group relative block w-full aspect-[3/4] rounded-xs overflow-hidden border border-brass/70 shadow-sm cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brass"
                  >
                    <CoverImage
                      photoUrl={dentist.photo_url}
                      name={dentist.name}
                      isDistinguished={true}
                      specialty={dentist.specialty}
                      city={dentist.city}
                      className="w-full h-full object-cover"
                    />

                    {/* Expand Control in Bottom-Right */}
                    <div
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-sm bg-ink-bg/80 text-bg flex items-center justify-center shadow-md transition-opacity duration-180 group-hover:opacity-100 sm:opacity-90"
                      title="Expand cover"
                    >
                      <Maximize2 className="w-4 h-4 text-brass" />
                    </div>
                  </button>

                  <span className="block text-center text-[11px] text-ink-3 mt-3">
                    Click to expand digital magazine cover
                  </span>
                </div>
              </div>

              {/* Right Column (7/12): Practitioner Identity & Contacts */}
              <div className="lg:col-span-7 order-2 lg:order-2 space-y-6">
                {/* 1. Eyebrow */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-brass-t text-brass-ink border border-brass/40 text-xs font-semibold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-brass" />
                  <span>DISTINGUISHED DENTIST</span>
                </div>

                {/* 2. H1: Name with Credentials */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-medium text-ink leading-[1.1] tracking-tight">
                  {dentist.name}
                </h1>

                {/* 3. Practice Name */}
                {dentist.practice_name && (
                  <p className="font-serif italic text-xl sm:text-2xl text-ink-2">
                    {dentist.practice_name}
                  </p>
                )}

                {/* 4. Hairline Rule, 48px wide, brass */}
                <div className="w-12 h-[2px] bg-brass" />

                {/* 5. Address Block & Plain Text Phone */}
                <div className="space-y-2 text-sm text-ink-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      {dentist.address_line_1 && `${dentist.address_line_1}, `}
                      {dentist.city}, {dentist.state_province_region}{' '}
                      <strong className="font-mono text-ink font-semibold">
                        {dentist.postal_code}
                      </strong>{' '}
                      ({dentist.country})
                    </span>
                  </div>

                  {/* Phone as Plain Text per PRD §8.3 */}
                  {dentist.phone && (
                    <div className="flex items-center gap-2.5 select-text">
                      <Phone className="w-4 h-4 text-ink-3 shrink-0" aria-hidden="true" />
                      <span className="font-mono text-sm text-ink select-text">
                        {dentist.phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* 6. Website Link */}
                {dentist.website && (
                  <div>
                    <a
                      href={dentist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-h underline underline-offset-4"
                    >
                      <span>
                        Visit Practice Website ({new URL(dentist.website).hostname.replace('www.', '')})
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </div>
                )}

                {/* 7. Full-Width Contact Button (hidden cleanly if no email per PRD §12.2) */}
                {dentist.email && (
                  <div>
                    <a
                      href={`mailto:${dentist.email}`}
                      className="w-full sm:w-auto min-w-[280px] h-[52px] px-8 rounded-sm bg-primary text-bg font-sans font-semibold text-sm hover:bg-primary-h active:bg-primary-a transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contact {dentist.name.replace(/,\s*(DDS|DMD|BDS|BDSc).*$/i, '')}</span>
                    </a>
                  </div>
                )}

                {/* 8. Social Icons Row (conditional per PRD §1.11 & §8.3) */}
                <div>
                  <SocialLinks
                    facebook={dentist.facebook_url}
                    instagram={dentist.instagram_url}
                    linkedin={dentist.linkedin_url}
                    x={dentist.x_url}
                    className="pt-2"
                  />
                </div>
              </div>
            </div>

            {/* Editorial Article Band per PRD §8.3 */}
            {dentist.about && (
              <section className="mt-20 pt-16 border-t border-line">
                <div className="max-w-article mx-auto text-center mb-8">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-brass">
                    IN PROFILE
                  </span>
                  <div className="w-8 h-[1px] bg-brass mx-auto mt-2" />
                </div>

                {/* Article rendered via wpautop() with lede formatting */}
                <article>
                  <Article content={dentist.about} />
                </article>

                {/* Closing Element */}
                <div className="max-w-article mx-auto mt-14 pt-8 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-primary font-medium"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Back to top</span>
                  </button>

                  {dentist.email && (
                    <a
                      href={`mailto:${dentist.email}`}
                      className="px-5 py-2.5 rounded-sm border border-line-2 bg-elevated hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact Practitioner</span>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Lightbox Component */}
            <Lightbox
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              photoUrl={dentist.photo_url}
              name={dentist.name}
              specialty={dentist.specialty}
              city={dentist.city}
              triggerRef={coverButtonRef}
            />
          </>
        )}
      </div>
    </div>
  );
}
