import React, { useState } from 'react';
import { MapPin, Calendar, Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Navigation } from 'lucide-react';
import { TripStop, TripActivity } from '../../types';
import { formatDateRange, calculateDaysBetween } from '../../utils/formatters';
import { ActivityItem } from './ActivityItem';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface StopCardProps {
  stop: TripStop;
  stopIndex: number;
  onAddActivity: (stopId: string, defaultDay?: number) => void;
  onDeleteActivity: (activityId: string) => void;
  onDeleteStop: (stopId: string) => void;
  onToggleActivityComplete?: (activity: TripActivity) => void;
  readOnly?: boolean;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  stopIndex,
  onAddActivity,
  onDeleteActivity,
  onDeleteStop,
  onToggleActivityComplete,
  readOnly = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const durationDays = calculateDaysBetween(stop.arrivalDate, stop.departureDate);
  const activities = stop.activities || [];

  // Group activities by dayNumber
  const dayBuckets: Record<number, TripActivity[]> = {};
  for (let d = 1; d <= Math.max(durationDays, 1); d++) {
    dayBuckets[d] = [];
  }
  activities.forEach((act) => {
    const day = act.dayNumber || 1;
    if (!dayBuckets[day]) dayBuckets[day] = [];
    dayBuckets[day].push(act);
  });

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden mb-6 transition-all duration-300">
        {/* Stop Header Banner */}
        <div className="relative p-5 sm:p-6 bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-base shadow-sm shadow-blue-500/25 flex-shrink-0">
              #{stopIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight text-white">{stop.cityName}</h3>
                <span className="text-xs text-slate-300 font-semibold px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10">
                  {stop.country}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {formatDateRange(stop.arrivalDate, stop.departureDate)}
                </span>
                <span className="font-bold text-teal-400">
                  ({durationDays} {durationDays === 1 ? 'Day' : 'Days'})
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {!readOnly && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => onAddActivity(stop.id, 1)}
                  className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-slate-900 text-xs font-semibold rounded-xl"
                >
                  Add Activity
                </Button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Remove Stop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Stop notes banner if any */}
        {stop.notes && (
          <div className="px-6 py-3 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span><strong className="font-semibold">Notes:</strong> {stop.notes}</span>
          </div>
        )}

        {/* Days & Activities List */}
        {isExpanded && (
          <div className="p-5 sm:p-6 space-y-6">
            {Object.keys(dayBuckets).map((dayKey) => {
              const dayNum = Number(dayKey);
              const dayActivities = dayBuckets[dayNum];

              return (
                <div key={dayNum} className="space-y-3">
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 text-xs font-extrabold border border-blue-100 dark:border-blue-900/40">
                        D{dayNum}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Day {dayNum} in {stop.cityName}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        ({dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'})
                      </span>
                    </div>

                    {!readOnly && (
                      <button
                        onClick={() => onAddActivity(stop.id, dayNum)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Day {dayNum}</span>
                      </button>
                    )}
                  </div>

                  {/* Day Activities */}
                  {dayActivities.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5">
                      {dayActivities.map((act) => (
                        <ActivityItem
                          key={act.id}
                          activity={act}
                          onDelete={onDeleteActivity}
                          onToggleComplete={onToggleActivityComplete}
                          readOnly={readOnly}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 px-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">No activities scheduled for Day {dayNum}.</p>
                      {!readOnly && (
                        <button
                          onClick={() => onAddActivity(stop.id, dayNum)}
                          className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                        >
                          + Add first activity
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Stop Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDeleteStop(stop.id);
          setShowDeleteConfirm(false);
        }}
        title="Remove Destination Stop?"
        message={`Are you sure you want to remove ${stop.cityName} from this trip? All ${activities.length} activities scheduled under this stop will also be removed.`}
        confirmText="Remove Stop"
      />
    </>
  );
};
