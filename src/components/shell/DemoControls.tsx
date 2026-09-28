import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  X,
  Zap,
  RotateCcw,
  Wifi,
  ShieldAlert,
  Clock,
  Eye,
  Activity,
  Layers,
  FileCode2,
} from 'lucide-react';
import { useDemoStore } from '../../store/demoStore';
import { useDentistStore } from '../../store/dentistStore';

export function DemoControls() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    slowNetwork,
    setSlowNetwork,
    serverErrorNext,
    setServerErrorNext,
    triggerScraperBurst,
    clearScraperThrottle,
    scraperThrottledUntil,
    expiredNonce,
    setExpiredNonce,
    importTimeoutAt117,
    setImportTimeoutAt117,
    showDoctorOfMonth,
    setShowDoctorOfMonth,
    telemetryEnabled,
    setTelemetryEnabled,
    reducedMotion,
    setReducedMotion,
    importPace,
    setImportPace,
    resetDemoSettings,
  } = useDemoStore();

  const resetAllData = useDentistStore((s) => s.resetToDefault);

  const handleFullReset = () => {
    resetDemoSettings();
    resetAllData();
    clearScraperThrottle();
  };

  return (
    <div className="fixed bottom-4 left-4 z-demo font-sans">
      {/* Discreet 36px Demo Chip */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-9 px-3 rounded-pill bg-ink-bg text-bg border border-brass/50 text-xs font-semibold flex items-center gap-1.5 shadow-sh-2 hover:bg-ink hover:scale-105 active:scale-95 transition-all"
          title="Open interactive reviewer demo controls"
        >
          <Sliders className="w-3.5 h-3.5 text-brass" />
          <span>Demo Controls</span>
        </button>
      )}

      {/* Popover Panel */}
      {isOpen && (
        <div className="w-[330px] sm:w-[360px] max-h-[85vh] overflow-y-auto bg-elevated rounded-lg border border-line-2 shadow-sh-3 p-5 text-ink text-xs animate-scaleIn">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xs bg-ink-bg flex items-center justify-center text-brass">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-sm text-ink">Demo Controls</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-ink-3 hover:text-ink rounded-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {/* Section 1: Network & Failure Simulations */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-ink-3 block mb-2">
                Simulate Network & Failure Modes
              </span>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-sm border border-line hover:bg-surface cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-primary" />
                    <span>Slow Network (1.6s latency)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={slowNetwork}
                    onChange={(e) => setSlowNetwork(e.target.checked)}
                    className="accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-sm border border-line hover:bg-surface cursor-pointer">
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-error" />
                    <span>Next Search Server Error (500)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={serverErrorNext}
                    onChange={(e) => setServerErrorNext(e.target.checked)}
                    className="accent-primary"
                  />
                </label>

                <div className="flex items-center justify-between p-2 rounded-sm border border-line">
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-warning" />
                    <span>Scraper Burst (429 Throttle)</span>
                  </span>
                  <button
                    type="button"
                    onClick={triggerScraperBurst}
                    className="px-2 py-0.5 rounded-xs bg-warning text-bg font-semibold text-[11px] hover:opacity-90"
                  >
                    Fire 12 Reqs
                  </button>
                </div>

                <label className="flex items-center justify-between p-2 rounded-sm border border-line hover:bg-surface cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-ink-3" />
                    <span>Expired Nonce (403 Timeout)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={expiredNonce}
                    onChange={(e) => setExpiredNonce(e.target.checked)}
                    className="accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-sm border border-line hover:bg-surface cursor-pointer">
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-primary" />
                    <span>Import Timeout at Batch 117</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={importTimeoutAt117}
                    onChange={(e) => setImportTimeoutAt117(e.target.checked)}
                    className="accent-primary"
                  />
                </label>
              </div>
            </div>

            {/* Section 2: UX Toggles */}
            <div className="pt-2 border-t border-line">
              <span className="text-[10px] uppercase font-bold tracking-wider text-ink-3 block mb-2">
                Editorial & UI Toggles
              </span>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-sm border border-line hover:bg-surface cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-brass" />
                    <span>Show "Doctor of the Month" (Before)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showDoctorOfMonth}
                    onChange={(e) => setShowDoctorOfMonth(e.target.checked)}
                    className="accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-sm border border-line hover:bg-surface cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    <span>Index Telemetry Chips</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={telemetryEnabled}
                    onChange={(e) => setTelemetryEnabled(e.target.checked)}
                    className="accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-sm border border-line hover:bg-surface cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-ink-3" />
                    <span>Reduced Motion Preview</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => {
                      setReducedMotion(e.target.checked);
                      document.documentElement.classList.toggle('reduced-motion-override', e.target.checked);
                    }}
                    className="accent-primary"
                  />
                </label>

                <div className="flex items-center justify-between p-2 rounded-sm border border-line">
                  <span className="text-ink-2">Importer Pace</span>
                  <div className="inline-flex rounded-xs bg-bg p-0.5 border border-line">
                    <button
                      type="button"
                      onClick={() => setImportPace('fast')}
                      className={`px-2 py-0.5 rounded-xs text-[11px] font-semibold ${
                        importPace === 'fast' ? 'bg-primary text-bg' : 'text-ink-2'
                      }`}
                    >
                      Fast (~14s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPace('realistic')}
                      className={`px-2 py-0.5 rounded-xs text-[11px] font-semibold ${
                        importPace === 'realistic' ? 'bg-primary text-bg' : 'text-ink-2'
                      }`}
                    >
                      Realistic
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Links */}
            <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleFullReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-line-2 hover:bg-surface text-ink-2 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              <Link
                to="/how-it-works"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-primary-t text-primary font-semibold hover:bg-primary-t/70"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>How It Works</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
