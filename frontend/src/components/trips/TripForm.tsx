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
        <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2">
          Trip Cover Image
        </label>
        
        {/* Preview Banner */}
        <div className="relative h-40 sm:h-48 w-full rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.10] shadow-xs mb-3">
          <img
            src={selectedCover}
            alt="Trip Cover Preview"
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] text-white font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">
              Cover Preview
            </span>
          </div>
        </div>

        {/* Preset Selector */}
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">Choose from curated travel covers:</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_COVERS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCoverSelect(preset.url)}
              className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                selectedCover === preset.url
                  ? 'border-[#007AFF] dark:border-[#0A84FF] ring-2 ring-[#007AFF]/20'
                  : 'border-transparent hover:border-black/[0.20]'
              }`}
            >
              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
              {selectedCover === preset.url && (
                <div className="absolute inset-0 bg-[#007AFF]/40 flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Image URL */}
        <div className="mt-2.5">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
          Description / Goals
        </label>
        <textarea
          rows={3}
          placeholder="What do you plan to see, taste, and experience on this trip?"
          className={`w-full rounded-lg border bg-black/[0.02] dark:bg-white/[0.04] p-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#8E8E93] transition-colors focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] ${
            errors.description
              ? 'border-red-500'
              : 'border-black/[0.08] dark:border-white/[0.10]'
          }`}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-[11px] text-[#FF3B30] dark:text-[#FF453A] font-medium">{errors.description.message}</p>
        )}
      </div>

      {/* Submit CTA */}
      <div className="pt-3 flex items-center justify-end gap-2 border-t border-black/[0.06] dark:border-white/[0.08]">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white font-medium shadow-xs"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
