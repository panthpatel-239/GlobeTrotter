import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Compass,
  MapPin,
  Sparkles,
  PlusCircle,
  User,
  ArrowRight,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  Globe2,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { cityService } from '../../services/cityService';
import { activityService } from '../../services/activityService';
import { Trip, City, Activity } from '../../types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);

      const loadData = async () => {
        try {
          const [t, c, a] = await Promise.all([
            tripService.getTrips(),
            cityService.getCities(),
            activityService.getActivities(),
          ]);
          setTrips(t);
          setCities(c);
          setActivities(a);
        } catch (err) {
          console.error(err);
        }
      };
      loadData();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredTrips = q
    ? trips.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destinationSummary?.toLowerCase().includes(q)
      )
    : trips.slice(0, 2);

  const filteredCities = q
    ? cities.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.region?.toLowerCase().includes(q)
      )
    : cities.slice(0, 3);

  const filteredActivities = q
    ? activities.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.cityName?.toLowerCase().includes(q)
      )
    : activities.slice(0, 3);

  const defaultActions = [
    {
      label: 'Plan a New Journey',
      path: '/trips/create',
      icon: PlusCircle,
      desc: 'Build a multi-city itinerary from scratch',
      category: 'Action',
    },
    {
      label: 'Explore Global Destinations',
      path: '/explore/cities',
      icon: MapPin,
      desc: 'Browse trending cities, landmarks & daily budgets',
      category: 'Action',
    },
    {
      label: 'Discover Things To Do',
      path: '/explore/activities',
      icon: Sparkles,
      desc: 'Search tours, dining, adventure hikes & museums',
      category: 'Action',
    },
    {
      label: 'View All My Trips',
      path: '/trips',
      icon: Compass,
      desc: 'Manage your active, planned and past journeys',
      category: 'Action',
    },
    {
      label: 'Profile & Travel Preferences',
      path: '/profile',
      icon: User,
      desc: 'Edit travel style, currency, and credentials',
      category: 'Action',
    },
  ];

  const filteredActions = q
    ? defaultActions.filter(
        (a) =>
          a.label.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q)
      )
    : defaultActions;

  const handleSelectRoute = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div
          className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-3">
            <Search className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, activities, journeys, or actions..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 rounded-md border border-slate-200">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Quick Actions */}
            {filteredActions.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                  Quick Navigation
                </span>
                <div className="space-y-1">
                  {filteredActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.path}
                        onClick={() => handleSelectRoute(action.path)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 truncate">
                              {action.label}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{action.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Journeys */}
            {filteredTrips.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                  My Travel Journeys
                </span>
                <div className="space-y-1">
                  {filteredTrips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => handleSelectRoute(`/trips/${trip.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80'}
                          alt={trip.title}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 truncate">
                            {trip.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {trip.startDate} • {trip.destinationSummary || 'Planned'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 capitalize">
                        {trip.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Destinations */}
            {filteredCities.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                  Global Destinations
                </span>
                <div className="space-y-1">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectRoute(`/explore/cities?search=${encodeURIComponent(city.name)}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 truncate">
                            {city.name}, {city.country}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{city.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                        ${city.averageDailyCost}/day
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {filteredActivities.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                  Things to Do
                </span>
                <div className="space-y-1">
                  {filteredActivities.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => handleSelectRoute(`/explore/activities?search=${encodeURIComponent(act.name)}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={act.image}
                          alt={act.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 truncate">
                            {act.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {act.category} • {act.cityName}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {act.cost > 0 ? `$${act.cost}` : 'Free'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredActions.length === 0 &&
              filteredTrips.length === 0 &&
              filteredCities.length === 0 &&
              filteredActivities.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500">
                  No matching results found for "{query}".
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span>Navigation:</span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold">↵</kbd>
              <span>to select</span>
            </span>
            <span>GlobeTrotter Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};
