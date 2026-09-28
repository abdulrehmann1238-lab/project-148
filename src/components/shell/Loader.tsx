import React, { useState, useEffect } from 'react';
import { useDemoStore } from '../../store/demoStore';

export function Loader({ onComplete }: { onComplete: () => void }) {
  const { seenLoader, setSeenLoader, reducedMotion } = useDemoStore();
  const [stage, setStage] = useState<'drawing' | 'text' | 'progress' | 'exiting' | 'done'>('drawing');
  const [progressWidth, setProgressWidth] = useState(0);

  // If already seen in this session, skip quickly
  useEffect(() => {
    const sessionSeen = sessionStorage.getItem('dnn_seen');
    if (sessionSeen || seenLoader) {
      onComplete();
      setStage('done');
      return;
    }

    if (reducedMotion) {
      setTimeout(() => {
        sessionStorage.setItem('dnn_seen', '1');
        setSeenLoader(true);
        onComplete();
        setStage('done');
      }, 200);
      return;
    }

    // Standard sequence per PRD §6:
    const t1 = setTimeout(() => setStage('text'), 350);
    const t2 = setTimeout(() => {
      setStage('progress');
      setProgressWidth(100);
    }, 450);
    const t3 = setTimeout(() => setStage('exiting'), 1150);
    const t4 = setTimeout(() => {
      sessionStorage.setItem('dnn_seen', '1');
      setSeenLoader(true);
      onComplete();
      setStage('done');
    }, 1550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [seenLoader, setSeenLoader, reducedMotion, onComplete]);

  // Click or keypress skips loader instantly per PRD §6
  const handleSkip = () => {
    sessionStorage.setItem('dnn_seen', '1');
    setSeenLoader(true);
    onComplete();
    setStage('done');
  };

  if (stage === 'done') return null;

  return (
    <div
      role="status"
      aria-label="Loading Dental News Network Directory"
      onClick={handleSkip}
      onKeyDown={handleSkip}
      tabIndex={0}
      className={`fixed inset-0 z-loader bg-ink-bg flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        stage === 'exiting' ? '-translate-y-full opacity-0' : 'opacity-100'
      }`}
      style={{
        clipPath: stage === 'exiting' ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
      }}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Drawing Tooth Arc Mark */}
        <div className="w-12 h-12 mb-4">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path
              d="M10 9C10 6.5 13 6 16 7.5C19 6 22 6.5 22 9C22 13 21 16 19 23C18 26.5 16.5 26.5 16 23.5C15.5 26.5 14 26.5 13 23C11 16 10 13 10 9Z"
              stroke="#A8834A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset={stage === 'drawing' ? '0' : '0'}
              className="transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <h1
          className={`font-serif text-2xl sm:text-3xl text-bg font-normal tracking-tight transition-all duration-500 ${
            stage !== 'drawing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Dental News Network
        </h1>

        <span
          className={`text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-brass mt-1.5 transition-all duration-500 ${
            stage !== 'drawing' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Directory & Distinguished Profiles
        </span>

        {/* 1px Brass Progress Hairline */}
        <div className="w-48 h-[1px] bg-white/10 mt-6 overflow-hidden">
          <div
            className="h-full bg-brass transition-all duration-700 ease-out origin-left"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <span className="text-[11px] text-bg/40 mt-3 font-sans">
          Click or press any key to skip
        </span>
      </div>
    </div>
  );
}
