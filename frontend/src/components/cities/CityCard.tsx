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
    <div className="group bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card hover:border-[#007AFF]/40 dark:hover:border-[#0A84FF]/40 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* City Hero Image */}
      <div className="relative h-44 w-full overflow-hidden bg-black/[0.04] dark:bg-white/[0.04]">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Cost Index Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={costConfig.variant} size="sm">
            {costConfig.label}
          </Badge>
        </div>

        {/* Heart Bookmark & Popularity score */}
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

          <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[11px] font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{city.popularityScore}</span>
          </div>
        </div>

        {/* City & Country bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-bold tracking-tight">{city.name}</h3>
          <p className="text-xs text-[#aeaeb2] font-normal flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#0A84FF]" />
            <span>{city.country}</span>
            {city.region && <span>• {city.region}</span>}
          </p>
        </div>
      </div>

      {/* City Description & Attractions */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] line-clamp-2 leading-relaxed">
            {city.description}
          </p>

          {/* Top Attractions Tags */}
          {city.topAttractions && city.topAttractions.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[10px] uppercase font-semibold text-[#8E8E93] dark:text-[#98989D] block mb-1">
                Top Highlights
              </span>
              <div className="flex flex-wrap gap-1">
                {city.topAttractions.slice(0, 3).map((attraction, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-[#6E6E73] dark:text-[#98989D] truncate max-w-[140px]"
                  >
                    {attraction}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8E8E93] dark:text-[#98989D] block">
              Avg. Daily
            </span>
            <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {formatCurrency(city.averageDailyCost)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(city)}
                className="px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.10] text-[#1D1D1F] dark:text-[#F5F5F7] text-xs font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Details
              </button>
            )}
            {onAddToTrip && (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-3 h-3" />}
                onClick={() => onAddToTrip(city)}
                className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white text-xs font-medium"
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
