import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, DollarSign, Image as ImageIcon, Map, Sparkles, Check } from 'lucide-react';
import { tripSchema, TripFormData } from '../../utils/validators';
import { Trip } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { TRIP_STATUS_OPTIONS } from '../../constants';

export interface TripFormProps {
  initialData?: Partial<Trip>;
  onSubmit: (data: TripFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
}

const PRESET_COVERS = [
  { label: 'Mountain Vista', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Historic City', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tokyo Nightscape', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Desert Heritage', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Italian Coast', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
];

export const TripForm: React.FC<TripFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Trip',
}) => {
  const [selectedCover, setSelectedCover] = useState(
    initialData?.coverImage || PRESET_COVERS[0].url
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
      endDate: initialData?.endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      coverImage: initialData?.coverImage || PRESET_COVERS[0].url,
      budget: initialData?.budget || 1500,
      status: initialData?.status || 'planned',
    },
  });

  const handleCoverSelect = (url: string) => {
    setSelectedCover(url);
    setValue('coverImage', url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Cover Image Preview & Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Trip Cover Image
        </label>
        
        {/* Preview Banner */}
        <div className="relative h-40 sm:h-48 w-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xs mb-3">
          <img
            src={selectedCover}
            alt="Trip Cover Preview"
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3.5">
            <span className="text-[11px] text-white font-semibold bg-slate-900/60 px-2.5 py-0.5 rounded-lg backdrop-blur-md border border-white/10">
              Cover Preview
            </span>
          </div>
        </div>

        {/* Preset Selector */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Choose from curated travel covers:</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {PRESET_COVERS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCoverSelect(preset.url)}
              className={`relative h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedCover === preset.url
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-2xs'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
              {selectedCover === preset.url && (
                <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Image URL */}
        <div className="mt-3">
          <Input
            placeholder="Or paste a custom image URL (Unsplash, etc.)"
            leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
            value={selectedCover}
            onChange={(e) => {
              setSelectedCover(e.target.value);
              setValue('coverImage', e.target.value);
            }}
            error={errors.coverImage?.message}
          />
        </div>
      </div>

      {/* Title */}
      <Input
        label="Trip Title *"
        placeholder="e.g. Japanese Cherry Blossom Adventure"
        leftIcon={<Map className="w-3.5 h-3.5" />}
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date *"
          type="date"
          leftIcon={<Calendar className="w-3.5 h-3.5" />}
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          label="End Date *"
          type="date"
          leftIcon={<Calendar className="w-3.5 h-3.5" />}
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      {/* Budget & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Estimated Budget ($ USD)"
          type="number"
          step="50"
          placeholder="e.g. 2000"
          leftIcon={<DollarSign className="w-3.5 h-3.5" />}
          error={errors.budget?.message}
          {...register('budget', { valueAsNumber: true })}
        />

        <Select
          label="Trip Status"
          options={TRIP_STATUS_OPTIONS}
          error={errors.status?.message}
          {...register('status')}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
          Description / Goals
        </label>
        <textarea
          rows={3}
          placeholder="What do you plan to see, taste, and experience on this trip?"
          className={`w-full rounded-xl border bg-slate-50/70 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
            errors.description
              ? 'border-rose-500'
              : 'border-slate-200 dark:border-slate-700'
          }`}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">{errors.description.message}</p>
        )}
      </div>

      {/* Submit CTA */}
      <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-500/25 rounded-xl px-4 py-2"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
