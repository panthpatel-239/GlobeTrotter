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
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
        {/* Top Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={
              trip.coverImage ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
            }
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />

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
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900 transition-colors cursor-pointer border border-white/10"
                aria-label="Trip options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-xl border border-slate-200 dark:border-slate-700 z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/trips/${trip.id}`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <Route className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Open Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/trips/${trip.id}/edit`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 text-slate-400" />
                    <span>Edit Trip</span>
                  </button>

                  {onShare && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onShare(trip);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-slate-400" />
                      <span>Share Plan</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Trip</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Title overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block drop-shadow-xs">
              {trip.destinationSummary || 'Multi-Stop Expedition'}
            </span>
            <h3 className="font-extrabold text-base tracking-tight truncate drop-shadow-sm">{trip.title}</h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            {trip.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">{formatDateRange(trip.startDate, trip.endDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>
                  {durationDays}d • {stopsCount} {stopsCount === 1 ? 'stop' : 'stops'}
                </span>
              </div>
            </div>

            {/* Preparation / Itinerary Progress */}
            {totalActivities > 0 && (
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Preparation</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer with Budget & CTA */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Target Budget
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(trip.budget)}
              </span>
            </div>

            <Link
              to={`/trips/${trip.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-2xs"
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
