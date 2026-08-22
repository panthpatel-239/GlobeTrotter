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
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden mb-6 transition-all duration-300">
        {/* Stop Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white font-extrabold text-lg shadow-lg shadow-brand-500/30 flex-shrink-0">
              #{stopIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight text-white">{stop.cityName}</h3>
                <span className="text-xs text-slate-300 font-medium px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                  {stop.country}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  {formatDateRange(stop.arrivalDate, stop.departureDate)}
                </span>
                <span className="font-semibold text-brand-300">
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
                  variant="glass"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => onAddActivity(stop.id, 1)}
                  className="text-white hover:text-slate-900"
                >
                  Add Activity
                </Button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                  title="Remove Stop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Stop notes banner if any */}
        {stop.notes && (
          <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-100 text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span><strong className="font-semibold">Notes:</strong> {stop.notes}</span>
          </div>
        )}

        {/* Days & Activities List */}
        {isExpanded && (
          <div className="p-6 space-y-6">
            {Object.keys(dayBuckets).map((dayKey) => {
              const dayNum = Number(dayKey);
              const dayActivities = dayBuckets[dayNum];

              return (
                <div key={dayNum} className="space-y-3">
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-100 text-brand-800 text-xs font-black">
                        D{dayNum}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">
                        Day {dayNum} in {stop.cityName}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        ({dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'})
                      </span>
                    </div>

                    {!readOnly && (
                      <button
                        onClick={() => onAddActivity(stop.id, dayNum)}
                        className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 hover:underline"
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
                    <div className="py-4 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                      <p className="text-xs text-slate-500">No activities scheduled for Day {dayNum}.</p>
                      {!readOnly && (
                        <button
                          onClick={() => onAddActivity(stop.id, dayNum)}
                          className="mt-1.5 text-xs text-brand-600 font-semibold hover:underline"
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
