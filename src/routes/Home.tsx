import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Search,
  Sparkles,
  Clock,
  RefreshCw,
  ShieldAlert,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';
import { HOME_ARTICLES, DENTAL_TIPS } from '../mock/articles';
import { CoverImage } from '../components/domain/CoverImage';
import { MagazineCover } from '../components/domain/MagazineCover';
import { useDemoStore } from '../store/demoStore';

export function Home() {
  const navigate = useNavigate();
  const { showDoctorOfMonth, completeGuideStep } = useDemoStore();
  const [scrolled, setScrolled] = useState(false);

  // Search caption animation cycle
  const searchCaptions = [
    'orthodontist, austin',
    'SW1A, London',
    'pediatric, toronto',
    'Sydney, NSW',
  ];
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % searchCaptions.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Hide scroll cue on first scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFocusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('input[placeholder*="Search by name"]');
      if (input) {
        input.focus();
        input.classList.add('ring-2', 'ring-primary');
        setTimeout(() => input.classList.remove('ring-2', 'ring-primary'), 600);
      }
    }, 300);
  };

  return (
    <div className="bg-bg min-h-screen">
      {/* 8.1 Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-24 border-b border-line">
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[540px]">
            {/* Left 6 Columns: Editorial Copy */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-brass">
                THE DNN DIRECTORY
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-medium leading-[1.08] text-ink tracking-tight">
                Every practice worth knowing, in one searchable directory.
              </h1>

              <p className="font-sans text-base sm:text-lg text-ink-2 max-w-[54ch] leading-relaxed">
                Look up dentists across the United States, Canada, the United Kingdom and Australia. And read the stories of the practitioners we’ve distinguished.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleFocusSearch}
                  className="px-6 py-3.5 rounded-sm bg-primary text-bg font-sans font-semibold text-sm hover:bg-primary-h active:bg-primary-a transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a dentist</span>
                </button>

                <Link
                  to="/find-a-dentist?mode=distinguished"
                  className="px-6 py-3.5 rounded-sm border border-brass text-brass-ink bg-brass-t/40 hover:bg-brass-t font-sans font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-brass" />
                  <span>Meet the Distinguished</span>
                </Link>
              </div>
            </div>

            {/* Right 6 Columns: The Directory in Motion (CSS-only live visual per PRD §8.1) */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end" aria-hidden="true">
              <div className="relative w-full max-w-[460px] h-[440px] sm:h-[480px] rounded-lg border border-line bg-surface/80 p-4 sm:p-6 overflow-hidden shadow-sh-2">
                {/* Background Contour SVG drifting horizontally */}
                <div className="absolute inset-0 pointer-events-none anim-contour-drift opacity-40">
                  <svg viewBox="0 0 600 500" fill="none" className="w-[140%] h-full">
                    <path
                      d="M-20,100 C150,50 350,220 620,120"
                      stroke="#8FA89B"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M-40,240 C120,180 300,340 600,260"
                      stroke="#A8834A"
                      strokeWidth="1"
                    />
                    <path
                      d="M-10,380 C180,310 400,450 630,370"
                      stroke="#8FA89B"
                      strokeWidth="0.8"
                    />
                  </svg>
                </div>

                {/* Animated Search Caption typing through four queries */}
                <div className="relative z-10 flex items-center justify-between mb-4 pb-2.5 border-b border-line">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-xs font-medium text-ink-2">
                      q = "<span className="text-primary font-semibold">{searchCaptions[captionIndex]}</span>"
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-xs bg-primary-t text-primary">
                    LIVE INDEX
                  </span>
                </div>

                {/* Stack of practice cards translating upward slowly */}
                <div className="relative h-[340px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                  <div className="anim-stack-translate space-y-3">
                    {/* Card 1 */}
                    <div className="p-3.5 rounded-sm bg-elevated border border-line shadow-sh-1 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xs bg-sage-t shrink-0 flex items-center justify-center font-serif text-sm font-semibold text-primary">
                        EC
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-ink truncate">
                            Dr. Emily Chen, DDS
                          </span>
                          <span className="text-[10px] text-brass-ink font-semibold">★ DISTINGUISHED</span>
                        </div>
                        <span className="text-[11px] text-ink-2 block truncate">
                          Chen Family Dental · Houston, TX 77098
                        </span>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-3.5 rounded-sm bg-elevated border border-line shadow-sh-1 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xs bg-sage-t shrink-0 flex items-center justify-center font-serif text-sm font-semibold text-primary">
                        DB
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-xs text-ink truncate block">
                          Dr. Daniel Brooks, DMD
                        </span>
                        <span className="text-[11px] text-ink-2 block truncate">
                          Brooks Orthodontics · Austin, TX 78704
                        </span>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-3.5 rounded-sm bg-elevated border border-line shadow-sh-1 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xs bg-sage-t shrink-0 flex items-center justify-center font-serif text-sm font-semibold text-primary">
                        OH
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-ink truncate">
                            Dr. Oliver Hartley, BDS
                          </span>
                          <span className="text-[10px] text-brass-ink font-semibold">★ DISTINGUISHED</span>
                        </div>
                        <span className="text-[11px] text-ink-2 block truncate">
                          Hartley & Pryce · London, W1G 9PF, UK
                        </span>
                      </div>
                    </div>

                    {/* Card 4 (loop filler) */}
                    <div className="p-3.5 rounded-sm bg-elevated border border-line shadow-sh-1 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xs bg-sage-t shrink-0 flex items-center justify-center font-serif text-sm font-semibold text-primary">
                        MK
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-ink truncate">
                            Dr. Mia Kowalczyk, BDSc
                          </span>
                          <span className="text-[10px] text-brass-ink font-semibold">★ DISTINGUISHED</span>
                        </div>
                        <span className="text-[11px] text-ink-2 block truncate">
                          Harbourside Dental · Sydney, NSW, AU
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlapping Distinguished Magazine Cover floating at bottom-right */}
                <div className="absolute right-4 bottom-4 w-32 sm:w-36 aspect-[3/4] shadow-sh-3 rounded-xs border border-brass/60 anim-cover-drift pointer-events-none">
                  <MagazineCover
                    name="Dr. Emily Chen"
                    specialty="General Restorative"
                    city="Houston, TX"
                    palette="teal"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Cue per PRD §8.1 */}
          {!scrolled && (
            <div className="hidden lg:flex items-center gap-2 mt-8 text-xs text-ink-3">
              <span className="uppercase tracking-widest text-[10px] font-semibold">Scroll</span>
              <div className="w-[1px] h-6 bg-line relative overflow-hidden">
                <div className="w-full h-full bg-primary anim-scroll-cue" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8.1 Latest Articles */}
      <section className="py-16 sm:py-20 border-b border-line bg-surface/50">
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-line">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brass">
                DNN EDITORIAL
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium mt-1">
                Latest Trade News & Clinical Insights
              </h2>
            </div>
            <Link
              to="/find-a-dentist"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-h"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOME_ARTICLES.map((art) => (
              <article
                key={art.id}
                className={`group flex flex-col justify-between bg-elevated rounded-md border border-line p-6 transition-all duration-200 hover:shadow-sh-2 hover:-translate-y-0.5 ${
                  art.featured ? 'lg:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Generated duotone SVG placeholder illustration (no stock photos per PRD §27) */}
                  <div className="w-full aspect-[16/9] mb-5 rounded-sm overflow-hidden bg-sage-t relative border border-line/60">
                    <svg viewBox="0 0 400 225" fill="none" className="w-full h-full">
                      <rect width="400" height="225" fill={art.featured ? '#1F4A4F' : '#3B5951'} />
                      <circle cx="200" cy="112" r="70" stroke="#A8834A" strokeWidth="1.2" opacity="0.6" />
                      <circle cx="200" cy="112" r="45" stroke="#E6EDE8" strokeWidth="0.8" opacity="0.4" />
                      <line x1="50" y1="112" x2="350" y2="112" stroke="#A8834A" strokeWidth="0.8" opacity="0.5" />
                      <text
                        x="20"
                        y="35"
                        fill="#F6F3EC"
                        fontSize="10"
                        fontWeight="600"
                        letterSpacing="0.15em"
                        fontFamily="Hanken Grotesk"
                      >
                        DNN CLINICAL DISPATCH
                      </text>
                    </svg>
                  </div>

                  <div className="flex items-center gap-3 text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-xs font-semibold text-[11px] bg-primary-t text-primary">
                      {art.category}
                    </span>
                    <span className="text-ink-3 font-mono text-[11px]">{art.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-ink group-hover:underline leading-snug">
                    {art.title}
                  </h3>

                  <p className="font-sans text-sm text-ink-2 mt-2.5 leading-relaxed">
                    {art.dek}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8.1 Removed Slot (Doctor of the Month) - Before/After animation */}
      {showDoctorOfMonth && (
        <section className="bg-warning-t/40 border-y border-dashed border-error/50 py-8 transition-all duration-360">
          <div className="max-w-content mx-auto px-5 sm:px-8">
            <div className="p-6 rounded-md bg-elevated border border-error/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-sm bg-error/10 text-error shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-bold uppercase tracking-wider bg-error text-bg mb-2">
                    REMOVED IN MILESTONE 2
                  </div>
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Legacy Widget: Doctor of the Month (Deprecated)
                  </h3>
                  <p className="text-xs text-ink-2 mt-1 max-w-xl">
                    This ad-hoc homepage widget has been decommissioned per client spec §0.4 to prevent duplicate listings and make way for the integrated Distinguished profiles tier.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-error font-semibold shrink-0">
                Visible in "Before" preview only
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 8.1 Dental Tips Section */}
      <section id="tips-section" className="py-16 sm:py-20 border-b border-line">
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <div className="mb-10 pb-4 border-b border-line">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brass">
              PRACTICE ADVICE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium mt-1">
              Dental Tips & Clinical Best Practices
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DENTAL_TIPS.map((tip) => {
              const icons = {
                Sparkles: <Sparkles className="w-4 h-4 text-primary" />,
                Clock: <Clock className="w-4 h-4 text-primary" />,
                RefreshCw: <RefreshCw className="w-4 h-4 text-primary" />,
                ShieldAlert: <ShieldAlert className="w-4 h-4 text-primary" />,
              };

              return (
                <div
                  key={tip.id}
                  className="p-5 rounded-md bg-surface border border-line hover:border-line-2 transition-all duration-180 hover:-translate-y-0.5"
                >
                  <div className="w-8 h-8 rounded-sm bg-primary-t flex items-center justify-center mb-3">
                    {icons[tip.iconName]}
                  </div>
                  <h4 className="font-serif text-lg font-medium text-ink leading-snug">
                    {tip.title}
                  </h4>
                  <p className="font-sans text-xs text-ink-2 mt-2 leading-relaxed">
                    {tip.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
