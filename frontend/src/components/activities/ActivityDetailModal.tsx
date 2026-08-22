import React from 'react';
import { Activity } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { Clock, MapPin, DollarSign, Star, Plus, Sparkles, Tag } from 'lucide-react';

export interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToItinerary: (activity: Activity) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
  onAddToItinerary,
}) => {
  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="relative h-52 -mx-6 -mt-5 overflow-hidden rounded-t-2xl">
          <img
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="primary" size="sm">
              {activity.category}
            </Badge>
          </div>

          {/* Rating */}
          {activity.rating && (
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{activity.rating} / 5.0 Rating</span>
            </div>
          )}

          {/* Title */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{activity.name}</h2>
            {activity.cityName && (
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{activity.cityName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Quick Details Chips */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Cost Per Person</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {activity.cost > 0 ? formatCurrency(activity.cost) : 'Free Activity'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Recommended Duration</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{formatDuration(activity.durationMinutes)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Activity Overview</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{activity.description}</p>
        </div>

        {/* Location Info */}
        {activity.location && (
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-slate-900 dark:text-slate-100 block">Location / Meeting Point:</strong>
              <span>{activity.location}</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onAddToItinerary(activity);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
          >
            Add to Itinerary
          </Button>
        </div>
      </div>
    </Modal>
  );
};
