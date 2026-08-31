/**
 * Card — eGovPH UI primitive
 * 16px radius, 1px border, soft shadow — no heavy glassmorphism
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  as?: 'div' | 'button' | 'article' | 'section';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  padding = 'md',
  hoverable = false,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <Tag
      className={[
        'bg-white rounded-lg border border-border shadow-card',
        paddingClasses[padding],
        hoverable
          ? 'cursor-pointer hover:shadow-card-hover hover:border-primary/20 transition-all duration-150 active:scale-[0.99]'
          : '',
        className,
      ].join(' ')}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </Tag>
  );
}

// ----------------------------------------------------------------
// Loading Skeleton
// ----------------------------------------------------------------

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`}
          />
        ))}
      </div>
    );
  }
  return <div className={`skeleton ${className}`} />;
}

// ----------------------------------------------------------------
// Card Skeleton (loading state for card lists)
// ----------------------------------------------------------------

export function CardSkeleton() {
  return (
    <Card>
      <div className="flex gap-3 items-start">
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------
// Empty State
// ----------------------------------------------------------------

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mb-1">
          {icon}
        </div>
      )}
      <p className="text-h2 font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="text-body text-text-secondary max-w-xs">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// ----------------------------------------------------------------
// Error State (with retry)
// ----------------------------------------------------------------

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Couldn't load this content. Please check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-1">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-h2 font-semibold text-text-primary">{title}</p>
      <p className="text-body text-text-secondary max-w-xs">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 h-10 px-6 rounded-md bg-primary text-white text-button font-semibold hover:bg-primary-dark transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Badge / Chip
// ----------------------------------------------------------------

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'new';

const badgeVariants: Record<BadgeVariant, string> = {
  primary: 'bg-primary-light text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  neutral: 'bg-gray-100 text-gray-600',
  new: 'bg-secondary text-white',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
      badgeVariants[variant],
      className,
    ].join(' ')}>
      {children}
    </span>
  );
}
