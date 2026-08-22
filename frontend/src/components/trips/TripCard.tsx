import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  DollarSign,
  ArrowRight,
  MoreVertical,
  Edit2,
  Trash2,
  Route,
  PieChart,
  Share2,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react';
import { Trip } from '../../types';
import { formatDateRange, formatCurrency, calculateDaysBetween } from '../../utils/formatters';
import { TripStatusBadge } from './TripStatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
  onShare?: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete, onShare }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const stopsCount = trip.stops?.length || 0;

  // Calculate total and completed activities
  const allActivities = (trip.stops || []).flatMap((s) => s.activities || []);
  const totalActivities = allActivities.length;
  const completedActivities = allActivities.filter((a) => a.isCompleted).length;
  const progressPercent =
    totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(trip.id);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card hover:border-[#007AFF]/40 dark:hover:border-[#0A84FF]/40 transition-all duration-200 overflow-hidden flex flex-col justify-between">
        {/* Top Cover Image */}
        <div className="relative h-44 w-full overflow-hidden bg-black/[0.04] dark:bg-white/[0.04]">
          <img
            src={
              trip.coverImage ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
            }
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <TripStatusBadge status={trip.status} />
          </div>

          {/* Quick Actions Dropdown Menu */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-colors cursor-pointer"
                aria-label="Trip options"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-[#2C2C2E] p-1 shadow-xl border border-black/[0.08] dark:border-white/[0.10] z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/trips/${trip.id}`);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Route className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" />
                    <span>Open Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/trips/${trip.id}/edit`);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#8E8E93]" />
                    <span>Edit Trip</span>
                  </button>

                  {onShare && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onShare(trip);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#8E8E93]" />
                      <span>Share Plan</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#FF3B30] dark:text-[#FF453A] hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Trip</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Title overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9F0A] block drop-shadow-xs">
              {trip.destinationSummary || 'Multi-Stop Expedition'}
            </span>
            <h3 className="font-bold text-base tracking-tight truncate drop-shadow-xs">{trip.title}</h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {trip.description && (
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-[#6E6E73] dark:text-[#98989D] pt-1">
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF] flex-shrink-0" />
                <span className="truncate">{formatDateRange(trip.startDate, trip.endDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF] flex-shrink-0" />
                <span>
                  {durationDays}d • {stopsCount} {stopsCount === 1 ? 'stop' : 'stops'}
                </span>
              </div>
            </div>

            {/* Preparation / Itinerary Progress */}
            {totalActivities > 0 && (
              <div className="pt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#34C759] dark:text-[#30D158]" />
                    <span>Preparation</span>
                  </span>
                  <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-black/[0.06] dark:bg-white/[0.10] rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-[#34C759] dark:bg-[#30D158] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer with Budget & CTA */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#8E8E93] dark:text-[#98989D] block">
                Target Budget
              </span>
              <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {formatCurrency(trip.budget)}
              </span>
            </div>

            <Link
              to={`/trips/${trip.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#007AFF] hover:text-white dark:hover:bg-[#0A84FF] transition-colors"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Trip?"
        message={`Are you sure you want to remove "${trip.title}"? All scheduled stops, activities, and budget entries will be removed.`}
        confirmText="Delete Trip"
        isLoading={isDeleting}
      />
    </>
  );
};
