import React, { useState } from 'react';
import { Clock, Star, MapPin, Plus, DollarSign, Sparkles, Heart } from 'lucide-react';
import { Activity } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

export interface ActivityCardProps {
  activity: Activity;
  onAddToItinerary?: (activity: Activity) => void;
  onViewDetails?: (activity: Activity) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (activityId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onAddToItinerary,
  onViewDetails,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const { info } = useToast();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !bookmarked;
    setBookmarked(newState);
    if (onToggleBookmark) {
      onToggleBookmark(activity.id);
    }
    info(newState ? `Saved "${activity.name}" to Wishlist` : `Removed "${activity.name}" from Wishlist`);
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Activity Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" size="sm">
            {activity.category}
          </Badge>
        </div>

        {/* Heart Bookmark & Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={handleBookmarkToggle}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/10 ${
              bookmarked
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-slate-900/60 text-white hover:bg-slate-900'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Save to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-white' : ''}`} />
          </button>

          {activity.rating && (
            <div className="bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1 border border-white/10">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{activity.rating}</span>
            </div>
          )}
        </div>

        {/* City name banner */}
        {activity.cityName && (
          <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-xs font-semibold drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{activity.cityName}</span>
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {activity.name}
          </h3>

          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDuration(activity.durationMinutes)}
            </span>
            {activity.location && (
              <span className="truncate max-w-[150px]">• {activity.location}</span>
            )}
          </div>
        </div>

        {/* Footer: Cost & Add CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
              Cost
            </span>
            {activity.cost > 0 ? (
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {formatCurrency(activity.cost)}
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                Free
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(activity)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Details
              </button>
            )}
            {onAddToItinerary && (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onAddToItinerary(activity)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 shadow-2xs"
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
