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
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton height={260} className="rounded-2xl" />
        <Skeleton height={300} className="rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorState
            title="Itinerary Not Available"
            message={error || 'This shared itinerary link may be private or expired.'}
            onRetry={fetchSharedTrip}
          />
          <div className="text-center mt-4">
            <Link to="/login" className="text-xs font-semibold text-[#007AFF] dark:text-[#0A84FF] hover:underline">
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
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7]">
      {/* Top Floating Public Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/[0.10]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF] dark:bg-[#0A84FF] text-white">
              <Globe2 className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">{APP_NAME}</span>
              <span className="hidden sm:inline text-[10px] text-[#8E8E93] dark:text-[#98989D] ml-2">
                Public Travel Guide
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyLink}
              className="text-xs"
            >
              {isCopied ? 'Link Copied' : 'Copy Itinerary Link'}
            </Button>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white text-xs font-medium shadow-xs"
            >
              <span>Plan Your Trip</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Shared Hero Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-card border border-black/[0.08] dark:border-white/[0.10] bg-[#1C1C1E] text-white min-h-[260px] flex flex-col justify-end p-5 sm:p-8">
          <img
            src={
              trip.coverImage ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80'
            }
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/60 to-transparent" />

          {/* Top details */}
          <div className="relative z-10 flex items-center justify-between mb-auto pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#0A84FF]/20 border border-[#0A84FF]/30 text-[#64D2FF] text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-md">
                Public Shared Itinerary
              </span>
              <span className="text-xs text-[#aeaeb2]">Curated by {ownerName || 'Explorer'}</span>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShareWhatsApp}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-emerald-600 text-white text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#007AFF] text-white text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Twitter</span>
              </button>
            </div>
          </div>

          {/* Trip Title & Subtitle */}
          <div className="relative z-10 max-w-3xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9F0A]">
              {trip.destinationSummary || 'Multi-City Expedition'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">{trip.title}</h1>
            {trip.description && (
              <p className="text-xs sm:text-sm text-[#aeaeb2] leading-relaxed pt-1">
                {trip.description}
              </p>
            )}

            <div className="flex items-center gap-4 pt-3 text-xs text-[#aeaeb2] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0A84FF]" />
                {formatDateRange(trip.startDate, trip.endDate)} ({durationDays} Days)
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0A84FF]" />
                {totalStops} {totalStops === 1 ? 'City Stop' : 'City Stops'} • {totalActivities} Experiences
              </span>
              <span className="flex items-center gap-1.5 font-bold text-white">
                <DollarSign className="w-3.5 h-3.5 text-[#0A84FF]" />
                Target Budget: {formatCurrency(trip.budget)}
              </span>
            </div>
          </div>
        </div>

        {/* Day-by-Day Stops & Activities Timeline */}
        <div className="space-y-4">
          <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-2">
            <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Complete Expedition Itinerary
            </h2>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
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
            <div className="p-8 text-center bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.08] dark:border-white/[0.10]">
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">No destination stops listed in this public guide.</p>
            </div>
          )}
        </div>

        {/* CTA Bottom Banner */}
        <div className="bg-white dark:bg-[#1C1C1E] p-6 sm:p-8 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card text-center space-y-3">
          <div className="inline-flex p-2 rounded-xl bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Inspired to plan your own journey?
          </h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">
            Use GlobeTrotter to build day-by-day itineraries, track your budget, and discover hidden gems around the world.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white text-xs font-semibold shadow-xs"
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
