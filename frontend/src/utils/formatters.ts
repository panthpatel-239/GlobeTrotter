import { CURRENCY_SYMBOLS } from '../constants';

export const formatCurrency = (amount: number | undefined | null, currency = 'USD'): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatDateRange = (start?: string, end?: string): string => {
  if (!start) return '';
  if (!end) return formatDate(start);
  
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate.getFullYear() === endDate.getFullYear()) {
      const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startMonth} - ${endFormatted}`;
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  } catch {
    return `${start} - ${end}`;
  }
};

export const calculateDaysBetween = (start?: string, end?: string): number => {
  if (!start || !end) return 1;
  try {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start and end
    return diffDays > 0 ? diffDays : 1;
  } catch {
    return 1;
  }
};

export const formatDuration = (minutes?: number): string => {
  if (!minutes) return '1 hr';
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${hours} hr ${remainingMins} min`;
};
