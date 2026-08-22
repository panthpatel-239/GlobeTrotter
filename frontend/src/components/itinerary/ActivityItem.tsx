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
      className={`group relative flex items-start justify-between p-4 rounded-xl border transition-all duration-200 ${
        activity.isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-75'
          : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 shadow-2xs hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle complete button */}
        {!readOnly && onToggleComplete ? (
          <button
            type="button"
            onClick={() => onToggleComplete(activity)}
            className="mt-0.5 text-slate-300 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title={activity.isCompleted ? 'Mark incomplete' : 'Mark completed'}
          >
            {activity.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        ) : (
          <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
        )}

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-xs sm:text-sm font-bold truncate ${
                activity.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {activity.name}
            </h4>
            <Badge variant="primary" size="sm">
              {activity.category}
            </Badge>
          </div>

          {/* Time & Location */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-medium">
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
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg mt-1 italic">
              {activity.notes}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Cost & Delete */}
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        {activity.cost > 0 ? (
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
            {formatCurrency(activity.cost)}
          </span>
        ) : (
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/40 px-2 py-0.5 rounded-lg">
            Free
          </span>
        )}

        {!readOnly && onDelete && (
          <button
            onClick={() => onDelete(activity.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
            title="Delete activity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
