import React from 'react';
import { wpautop } from '../../lib/wpautop';

interface ArticleProps {
  content: string;
  className?: string;
}

export function Article({ content, className = '' }: ArticleProps) {
  const paragraphs = wpautop(content);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={`editorial-article max-w-article mx-auto ${className}`}>
      {paragraphs.map((para, idx) => {
        // Split internal lines for single <br> breaks
        const lines = para.split('\n');

        return (
          <p
            key={idx}
            className={
              idx === 0
                ? 'font-serif text-[1.35rem] leading-[1.55] text-ink -tracking-[0.005em] mb-7'
                : 'font-serif text-[1.1875rem] leading-[1.75] text-ink mb-6'
            }
          >
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {line}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
