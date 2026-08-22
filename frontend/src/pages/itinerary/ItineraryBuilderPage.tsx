import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Route,
  Plus,
  Calendar,
  MapPin,
  Sparkles,
  Share2,
  DollarSign,
  ArrowRight,
  Eye,
  Edit3,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  PieChart,
  CalendarDays,
  ArrowLeft,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { itineraryService } from '../../services/itineraryService';
import { Trip, TripStop, TripActivity } from '../../types';
import { formatDateRange, formatCurrency, calculateDaysBetween } from '../../utils/formatters';
import { StopCard } from '../../components/itinerary/StopCard';
import { AddStopModal } from '../../components/itinerary/AddStopModal';
import { AddActivityModal } from '../../components/itinerary/AddActivityModal';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { TripStatusBadge } from '../../components/trips/TripStatusBadge';

export const ItineraryBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<TripStop | null>(null);
  const [activeDayForActivity, setActiveDayForActivity] = useState<number>(1);

  // View mode: 'builder' | 'preview'
  const [viewMode, setViewMode] = useState<'builder' | 'preview'>('builder');

  const fetchTrip = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trip itinerary.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  // Add Stop Handler
  const handleAddStop = async (stopData: any) => {
    if (!trip) return;
    try {
      await itineraryService.addStop(trip.id, stopData);
      success('Stop Added', `${stopData.cityName} was added to your itinerary!`);
      await fetchTrip();
    } catch (err: any) {
      toastError('Failed to add stop', err.message);
    }
  };

  // Delete Stop Handler
  const handleDeleteStop = async (stopId: string) => {
    if (!trip) return;
    try {
      await itineraryService.deleteStop(trip.id, stopId);
      success('Stop Removed', 'Destination stop was removed from itinerary.');
      await fetchTrip();
    } catch (err: any) {
      toastError('Failed to remove stop', err.message);
    }
  };

  // Trigger Add Activity Modal
  const handleOpenAddActivity = (stopId: string, defaultDay = 1) => {
    if (!trip) return;
    const targetStop = (trip.stops || []).find((s) => s.id === stopId);
    if (targetStop) {
      setActiveStopForActivity(targetStop);
      setActiveDayForActivity(defaultDay);
      setShowAddActivityModal(true);
    }
  };

  // Add Activity Handler
  const handleAddActivity = async (activityData: any) => {
    if (!trip || !activeStopForActivity) return;
    try {
      await itineraryService.addActivity(trip.id, activeStopForActivity.id, activityData);
      success('Activity Scheduled', `"${activityData.name}" added to Day ${activityData.dayNumber}!`);
      await fetchTrip();
    } catch (err: any) {
      toastError('Failed to add activity', err.message);
    }
  };

  // Delete Activity Handler
  const handleDeleteActivity = async (activityId: string) => {
    if (!trip) return;
    try {
      await itineraryService.deleteActivity(trip.id, activityId);
      success('Activity Removed', 'Activity was deleted from itinerary.');
      await fetchTrip();
    } catch (err: any) {
      toastError('Failed to remove activity', err.message);
    }
  };

  // Toggle Activity Completion
  const handleToggleActivityComplete = async (activity: TripActivity) => {
    if (!trip) return;
    const newStatus = !activity.isCompleted;

    setTrip((prev) => {
      if (!prev || !prev.stops) return prev;
      const updatedStops = prev.stops.map((stop) => {
        if (!stop.activities) return stop;
        const updatedActs = stop.activities.map((a) => {
          if (a.id === activity.id) {
            return { ...a, isCompleted: newStatus };
          }
          return a;
        });
        return { ...stop, activities: updatedActs };
      });
      return { ...prev, stops: updatedStops };
    });

    try {
      await itineraryService.updateActivity(trip.id, activity.id, { isCompleted: newStatus });
      info(newStatus ? `Completed: "${activity.name}"` : `Marked incomplete: "${activity.name}"`);
    } catch (err) {
      console.error('Failed to sync toggle:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={100} className="rounded-2xl" />
        <Skeleton height={260} className="rounded-2xl" />
        <Skeleton height={260} className="rounded-2xl" />
      </div>
    );
  }

  if (error || !trip) {
    return <ErrorState message={error || 'Trip not found'} onRetry={fetchTrip} />;
  }

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const allActivities = (trip.stops || []).flatMap((s) => s.activities || []);
  const completedActivities = allActivities.filter((a) => a.isCompleted).length;
  const progressPercent =
    allActivities.length > 0
      ? Math.round((completedActivities / allActivities.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Itinerary Header */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/trips/${trip.id}`}
              className="text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Trip Workspace</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              {trip.title} Itinerary
            </h1>
            <TripStatusBadge status={trip.status} />
          </div>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            {formatDateRange(trip.startDate, trip.endDate)} • {durationDays} Days • {trip.stops?.length || 0} Destination Stops
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-black/[0.04] dark:bg-white/[0.06] p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewMode('builder')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'builder'
                  ? 'bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] shadow-xs font-semibold'
                  : 'text-[#6E6E73] dark:text-[#98989D]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Builder</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] shadow-xs font-semibold'
                  : 'text-[#6E6E73] dark:text-[#98989D]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowAddStopModal(true)}
            className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white font-medium text-xs"
          >
            Add Stop
          </Button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      {allActivities.length > 0 && (
        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E6E73] dark:text-[#98989D]">
            <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Checklist & Activities Progress
            </span>
            <span>
              {completedActivities} of {allActivities.length} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-black/[0.06] dark:bg-white/[0.10] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#34C759] dark:bg-[#30D158] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Stops & Itinerary Timeline */}
      {trip.stops && trip.stops.length > 0 ? (
        <div className="space-y-4">
          {trip.stops.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              stopIndex={index}
              onAddActivity={handleOpenAddActivity}
              onDeleteActivity={handleDeleteActivity}
              onDeleteStop={handleDeleteStop}
              onToggleActivityComplete={handleToggleActivityComplete}
            />
          ))}

          <div className="text-center py-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowAddStopModal(true)}
              className="text-xs font-medium"
            >
              Add Another Destination Stop
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Destination Stops Added"
          description="Add your first destination stop (e.g. Tokyo, Kyoto, Paris) to start scheduling day-by-day activities."
          actionText="Add Destination Stop"
          onAction={() => setShowAddStopModal(true)}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}

      {/* Add Stop Modal */}
      <AddStopModal
        isOpen={showAddStopModal}
        onClose={() => setShowAddStopModal(false)}
        onAddStop={handleAddStop}
        tripStartDate={trip.startDate}
        tripEndDate={trip.endDate}
      />

      {/* Add Activity Modal */}
      {activeStopForActivity && (
        <AddActivityModal
          isOpen={showAddActivityModal}
          onClose={() => setShowAddActivityModal(false)}
          onAddActivity={handleAddActivity}
          cityName={activeStopForActivity.cityName}
          defaultDayNumber={activeDayForActivity}
          totalDaysInStop={calculateDaysBetween(
            activeStopForActivity.arrivalDate,
            activeStopForActivity.departureDate
          )}
        />
      )}
    </div>
  );
};
