/**
 * Input — eGovPH UI primitive
 * Supports: text, email, tel, password, number
 * Always paired with a label and error message for accessibility
 */

import React, { forwardRef, useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-') ?? generatedId}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const isPassword = type === 'password';
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label text-text-secondary uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-text-secondary pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={!!error}
            aria-describedby={[error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined}
            className={[
              'w-full h-12 px-4 bg-white',
              'text-body text-text-primary placeholder-text-secondary',
              'border rounded-md',
              'transition-colors duration-150',
              'outline-none',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-border',
              leftIcon ? 'pl-11' : '',
              rightIcon || isPassword ? 'pr-11' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-4 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {rightIcon && !isPassword && (
            <span className="absolute right-4 text-text-secondary" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-body-sm text-error flex items-start gap-1" role="alert">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-body-sm text-text-secondary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ----------------------------------------------------------------
// OTP Input — 6 individual boxes
// ----------------------------------------------------------------

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
}

export function OTPInput({ length = 6, value, onChange, error, autoFocus = false }: OTPInputProps) {
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newVal = value.split('');
    newVal[index] = char;
    const joined = newVal.join('').slice(0, length);
    onChange(joined);
    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newVal = value.split('');
      newVal[index - 1] = '';
      onChange(newVal.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputs.current[focusIdx]?.focus();
    e.preventDefault();
  };

  return (
    <div>
      <div className="flex gap-2 justify-center" role="group" aria-label="One-time password input">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ''}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            autoFocus={autoFocus && i === 0}
            aria-label={`OTP digit ${i + 1}`}
            className={[
              'w-12 h-14 text-center text-h2 font-semibold',
              'border rounded-md bg-white text-text-primary',
              'transition-colors duration-150 outline-none',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              error ? 'border-error' : 'border-border',
            ].join(' ')}
          />
        ))}
      </div>
      {error && (
        <p className="text-body-sm text-error text-center mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// MPIN Input — 6 dots (masked)
// ----------------------------------------------------------------

interface MPINInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  error?: string;
}

export function MPINInput({ value, onChange, maxLength = 6, error }: MPINInputProps) {
  const handleDigit = (digit: string) => {
    if (value.length < maxLength) {
      onChange(value + digit);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Dot indicators */}
      <div className="flex gap-4" role="presentation" aria-label={`${value.length} of ${maxLength} digits entered`}>
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={[
              'w-4 h-4 rounded-full transition-all duration-150',
              i < value.length ? 'bg-primary scale-110' : 'bg-border',
            ].join(' ')}
          />
        ))}
      </div>

      {error && (
        <p className="text-body-sm text-error" role="alert">{error}</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs" role="group" aria-label="MPIN keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
          <button
            key={d}
            type="button"
            onClick={() => handleDigit(d)}
            className="h-14 rounded-lg bg-white border border-border text-h2 font-semibold text-text-primary hover:bg-primary-light hover:border-primary active:scale-95 transition-all duration-100"
            aria-label={d}
          >
            {d}
          </button>
        ))}
        <div /> {/* empty cell */}
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-14 rounded-lg bg-white border border-border text-h2 font-semibold text-text-primary hover:bg-primary-light hover:border-primary active:scale-95 transition-all duration-100"
          aria-label="0"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          disabled={value.length === 0}
          className="h-14 rounded-lg bg-white border border-border text-text-secondary hover:bg-error/10 hover:border-error active:scale-95 transition-all duration-100 disabled:opacity-40 flex items-center justify-center"
          aria-label="Delete last digit"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
