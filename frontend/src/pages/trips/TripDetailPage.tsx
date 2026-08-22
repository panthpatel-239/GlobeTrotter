import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  DollarSign,
  Route,
  PieChart,
  CalendarDays,
  Share2,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Compass,
  Ticket,
  ShieldCheck,
  Users,
  UserPlus,
  Mail,
  Map as MapIcon,
  ChevronRight,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { itineraryService } from '../../services/itineraryService';
import { shareService } from '../../services/shareService';
import { mockHandlers } from '../../services/mockStorage';
import { Trip, TripStop, TripActivity, TripMember } from '../../types';
import { formatDateRange, formatCurrency, calculateDaysBetween } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { TripStatusBadge } from '../../components/trips/TripStatusBadge';
import { StopCard } from '../../components/itinerary/StopCard';
import { AddStopModal } from '../../components/itinerary/AddStopModal';
import { AddActivityModal } from '../../components/itinerary/AddActivityModal';
import { TripMapView } from '../../components/trips/TripMapView';
import { useToast } from '../../context/ToastContext';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active Workspace Tab: 'overview' | 'itinerary' | 'map' | 'travelers'
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'map' | 'travelers'>('overview');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<TripStop | null>(null);
  const [activeDayForActivity, setActiveDayForActivity] = useState<number>(1);

  // Invite Member Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const fetchTripDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
      const m = mockHandlers.getTripMembers(id);
      setMembers(m);
    } catch (err: any) {
      setError(err.message || 'Failed to load trip details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const handleDeleteTrip = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await tripService.deleteTrip(id);
      success('Trip Deleted', 'Trip has been removed successfully.');
      navigate('/trips');
    } catch (err: any) {
      toastError('Error', err.message || 'Could not delete trip.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleShareClick = async () => {
    if (!trip) return;
    try {
      const res = await shareService.generateShareLink(trip.id);
      setShareLink(res.shareUrl);
      setShowShareModal(true);
    } catch (err: any) {
      toastError('Share Failed', err.message || 'Could not generate share link.');
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    success('Link Copied', 'Public share link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleAddStop = async (stopData: any) => {
    if (!trip) return;
    try {
      await itineraryService.addStop(trip.id, stopData);
      success('Stop Added', `${stopData.cityName} added to your journey!`);
      await fetchTripDetails();
    } catch (err: any) {
      toastError('Failed to add stop', err.message);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!trip) return;
    try {
      await itineraryService.deleteStop(trip.id, stopId);
      success('Stop Removed', 'Destination stop was removed.');
      await fetchTripDetails();
    } catch (err: any) {
      toastError('Failed to remove stop', err.message);
    }
  };

  const handleOpenAddActivity = (stopId: string, defaultDay = 1) => {
    if (!trip) return;
    const targetStop = (trip.stops || []).find((s) => s.id === stopId);
    if (targetStop) {
      setActiveStopForActivity(targetStop);
      setActiveDayForActivity(defaultDay);
      setShowAddActivityModal(true);
    }
  };

  const handleAddActivity = async (activityData: any) => {
    if (!trip || !activeStopForActivity) return;
    try {
      await itineraryService.addActivity(trip.id, activeStopForActivity.id, activityData);
      success('Activity Scheduled', `"${activityData.name}" added to Day ${activityData.dayNumber}!`);
      await fetchTripDetails();
    } catch (err: any) {
      toastError('Failed to add activity', err.message);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!trip) return;
    try {
      await itineraryService.deleteActivity(trip.id, activityId);
      success('Activity Removed', 'Activity was deleted.');
      await fetchTripDetails();
    } catch (err: any) {
      toastError('Failed to remove activity', err.message);
    }
  };

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

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !inviteEmail) return;
    try {
      const newM = mockHandlers.inviteMember(trip.id, inviteEmail, inviteName, inviteRole);
      setMembers((prev) => [...prev, newM]);
      success('Invitation Sent', `Invited ${inviteEmail} as ${inviteRole}.`);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
    } catch (err: any) {
      toastError('Error', err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={260} className="rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton height={120} className="rounded-2xl" />
          <Skeleton height={120} className="rounded-2xl" />
          <Skeleton height={120} className="rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return <ErrorState message={error || 'Trip not found'} onRetry={fetchTripDetails} />;
  }

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const totalStops = trip.stops?.length || 0;
  const allActivities = (trip.stops || []).flatMap((s) => s.activities || []);
  const totalActivities = allActivities.length;
  const completedActivities = allActivities.filter((a) => a.isCompleted).length;
  const progressPercent =
    totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  const totalExpenses = (trip.expenses || []).reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Trip Hero Workspace Header */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-800 bg-slate-950 text-white min-h-[300px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={
            trip.coverImage ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80'
          }
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/30" />

        {/* Top actions toolbar */}
        <div className="relative z-10 flex items-center justify-between mb-auto pb-6 flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <TripStatusBadge status={trip.status} />
            <span className="bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-white border border-white/10">
              {durationDays} Days Expedition
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Collaborators Avatar Stack */}
            <div className="flex items-center -space-x-2 mr-1">
              {members.map((m) => (
                <img
                  key={m.id}
                  src={
                    m.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                  }
                  alt={m.name}
                  className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover shadow-2xs"
                  title={`${m.name} (${m.role})`}
                />
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              onClick={() => setShowInviteModal(true)}
              className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-slate-900 text-xs font-semibold rounded-xl"
            >
              Invite
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              onClick={handleShareClick}
              className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-slate-900 text-xs font-semibold rounded-xl"
            >
              Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/trips/${trip.id}/edit`)}
              className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-slate-900 text-xs font-semibold rounded-xl"
            >
              Edit
            </Button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-rose-600 transition-colors cursor-pointer border border-white/15"
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Title & Details */}
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block drop-shadow-xs">
            {trip.destinationSummary || 'Multi-City Expedition'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">{trip.title}</h1>
          {trip.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {trip.description}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2 text-xs text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {totalStops} {totalStops === 1 ? 'Destination Stop' : 'Destination Stops'}
            </span>
            <span className="flex items-center gap-1.5 font-bold text-white">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Budget: {formatCurrency(trip.budget)}
            </span>
          </div>

          {/* Activity Progress */}
          {totalActivities > 0 && (
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1.5">
                <span>Itinerary Readiness</span>
                <span className="text-blue-400">
                  {completedActivities}/{totalActivities} Activities ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-white/10">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Workspace Navigation Tabs */}
      <div className="sticky top-16 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between flex-wrap gap-2 transition-colors">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview & Hubs</span>
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'itinerary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Route className="w-4 h-4" />
            <span>Itinerary Timeline ({totalActivities})</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => navigate(`/trips/${trip.id}/budget`)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <PieChart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Budget</span>
          </button>
          <button
            onClick={() => navigate(`/trips/${trip.id}/calendar`)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('travelers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'travelers'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Travelers ({members.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddStopModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/25 rounded-xl px-4 py-2"
          >
            Add Stop
          </Button>
        </div>
      </div>

      {/* TAB 1: Overview & Hubs */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Quick Hub Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to={`/trips/${trip.id}/itinerary`}
              className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900/40">
                  <Route className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Itinerary Builder
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {totalStops} destination hubs & {totalActivities} scheduled experiences.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Open Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              to={`/trips/${trip.id}/budget`}
              className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-3 border border-emerald-100 dark:border-emerald-900/40">
                  <PieChart className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Budget Analytics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tracked {formatCurrency(totalExpenses)} of {formatCurrency(trip.budget)} budget.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>View Budget Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              to={`/trips/${trip.id}/calendar`}
              className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-3 border border-indigo-100 dark:border-indigo-900/40">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Calendar Agenda
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Unified flights, hotel check-ins, and activity schedules.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Open Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>

          {/* Destination Stops List */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Expedition Route & Destination Stops
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cities and regions mapped out on this journey
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddStopModal(true)}
                className="text-xs font-semibold rounded-xl"
              >
                Add Stop
              </Button>
            </div>

            {trip.stops && trip.stops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trip.stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center gap-3.5 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs flex-shrink-0 shadow-2xs">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {stop.cityName}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{stop.country}</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                        {formatDateRange(stop.arrivalDate, stop.departureDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddActivity(stop.id, 1)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Add Activity to Stop"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">No stops added yet.</p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setShowAddStopModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                >
                  Add First Stop
                </Button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 2: Itinerary Timeline */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4">
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

              <div className="text-center py-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowAddStopModal(true)}
                  className="text-xs font-semibold rounded-xl"
                >
                  Add Another Destination Stop
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-sm">
              <Compass className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Your Timeline is Empty
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Add destination stops and schedule activities to build your day-by-day timeline.
              </p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddStopModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
              >
                Add First Stop
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Interactive Map View */}
      {activeTab === 'map' && (
        <TripMapView trip={trip} />
      )}

      {/* TAB 4: Collaboration & Travelers */}
      {activeTab === 'travelers' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Trip Members & Collaboration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Invite travel companions to co-plan and edit this expedition.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-2xs"
              >
                Invite Traveler
              </Button>
            </div>

            <div className="space-y-2.5">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {member.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold capitalize bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                      {member.role}
                    </span>
                    {member.status === 'invited' && (
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/40 px-2 py-0.5 rounded-md">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Travel Companion"
        description="Add a friend or co-planner to this travel expedition."
        maxWidth="md"
      >
        <form onSubmit={handleInviteMember} className="space-y-3.5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Companion Name
            </label>
            <input
              type="text"
              required
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="elena@travel.org"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Access Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="editor">Editor (Can add/modify stops and activities)</option>
              <option value="viewer">Viewer (Read-only itinerary view)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            >
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Expedition"
        description="Anyone with this link can view this complete travel itinerary without needing an account."
        maxWidth="md"
      >
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center gap-2 p-3 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none select-all font-mono"
            />
            <Button
              size="sm"
              variant={isCopied ? 'secondary' : 'primary'}
              leftIcon={isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyShareLink}
              className={isCopied ? '' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Preview Public Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Button variant="outline" size="sm" onClick={() => setShowShareModal(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTrip}
        title="Delete Expedition?"
        message={`Are you sure you want to delete "${trip.title}"? This action cannot be undone.`}
        confirmText="Delete Expedition"
        isLoading={isDeleting}
      />
    </div>
  );
};
