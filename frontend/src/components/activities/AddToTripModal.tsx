import React, { useState, useEffect } from 'react';
import { Trip, City, Activity } from '../../types';
import { tripService } from '../../services/tripService';
import { itineraryService } from '../../services/itineraryService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Compass, MapPin, Sparkles, Calendar } from 'lucide-react';

export interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityItem?: City | null;
  activityItem?: Activity | null;
  onSuccess?: () => void;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({
  isOpen,
  onClose,
  cityItem,
  activityItem,
  onSuccess,
}) => {
  const { success, error: toastError } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [selectedStopId, setSelectedStopId] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const loadUserTrips = async () => {
        setIsLoading(true);
        try {
          const userTrips = await tripService.getTrips();
          setTrips(userTrips);
          if (userTrips.length > 0) {
            setSelectedTripId(userTrips[0].id);
            if (userTrips[0].stops && userTrips[0].stops.length > 0) {
              setSelectedStopId(userTrips[0].stops[0].id);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadUserTrips();
    }
  }, [isOpen]);

  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) {
      toastError('Select a Trip', 'Please choose a trip first.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (cityItem) {
        // Adding a city stop
        await itineraryService.addStop(selectedTripId, {
          cityName: cityItem.name,
          country: cityItem.country,
          arrivalDate: selectedTrip?.startDate || new Date().toISOString().split('T')[0],
          departureDate: selectedTrip?.endDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          notes: `Added from City Discovery: ${cityItem.description.slice(0, 100)}...`,
          coverImage: cityItem.image,
        });
        success('Stop Added!', `${cityItem.name} added to "${selectedTrip?.title}"`);
      } else if (activityItem) {
        // Adding an activity to a stop
        let stopId = selectedStopId;
        if (!stopId && selectedTrip?.stops && selectedTrip.stops.length > 0) {
          stopId = selectedTrip.stops[0].id;
        }

        if (!stopId) {
          // If trip has no stops, create one first for this activity
          const newStop = await itineraryService.addStop(selectedTripId, {
            cityName: activityItem.cityName || 'Destination',
            country: 'Travel Spot',
            arrivalDate: selectedTrip?.startDate || new Date().toISOString().split('T')[0],
            departureDate: selectedTrip?.endDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            notes: 'Created automatically for activity.',
          });
          stopId = newStop.id;
        }

        await itineraryService.addActivity(selectedTripId, stopId, {
          activityId: activityItem.id,
          name: activityItem.name,
          category: activityItem.category,
          dayNumber,
          cost: activityItem.cost,
          location: activityItem.location || activityItem.cityName,
          notes: activityItem.description,
        });
        success('Activity Added!', `"${activityItem.name}" added to "${selectedTrip?.title}"`);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toastError('Failed to Add', err.message || 'Could not add item to trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cityItem ? `Add ${cityItem.name} to Trip` : `Add "${activityItem?.name}" to Trip`}
      description="Select which trip itinerary you'd like to add this to."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {trips.length > 0 ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Select Target Trip *
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => {
                  setSelectedTripId(e.target.value);
                  const trip = trips.find((t) => t.id === e.target.value);
                  if (trip?.stops && trip.stops.length > 0) {
                    setSelectedStopId(trip.stops[0].id);
                  } else {
                    setSelectedStopId('');
                  }
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.title} ({trip.startDate} to {trip.endDate})
                  </option>
                ))}
              </select>
            </div>

            {/* If adding an activity, show stop and day picker */}
            {activityItem && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedTrip?.stops && selectedTrip.stops.length > 0 ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Destination Stop
                    </label>
                    <select
                      value={selectedStopId}
                      onChange={(e) => setSelectedStopId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none"
                    >
                      {selectedTrip.stops.map((stop) => (
                        <option key={stop.id} value={stop.id}>
                          {stop.cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Destination Stop
                    </label>
                    <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                      A new stop will be automatically created for this activity.
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Schedule for Day
                  </label>
                  <select
                    value={dayNumber}
                    onChange={(e) => setDayNumber(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                      <option key={d} value={d}>
                        Day {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
                Confirm & Add
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              You don't have any active trips yet. Create a trip first!
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onClose();
                window.location.href = '/trips/create';
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            >
              Create a Trip
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};
