import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, Globe } from 'lucide-react';
import { tripStopSchema, TripStopFormData } from '../../utils/validators';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { POPULAR_DESTINATIONS } from '../../constants';

export interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (data: TripStopFormData) => Promise<void>;
  tripStartDate?: string;
  tripEndDate?: string;
  isLoading?: boolean;
}

export const AddStopModal: React.FC<AddStopModalProps> = ({
  isOpen,
  onClose,
  onAddStop,
  tripStartDate,
  tripEndDate,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TripStopFormData>({
    resolver: zodResolver(tripStopSchema),
    defaultValues: {
      cityName: '',
      country: '',
      arrivalDate: tripStartDate || new Date().toISOString().split('T')[0],
      departureDate: tripEndDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: '',
    },
  });

  const handleCitySuggestion = (city: typeof POPULAR_DESTINATIONS[0]) => {
    setValue('cityName', city.name);
    setValue('country', city.country);
  };

  const handleFormSubmit = async (data: TripStopFormData) => {
    await onAddStop(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Destination Stop"
      description="Add a city or destination to your journey itinerary."
      maxWidth="md"
    >
      {/* Quick suggestions */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Popular Suggestions:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_DESTINATIONS.slice(0, 5).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCitySuggestion(c)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-medium transition-colors"
            >
              {c.name}, {c.country}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City / Destination *"
            placeholder="e.g. Kyoto"
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.cityName?.message}
            {...register('cityName')}
          />

          <Input
            label="Country *"
            placeholder="e.g. Japan"
            leftIcon={<Globe className="w-4 h-4" />}
            error={errors.country?.message}
            {...register('country')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Arrival Date *"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.arrivalDate?.message}
            {...register('arrivalDate')}
          />

          <Input
            label="Departure Date *"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.departureDate?.message}
            {...register('departureDate')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Accommodation & Transit Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Hotel booked in Gion district. Shinkansen reservation #412"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('notes')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Add Destination Stop
          </Button>
        </div>
      </form>
    </Modal>
  );
};
