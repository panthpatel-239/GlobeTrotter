import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Clock, DollarSign, MapPin, Tag } from 'lucide-react';
import { activitySchema, ActivityFormData } from '../../utils/validators';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { ACTIVITY_CATEGORIES } from '../../constants';

export interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (data: ActivityFormData) => Promise<void>;
  cityName?: string;
  defaultDayNumber?: number;
  totalDaysInStop?: number;
  isLoading?: boolean;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
  cityName = 'Destination',
  defaultDayNumber = 1,
  totalDaysInStop = 5,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: '',
      category: 'Sightseeing',
      dayNumber: defaultDayNumber,
      startTime: '10:00',
      endTime: '12:30',
      cost: 20,
      location: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setValue('dayNumber', defaultDayNumber);
    }
  }, [isOpen, defaultDayNumber, setValue]);

  const categoryOptions = ACTIVITY_CATEGORIES.map((c) => ({ value: c, label: c }));

  const dayOptions = Array.from({ length: Math.max(totalDaysInStop, 1) }, (_, i) => ({
    value: i + 1,
    label: `Day ${i + 1}`,
  }));

  const handleFormSubmit = async (data: ActivityFormData) => {
    await onAddActivity(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Activity to ${cityName}`}
      description="Plan an activity, tour, museum, or dining experience."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-1">
        <Input
          label="Activity Name *"
          placeholder="e.g. Guided Sunrise Temple Tour"
          leftIcon={<Sparkles className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category *"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />

          <Select
            label="Schedule for *"
            options={dayOptions}
            error={errors.dayNumber?.message}
            {...register('dayNumber', { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Start Time"
            type="time"
            leftIcon={<Clock className="w-4 h-4" />}
            error={errors.startTime?.message}
            {...register('startTime')}
          />

          <Input
            label="End Time"
            type="time"
            leftIcon={<Clock className="w-4 h-4" />}
            error={errors.endTime?.message}
            {...register('endTime')}
          />

          <Input
            label="Cost ($ USD)"
            type="number"
            min="0"
            step="5"
            placeholder="0"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.cost?.message}
            {...register('cost', { valueAsNumber: true })}
          />
        </div>

        <Input
          label="Location / Meeting Point"
          placeholder="e.g. Main Gate, Amber Fort"
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.location?.message}
          {...register('location')}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Notes / Booking info
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Pre-booked ticket ID #8843. Bring water bottle."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('notes')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Add Activity
          </Button>
        </div>
      </form>
    </Modal>
  );
};
