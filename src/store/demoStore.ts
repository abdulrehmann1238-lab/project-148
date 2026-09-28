import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DemoState {
  slowNetwork: boolean;
  serverErrorNext: boolean;
  scraperThrottledUntil: number | null;
  expiredNonce: boolean;
  importTimeoutAt117: boolean;
  showDoctorOfMonth: boolean; // false = After (removed), true = Before (legacy block)
  telemetryEnabled: boolean;
  reducedMotion: boolean;
  importPace: 'fast' | 'realistic';
  guideProgress: Record<string, boolean>;
  guideDismissed: boolean;
  seenLoader: boolean;

  setSlowNetwork: (val: boolean) => void;
  setServerErrorNext: (val: boolean) => void;
  triggerScraperBurst: () => void;
  clearScraperThrottle: () => void;
  setExpiredNonce: (val: boolean) => void;
  setImportTimeoutAt117: (val: boolean) => void;
  setShowDoctorOfMonth: (val: boolean) => void;
  setTelemetryEnabled: (val: boolean) => void;
  setReducedMotion: (val: boolean) => void;
  setImportPace: (pace: 'fast' | 'realistic') => void;
  completeGuideStep: (stepId: string) => void;
  dismissGuide: () => void;
  setSeenLoader: (val: boolean) => void;
  resetDemoSettings: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      slowNetwork: false,
      serverErrorNext: false,
      scraperThrottledUntil: null,
      expiredNonce: false,
      importTimeoutAt117: true, // Default ON per PRD §7.4
      showDoctorOfMonth: false, // Default removed (After) per PRD §8.1
      telemetryEnabled: true,
      reducedMotion: false,
      importPace: 'fast',
      guideProgress: {},
      guideDismissed: false,
      seenLoader: false,

      setSlowNetwork: (val) => set({ slowNetwork: val }),
      setServerErrorNext: (val) => set({ serverErrorNext: val }),
      triggerScraperBurst: () => {
        const until = Date.now() + 8500; // 8.5s cooldown
        set({ scraperThrottledUntil: until });
      },
      clearScraperThrottle: () => set({ scraperThrottledUntil: null }),
      setExpiredNonce: (val) => set({ expiredNonce: val }),
      setImportTimeoutAt117: (val) => set({ importTimeoutAt117: val }),
      setShowDoctorOfMonth: (val) => set({ showDoctorOfMonth: val }),
      setTelemetryEnabled: (val) => set({ telemetryEnabled: val }),
      setReducedMotion: (val) => set({ reducedMotion: val }),
      setImportPace: (pace) => set({ importPace: pace }),
      completeGuideStep: (stepId) =>
        set((state) => ({
          guideProgress: { ...state.guideProgress, [stepId]: true },
        })),
      dismissGuide: () => set({ guideDismissed: true }),
      setSeenLoader: (val) => set({ seenLoader: val }),
      resetDemoSettings: () =>
        set({
          slowNetwork: false,
          serverErrorNext: false,
          scraperThrottledUntil: null,
          expiredNonce: false,
          importTimeoutAt117: true,
          showDoctorOfMonth: false,
          telemetryEnabled: true,
          reducedMotion: false,
          importPace: 'fast',
          guideProgress: {},
        }),
    }),
    {
      name: 'dnn_demo_settings_v1',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
