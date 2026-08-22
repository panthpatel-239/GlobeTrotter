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
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{city.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-brand-400" />
              <span>{city.country}</span>
              {city.region && <span>• {city.region}</span>}
            </p>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-100 text-brand-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg. Daily Cost</span>
              <span className="text-sm font-extrabold text-slate-900">{formatCurrency(city.averageDailyCost)}/day</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Time</span>
              <span className="text-xs font-bold text-slate-900 truncate max-w-[120px] block">{city.bestTimeToVisit || 'All Year'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-ocean-100 text-ocean-700">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Climate</span>
              <span className="text-xs font-bold text-slate-900 truncate max-w-[140px] block">{city.climate || 'Temperate'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">About Destination</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{city.description}</p>
        </div>

        {/* Top Attractions */}
        {city.topAttractions && city.topAttractions.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Must-See Landmarks</h3>
            <div className="flex flex-wrap gap-2">
              {city.topAttractions.map((attraction, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-brand-600" />
                  <span>{attraction}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top Activities in this city if available */}
        {cityActivities.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Available Activities in {city.name}
            </h3>
            <div className="space-y-2">
              {cityActivities.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={act.image} alt={act.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{act.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
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
                    <span className="text-xs font-bold text-slate-900">{formatCurrency(act.cost)}</span>
                    {onSelectActivity && (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectActivity(act);
                        }}
                        className="p-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
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
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onAddToTrip(city);
            }}
          >
            Add {city.name} to Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};
