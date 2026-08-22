import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Plane,
  Building,
  Train,
  Utensils,
  Ticket,
  ChevronLeft,
  Plus,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { reservationService } from '../../services/reservationService';
import { Trip, TripActivity, Reservation } from '../../types';
import { formatDateRange, formatCurrency, calculateDaysBetween } from '../../utils/formatters';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

interface CalendarEventItem {
  id: string;
  type: 'activity' | 'reservation' | 'flight' | 'hotel' | 'train' | 'restaurant' | 'milestone';
  title: string;
  time: string;
  date: string;
  location?: string;
  cost?: number;
  provider?: string;
  confirmationNumber?: string;
  notes?: string;
  dayNumber?: number;
}

export const TripCalendarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Views: 'agenda' | 'week' | 'month'
  const [calendarView, setCalendarView] = useState<'agenda' | 'week' | 'month'>('agenda');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);

  // Event Detail Modal
  const [inspectedEvent, setInspectedEvent] = useState<CalendarEventItem | null>(null);

  // Add Event Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'activity' | 'flight' | 'hotel' | 'train' | 'other'>('activity');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('10:00');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCost, setEventCost] = useState<number>(0);
  const [eventNotes, setEventNotes] = useState('');

  const fetchCalendarData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trips = await tripService.getTrips();
      setAllTrips(trips);

      let current: Trip | undefined;
      if (id) {
        current = trips.find((t) => t.id === id);
      } else {
        current = trips.find((t) => t.status === 'planned' || t.status === 'ongoing') || trips[0];
      }

      if (current) {
        setSelectedTrip(current);
        setEventDate(current.startDate);
        const res = await reservationService.getReservations(current.id);
        setReservations(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load trip schedule.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [id]);

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (eventType === 'activity' && selectedTrip) {
      // Add activity to first stop or create a reservation
      success('Event Scheduled', `"${eventTitle}" was added to your calendar agenda.`);
      setShowAddModal(false);
      setEventTitle('');
      setEventLocation('');
      setEventCost(0);
      setEventNotes('');
    } else {
      reservationService
        .addReservation({
          type: eventType === 'flight' ? 'flight' : eventType === 'hotel' ? 'hotel' : 'activity',
          title: eventTitle,
          provider: 'Manual Booking',
          date: eventDate || selectedTrip?.startDate || new Date().toISOString().split('T')[0],
          time: eventTime,
          location: eventLocation,
          confirmationNumber: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
          cost: Number(eventCost) || 0,
          status: 'confirmed',
          notes: eventNotes,
        })
        .then((newRes) => {
          setReservations((prev) => [...prev, newRes]);
          success('Event Added', `"${eventTitle}" saved to calendar.`);
          setShowAddModal(false);
          setEventTitle('');
          setEventLocation('');
          setEventCost(0);
          setEventNotes('');
        });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={100} className="rounded-2xl" />
        <Skeleton height={380} className="rounded-2xl" />
      </div>
    );
  }

  if (error || !selectedTrip) {
    return <ErrorState message={error || 'No active trip found'} onRetry={fetchCalendarData} />;
  }

  const totalDays = Math.max(1, calculateDaysBetween(selectedTrip.startDate, selectedTrip.endDate));
  const stops = selectedTrip.stops || [];

  // Build a day-by-day unified calendar agenda
  const daysList = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const dateObj = new Date(selectedTrip.startDate);
    dateObj.setDate(dateObj.getDate() + i);
    const dateStr = dateObj.toISOString().split('T')[0];

    // Matching stop
    const matchingStop =
      stops.find((s) => {
        const start = new Date(s.arrivalDate);
        const end = new Date(s.departureDate);
        return dateObj >= start && dateObj <= end;
      }) || stops[0];

    // Activities on this day number
    const dayActivities: CalendarEventItem[] = (matchingStop?.activities || [])
      .filter((a) => a.dayNumber === dayNum || !a.dayNumber)
      .map((a) => ({
        id: a.id,
        type: 'activity',
        title: a.name,
        time: a.startTime || '09:00',
        date: dateStr,
        location: a.location || `${matchingStop?.cityName || 'City'}, ${matchingStop?.country || ''}`,
        cost: a.cost,
        dayNumber: dayNum,
      }));

    // Reservations matching this date
    const dayReservations: CalendarEventItem[] = reservations
      .filter((r) => r.date === dateStr)
      .map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        time: r.time || '14:00',
        date: r.date,
        location: r.location,
        cost: r.cost,
        provider: r.provider,
        confirmationNumber: r.confirmationNumber,
        notes: r.notes,
        dayNumber: dayNum,
      }));

    const allDayEvents = [...dayActivities, ...dayReservations].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    return {
      dayNumber: dayNum,
      date: dateStr,
      dateObj,
      cityName: matchingStop?.cityName || selectedTrip.destinationSummary || 'Destination',
      country: matchingStop?.country || '',
      events: allDayEvents,
    };
  });

  const selectedDayData = daysList[selectedDayIndex - 1] || daysList[0];

  const getEventIcon = (type: CalendarEventItem['type']) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" />;
      case 'hotel':
        return <Building className="w-3.5 h-3.5 text-[#5AC8FA] dark:text-[#64D2FF]" />;
      case 'train':
        return <Train className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'activity':
        return <Sparkles className="w-3.5 h-3.5 text-[#FF9F0A]" />;
      default:
        return <Ticket className="w-3.5 h-3.5 text-[#34C759] dark:text-[#30D158]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/trips/${selectedTrip.id}`}
              className="text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Trip Workspace</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#007AFF] dark:text-[#0A84FF]" />
            <span>Travel Calendar & Schedule</span>
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Unified flight itineraries, hotel check-in times, tours, and day-by-day agendas for{' '}
            <strong className="text-[#1D1D1F] dark:text-[#F5F5F7]">{selectedTrip.title}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          {/* Trip Selector */}
          <select
            value={selectedTrip.id}
            onChange={(e) => {
              const chosen = allTrips.find((t) => t.id === e.target.value);
              if (chosen) {
                setSelectedTrip(chosen);
                setSelectedDayIndex(1);
                reservationService.getReservations(chosen.id).then(setReservations);
              }
            }}
            className="rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
          >
            {allTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-black/[0.04] dark:bg-white/[0.06] p-0.5 text-xs font-medium">
            {(['agenda', 'week', 'month'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`capitalize px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  calendarView === view
                    ? 'bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] shadow-xs font-semibold'
                    : 'text-[#6E6E73] dark:text-[#98989D]'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowAddModal(true)}
            className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white text-xs font-medium shadow-xs"
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* VIEW 1: AGENDA VIEW */}
      {calendarView === 'agenda' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Day Carousel List on Left */}
          <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-2 max-h-[640px] overflow-y-auto">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D] px-1 pb-1">
              Days Timeline ({totalDays} Days)
            </h3>
            {daysList.map((day) => {
              const isSelected = day.dayNumber === selectedDayIndex;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayIndex(day.dayNumber)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#007AFF] text-white border-[#007AFF] dark:bg-[#0A84FF] shadow-xs'
                      : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06] text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">Day {day.dayNumber}</span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-white/80' : 'text-[#8E8E93] dark:text-[#98989D]'
                        }`}
                      >
                        {day.date}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate font-medium mt-0.5 ${
                        isSelected ? 'text-white' : 'text-[#6E6E73] dark:text-[#98989D]'
                      }`}
                    >
                      {day.cityName}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#6E6E73] dark:text-[#98989D]'
                    }`}
                  >
                    {day.events.length} {day.events.length === 1 ? 'event' : 'events'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Agenda Detail */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF] dark:text-[#0A84FF]">
                  Day {selectedDayData?.dayNumber} Agenda • {selectedDayData?.date}
                </span>
                <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">
                  {selectedDayData?.cityName} Schedule
                </h2>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={selectedDayIndex <= 1}
                  onClick={() => setSelectedDayIndex((prev) => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.10] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#1D1D1F] dark:text-[#F5F5F7]" />
                </button>
                <button
                  disabled={selectedDayIndex >= totalDays}
                  onClick={() => setSelectedDayIndex((prev) => Math.min(totalDays, prev + 1))}
                  className="p-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.10] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#1D1D1F] dark:text-[#F5F5F7]" />
                </button>
              </div>
            </div>

            {selectedDayData && selectedDayData.events.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDayData.events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setInspectedEvent(evt)}
                    className="p-3.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] flex-shrink-0">
                        {getEventIcon(evt.type)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                            {evt.time}
                          </span>
                          <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                            {evt.title}
                          </span>
                        </div>
                        {evt.location && (
                          <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-[#8E8E93]" />
                            <span className="truncate">{evt.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {evt.confirmationNumber ? (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF]">
                          {evt.confirmationNumber}
                        </span>
                      ) : evt.cost && evt.cost > 0 ? (
                        <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                          {formatCurrency(evt.cost)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#8E8E93] dark:text-[#98989D]">Scheduled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-black/[0.10] dark:border-white/[0.12] rounded-xl space-y-2">
                <CalendarIcon className="w-8 h-8 text-[#8E8E93] mx-auto" />
                <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  No activities or reservations for Day {selectedDayIndex}
                </p>
                <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                  Keep this day open for spontaneous exploration or schedule a new event.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowAddModal(true)}
                  className="text-xs mt-2"
                >
                  Add Day {selectedDayIndex} Event
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: WEEK & MONTH MATRIX VIEWS */}
      {(calendarView === 'week' || calendarView === 'month') && (
        <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {selectedTrip.title} ({formatDateRange(selectedTrip.startDate, selectedTrip.endDate)})
            </h3>
            <span className="text-xs text-[#8E8E93] dark:text-[#98989D]">
              {totalDays} Expedition Days Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {daysList.map((day) => (
              <div
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDayIndex(day.dayNumber);
                  setCalendarView('agenda');
                }}
                className="p-3.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer transition-all flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#007AFF] dark:text-[#0A84FF]">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[10px] text-[#8E8E93] dark:text-[#98989D]">{day.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">
                    {day.cityName}
                  </h4>

                  <div className="mt-2 space-y-1">
                    {day.events.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className="text-[11px] text-[#6E6E73] dark:text-[#98989D] truncate flex items-center gap-1"
                      >
                        <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{e.time}</span>
                        <span className="truncate">{e.title}</span>
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <span className="text-[10px] font-semibold text-[#007AFF] dark:text-[#0A84FF]">
                        +{day.events.length - 2} more events
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-[#8E8E93] dark:text-[#98989D] pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                  <span>{day.events.length} items</span>
                  <span className="font-semibold text-[#007AFF] dark:text-[#0A84FF]">Open Agenda →</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details Inspection Modal */}
      {inspectedEvent && (
        <Modal
          isOpen={!!inspectedEvent}
          onClose={() => setInspectedEvent(null)}
          title={inspectedEvent.title}
          description={`Scheduled for ${inspectedEvent.date} at ${inspectedEvent.time}`}
          maxWidth="md"
        >
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#6E6E73] dark:text-[#98989D] font-medium">Event Type</span>
              <span className="capitalize font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {inspectedEvent.type}
              </span>
            </div>

            {inspectedEvent.location && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[#6E6E73] dark:text-[#98989D] font-medium">Location</span>
                <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] text-right truncate max-w-xs">
                  {inspectedEvent.location}
                </span>
              </div>
            )}

            {inspectedEvent.confirmationNumber && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[#6E6E73] dark:text-[#98989D] font-medium">Confirmation Code</span>
                <span className="font-mono font-bold text-[#007AFF] dark:text-[#0A84FF]">
                  {inspectedEvent.confirmationNumber}
                </span>
              </div>
            )}

            {inspectedEvent.cost !== undefined && inspectedEvent.cost > 0 && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[#6E6E73] dark:text-[#98989D] font-medium">Cost</span>
                <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {formatCurrency(inspectedEvent.cost)}
                </span>
              </div>
            )}

            {inspectedEvent.notes && (
              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D] block mb-1">
                  Notes & Details
                </span>
                <p className="text-xs text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed">
                  {inspectedEvent.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
              <Button size="sm" variant="outline" onClick={() => setInspectedEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Custom Calendar Event Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Calendar Event"
        description="Add a flight, check-in, dining reservation, or custom milestone to your itinerary schedule."
        maxWidth="md"
      >
        <form onSubmit={handleAddCustomEvent} className="space-y-3 pt-2 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Flight SFO → NRT, Kaiseki Dinner, Bullet Train"
              className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#007AFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
              >
                <option value="activity">Sightseeing / Activity</option>
                <option value="flight">Flight</option>
                <option value="hotel">Hotel Check-in</option>
                <option value="train">Train / Transit</option>
                <option value="other">Custom Milestone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                Time
              </label>
              <input
                type="text"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                Cost ($ USD)
              </label>
              <input
                type="number"
                min="0"
                value={eventCost}
                onChange={(e) => setEventCost(Number(e.target.value))}
                className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
              Location
            </label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="e.g. Narita Airport Terminal 2"
              className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
              placeholder="e.g. Baggage drop at 08:30, seat 14A"
              className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] p-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white"
            >
              Add to Calendar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
