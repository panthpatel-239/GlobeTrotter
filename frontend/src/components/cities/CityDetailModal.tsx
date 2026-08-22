import React from 'react';
import { City, Activity } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { MapPin, Globe, Calendar, DollarSign, Star, Plus, Sun, Clock, Compass } from 'lucide-react';

export interface CityDetailModalProps {
  city: City | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToTrip: (city: City) => void;
  cityActivities?: Activity[];
  onSelectActivity?: (activity: Activity) => void;
}

export const CityDetailModal: React.FC<CityDetailModalProps> = ({
  city,
  isOpen,
  onClose,
  onAddToTrip,
  cityActivities = [],
  onSelectActivity,
}) => {
  if (!city) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Cover Hero */}
        <div className="relative h-56 -mx-6 -mt-5 overflow-hidden rounded-t-2xl">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge variant={costConfig.variant} size="sm">
              {costConfig.label}
            </Badge>
          </div>

          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{city.popularityScore} / 100 Popularity</span>
          </div>

          {/* Bottom Title */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{city.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold flex items-center gap-1.5 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{city.country}</span>
              {city.region && <span>• {city.region}</span>}
            </p>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Avg. Daily Cost</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(city.averageDailyCost)}/day</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Best Time</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px] block">{city.bestTimeToVisit || 'All Year'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Climate</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[140px] block">{city.climate || 'Temperate'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">About Destination</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{city.description}</p>
        </div>

        {/* Top Attractions */}
        {city.topAttractions && city.topAttractions.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Must-See Landmarks</h3>
            <div className="flex flex-wrap gap-2">
              {city.topAttractions.map((attraction, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>{attraction}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top Activities in this city if available */}
        {cityActivities.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
              Available Activities in {city.name}
            </h3>
            <div className="space-y-2">
              {cityActivities.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={act.image} alt={act.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{act.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>{act.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDuration(act.durationMinutes)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatCurrency(act.cost)}</span>
                    {onSelectActivity && (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectActivity(act);
                        }}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                        title="Add Activity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Close
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onAddToTrip(city);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
          >
            Add {city.name} to Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};
