import React, { useState } from 'react';
import { MapPin, DollarSign, Star, Plus, Globe, Sparkles, Heart, Info } from 'lucide-react';
import { City } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

export interface CityCardProps {
  city: City;
  onAddToTrip?: (city: City) => void;
  onViewDetails?: (city: City) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (cityId: string) => void;
}

export const CityCard: React.FC<CityCardProps> = ({
  city,
  onAddToTrip,
  onViewDetails,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const { info } = useToast();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const getCostBadge = (index: City['costIndex']) => {
    switch (index) {
      case 'budget':
        return { label: 'Budget ($)', variant: 'success' as const };
      case 'moderate':
        return { label: 'Moderate ($$)', variant: 'info' as const };
      case 'luxury':
        return { label: 'Luxury ($$$)', variant: 'secondary' as const };
      default:
        return { label: index, variant: 'neutral' as const };
    }
  };

  const costConfig = getCostBadge(city.costIndex);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !bookmarked;
    setBookmarked(newState);
    if (onToggleBookmark) {
      onToggleBookmark(city.id);
    }
    info(newState ? `Saved ${city.name} to Wishlist` : `Removed ${city.name} from Wishlist`);
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* City Hero Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Cost Index Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={costConfig.variant} size="sm">
            {costConfig.label}
          </Badge>
        </div>

        {/* Heart Bookmark & Popularity score */}
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

          <div className="bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1 border border-white/10">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{city.popularityScore}</span>
          </div>
        </div>

        {/* City & Country bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-extrabold tracking-tight drop-shadow-sm">{city.name}</h3>
          <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{city.country}</span>
            {city.region && <span>• {city.region}</span>}
          </p>
        </div>
      </div>

      {/* City Description & Attractions */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {city.description}
          </p>

          {/* Top Attractions Tags */}
          {city.topAttractions && city.topAttractions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">
                Top Highlights
              </span>
              <div className="flex flex-wrap gap-1.5">
                {city.topAttractions.slice(0, 3).map((attraction, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[140px] border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {attraction}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
              Avg. Daily
            </span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
              {formatCurrency(city.averageDailyCost)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(city)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Details
              </button>
            )}
            {onAddToTrip && (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onAddToTrip(city)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 shadow-2xs"
              >
                Add to Trip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
