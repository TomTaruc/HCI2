/**
 * ScreenContainer — page-level layout wrapper
 * Provides consistent padding, scrollability, and bottom-nav spacing
 */

import React from 'react';

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  noBottomPad?: boolean;
  scrollable?: boolean;
  background?: string;
}

export function ScreenContainer({
  children,
  className = '',
  noPadding = false,
  noBottomPad = false,
  scrollable = true,
  background = 'bg-bg',
}: ScreenContainerProps) {
  return (
    <main
      className={[
        'flex-1 flex flex-col',
        background,
        scrollable ? 'overflow-y-auto' : 'overflow-hidden',
        noPadding ? '' : 'px-4',
        noBottomPad ? '' : 'pb-24', // space for fixed bottom nav
        className,
      ].join(' ')}
    >
      {children}
    </main>
  );
}

// ----------------------------------------------------------------
// Section — named subsection within a screen
// ----------------------------------------------------------------

interface SectionProps {
  title?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, rightAction, children, className = '' }: SectionProps) {
  return (
    <section className={`flex flex-col gap-3 ${className}`}>
      {(title || rightAction) && (
        <div className="flex items-center justify-between">
          {title && (
            <h2 className="text-h2 font-semibold text-text-primary">{title}</h2>
          )}
          {rightAction}
        </div>
      )}
      {children}
    </section>
  );
}

// ----------------------------------------------------------------
// Divider
// ----------------------------------------------------------------

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-t border-border ${className}`} aria-hidden="true" />;
}
