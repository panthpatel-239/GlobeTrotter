import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  Wallet,
  Ticket,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
  Plane,
  CloudSun,
  AlertCircle,
  TrendingUp,
  Users,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tripService } from '../../services/tripService';
import { cityService } from '../../services/cityService';
import { activityService } from '../../services/activityService';
import { reservationService } from '../../services/reservationService';
import { documentService } from '../../services/documentService';
import { checklistService } from '../../services/checklistService';
import { Trip, City, Activity, Reservation, TripDocument, ChecklistItem } from '../../types';
import { formatCurrency, formatDateRange, calculateDaysBetween } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { TripCard } from '../../components/trips/TripCard';
import { CityCard } from '../../components/cities/CityCard';
import { CityDetailModal } from '../../components/cities/CityDetailModal';
import { AddToTripModal } from '../../components/activities/AddToTripModal';
import { useToast } from '../../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [documents, setDocuments] = useState<TripDocument[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedCityForDetail, setSelectedCityForDetail] = useState<City | null>(null);
  const [selectedCityForTrip, setSelectedCityForTrip] = useState<City | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTrips, fetchedCities, fetchedActivities, fetchedRes, fetchedDocs, fetchedCheck] =
        await Promise.all([
          tripService.getTrips(),
          cityService.getCities(),
          activityService.getActivities(),
          reservationService.getReservations(),
          documentService.getDocuments(),
          checklistService.getChecklist(),
        ]);
      setTrips(fetchedTrips);
      setPopularCities(fetchedCities.slice(0, 4));
      setActivities(fetchedActivities);
      setReservations(fetchedRes);
      setDocuments(fetchedDocs);
      setChecklist(fetchedCheck);
    } catch (err: any) {
      setError(err.message || 'Failed to load travel command center.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await tripService.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      success('Trip Deleted', 'The trip has been removed.');
    } catch (err: any) {
      console.error(err);
    }
  };

  // Primary Active Expedition
  const currentTrip = useMemo(
    () => trips.find((t) => t.status === 'planned' || t.status === 'ongoing') || trips[0],
    [trips]
  );

  const allStops = currentTrip?.stops || [];
  const allTripActivities = allStops.flatMap((s) => s.activities || []);
  const completedActs = allTripActivities.filter((a) => a.isCompleted).length;
  const totalActs = allTripActivities.length;
  const tripProgress = totalActs > 0 ? Math.round((completedActs / totalActs) * 100) : 65;

  const nextActivity = allTripActivities.find((a) => !a.isCompleted) || allTripActivities[0];
  const spentBudget = (currentTrip?.expenses || []).reduce((sum, e) => sum + e.amount, 0) || 1840;
  const targetBudget = currentTrip?.budget || 2500;
  const remainingBudget = Math.max(0, targetBudget - spentBudget);
  const remainingDays = 12;

  // Overview Statistics
  const upcomingTripsCount = trips.filter((t) => t.status === 'planned').length;
  const totalDestinationsCount = new Set(trips.flatMap((t) => (t.stops || []).map((s) => s.cityName))).size || 6;
  const totalTravelDays = trips.reduce(
    (acc, t) => acc + calculateDaysBetween(t.startDate, t.endDate),
    0
  );
  const totalPlannedSpend = trips.reduce((acc, t) => acc + (t.budget || 0), 0);

  // Smart Alerts
  const alerts = useMemo(() => {
    const list: { id: string; type: 'warning' | 'info' | 'danger'; title: string; message: string; actionText?: string; actionPath?: string }[] = [];

    // Document expiration alert
    const expiringDoc = documents.find((d) => d.status === 'expiring_soon');
    if (expiringDoc) {
      list.push({
        id: 'alert-doc',
        type: 'warning',
        title: 'Document Expiring Soon',
        message: `${expiringDoc.name} (${expiringDoc.documentNumber || 'ID'}) expires on ${expiringDoc.expirationDate}. Verify validity before departure.`,
        actionText: 'Open Wallet',
        actionPath: '/documents',
      });
    }

    // Budget threshold alert
    if (targetBudget > 0 && spentBudget / targetBudget >= 0.7) {
      list.push({
        id: 'alert-budget',
        type: 'info',
        title: 'Budget Tracking',
        message: `You have utilized ${Math.round((spentBudget / targetBudget) * 100)}% of your ${formatCurrency(targetBudget)} allocation for ${currentTrip?.title || 'active trip'}.`,
        actionText: 'View Ledger',
        actionPath: '/budget',
      });
    }

    // Reservation reminder
    if (reservations.some((r) => r.status === 'confirmed' && r.type === 'flight')) {
      list.push({
        id: 'alert-flight',
        type: 'info',
        title: 'Flight Confirmation Ready',
        message: 'Japan Airlines SFO → NRT flight is confirmed. Online check-in opens 24h prior.',
        actionText: 'View Booking',
        actionPath: '/reservations',
      });
    }

    return list;
  }, [documents, spentBudget, targetBudget, currentTrip, reservations]);

  // Upcoming Timeline events
  const timelineEvents = useMemo(() => {
    const list: { id: string; time: string; date: string; title: string; subtitle: string; icon: any; type: string }[] = [];

    if (nextActivity) {
      list.push({
        id: 'tl-act-1',
        time: nextActivity.startTime || '08:30',
        date: 'Tomorrow',
        title: nextActivity.name,
        subtitle: nextActivity.location || 'Tokyo, Japan',
        icon: Sparkles,
        type: 'activity',
      });
    }

    reservations.slice(0, 3).forEach((r) => {
      list.push({
        id: `tl-res-${r.id}`,
        time: r.time || '14:00',
        date: r.date,
        title: r.title,
        subtitle: `${r.provider} • ${r.location || 'Confirmed'}`,
        icon: r.type === 'flight' ? Plane : Ticket,
        type: 'reservation',
      });
    });

    return list;
  }, [nextActivity, reservations]);

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Alex'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Your next journey begins in <strong className="text-[#007AFF] dark:text-[#0A84FF]">6 days</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/trips/create')}
            className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white font-medium shadow-xs text-xs"
          >
            Plan New Journey
          </Button>
        </div>
      </div>

      {/* Section A: Next Trip / Milestone Spotlight & Section B: NEXT UP Activity */}
      {currentTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Journey Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-[#1C1C1E] text-white min-h-[260px] flex flex-col justify-between p-5 sm:p-6 border border-black/[0.08] dark:border-white/[0.10] shadow-sm">
            <img
              src={
                currentTrip.coverImage ||
                'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80'
              }
              alt={currentTrip.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/60 to-transparent" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#0A84FF]/20 border border-[#0A84FF]/40 text-[#64D2FF] text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
                  Active Expedition
                </span>
                <span className="text-xs text-[#98989D] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Departs in 6 days</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#98989D] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>Tokyo 19°C Clear</span>
              </div>
            </div>

            <div className="relative z-10 space-y-2.5 pt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9F0A]">
                  {currentTrip.destinationSummary || 'Tokyo → Kyoto → Osaka'}
                </span>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mt-0.5">
                  {currentTrip.title}
                </h2>
                <p className="text-xs text-[#aeaeb2] font-normal">
                  {formatDateRange(currentTrip.startDate, currentTrip.endDate)} • {calculateDaysBetween(currentTrip.startDate, currentTrip.endDate)} Days
                </p>
              </div>

              {/* Progress & Budget Allocation */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#aeaeb2] mb-1">
                    <span>Itinerary Progress</span>
                    <span>{tripProgress}% Ready</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-[#0A84FF] h-1 rounded-full transition-all duration-300"
                      style={{ width: `${tripProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#aeaeb2] mb-1">
                    <span>Budget Utilized</span>
                    <span>
                      {formatCurrency(spentBudget)} / {formatCurrency(targetBudget)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-[#30D158] h-1 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (spentBudget / targetBudget) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/trips/${currentTrip.id}/itinerary`)}
                  className="bg-[#0A84FF] hover:bg-[#409CFF] text-white font-medium text-xs"
                >
                  Open Itinerary
                </Button>
                <Link
                  to={`/trips/${currentTrip.id}`}
                  className="text-xs font-medium text-[#aeaeb2] hover:text-white px-2 py-1"
                >
                  Workspace Hub
                </Link>
              </div>
            </div>
          </div>

          {/* NEXT UP Actionable Milestone Widget */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 border border-black/[0.08] dark:border-white/[0.10] shadow-card flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9F0A]">
                  NEXT UP
                </span>
                <span className="text-xs font-medium text-[#8E8E93] dark:text-[#98989D]">Tomorrow</span>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {nextActivity?.startTime || '07:00'}
                  </span>
                  <span className="text-xs text-[#8E8E93] dark:text-[#98989D]">
                    • 2h duration
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-snug">
                  {nextActivity?.name || 'Sunrise Tour at Amber Fort'}
                </h3>

                <p className="text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" />
                  <span>{nextActivity?.location || 'Tokyo, Japan'}</span>
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-[#6E6E73] dark:text-[#98989D] font-medium">
                    {nextActivity?.category || 'Sightseeing'}
                  </span>
                  <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {nextActivity?.cost ? formatCurrency(nextActivity.cost) : '$35 estimated'}
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/trips/${currentTrip.id}/itinerary`)}
              className="w-full justify-center font-medium text-xs"
            >
              Open Daily Itinerary
            </Button>
          </div>
        </div>
      )}

      {/* Section C: Travel Overview (Meaningful statistics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] flex-shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D] block">
              Upcoming Trips
            </span>
            <span className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {upcomingTripsCount} {upcomingTripsCount === 1 ? 'Expedition' : 'Expeditions'}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D] block">
              Destinations
            </span>
            <span className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {totalDestinationsCount} Cities Mapped
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-[#34C759] dark:text-[#30D158] flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D] block">
              Days Traveling
            </span>
            <span className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {totalTravelDays} Days Scheduled
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-[#FF9F0A] flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D] block">
              Planned Spend
            </span>
            <span className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {formatCurrency(totalPlannedSpend)}
            </span>
          </div>
        </div>
      </div>

      {/* Section D & E: Smart Alerts & Upcoming Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Smart Alerts */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
              Trip Preparation Alerts
            </h3>
            <span className="px-1.5 py-0.2 rounded-full bg-black/[0.06] dark:bg-white/[0.10] text-[10px] font-bold text-[#6E6E73] dark:text-[#98989D]">
              {alerts.length} active
            </span>
          </div>

          <div className="space-y-2">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs transition-colors ${
                    alert.type === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/20 text-[#1D1D1F] dark:text-[#F5F5F7]'
                      : 'bg-blue-500/5 border-blue-500/20 text-[#1D1D1F] dark:text-[#F5F5F7]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF] flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="font-semibold text-xs">{alert.title}</div>
                      <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                        {alert.message}
                      </p>
                      {alert.actionPath && (
                        <Link
                          to={alert.actionPath}
                          className="inline-block text-[11px] font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline pt-0.5"
                        >
                          {alert.actionText || 'Review'} →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-[#8E8E93]">
                No pending alerts. All travel checklists & documents in order!
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Timeline Events */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
              Upcoming Travel Timeline
            </h3>
            <Link
              to="/calendar"
              className="text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-0.5"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {timelineEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-[#007AFF] dark:text-[#0A84FF] flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] truncate">
                        {evt.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] block">
                      {evt.time}
                    </span>
                    <span className="text-[10px] text-[#8E8E93] dark:text-[#98989D]">
                      {evt.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section B continued: Active Journeys Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF]" />
              <span>YOUR JOURNEYS</span>
            </h2>
            <p className="text-xs text-[#8E8E93] dark:text-[#98989D]">
              Active, planned, and completed multi-destination expeditions
            </p>
          </div>
          <Link
            to="/trips"
            className="text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-0.5"
          >
            <span>View All ({trips.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={260} className="rounded-2xl" />
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
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
            title="No Trips Planned Yet"
            description="Start planning your next adventure and build your itinerary day by day."
            actionText="Plan Your First Trip"
            onAction={() => navigate('/trips/create')}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        )}
      </section>

      {/* DISCOVER: Recommendations */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF]" />
              <span>CURATED DESTINATIONS</span>
            </h2>
            <p className="text-xs text-[#8E8E93] dark:text-[#98989D]">
              Recommendations based on your {user?.travelStyle || 'Cultural & Adventure'} style
            </p>
          </div>
          <Link
            to="/explore/cities"
            className="text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-0.5"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={260} className="rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onAddToTrip={(c) => setSelectedCityForTrip(c)}
                onViewDetails={(c) => setSelectedCityForDetail(c)}
              />
            ))}
          </div>
        )}
      </section>

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
        onSuccess={loadDashboardData}
      />
    </div>
  );
};
