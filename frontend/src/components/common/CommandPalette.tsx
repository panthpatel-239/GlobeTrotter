import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Ticket,
  ShieldCheck,
  CheckSquare,
  Bookmark,
  Clock,
  Check,
} from 'lucide-react';
import { searchService, SearchResults } from '../../services/searchService';
import { reservationService } from '../../services/reservationService';
import { expenseService } from '../../services/expenseService';
import { Reservation, Expense } from '../../types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  type: 'action' | 'destination' | 'trip' | 'activity' | 'reservation' | 'expense';
  title: string;
  subtitle: string;
  icon: any;
  path: string;
  meta?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResults>({
    destinations: [],
    trips: [],
    activities: [],
    itineraryItems: [],
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Tokyo, Japan',
    'Tsukiji Outer Market',
    'Japan Grand Expedition',
  ]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
      reservationService.getReservations().then(setReservations).catch(() => {});
      expenseService.getExpenses('trip-1').then(setExpenses).catch(() => {});
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ destinations: [], trips: [], activities: [], itineraryItems: [] });
      setSelectedIndex(0);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await searchService.searchAll(query);
      setResults(res);
      setSelectedIndex(0);
    }, 120);
    return () => clearTimeout(timer);
  }, [query]);

  const defaultActions = useMemo(
    () => [
      {
        id: 'act-plan',
        type: 'action' as const,
        title: 'Plan a New Journey',
        subtitle: 'Build a multi-city itinerary from scratch',
        icon: PlusCircle,
        path: '/trips/create',
      },
      {
        id: 'act-dest',
        type: 'action' as const,
        title: 'Explore Global Destinations',
        subtitle: 'Browse trending cities, landmarks & daily budgets',
        icon: MapPin,
        path: '/explore/cities',
      },
      {
        id: 'act-act',
        type: 'action' as const,
        title: 'Discover Things To Do',
        subtitle: 'Search tours, dining, adventure hikes & museums',
        icon: Sparkles,
        path: '/explore/activities',
      },
      {
        id: 'act-trips',
        type: 'action' as const,
        title: 'My Travel Journeys',
        subtitle: 'Manage your active, planned and past trips',
        icon: Compass,
        path: '/trips',
      },
      {
        id: 'act-cal',
        type: 'action' as const,
        title: 'Travel Calendar & Schedule',
        subtitle: 'View day-by-day travel agenda and milestones',
        icon: Calendar,
        path: '/calendar',
      },
      {
        id: 'act-budget',
        type: 'action' as const,
        title: 'Budget & Cost Breakdown',
        subtitle: 'Track expenses and spending forecasts',
        icon: DollarSign,
        path: '/budget',
      },
      {
        id: 'act-res',
        type: 'action' as const,
        title: 'Reservations & Bookings',
        subtitle: 'Flights, hotels, trains, and dining bookings',
        icon: Ticket,
        path: '/reservations',
      },
      {
        id: 'act-doc',
        type: 'action' as const,
        title: 'Document Wallet',
        subtitle: 'Passports, visas, insurance & flight tickets',
        icon: ShieldCheck,
        path: '/documents',
      },
      {
        id: 'act-saved',
        type: 'action' as const,
        title: 'Saved Places & Wishlists',
        subtitle: 'View saved destinations and favorite activities',
        icon: Bookmark,
        path: '/saved',
      },
      {
        id: 'act-profile',
        type: 'action' as const,
        title: 'Profile & Settings',
        subtitle: 'Preferences, currency, theme & traveler identity',
        icon: User,
        path: '/profile',
      },
    ],
    []
  );

  // Grouped items
  const matchedReservations = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return reservations.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.confirmationNumber.toLowerCase().includes(q)
    );
  }, [query, reservations]);

  const matchedExpenses = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return expenses.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [query, expenses]);

  const allFlattenedItems: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [];

    // Destinations
    results.destinations.forEach((d) => {
      list.push({
        id: `dest-${d.id}`,
        type: 'destination',
        title: `${d.name}, ${d.country}`,
        subtitle: d.description || `Avg. $${d.averageDailyCost}/day`,
        icon: MapPin,
        path: `/explore/cities?search=${encodeURIComponent(d.name)}`,
        meta: `$${d.averageDailyCost}/day`,
      });
    });

    // Trips
    results.trips.forEach((t) => {
      list.push({
        id: `trip-${t.id}`,
        type: 'trip',
        title: t.title,
        subtitle: `${t.startDate} • ${t.destinationSummary || 'Planned'}`,
        icon: Compass,
        path: `/trips/${t.id}`,
        meta: t.status,
      });
    });

    // Activities
    results.activities.forEach((a) => {
      list.push({
        id: `act-${a.id}`,
        type: 'activity',
        title: a.name,
        subtitle: `${a.category} • ${a.cityName}`,
        icon: Sparkles,
        path: `/explore/activities?search=${encodeURIComponent(a.name)}`,
        meta: a.cost > 0 ? `$${a.cost}` : 'Free',
      });
    });

    // Reservations
    matchedReservations.forEach((r) => {
      list.push({
        id: `res-${r.id}`,
        type: 'reservation',
        title: `${r.title} (${r.confirmationNumber})`,
        subtitle: `${r.provider} • ${r.date}`,
        icon: Ticket,
        path: '/reservations',
        meta: r.status,
      });
    });

    // Expenses
    matchedExpenses.forEach((e) => {
      list.push({
        id: `exp-${e.id}`,
        type: 'expense',
        title: e.title,
        subtitle: `${e.category} • ${e.date}`,
        icon: DollarSign,
        path: '/budget',
        meta: `$${e.amount}`,
      });
    });

    // Actions
    const q = query.toLowerCase().trim();
    const actions = q
      ? defaultActions.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.subtitle.toLowerCase().includes(q)
        )
      : defaultActions.slice(0, 5);

    actions.forEach((a) => list.push(a));

    return list;
  }, [results, matchedReservations, matchedExpenses, query, defaultActions]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allFlattenedItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allFlattenedItems.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = allFlattenedItems[selectedIndex];
        if (selected) {
          handleSelectRoute(selected.path);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allFlattenedItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  const handleSelectRoute = (path: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 4)]);
    }
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-20 text-center">
        <div
          className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-2xl border border-slate-200/80 dark:border-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, trips, activities, bookings, expenses, actions..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
            {/* Recent Searches (when query empty) */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="px-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                  Recent Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((rec) => (
                    <button
                      key={rec}
                      onClick={() => setQuery(rec)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{rec}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Flattened Items */}
            {allFlattenedItems.length > 0 ? (
              <div className="space-y-1">
                {allFlattenedItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectRoute(item.path)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-xl flex-shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {item.title}
                          </p>
                          <p
                            className={`text-[11px] truncate ${
                              isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {item.meta && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {item.meta}
                          </span>
                        )}
                        <ArrowRight
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-400">
                No matching results found for "{query}".
              </div>
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-bold">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-bold">
                  ↓
                </kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-bold">
                  ↵
                </kbd>
                <span>open</span>
              </span>
            </div>
            <span>GlobeTrotter Command</span>
          </div>
        </div>
      </div>
    </div>
  );
};
