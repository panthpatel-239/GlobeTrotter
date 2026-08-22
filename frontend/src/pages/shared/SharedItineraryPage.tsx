import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe2,
  Calendar,
  MapPin,
  DollarSign,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Send,
} from 'lucide-react';
import { shareService } from '../../services/shareService';
import { SharedItinerary } from '../../types';
import { formatDateRange, formatCurrency, calculateDaysBetween } from '../../utils/formatters';
import { StopCard } from '../../components/itinerary/StopCard';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { APP_NAME, APP_TAGLINE } from '../../constants';
import { useToast } from '../../context/ToastContext';

export const SharedItineraryPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const { success } = useToast();

  const [data, setData] = useState<SharedItinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const fetchSharedTrip = async () => {
    if (!shareId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await shareService.getSharedItinerary(shareId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Shared itinerary not found or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedTrip();
  }, [shareId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    success('Link Copied', 'Shared travel itinerary link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this amazing travel itinerary: "${data?.trip.title}" on ${APP_NAME}! ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Planning my upcoming trip with @GlobeTrotter: "${data?.trip.title}" 🌍 Check it out:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
        window.location.href
      )}`,
      '_blank'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton height={260} className="rounded-2xl" />
        <Skeleton height={300} className="rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorState
            title="Itinerary Not Available"
            message={error || 'This shared itinerary link may be private or expired.'}
            onRetry={fetchSharedTrip}
          />
          <div className="text-center mt-4">
            <Link to="/login" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Go to GlobeTrotter Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { trip, user } = data;
  const ownerName = user?.name || 'Explorer';
  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const totalStops = trip.stops?.length || 0;
  const totalActivities = (trip.stops || []).flatMap((s) => s.activities || []).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      {/* Top Floating Public Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-sm">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100">{APP_NAME}</span>
              <span className="hidden sm:inline text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-2">
                Public Travel Guide
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              leftIcon={isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyLink}
              className="text-xs rounded-xl"
            >
              {isCopied ? 'Link Copied' : 'Copy Itinerary Link'}
            </Button>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25"
            >
              <span>Plan Your Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Shared Hero Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-800 bg-slate-950 text-white min-h-[280px] flex flex-col justify-end p-6 sm:p-8">
          <img
            src={
              trip.coverImage ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80'
            }
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top details */}
          <div className="relative z-10 flex items-center justify-between mb-auto pb-4 flex-wrap gap-2.5">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600/30 border border-blue-400/40 text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-md">
                Public Shared Itinerary
              </span>
              <span className="text-xs text-slate-300 font-medium">Curated by {ownerName || 'Explorer'}</span>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-emerald-600 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-blue-600 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Twitter</span>
              </button>
            </div>
          </div>

          {/* Trip Title & Subtitle */}
          <div className="relative z-10 max-w-3xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              {trip.destinationSummary || 'Multi-City Expedition'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">{trip.title}</h1>
            {trip.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {trip.description}
              </p>
            )}

            <div className="flex items-center gap-4 pt-3 text-xs text-slate-300 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {formatDateRange(trip.startDate, trip.endDate)} ({durationDays} Days)
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {totalStops} {totalStops === 1 ? 'City Stop' : 'City Stops'} • {totalActivities} Experiences
              </span>
              <span className="flex items-center gap-1.5 font-bold text-white">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Target Budget: {formatCurrency(trip.budget)}
              </span>
            </div>
          </div>
        </div>

        {/* Day-by-Day Stops & Activities Timeline */}
        <div className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Complete Expedition Itinerary
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Day-by-day destination schedule with curated tours, locations, and timings
            </p>
          </div>

          {trip.stops && trip.stops.length > 0 ? (
            <div className="space-y-4">
              {trip.stops.map((stop, index) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  stopIndex={index}
                  readOnly={true}
                  onAddActivity={() => {}}
                  onDeleteActivity={() => {}}
                  onDeleteStop={() => {}}
                  onToggleActivityComplete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">No destination stops listed in this public guide.</p>
            </div>
          )}
        </div>

        {/* CTA Bottom Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-3">
          <div className="inline-flex p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Inspired to plan your own journey?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Use GlobeTrotter to build day-by-day itineraries, track your budget, and discover hidden gems around the world.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
