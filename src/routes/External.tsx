import React from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, X } from 'lucide-react';
import { ToothArcMark } from '../components/ui/Icons';

export function External() {
  const { host } = useParams<{ host: string }>();

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center p-6 text-center selection:bg-primary-t">
      <div className="max-w-md w-full p-8 rounded-lg bg-surface border border-line shadow-sh-2 space-y-5">
        <div className="w-12 h-12 rounded-sm bg-ink-bg flex items-center justify-center text-brass mx-auto shadow-sm">
          <ToothArcMark className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-brass">
            EXTERNAL PRACTICE DESTINATION
          </span>
          <h1 className="font-serif text-2xl text-ink font-medium">
            Demo Link Placeholder
          </h1>
          <p className="text-xs text-ink-2 leading-relaxed">
            In production, this link opens the live external website for{' '}
            <strong className="font-mono text-ink text-sm block mt-1">{host || 'the external practice'}</strong>{' '}
            with attributes <code className="font-mono text-[11px] bg-elevated px-1 py-0.5 rounded border border-line">target="_blank" rel="noopener noreferrer"</code>.
          </p>
        </div>

        <div className="pt-3">
          <button
            type="button"
            onClick={() => window.close()}
            className="w-full py-2.5 rounded-sm bg-primary text-bg font-sans font-semibold text-xs hover:bg-primary-h transition-colors flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close this tab</span>
          </button>
        </div>
      </div>
    </div>
  );
}
