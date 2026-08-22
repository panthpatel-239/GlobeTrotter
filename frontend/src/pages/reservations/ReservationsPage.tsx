import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Plane,
  Building,
  Train,
  Utensils,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import { reservationService } from '../../services/reservationService';
import { Reservation } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const ReservationsPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState<Reservation['type']>('hotel');
  const [provider, setProvider] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [location, setLocation] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleAddReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !provider) {
      toastError('Missing Details', 'Please provide a title and provider name.');
      return;
    }

    try {
      await reservationService.addReservation({
        type,
        provider,
        title,
        date,
        time,
        location,
        confirmationNumber: confirmationNumber || `RES-${Math.floor(100000 + Math.random() * 900000)}`,
        cost: Number(cost) || 0,
        status: 'confirmed',
        notes,
      });
      success('Booking Added', `"${title}" has been saved to your reservations.`);
      setShowAddModal(false);
      // Reset
      setTitle('');
      setProvider('');
      setLocation('');
      setConfirmationNumber('');
      setCost(0);
      setNotes('');
      fetchReservations();
    } catch (err: any) {
      toastError('Error', err.message || 'Could not add reservation.');
    }
  };

  const handleDeleteReservation = async () => {
    if (!deletingId) return;
    try {
      await reservationService.deleteReservation(deletingId);
      success('Removed', 'Booking reservation deleted.');
      setDeletingId(null);
      fetchReservations();
    } catch (err: any) {
      toastError('Error', err.message || 'Could not delete reservation.');
    }
  };

  const filtered =
    selectedType === 'all'
      ? reservations
      : reservations.filter((r) => r.type === selectedType);

  const getTypeIcon = (t: Reservation['type']) => {
    switch (t) {
      case 'flight':
        return <Plane className="w-4 h-4 text-brand-600 dark:text-brand-400" />;
      case 'hotel':
        return <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'train':
        return <Train className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'restaurant':
        return <Utensils className="w-4 h-4 text-accent-500 dark:text-accent-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Booking Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-sand-900 dark:text-[#F4F7F5] tracking-tight">
            Reservations & Bookings
          </h1>
          <p className="text-sm text-sand-600 dark:text-[#A7B3AD] mt-0.5">
            Track confirmation numbers, check-in times, and booking vouchers for flights, hotels, trains, and dining.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:text-sand-950 font-bold"
        >
          Add Booking
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Bookings' },
          { id: 'flight', label: 'Flights' },
          { id: 'hotel', label: 'Hotels & Stays' },
          { id: 'train', label: 'Trains & Transit' },
          { id: 'restaurant', label: 'Dining' },
          { id: 'activity', label: 'Activities' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedType === t.id
                ? 'bg-sand-900 dark:bg-brand-500 text-white dark:text-sand-950 shadow-2xs'
                : 'bg-white dark:bg-[#121A18] border border-sand-300 dark:border-[#28342F] text-sand-600 dark:text-[#A7B3AD] hover:text-sand-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={110} className="rounded-3xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-[#121A18] p-5 rounded-3xl border border-sand-300 dark:border-[#28342F] shadow-card hover:shadow-soft transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-sand-100 dark:bg-[#18221F] border border-sand-200 dark:border-[#28342F] flex-shrink-0">
                  {getTypeIcon(res.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-sand-900 dark:text-[#F4F7F5]">{res.title}</h3>
                    {getStatusBadge(res.status)}
                  </div>
                  <p className="text-xs text-sand-600 dark:text-[#A7B3AD] font-medium">{res.provider}</p>
                  <div className="flex items-center gap-4 text-xs text-sand-500 dark:text-[#A7B3AD] flex-wrap pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sand-400" />
                      <span>{res.date}</span>
                    </span>
                    {res.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sand-400" />
                        <span>{res.time}</span>
                      </span>
                    )}
                    {res.location && (
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-sand-400" />
                        <span className="truncate">{res.location}</span>
                      </span>
                    )}
                  </div>
                  {res.notes && (
                    <p className="text-[11px] text-brand-700 dark:text-brand-300 font-medium italic pt-1">{res.notes}</p>
                  )}
                </div>
              </div>

              {/* Right Side: Confirmation Code & Delete */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-sand-200 dark:border-[#28342F]">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-sand-400 block tracking-wider">
                    Confirmation No.
                  </span>
                  <span className="font-mono text-xs font-black text-sand-900 dark:text-[#F4F7F5] bg-sand-100 dark:bg-[#18221F] px-2 py-0.5 rounded border border-sand-300 dark:border-[#28342F]">
                    {res.confirmationNumber}
                  </span>
                  {res.cost > 0 && (
                    <p className="text-xs font-bold text-sand-700 dark:text-sand-300 mt-1">
                      {formatCurrency(res.cost)}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setDeletingId(res.id)}
                  className="p-2 rounded-xl text-sand-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Remove reservation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Bookings Found"
          description="Keep all your flight, hotel, and transit confirmation vouchers organized in one place."
          actionText="Add First Booking"
          onAction={() => setShowAddModal(true)}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}

      {/* Add Booking Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Travel Booking"
        description="Save your flight, hotel, train or dining reservation details."
        maxWidth="lg"
      >
        <form onSubmit={handleAddReservation} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Booking Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Reservation['type'])}
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
              >
                <option value="flight">Flight</option>
                <option value="hotel">Hotel / Ryokan</option>
                <option value="train">Train / Transit</option>
                <option value="restaurant">Restaurant Table</option>
                <option value="activity">Tour / Activity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Provider / Airline</label>
              <input
                type="text"
                required
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Japan Airlines, Hotel Gracery"
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Booking Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Roundtrip SFO to Narita Tokyo"
              className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Time / Check-in</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 11:45 AM or 3:00 PM"
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Confirmation Code</label>
              <input
                type="text"
                value={confirmationNumber}
                onChange={(e) => setConfirmationNumber(e.target.value)}
                placeholder="e.g. JL-8849201"
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Cost ($ USD)</label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Location / Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Shinjuku Kabukicho, Tokyo"
              className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Notes / Instructions</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Baggage allowance, breakfast included, terminal details..."
              className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] p-3 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-200 dark:border-[#28342F]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:text-sand-950 font-bold"
            >
              Save Reservation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteReservation}
        title="Delete Booking Reservation?"
        message="Are you sure you want to remove this booking from your travel itinerary records?"
        confirmText="Delete Booking"
      />
    </div>
  );
};
