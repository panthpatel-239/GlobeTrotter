import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, Globe, Search, Check, Sparkles, X } from 'lucide-react';
import { tripStopSchema, TripStopFormData } from '../../utils/validators';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { searchGlobalDestinations, GLOBAL_DESTINATIONS } from '../../utils/destinationsData';
import { City } from '../../types';

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
  const [cityInput, setCityInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      coverImage: '',
    },
  });

  const currentCountry = watch('country');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter global destinations dynamically with fuzzy typo tolerance
  const suggestedCities = useMemo(() => {
    return searchGlobalDestinations(cityInput);
  }, [cityInput]);

  const handleSelectCity = (city: { name: string; country: string; image?: string }) => {
    setCityInput(city.name);
    setValue('cityName', city.name, { shouldValidate: true });
    setValue('country', city.country, { shouldValidate: true });
    if (city.image) {
      setValue('coverImage', city.image);
    }
    setIsDropdownOpen(false);
  };

  const handleFormSubmit = async (data: TripStopFormData) => {
    await onAddStop(data);
    reset();
    setCityInput('');
    setIsDropdownOpen(false);
    onClose();
  };

  const popularPills = [
    { name: 'Ahmedabad', country: 'India', image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
    { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
    { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dubai', country: 'United Arab Emirates', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Destination Stop"
      description="Add a city or destination with dynamic search to your journey itinerary."
      maxWidth="md"
    >
      {/* Quick suggestions pills */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Popular Suggestions:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularPills.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleSelectCity(c)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {c.name}, {c.country}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Dynamic City Search with Autocomplete */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              City / Destination *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={cityInput}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setValue('cityName', e.target.value, { shouldValidate: true });
                  setIsDropdownOpen(true);
                }}
                placeholder="e.g. Ahmedabad, Kyoto, Rome..."
                className={`w-full rounded-xl border bg-slate-50/70 dark:bg-slate-800/60 pl-10 pr-8 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.cityName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {cityInput && (
                <button
                  type="button"
                  onClick={() => {
                    setCityInput('');
                    setValue('cityName', '');
                    setIsDropdownOpen(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {errors.cityName && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.cityName.message}</p>
            )}

            {/* Dynamic Suggestions Dropdown */}
            {isDropdownOpen && cityInput.trim().length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-h-56 overflow-y-auto p-1.5 space-y-1">
                {suggestedCities.slice(0, 8).map((city) => (
                  <div
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className="p-2 rounded-lg flex items-center justify-between gap-2.5 cursor-pointer hover:bg-blue-50/70 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {city.name}, <span className="font-normal text-slate-500 dark:text-slate-400">{city.country}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md flex-shrink-0">
                      Select
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Country *"
            placeholder="e.g. India, Japan, France"
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Accommodation & Transit Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Hotel booked in central district. Train reservation #412"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20"
            {...register('notes')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2">
            Add Destination Stop
          </Button>
        </div>
      </form>
    </Modal>
  );
};
