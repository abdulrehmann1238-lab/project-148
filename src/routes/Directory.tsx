import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchX, Loader2, Award, RotateCcw } from 'lucide-react';
import { DentistRecord, SearchMode } from '../types/dentist';
import { searchDentists } from '../api/mockApi';
import { DentistCard, DentistCardSkeleton } from '../components/domain/DentistCard';
import { useDemoStore } from '../store/demoStore';

export function Directory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const qParam = searchParams.get('q');
  const modeParam = (searchParams.get('mode') as SearchMode) || 'all';

  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<DentistRecord[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [telemetry, setTelemetry] = useState<{ queryTimeMs: number; matchedIndex: string } | null>(null);

  const { telemetryEnabled, completeGuideStep } = useDemoStore();
  const loadMoreBtnRef = useRef<HTMLButtonElement>(null);

  // Check and perform search
  useEffect(() => {
    // If URL has search query or is explicitly in distinguished mode, fire search
    if (qParam !== null || modeParam === 'distinguished') {
      const q = qParam || '';
      const mode = modeParam;

      setHasSearched(true);
      setLoading(true);
      setError(null);

      // Check session state retention for back navigation (PRD §8.2)
      const savedStateRaw = sessionStorage.getItem('dnn_search_state');
      let initialLimit = 12;
      let shouldRestoreScroll = false;
      let targetScrollY = 0;

      if (savedStateRaw) {
        try {
          const saved = JSON.parse(savedStateRaw);
          if (saved.q === q && saved.mode === mode && saved.loadedCount > 12) {
            initialLimit = saved.loadedCount;
            targetScrollY = saved.scrollY;
            shouldRestoreScroll = true;
          }
        } catch {
          // ignore parsing error
        }
      }

      searchDentists({ q, mode, offset: 0, limit: initialLimit })
        .then((res) => {
          setResults(res.items);
          setHasMore(res.hasMore);
          setTelemetry({ queryTimeMs: res.queryTimeMs, matchedIndex: res.matchedIndex });
          setLoading(false);

          if (shouldRestoreScroll && targetScrollY > 0) {
            setTimeout(() => {
              window.scrollTo({ top: targetScrollY, behavior: 'instant' as any });
              completeGuideStep('back-retention');
            }, 100);
          }
        })
        .catch((err) => {
          setError(err.message || 'An error occurred while fetching directory listings.');
          setLoading(false);
        });
    } else {
      // Blank initially per PRD §8.2: renders nothing at all before the first search
      setHasSearched(false);
      setResults([]);
      setHasMore(false);
      setError(null);
    }
  }, [qParam, modeParam, completeGuideStep]);

  // Load More handler (12 items per batch)
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextOffset = results.length;
    const q = qParam || '';

    searchDentists({ q, mode: modeParam, offset: nextOffset, limit: 12 })
      .then((res) => {
        setResults((prev) => [...prev, ...res.items]);
        setHasMore(res.hasMore);
        setLoadingMore(false);
        completeGuideStep('load-more');
      })
      .catch((err) => {
        setError(err.message || 'Failed to load more dentists.');
        setLoadingMore(false);
      });
  };

  // State retention on navigating to profile per PRD §8.2
  const handleNavigateToProfile = () => {
    sessionStorage.setItem(
      'dnn_search_state',
      JSON.stringify({
        q: qParam || '',
        mode: modeParam,
        loadedCount: results.length,
        scrollY: window.scrollY,
      })
    );
  };

  return (
    <div className="bg-bg min-h-screen pb-24">
      {/* Header section outside results container per PRD §8.2 */}
      <section className="pt-10 pb-8 border-b border-line bg-surface/40">
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-brass">
                DIRECTORY
              </span>
              {modeParam === 'distinguished' && (
                <span className="px-2 py-0.5 rounded-xs bg-brass-t border border-brass/40 text-[11px] font-semibold text-brass-ink uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3 text-brass" />
                  Distinguished Tier
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-ink leading-tight">
              {modeParam === 'distinguished' ? 'Distinguished Dentists' : 'Find a Dentist'}
            </h1>

            <p className="font-sans text-sm text-ink-2 mt-2 leading-relaxed">
              Search by name, city, postal code, country or specialty.
            </p>
          </div>
        </div>
      </section>

      {/* Main Results Container per PRD §8.2: blank until search! */}
      <main className="max-w-content mx-auto px-5 sm:px-8 pt-8">
        {!hasSearched ? (
          // BEFORE FIRST SEARCH: Renders nothing at all per PRD §8.2!
          <div className="py-16 text-center text-ink-3">
            {/* Kept quiet and empty as explicitly required by the client spec */}
          </div>
        ) : (
          <section
            id="results"
            aria-live="polite"
            aria-busy={loading}
            className="space-y-6"
          >
            {/* Index Telemetry Chip per PRD §1.1 & §8.2 (No result count!) */}
            {telemetryEnabled && telemetry && !loading && (
              <div className="flex items-center justify-between text-xs text-ink-3 pb-1 border-b border-line/40">
                <div className="inline-flex items-center gap-2 font-mono text-[11.5px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>
                    {telemetry.queryTimeMs.toFixed(2)}s · {telemetry.matchedIndex}
                  </span>
                </div>
                <span className="text-[11px] font-sans text-ink-3">
                  Sort: Distinguished first, Name A→Z
                </span>
              </div>
            )}

            {/* Loading State: 6 Skeleton cards */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <DentistCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="p-6 rounded-md bg-warning-t/50 border border-warning/40 text-center max-w-lg mx-auto space-y-3">
                <p className="font-serif text-lg text-ink font-medium">
                  We couldn’t complete that search.
                </p>
                <p className="text-xs text-ink-2">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary text-bg font-sans font-semibold text-xs hover:bg-primary-h"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Search</span>
                </button>
              </div>
            )}

            {/* Empty State: Exact Copy Required per PRD §1.9 & §8.2 */}
            {!loading && !error && results.length === 0 && (
              <div className="py-20 text-center max-w-[44ch] mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center mx-auto text-ink-3">
                  <SearchX className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-ink font-normal leading-snug">
                  No dentists found matching your search. Please check your spelling or try searching by city or ZIP code
                </h2>
              </div>
            )}

            {/* Results Grid (NO "Found X results" count anywhere per PRD §1.9 & §8.2) */}
            {!loading && !error && results.length > 0 && (
              <>
                <div
                  role="list"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {results.map((dentist) => (
                    <div key={dentist.unique_id} role="listitem">
                      <DentistCard
                        dentist={dentist}
                        onNavigateToProfile={handleNavigateToProfile}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button (Disappears when no more items exist!) */}
                {hasMore && (
                  <div className="pt-10 pb-6 flex justify-center">
                    <button
                      ref={loadMoreBtnRef}
                      type="button"
                      disabled={loadingMore}
                      onClick={handleLoadMore}
                      className="w-full sm:w-auto min-w-[240px] h-12 px-8 rounded-sm border border-line-2 bg-elevated hover:bg-surface text-ink font-sans font-semibold text-sm shadow-sm transition-all hover:border-primary disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span>Loading dentists...</span>
                        </>
                      ) : (
                        <span>Load more dentists</span>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
