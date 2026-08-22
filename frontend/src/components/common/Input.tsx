import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8E8E93] dark:text-[#98989D]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg border bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#8E8E93] dark:placeholder:text-[#98989D] transition-colors focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-black/[0.08] dark:border-white/[0.10] hover:border-black/[0.15] dark:hover:border-white/[0.20]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E8E93]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-[11px] text-[#FF3B30] dark:text-[#FF453A] font-medium flex items-center gap-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-0.5 text-[11px] text-[#6E6E73] dark:text-[#98989D]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
