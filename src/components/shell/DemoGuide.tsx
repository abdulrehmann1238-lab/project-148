import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, X, ChevronUp, ChevronDown, Compass } from 'lucide-react';
import { useDemoStore } from '../../store/demoStore';

export function DemoGuide() {
  const { guideProgress, guideDismissed, dismissGuide, completeGuideStep } = useDemoStore();
  const [collapsed, setCollapsed] = useState(false);

  if (guideDismissed) return null;

  const steps = [
    {
      id: 'search-emily',
      label: '1. Search "Emily Chen"',
      link: '/find-a-dentist?q=Emily%20Chen&mode=all',
      action: () => completeGuideStep('search-emily'),
    },
    {
      id: 'load-more',
      label: '2. Load more results',
      link: '/find-a-dentist?q=Austin&mode=all',
      action: () => completeGuideStep('load-more'),
    },
    {
      id: 'open-profile',
      label: '3. Open Distinguished profile & cover',
      link: '/dentist/dr-emily-chen-tx',
      action: () => completeGuideStep('open-profile'),
    },
    {
      id: 'back-retention',
      label: '4. Return back — view retained state',
      link: '/find-a-dentist',
      action: () => completeGuideStep('back-retention'),
    },
    {
      id: 'admin-edit',
      label: '5. WP-Admin: Edit & set Inactive',
      link: '/wp-admin/records',
      action: () => completeGuideStep('admin-edit'),
    },
    {
      id: 'run-importer',
      label: '6. Run batch importer with auto-retry',
      link: '/wp-admin/import',
      action: () => completeGuideStep('run-importer'),
    },
  ];

  const completedCount = steps.filter((s) => guideProgress[s.id]).length;
  const allCompleted = completedCount === steps.length;

  return (
    <div className="fixed bottom-4 right-4 z-demo font-sans">
      {/* Collapsed Pill on Mobile or after toggle */}
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="h-9 px-3.5 rounded-pill bg-elevated border border-line-2 shadow-sh-2 text-ink text-xs font-semibold flex items-center gap-2 hover:bg-surface"
        >
          <Compass className="w-3.5 h-3.5 text-primary" />
          <span>Demo Guide ({completedCount}/6)</span>
          <ChevronUp className="w-3.5 h-3.5 text-ink-3" />
        </button>
      ) : (
        <div className="w-[300px] sm:w-[320px] bg-elevated rounded-lg border border-line-2 shadow-sh-3 p-4 text-ink text-xs animate-scaleIn">
          <div className="flex items-center justify-between pb-2.5 border-b border-line">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <span className="font-semibold text-xs uppercase tracking-wider text-ink">
                Reviewer Guide ({completedCount}/6)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="p-1 text-ink-3 hover:text-ink rounded-xs"
                title="Collapse guide"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={dismissGuide}
                className="p-1 text-ink-3 hover:text-ink rounded-xs"
                title="Dismiss guide permanently"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {steps.map((step) => {
              const isDone = !!guideProgress[step.id];
              return (
                <Link
                  key={step.id}
                  to={step.link}
                  onClick={step.action}
                  className={`flex items-start gap-2.5 p-2 rounded-sm border transition-colors ${
                    isDone
                      ? 'border-success/30 bg-success-t/40 text-ink-2'
                      : 'border-line hover:border-primary hover:bg-surface text-ink'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-ink-3 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className={isDone ? 'line-through text-ink-3' : 'font-medium'}>
                      {step.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {allCompleted && (
            <div className="mt-3 p-2 rounded-sm bg-brass-t border border-brass/40 text-[11px] text-brass-ink font-medium text-center">
              ★ All demo milestones explored!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
