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
        return <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'hotel':
        return <Building className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'train':
        return <Train className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'activity':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              to={`/trips/${selectedTrip.id}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Trip Workspace</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Travel Calendar & Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unified flight itineraries, hotel check-in times, tours, and day-by-day agendas for{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">{selectedTrip.title}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            {allTrips.map((t) => (
              <option key={t.id} value={t.id} className="bg-white dark:bg-slate-900">
                {t.title}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            {(['agenda', 'week', 'month'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`capitalize px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  calendarView === view
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs rounded-xl px-4 py-2"
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* VIEW 1: AGENDA VIEW */}
      {calendarView === 'agenda' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Day Carousel List on Left */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 max-h-[640px] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 pb-1">
              Days Timeline ({totalDays} Days)
            </h3>
            {daysList.map((day) => {
              const isSelected = day.dayNumber === selectedDayIndex;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayIndex(day.dayNumber)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">Day {day.dayNumber}</span>
                      <span
                        className={`text-[10px] font-medium ${
                          isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {day.date}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate font-medium mt-0.5 ${
                        isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {day.cityName}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {day.events.length} {day.events.length === 1 ? 'event' : 'events'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Agenda Detail */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Day {selectedDayData?.dayNumber} Agenda • {selectedDayData?.date}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedDayData?.cityName} Schedule
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={selectedDayIndex <= 1}
                  onClick={() => setSelectedDayIndex((prev) => Math.max(1, prev - 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </button>
                <button
                  disabled={selectedDayIndex >= totalDays}
                  onClick={() => setSelectedDayIndex((prev) => Math.min(totalDays, prev + 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>

            {selectedDayData && selectedDayData.events.length > 0 ? (
              <div className="space-y-3">
                {selectedDayData.events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setInspectedEvent(evt)}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3.5 cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 flex-shrink-0 shadow-2xs">
                        {getEventIcon(evt.type)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {evt.time}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {evt.title}
                          </span>
                        </div>
                        {evt.location && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{evt.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {evt.confirmationNumber ? (
                        <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                          {evt.confirmationNumber}
                        </span>
                      ) : evt.cost && evt.cost > 0 ? (
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(evt.cost)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Scheduled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  No activities or reservations for Day {selectedDayIndex}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Keep this day open for spontaneous exploration or schedule a new event.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowAddModal(true)}
                  className="text-xs mt-2 font-semibold rounded-xl"
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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {selectedTrip.title} ({formatDateRange(selectedTrip.startDate, selectedTrip.endDate)})
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {totalDays} Expedition Days Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {daysList.map((day) => (
              <div
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDayIndex(day.dayNumber);
                  setCalendarView('agenda');
                }}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between min-h-[150px] shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">{day.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {day.cityName}
                  </h4>

                  <div className="mt-2.5 space-y-1.5">
                    {day.events.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className="text-[11px] text-slate-600 dark:text-slate-400 truncate flex items-center gap-1.5"
                      >
                        <span className="font-bold text-slate-900 dark:text-slate-100">{e.time}</span>
                        <span className="truncate">{e.title}</span>
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block pt-0.5">
                        +{day.events.length - 2} more events
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>{day.events.length} items</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Open Agenda →</span>
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
          <div className="space-y-3.5 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Event Type</span>
              <span className="capitalize font-bold text-slate-900 dark:text-slate-100">
                {inspectedEvent.type}
              </span>
            </div>

            {inspectedEvent.location && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Location</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right truncate max-w-xs">
                  {inspectedEvent.location}
                </span>
              </div>
            )}

            {inspectedEvent.confirmationNumber && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Confirmation Code</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {inspectedEvent.confirmationNumber}
                </span>
              </div>
            )}

            {inspectedEvent.cost !== undefined && inspectedEvent.cost > 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Cost</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">
                  {formatCurrency(inspectedEvent.cost)}
                </span>
              </div>
            )}

            {inspectedEvent.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                  Notes & Details
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {inspectedEvent.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" variant="outline" onClick={() => setInspectedEvent(null)} className="rounded-xl">
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
        <form onSubmit={handleAddCustomEvent} className="space-y-3.5 pt-2 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Flight SFO → NRT, Kaiseki Dinner, Bullet Train"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="activity">Sightseeing / Activity</option>
                <option value="flight">Flight</option>
                <option value="hotel">Hotel Check-in</option>
                <option value="train">Train / Transit</option>
                <option value="other">Custom Milestone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Time
              </label>
              <input
                type="text"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Cost ($ USD)
              </label>
              <input
                type="number"
                min="0"
                value={eventCost}
                onChange={(e) => setEventCost(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="e.g. Narita Airport Terminal 2"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
              placeholder="e.g. Baggage drop at 08:30, seat 14A"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            >
              Add to Calendar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
