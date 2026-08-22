import React from 'react';
import { Clock, DollarSign, MapPin, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { TripActivity } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export interface ActivityItemProps {
  activity: TripActivity;
  onDelete?: (id: string) => void;
  onToggleComplete?: (activity: TripActivity) => void;
  readOnly?: boolean;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onDelete,
  onToggleComplete,
  readOnly = false,
}) => {
  return (
    <div
      className={`group relative flex items-start justify-between p-4 rounded-2xl border transition-all duration-200 ${
        activity.isCompleted
          ? 'bg-slate-50 border-slate-200/60 opacity-75'
          : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle complete button */}
        {!readOnly && onToggleComplete ? (
          <button
            type="button"
            onClick={() => onToggleComplete(activity)}
            className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors"
            title={activity.isCompleted ? 'Mark incomplete' : 'Mark completed'}
          >
            {activity.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        ) : (
          <div className="mt-1 h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
        )}

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-bold truncate ${
                activity.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
              }`}
            >
              {activity.name}
            </h4>
            <Badge variant="primary" size="sm">
              {activity.category}
            </Badge>
          </div>

          {/* Time & Location */}
          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            {activity.startTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {activity.startTime}
                  {activity.endTime ? ` - ${activity.endTime}` : ''}
                </span>
              </span>
            )}
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[200px]">{activity.location}</span>
              </span>
            )}
          </div>

          {/* Notes */}
          {activity.notes && (
            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 italic">
              {activity.notes}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Cost & Delete */}
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        {activity.cost > 0 ? (
          <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
            {formatCurrency(activity.cost)}
          </span>
        ) : (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
            Free
          </span>
        )}

        {!readOnly && onDelete && (
          <button
            onClick={() => onDelete(activity.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Delete activity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
