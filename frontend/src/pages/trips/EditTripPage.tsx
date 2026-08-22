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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
          <Compass className="w-6 h-6 text-[#007AFF] dark:text-[#0A84FF]" />
          <span>Edit Journey Details</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-0.5">
          Update trip title, dates, budget targets, or cover image.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] p-6 sm:p-8 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card">
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
