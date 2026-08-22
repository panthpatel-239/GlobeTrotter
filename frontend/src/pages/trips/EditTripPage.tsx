import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { TripForm } from '../../components/trips/TripForm';
import { tripService } from '../../services/tripService';
import { Trip } from '../../types';
import { TripFormData } from '../../utils/validators';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const EditTripPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trip.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleSubmit = async (data: TripFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await tripService.updateTrip(id, data);
      success('Trip Updated', 'Your trip modifications were saved.');
      navigate(`/trips/${id}`);
    } catch (err: any) {
      toastError('Failed to Update Trip', err.message || 'Please check form values.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton height={400} className="rounded-2xl" />
      </div>
    );
  }

  if (error || !trip) {
    return <ErrorState message={error || 'Trip not found'} onRetry={fetchTrip} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Edit Journey Details</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update trip title, dates, budget targets, or cover image.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <TripForm
          initialData={trip}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitButtonText="Save Changes"
        />
      </div>
    </div>
  );
};
