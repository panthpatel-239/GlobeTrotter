import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, MapPin, Search } from 'lucide-react';
import { activityService } from '../../services/activityService';
import { cityService } from '../../services/cityService';
import { Activity, City } from '../../types';
import { ActivityCard } from '../../components/activities/ActivityCard';
import { ActivityFilter } from '../../components/activities/ActivityFilter';
import { ActivityDetailModal } from '../../components/activities/ActivityDetailModal';
import { AddToTripModal } from '../../components/activities/AddToTripModal';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';

const BOOKMARKED_ACTIVITIES_KEY = 'globetrotter_bookmarked_activities';

export const ExploreActivitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [cityId, setCityId] = useState(searchParams.get('cityId') || 'all');
  const [category, setCategory] = useState('all');
  const [maxCost, setMaxCost] = useState(150);

  // Bookmarks
  const [bookmarkedActivityIds, setBookmarkedActivityIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKED_ACTIVITIES_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedActivityForDetail, setSelectedActivityForDetail] = useState<Activity | null>(null);
  const [selectedActivityForTrip, setSelectedActivityForTrip] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchCitiesList = async () => {
      try {
        const c = await cityService.getCities();
        setCities(c);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCitiesList();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await activityService.getActivities({
        search: searchQuery,
        cityId: cityId !== 'all' ? cityId : undefined,
        category: category !== 'all' ? category : undefined,
        maxCost: maxCost > 0 ? maxCost : undefined,
      });
      setActivities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [searchQuery, cityId, category, maxCost]);

  const handleToggleBookmark = (activityId: string) => {
    setBookmarkedActivityIds((prev) => {
      const next = prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId];
      localStorage.setItem(BOOKMARKED_ACTIVITIES_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Things To Do</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore iconic landmarks, authentic dining, adventure tours, and cultural experiences worldwide.
        </p>
      </div>

      {/* City quick filter pills */}
      {cities.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setCityId('all')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              cityId === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            All Destinations
          </button>
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setCityId(city.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                cityId === city.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      )}

      {/* Filters Bar */}
      <ActivityFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={category}
        onCategoryChange={setCategory}
        maxCost={maxCost}
        onMaxCostChange={setMaxCost}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Found <strong className="text-slate-900 dark:text-slate-100 font-semibold">{activities.length}</strong>{' '}
          {activities.length === 1 ? 'activity' : 'activities'}
        </span>
      </div>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} height={280} className="rounded-2xl" />
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isBookmarked={bookmarkedActivityIds.includes(activity.id)}
              onToggleBookmark={handleToggleBookmark}
              onAddToItinerary={(a) => setSelectedActivityForTrip(a)}
              onViewDetails={(a) => setSelectedActivityForDetail(a)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Activities Found"
          description="Try broadening your category search or price range to find activities."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setCategory('all');
            setMaxCost(150);
            setCityId('all');
          }}
          actionIcon={<Sparkles className="w-4 h-4" />}
        />
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        isOpen={!!selectedActivityForDetail}
        onClose={() => setSelectedActivityForDetail(null)}
        activity={selectedActivityForDetail}
        onAddToItinerary={(a) => {
          setSelectedActivityForDetail(null);
          setSelectedActivityForTrip(a);
        }}
      />

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={!!selectedActivityForTrip}
        onClose={() => setSelectedActivityForTrip(null)}
        activityItem={selectedActivityForTrip}
      />
    </div>
  );
};
