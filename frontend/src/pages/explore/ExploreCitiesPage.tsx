import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Globe, Sparkles, Plus, SlidersHorizontal, Heart, Compass, Flame } from 'lucide-react';
import { cityService } from '../../services/cityService';
import { activityService } from '../../services/activityService';
import { City, Activity } from '../../types';
import { CityCard } from '../../components/cities/CityCard';
import { CityFilter } from '../../components/cities/CityFilter';
import { CityDetailModal } from '../../components/cities/CityDetailModal';
import { AddToTripModal } from '../../components/activities/AddToTripModal';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';

const BOOKMARKED_CITIES_KEY = 'globetrotter_bookmarked_cities';

export const ExploreCitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [costIndex, setCostIndex] = useState('all');
  const [region, setRegion] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Bookmarks
  const [bookmarkedCityIds, setBookmarkedCityIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKED_CITIES_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedCityForDetail, setSelectedCityForDetail] = useState<City | null>(null);
  const [selectedCityForTrip, setSelectedCityForTrip] = useState<City | null>(null);

  const fetchCitiesAndActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [citiesData, activitiesData] = await Promise.all([
        cityService.getCities({
          search: searchQuery,
          costIndex: costIndex !== 'all' ? costIndex : undefined,
          region: region !== 'all' ? region : undefined,
        }),
        activityService.getActivities(),
      ]);

      // Apply tag filter in frontend if selected
      const filtered =
        tagFilter === 'all'
          ? citiesData
          : citiesData.filter(
              (c) =>
                c.tags?.includes(tagFilter) ||
                (tagFilter === 'Budget' && c.costIndex === 'budget') ||
                c.description.toLowerCase().includes(tagFilter.toLowerCase())
            );

      setCities(filtered);
      setActivities(activitiesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch destinations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCitiesAndActivities();
  }, [searchQuery, costIndex, region, tagFilter]);

  const handleToggleBookmark = (cityId: string) => {
    setBookmarkedCityIds((prev) => {
      const next = prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId];
      localStorage.setItem(BOOKMARKED_CITIES_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            Global Destinations
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Discover trending cities, cultural hubs, daily costs, and curated itineraries worldwide.
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <CityFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        costIndex={costIndex}
        onCostIndexChange={setCostIndex}
        region={region}
        onRegionChange={setRegion}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
      />

      {/* Results Count & Tags */}
      <div className="flex items-center justify-between text-xs text-[#8E8E93] dark:text-[#98989D] px-1">
        <span>
          Showing <strong className="text-[#1D1D1F] dark:text-[#F5F5F7]">{cities.length}</strong>{' '}
          {cities.length === 1 ? 'destination' : 'destinations'}
        </span>
      </div>

      {/* Cities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} height={280} className="rounded-2xl" />
          ))}
        </div>
      ) : cities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              isBookmarked={bookmarkedCityIds.includes(city.id)}
              onToggleBookmark={handleToggleBookmark}
              onAddToTrip={(c) => setSelectedCityForTrip(c)}
              onViewDetails={(c) => setSelectedCityForDetail(c)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Destinations Found"
          description="Try adjusting your search terms, cost index, or region filter to find destinations."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setCostIndex('all');
            setRegion('all');
            setTagFilter('all');
          }}
          actionIcon={<SlidersHorizontal className="w-4 h-4" />}
        />
      )}

      {/* City Detail Modal */}
      <CityDetailModal
        isOpen={!!selectedCityForDetail}
        onClose={() => setSelectedCityForDetail(null)}
        city={selectedCityForDetail}
        cityActivities={activities.filter((a) => a.cityId === selectedCityForDetail?.id)}
        onAddToTrip={(c) => {
          setSelectedCityForDetail(null);
          setSelectedCityForTrip(c);
        }}
      />

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={!!selectedCityForTrip}
        onClose={() => setSelectedCityForTrip(null)}
        cityItem={selectedCityForTrip}
        onSuccess={fetchCitiesAndActivities}
      />
    </div>
  );
};
