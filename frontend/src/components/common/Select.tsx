import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none rounded-lg border bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-black/[0.08] dark:border-white/[0.10] hover:border-black/[0.15] dark:hover:border-white/[0.20]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8E8E93]">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="mt-1 text-[11px] text-[#FF3B30] dark:text-[#FF453A] font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-0.5 text-[11px] text-[#6E6E73] dark:text-[#98989D]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
