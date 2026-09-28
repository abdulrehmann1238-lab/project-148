import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';
import { ToothArcMark } from '../components/ui/Icons';

export function NotFound() {
  return (
    <div className="bg-bg min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-lg bg-surface border border-line shadow-sh-2 space-y-5">
        <div className="w-12 h-12 rounded-sm bg-ink-bg flex items-center justify-center text-brass mx-auto shadow-sm">
          <ToothArcMark className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-brass">
            ERROR 404
          </span>
          <h1 className="font-serif text-3xl text-ink font-medium">
            This page couldn’t be found.
          </h1>
          <p className="text-xs text-ink-2 leading-relaxed">
            The directory entry, profile slug, or publication article you requested is unavailable or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/find-a-dentist"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-bg font-sans font-semibold text-xs hover:bg-primary-h transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to the directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
