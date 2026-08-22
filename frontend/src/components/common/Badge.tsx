import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    primary:
      'bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] border-[#007AFF]/20',
    secondary:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    success:
      'bg-emerald-500/10 text-[#34C759] dark:text-[#30D158] border-[#34C759]/20',
    warning:
      'bg-amber-500/10 text-[#FF9F0A] border-[#FF9F0A]/20',
    danger:
      'bg-red-500/10 text-[#FF3B30] dark:text-[#FF453A] border-[#FF3B30]/20',
    info:
      'bg-sky-500/10 text-[#5AC8FA] dark:text-[#64D2FF] border-[#5AC8FA]/20',
    neutral:
      'bg-black/[0.04] dark:bg-white/[0.06] text-[#6E6E73] dark:text-[#98989D] border-black/[0.08] dark:border-white/[0.10]',
  };

  const dotColors = {
    primary: 'bg-[#007AFF] dark:bg-[#0A84FF]',
    secondary: 'bg-purple-500',
    success: 'bg-[#34C759] dark:bg-[#30D158]',
    warning: 'bg-[#FF9F0A]',
    danger: 'bg-[#FF3B30] dark:bg-[#FF453A]',
    info: 'bg-[#5AC8FA] dark:bg-[#64D2FF]',
    neutral: 'bg-[#8E8E93]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
