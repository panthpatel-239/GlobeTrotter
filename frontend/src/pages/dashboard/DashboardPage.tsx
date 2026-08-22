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
  const remainingDays = 6;

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
    <div className="space-y-7">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Alex'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your next journey begins in <strong className="text-blue-600 dark:text-blue-400 font-semibold">{remainingDays} days</strong>. Explore your itinerary and milestones below.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/trips/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-500/25 px-4 py-2 text-xs rounded-xl"
          >
            Plan New Journey
          </Button>
        </div>
      </div>

      {/* Hero / Active Trip Card & NEXT UP Actionable Milestone Widget */}
      {currentTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Active Expedition Hero Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-slate-950 text-white min-h-[300px] flex flex-col justify-between p-6 sm:p-7 border border-slate-800 shadow-md">
            <img
              src={
                currentTrip.coverImage ||
                'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80'
              }
              alt={currentTrip.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 transition-transform duration-700"
            />
            {/* Deep rich contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/35" />

            {/* Top Badges */}
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-2xs">
                  Active Expedition
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Departs in 6 days</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-200 bg-slate-900/70 border border-white/10 px-3 py-1 rounded-lg backdrop-blur-md">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>Tokyo 19°C Clear</span>
              </div>
            </div>

            {/* Middle and Bottom Content */}
            <div className="relative z-10 space-y-3.5 pt-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block drop-shadow-xs">
                  {currentTrip.destinationSummary || 'Tokyo → Kyoto → Osaka'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 drop-shadow-sm">
                  {currentTrip.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{formatDateRange(currentTrip.startDate, currentTrip.endDate)}</span>
                  <span>•</span>
                  <span>{calculateDaysBetween(currentTrip.startDate, currentTrip.endDate)} Days Traveling</span>
                </p>
              </div>

              {/* Progress & Budget Allocation Bars */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/15">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Itinerary Readiness</span>
                    <span className="text-blue-400 font-bold">{tripProgress}% Ready</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-white/10">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${tripProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Budget Allocation</span>
                    <span className="text-emerald-400 font-bold">
                      {formatCurrency(spentBudget)} / {formatCurrency(targetBudget)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-white/10">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (spentBudget / targetBudget) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  size="sm"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/trips/${currentTrip.id}/itinerary`)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl px-4 py-2 shadow-sm shadow-blue-500/25 cursor-pointer"
                >
                  Open Itinerary
                </Button>
                <Link
                  to={`/trips/${currentTrip.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-xl backdrop-blur-md transition-colors"
                >
                  <span>Workspace Hub</span>
                </Link>
              </div>
            </div>
          </div>

          {/* NEXT UP Actionable Milestone Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    NEXT UP
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  Tomorrow
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {nextActivity?.startTime || '08:30'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    • 2h scheduled
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {nextActivity?.name || 'Sunrise Tour at Amber Fort'}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">{nextActivity?.location || 'Tokyo, Japan'}</span>
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-100 dark:border-blue-900/40">
                    {nextActivity?.category || 'Sightseeing'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {nextActivity?.cost ? formatCurrency(nextActivity.cost) : '$35 estimated'}
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/trips/${currentTrip.id}/itinerary`)}
              className="w-full justify-center font-semibold text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl py-2"
            >
              Open Daily Itinerary
            </Button>
          </div>
        </div>
      )}

      {/* Section C: Travel Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Upcoming Trips */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex-shrink-0 border border-blue-100 dark:border-blue-900/40">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Upcoming Trips
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {upcomingTripsCount} {upcomingTripsCount === 1 ? 'Expedition' : 'Expeditions'}
            </span>
          </div>
        </div>

        {/* Card 2: Destinations */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 flex-shrink-0 border border-teal-100 dark:border-teal-900/40">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Destinations
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {totalDestinationsCount} Cities Mapped
            </span>
          </div>
        </div>

        {/* Card 3: Days Traveling */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Days Traveling
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {totalTravelDays} Days Scheduled
            </span>
          </div>
        </div>

        {/* Card 4: Planned Spend */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex-shrink-0 border border-amber-100 dark:border-amber-900/40">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Planned Spend
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {formatCurrency(totalPlannedSpend)}
            </span>
          </div>
        </div>
      </div>

      {/* Section D & E: Smart Alerts & Upcoming Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Smart Alerts */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Trip Preparation Alerts
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {alerts.length} active
            </span>
          </div>

          <div className="space-y-2.5">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-xs transition-colors ${
                    alert.type === 'warning'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-200'
                      : 'bg-blue-50/70 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800/60 dark:text-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="font-bold text-xs">{alert.title}</div>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        {alert.message}
                      </p>
                      {alert.actionPath && (
                        <Link
                          to={alert.actionPath}
                          className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                        >
                          {alert.actionText || 'Review'} →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending alerts. All travel checklists & documents in order!
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Timeline Events */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Upcoming Travel Timeline
            </h3>
            <Link
              to="/calendar"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {timelineEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex-shrink-0 border border-blue-100 dark:border-blue-900/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {evt.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {evt.time}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {evt.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Your Journeys Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>YOUR JOURNEYS</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active, planned, and completed multi-destination expeditions
            </p>
          </div>
          <Link
            to="/trips"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({trips.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={260} className="rounded-2xl" />
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>CURATED DESTINATIONS</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recommendations based on your {user?.travelStyle || 'Cultural & Adventure'} style
            </p>
          </div>
          <Link
            to="/explore/cities"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={260} className="rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
