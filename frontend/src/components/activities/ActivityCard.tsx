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
    <div className="group bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card hover:border-[#007AFF]/40 dark:hover:border-[#0A84FF]/40 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Activity Image */}
      <div className="relative h-44 w-full overflow-hidden bg-black/[0.04] dark:bg-white/[0.04]">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" size="sm">
            {activity.category}
          </Badge>
        </div>

        {/* Heart Bookmark & Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleBookmarkToggle}
            className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-black/60 text-white hover:bg-black'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Save to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-white' : ''}`} />
          </button>

          {activity.rating && (
            <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[11px] font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{activity.rating}</span>
            </div>
          )}
        </div>

        {/* City name banner */}
        {activity.cityName && (
          <div className="absolute bottom-2.5 left-3 text-white flex items-center gap-1 text-xs font-medium drop-shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>{activity.cityName}</span>
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors line-clamp-1">
            {activity.name}
          </h3>

          <p className="mt-1 text-xs text-[#6E6E73] dark:text-[#98989D] line-clamp-2 leading-relaxed">
            {activity.description}
          </p>

          <div className="mt-2.5 flex items-center gap-3 text-xs text-[#8E8E93] dark:text-[#98989D]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(activity.durationMinutes)}
            </span>
            {activity.location && (
              <span className="truncate max-w-[150px]">• {activity.location}</span>
            )}
          </div>
        </div>

        {/* Footer: Cost & Add CTA */}
        <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8E8E93] dark:text-[#98989D] block">
              Cost
            </span>
            {activity.cost > 0 ? (
              <span className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {formatCurrency(activity.cost)}
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#34C759] dark:text-[#30D158] bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Free
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(activity)}
                className="px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.10] text-[#1D1D1F] dark:text-[#F5F5F7] text-xs font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
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
                className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white text-xs font-medium"
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
