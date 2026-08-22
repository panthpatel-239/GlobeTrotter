import React from 'react';
import { TripStatus } from '../../types';
import { Badge } from '../common/Badge';

export interface TripStatusBadgeProps {
  status: TripStatus;
}

export const TripStatusBadge: React.FC<TripStatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = (st: TripStatus) => {
    switch (st) {
      case 'ongoing':
        return { variant: 'success' as const, label: 'Ongoing', dot: true };
      case 'planned':
        return { variant: 'info' as const, label: 'Planned', dot: true };
      case 'completed':
        return { variant: 'neutral' as const, label: 'Completed', dot: false };
      case 'draft':
        return { variant: 'warning' as const, label: 'Draft', dot: true };
      default:
        return { variant: 'neutral' as const, label: st, dot: false };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <Badge variant={config.variant} dot={config.dot} size="sm">
      {config.label}
    </Badge>
  );
};
