import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Compass, LayoutGrid, List as ListIcon } from 'lucide-react';
import { tripService } from '../../services/tripService';
import { Trip } from '../../types';
import { TripCard } from '../../components/trips/TripCard';
import { TripFilter } from '../../components/trips/TripFilter';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { useToast } from '../../context/ToastContext';

export const TripsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tripService.getTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trips.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (id: string) => {
    try {
      await tripService.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      success('Trip Removed', 'The trip was successfully deleted.');
    } catch (err: any) {
      console.error(err);
    }
  };

  // Filter and Sort Logic
  const filteredTrips = trips
    .filter((trip) => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchSearch =
        trip.title.toLowerCase().includes(query) ||
        (trip.destinationSummary && trip.destinationSummary.toLowerCase().includes(query)) ||
        (trip.description && trip.description.toLowerCase().includes(query));

      // Status match
      const matchStatus = statusFilter === 'all' || trip.status === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'upcoming') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === 'budget_high') {
        return (b.budget || 0) - (a.budget || 0);
      }
      if (sortBy === 'budget_low') {
        return (a.budget || 0) - (b.budget || 0);
      }
      return 0;
    });

  if (error) {
    return <ErrorState message={error} onRetry={fetchTrips} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>My Travel Journeys</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize, customize, and review all your planned and past trips.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/trips/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 px-4 py-2 rounded-xl"
        >
          Plan New Journey
        </Button>
      </div>

      {/* Filter and Sort Toolbar */}
      <TripFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Trips Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={260} className="rounded-2xl" />
          ))}
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={handleDeleteTrip}
              onShare={(t) => navigate(`/trips/${t.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Journeys Found"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'No trips match your current filter settings. Try resetting your search.'
              : 'You have not created any trips yet. Start planning your first adventure.'
          }
          actionText={
            searchQuery || statusFilter !== 'all' ? 'Reset Filters' : 'Create First Trip'
          }
          onAction={() => {
            if (searchQuery || statusFilter !== 'all') {
              setSearchQuery('');
              setStatusFilter('all');
            } else {
              navigate('/trips/create');
            }
          }}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}
    </div>
  );
};
