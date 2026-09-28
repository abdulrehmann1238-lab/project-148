import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Award, X, AlertCircle, RefreshCw, ChevronDown, Check } from 'lucide-react';
import { ToothArcMark } from '../ui/Icons';
import { useDemoStore } from '../../store/demoStore';

export function StickySearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isDirectory = location.pathname === '/find-a-dentist';

  // Local draft inputs
  const [generalQuery, setGeneralQuery] = useState('');
  const [distinguishedQuery, setDistinguishedQuery] = useState('');

  // Tablet/Mobile active mode & draft query
  const [activeMode, setActiveMode] = useState<'all' | 'distinguished'>('all');
  const [mobileQuery, setMobileQuery] = useState('');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Validation & Error states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);

  // Stuck state observer
  const [isStuck, setIsStuck] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Demo store states
  const {
    scraperThrottledUntil,
    clearScraperThrottle,
    expiredNonce,
    setExpiredNonce,
    completeGuideStep,
  } = useDemoStore();

  // Initialize draft inputs from URL params on load or navigation
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const modeParam = searchParams.get('mode') || 'all';

    if (modeParam === 'distinguished') {
      setDistinguishedQuery(qParam);
      setActiveMode('distinguished');
      setMobileQuery(qParam);
    } else {
      setGeneralQuery(qParam);
      setActiveMode('all');
      setMobileQuery(qParam);
    }
  }, [searchParams]);

  // Live countdown for rate limit
  useEffect(() => {
    if (!scraperThrottledUntil) {
      setRateLimitSeconds(null);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.ceil((scraperThrottledUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearScraperThrottle();
        setRateLimitSeconds(null);
      } else {
        setRateLimitSeconds(remaining);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [scraperThrottledUntil, clearScraperThrottle]);

  // Observer for sticky state
  useEffect(() => {
    const handleScroll = () => {
      if (barRef.current) {
        const top = barRef.current.getBoundingClientRect().top;
        setIsStuck(top <= 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Execution of search per PRD §7.2 rules
  const handleGeneralSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const trimmed = generalQuery.trim();
    if (trimmed.length < 2) {
      setValidationError('Please enter at least 2 characters.');
      return;
    }

    if (trimmed.toLowerCase().includes('emily chen')) {
      completeGuideStep('search-emily');
    }

    navigate(`/find-a-dentist?q=${encodeURIComponent(trimmed)}&mode=all`);
  };

  const handleDistinguishedSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const trimmed = distinguishedQuery.trim();
    // Blank is valid for distinguished per PRD §7.2!
    navigate(`/find-a-dentist?q=${encodeURIComponent(trimmed)}&mode=distinguished`);
  };

  // Tablet/Mobile unified submit
  const handleUnifiedSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const trimmed = mobileQuery.trim();
    if (activeMode === 'all' && trimmed.length < 2) {
      setValidationError('Please enter at least 2 characters.');
      return;
    }

    if (activeMode === 'distinguished') {
      navigate(`/find-a-dentist?q=${encodeURIComponent(trimmed)}&mode=distinguished`);
    } else {
      navigate(`/find-a-dentist?q=${encodeURIComponent(trimmed)}&mode=all`);
    }
  };

  const isRateLimited = (rateLimitSeconds ?? 0) > 0;

  return (
    <>
      <div
        ref={barRef}
        className={`sticky top-0 z-40 bg-surface/95 backdrop-blur-none border-b border-line transition-shadow duration-200 ${
          isStuck ? 'shadow-sh-1' : ''
        }`}
      >
        <div className="max-w-content mx-auto px-4 sm:px-8 py-2.5">
          {/* DESKTOP VIEW (>=1024px) Dual Search Bar */}
          <div className="hidden lg:grid grid-cols-12 gap-3 items-center">
            {/* Left Group (~58%): FIND A DENTIST */}
            <form
              onSubmit={handleGeneralSubmit}
              className="col-span-7 flex items-center gap-1.5"
            >
              <div
                className={`relative flex-1 flex items-center h-11 bg-elevated rounded-sm border transition-colors ${
                  validationError ? 'border-error ring-1 ring-error' : 'border-line-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15'
                }`}
              >
                <div className="pl-3 pr-2 border-r border-line/60 flex items-center gap-1.5 select-none shrink-0">
                  <Search className="w-3.5 h-3.5 text-ink-3" />
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-2">
                    FIND A DENTIST
                  </span>
                </div>

                <input
                  type="text"
                  value={generalQuery}
                  onChange={(e) => {
                    setGeneralQuery(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  aria-invalid={!!validationError}
                  placeholder="Search by name, city, postal code, country, or specialty..."
                  className="w-full h-full px-3 text-[13.5px] text-ink placeholder:text-ink-3/70 bg-transparent focus:outline-none"
                />

                {generalQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setGeneralQuery('');
                      setValidationError(null);
                    }}
                    className="p-1 mr-1.5 text-ink-3 hover:text-ink rounded-xs focus:outline-none"
                    aria-label="Clear general search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isRateLimited}
                className="h-11 px-4 rounded-sm bg-primary text-bg font-sans font-semibold text-[13px] hover:bg-primary-h active:bg-primary-a disabled:opacity-45 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Divider */}
            <div className="hidden col-span-0 lg:block lg:col-span-0 w-[1px] h-8 bg-line" />

            {/* Right Group (~42%): FIND DISTINGUISHED DENTIST */}
            <form
              onSubmit={handleDistinguishedSubmit}
              className="col-span-5 flex items-center gap-1.5"
            >
              <div className="relative flex-1 flex items-center h-11 bg-elevated rounded-sm border border-line-2 focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/20 transition-colors">
                <div className="pl-3 pr-2 border-r border-line/60 flex items-center gap-1.5 select-none shrink-0">
                  <Award className="w-3.5 h-3.5 text-brass" />
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-brass-ink">
                    DISTINGUISHED
                  </span>
                </div>

                <input
                  type="text"
                  value={distinguishedQuery}
                  onChange={(e) => setDistinguishedQuery(e.target.value)}
                  placeholder="Search Distinguished Dentists, or leave blank to see all"
                  className="w-full h-full px-3 text-[13.5px] text-ink placeholder:text-ink-3/70 bg-transparent focus:outline-none"
                />

                {distinguishedQuery && (
                  <button
                    type="button"
                    onClick={() => setDistinguishedQuery('')}
                    className="p-1 mr-1.5 text-ink-3 hover:text-ink rounded-xs focus:outline-none"
                    aria-label="Clear distinguished search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isRateLimited}
                className="h-11 px-3.5 rounded-sm bg-brass-t text-brass-ink border border-brass/60 font-sans font-semibold text-[13px] hover:bg-brass-t/80 active:bg-brass-t/60 disabled:opacity-45 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span>Search</span>
                <span className="text-xs">★</span>
              </button>
            </form>
          </div>

          {/* TABLET VIEW (768px - 1023px) Segmented Toggle + Single Input */}
          <div className="hidden sm:flex lg:hidden flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="inline-flex rounded-sm p-0.5 bg-bg border border-line text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('all');
                    setValidationError(null);
                  }}
                  className={`px-3 py-1 rounded-xs transition-colors ${
                    activeMode === 'all'
                      ? 'bg-elevated text-primary shadow-sh-1'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  Find a Dentist
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('distinguished');
                    setValidationError(null);
                  }}
                  className={`px-3 py-1 rounded-xs flex items-center gap-1 transition-colors ${
                    activeMode === 'distinguished'
                      ? 'bg-brass-t text-brass-ink border border-brass/40 shadow-sh-1'
                      : 'text-ink-2 hover:text-brass-ink'
                  }`}
                >
                  <span>Distinguished</span>
                  <span>★</span>
                </button>
              </div>

              {isStuck && (
                <div className="flex items-center gap-2 text-ink">
                  <ToothArcMark className="w-4 h-4 text-brass" />
                  <span className="font-serif text-sm font-medium">DNN Directory</span>
                </div>
              )}
            </div>

            <form onSubmit={handleUnifiedSubmit} className="flex items-center gap-2">
              <div
                className={`relative flex-1 flex items-center h-10 bg-elevated rounded-sm border transition-colors ${
                  validationError ? 'border-error ring-1 ring-error' : 'border-line-2 focus-within:border-primary'
                }`}
              >
                <Search className="w-4 h-4 ml-3 text-ink-3 shrink-0" />
                <input
                  type="text"
                  value={mobileQuery}
                  onChange={(e) => {
                    setMobileQuery(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder={
                    activeMode === 'all'
                      ? 'Search by name, city, postal code, or specialty...'
                      : 'Search Distinguished Dentists, or leave blank'
                  }
                  className="w-full h-full px-3 text-[13.5px] bg-transparent focus:outline-none"
                />
                {mobileQuery && (
                  <button
                    type="button"
                    onClick={() => setMobileQuery('')}
                    className="p-1 mr-2 text-ink-3 hover:text-ink"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isRateLimited}
                className={`h-10 px-4 rounded-sm font-semibold text-xs shadow-sm ${
                  activeMode === 'distinguished'
                    ? 'bg-brass-t text-brass-ink border border-brass/50'
                    : 'bg-primary text-bg'
                }`}
              >
                Search
              </button>
            </form>
          </div>

          {/* MOBILE VIEW (<768px) Pill Search with Mode Sheet Trigger */}
          <div className="sm:hidden flex items-center gap-2">
            <form onSubmit={handleUnifiedSubmit} className="flex-1 flex items-center gap-1.5">
              <div
                className={`relative flex-1 flex items-center h-10 bg-elevated rounded-pill border px-3 transition-colors ${
                  validationError ? 'border-error' : 'border-line-2 focus-within:border-primary'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-ink-3 mr-2 shrink-0" />
                <input
                  type="text"
                  value={mobileQuery}
                  onChange={(e) => {
                    setMobileQuery(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder={
                    activeMode === 'all'
                      ? 'Name, city, or ZIP...'
                      : 'Distinguished (or blank)...'
                  }
                  className="w-full h-full text-[13px] bg-transparent focus:outline-none text-ink placeholder:text-ink-3"
                />
                {mobileQuery && (
                  <button
                    type="button"
                    onClick={() => setMobileQuery('')}
                    className="p-1 text-ink-3"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Mode chip opening bottom sheet */}
              <button
                type="button"
                onClick={() => setMobileSheetOpen(true)}
                className={`h-10 px-2.5 rounded-pill border text-[11px] font-semibold flex items-center gap-1 shrink-0 ${
                  activeMode === 'distinguished'
                    ? 'bg-brass-t text-brass-ink border-brass/50'
                    : 'bg-surface text-ink-2 border-line-2'
                }`}
              >
                <span>{activeMode === 'distinguished' ? 'Distinguished ★' : 'All'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <button
                type="submit"
                disabled={isRateLimited}
                className="h-10 px-3 rounded-pill bg-primary text-bg font-semibold text-xs shrink-0"
              >
                Go
              </button>
            </form>
          </div>

          {/* Inline Validation Error per PRD §7.2 */}
          {validationError && (
            <div className="mt-2 text-xs text-error font-medium flex items-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Rate Limit Banner (429) per PRD §7.2 */}
          {isRateLimited && (
            <div className="mt-2.5 p-2.5 rounded-sm bg-warning-t border border-warning/40 text-xs text-warning flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning shrink-0" />
                <span>
                  You’re searching a little quickly. Please try again in{' '}
                  <strong className="font-bold text-ink">{rateLimitSeconds}</strong> seconds.
                </span>
              </div>
              <button
                type="button"
                onClick={clearScraperThrottle}
                className="text-[11px] underline font-semibold text-ink ml-3"
              >
                Reset
              </button>
            </div>
          )}

          {/* Expired Nonce Banner (403) per PRD §7.2 */}
          {expiredNonce && (
            <div className="mt-2.5 p-2.5 rounded-sm bg-warning-t border border-warning/40 text-xs text-warning flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning shrink-0" />
                <span>Your session timed out. Refresh the page to keep searching.</span>
              </div>
              <button
                type="button"
                onClick={() => setExpiredNonce(false)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-xs bg-elevated border border-warning/40 text-ink font-semibold text-xs hover:bg-white"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Mode Bottom Sheet */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-modal sm:hidden">
          <div
            className="fixed inset-0 bg-ink-bg/60 backdrop-blur-none"
            onClick={() => setMobileSheetOpen(false)}
          />
          <div className="fixed bottom-0 inset-x-0 bg-surface rounded-t-lg border-t border-line p-5 shadow-sh-3">
            <div className="w-10 h-1 bg-line-2 rounded-pill mx-auto mb-4" />
            <h3 className="font-serif text-lg font-medium text-ink mb-3 text-center">
              Select Search Tier
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('all');
                  setMobileSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-sm border text-left text-sm ${
                  activeMode === 'all'
                    ? 'border-primary bg-primary-t/30 font-semibold text-primary'
                    : 'border-line bg-elevated text-ink'
                }`}
              >
                <div>
                  <div className="font-medium">All Directory Listings</div>
                  <div className="text-xs text-ink-3 mt-0.5">Search across ~300,000 dental practices</div>
                </div>
                {activeMode === 'all' && <Check className="w-4 h-4 text-primary" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('distinguished');
                  setMobileSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-sm border text-left text-sm ${
                  activeMode === 'distinguished'
                    ? 'border-brass bg-brass-t/50 font-semibold text-brass-ink'
                    : 'border-line bg-elevated text-ink'
                }`}
              >
                <div>
                  <div className="font-medium flex items-center gap-1.5">
                    <span>Distinguished Dentists</span>
                    <span className="text-xs bg-brass-t px-1.5 py-0.5 rounded-xs text-brass-ink border border-brass/40">★</span>
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">Editorial digital magazine cover profiles</div>
                </div>
                {activeMode === 'distinguished' && <Check className="w-4 h-4 text-brass-ink" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
