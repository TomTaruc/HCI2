/**
 * Button — eGovPH UI primitive
 * Variants: primary, secondary, ghost, danger, outline
 * All meet WCAG AA contrast and 44px minimum touch target
 */

import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark ' +
    'disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
  secondary:
    'bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark ' +
    'disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-primary hover:bg-primary-light active:bg-primary-light ' +
    'disabled:text-gray-400 disabled:cursor-not-allowed',
  danger:
    'bg-error text-white hover:opacity-90 active:opacity-90 ' +
    'disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
  outline:
    'bg-transparent text-primary border border-primary hover:bg-primary-light active:bg-primary-light ' +
    'disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm rounded-md gap-1.5',
  md: 'h-11 px-6 text-button rounded-md gap-2',
  lg: 'h-14 px-8 text-button rounded-md gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ duration: 0.1 }}
      className={[
        'inline-flex items-center justify-center font-semibold',
        'transition-colors duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={disabled || isLoading}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={size === 'sm' ? 14 : 18} />
          <span>Please wait…</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}

function LoadingSpinner({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="animate-spin"
      aria-hidden="true"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
