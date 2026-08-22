import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Utensils,
  Trees,
  Waves,
  PartyPopper,
  Landmark,
  Plus,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { cityService } from '../../services/cityService';
import { activityService } from '../../services/activityService';
import { City, Activity } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, calculateDaysBetween } from '../../utils/formatters';

const TRIP_TYPES = [
  { id: 'Culture', label: 'Cultural & Heritage', icon: Landmark, desc: 'Museums, ancient temples & royal palaces' },
  { id: 'Food', label: 'Culinary & Dining', icon: Utensils, desc: 'Street food, Michelin dining & cooking workshops' },
  { id: 'Adventure', label: 'Adventure & Treks', icon: Compass, desc: 'Volcano hikes, scuba diving & safaris' },
  { id: 'Nature', label: 'Nature & Wildlife', icon: Trees, desc: 'National parks, waterfalls & aurora chasing' },
  { id: 'Relaxation', label: 'Relaxation & Wellness', icon: Waves, desc: 'Hot springs, luxury spas & private beaches' },
  { id: 'Nightlife', label: 'Nightlife & Social', icon: PartyPopper, desc: 'Izakayas, rooftop cocktail bars & festivals' },
];

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State across 6 steps
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [customDestination, setCustomDestination] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [tripType, setTripType] = useState('Culture');
  const [budget, setBudget] = useState(2500);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [c, a] = await Promise.all([
          cityService.getCities(),
          activityService.getActivities(),
        ]);
        setCities(c);
        setActivities(a);
        if (c.length > 0) {
          setSelectedCity(c[1]); // Default Tokyo
          setCoverImage(c[1].image);
          setTitle(`Expedition to ${c[1].name}`);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadInitialData();
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCoverImage(city.image);
    if (!title || title.startsWith('Expedition to')) {
      setTitle(`Expedition to ${city.name}`);
    }
  };

  const handleToggleActivity = (actId: string) => {
    setSelectedActivityIds((prev) =>
      prev.includes(actId) ? prev.filter((id) => id !== actId) : [...prev, actId]
    );
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!title.trim()) {
        toastError('Title Required', 'Please provide a name for your journey.');
        return false;
      }
    }
    if (step === 2) {
      if (!selectedCity && !customDestination.trim()) {
        toastError('Destination Required', 'Please select or enter a primary destination city.');
        return false;
      }
    }
    if (step === 3) {
      if (!startDate || !endDate) {
        toastError('Dates Required', 'Please specify departure and return dates.');
        return false;
      }
      if (new Date(endDate) <= new Date(startDate)) {
        toastError('Invalid Dates', 'Return date must be after departure date.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateTrip = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    try {
      const cityName = selectedCity?.name || customDestination || 'Global Explorer';
      const country = selectedCity?.country || 'International';

      const matchedActivities = activities.filter((a) => selectedActivityIds.includes(a.id));

      const newTripData = {
        title: title || `Trip to ${cityName}`,
        description:
          description ||
          `An incredible ${tripType.toLowerCase()} journey through ${cityName}, curated with ${matchedActivities.length} custom experiences.`,
        destinationSummary: `${cityName}, ${country}`,
        startDate,
        endDate,
        budget: Number(budget) || 2500,
        currency: 'USD',
        status: 'planned' as const,
        coverImage: coverImage || selectedCity?.image,
        stops: [
          {
            id: `stop-${Date.now()}`,
            cityId: selectedCity?.id || 'city-custom',
            cityName,
            country,
            arrivalDate: startDate,
            departureDate: endDate,
            order: 1,
            activities: matchedActivities.map((act, idx) => ({
              id: `act-${Date.now()}-${idx}`,
              name: act.name,
              category: act.category,
              cost: act.cost,
              durationMinutes: act.durationMinutes,
              location: act.cityName,
              dayNumber: (idx % Math.max(1, calculateDaysBetween(startDate, endDate))) + 1,
              startTime: idx % 2 === 0 ? '10:00' : '14:30',
              isCompleted: false,
            })),
          },
        ],
        expenses: [],
      };

      const created = await tripService.createTrip(newTripData);
      success('Journey Created!', `"${created.title}" is ready in your travel workspace.`);
      navigate(`/trips/${created.id}`);
    } catch (err: any) {
      toastError('Creation Failed', err.message || 'Could not create trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const durationDays = calculateDaysBetween(startDate, endDate);
  const cityFilteredActivities = selectedCity
    ? activities.filter((a) => a.cityId === selectedCity.id)
    : activities.slice(0, 8);

  const stepsList = [
    { num: 1, label: 'Name' },
    { num: 2, label: 'Destination' },
    { num: 3, label: 'Dates' },
    { num: 4, label: 'Style' },
    { num: 5, label: 'Activities' },
    { num: 6, label: 'Review' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Trip Builder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
          Plan Your Next Journey
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-0.5">
          Follow our 6-step guided planner to customize destinations, duration, budget, and daily activities.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="bg-white dark:bg-[#1C1C1E] p-3 sm:p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card">
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
          {stepsList.map((st) => (
            <button
              key={st.num}
              onClick={() => {
                if (st.num < currentStep) setCurrentStep(st.num);
              }}
              disabled={st.num > currentStep}
              className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                st.num === currentStep
                  ? 'text-[#007AFF] dark:text-[#0A84FF] font-bold'
                  : st.num < currentStep
                  ? 'text-[#34C759] dark:text-[#30D158] font-medium'
                  : 'text-[#8E8E93] dark:text-[#98989D] opacity-40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  st.num === currentStep
                    ? 'bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-xs'
                    : st.num < currentStep
                    ? 'bg-emerald-500/10 text-[#34C759] dark:text-[#30D158]'
                    : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#8E8E93]'
                }`}
              >
                {st.num < currentStep ? '✓' : st.num}
              </div>
              <span className="hidden sm:inline text-[11px]">{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 sm:p-7 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card min-h-[380px] flex flex-col justify-between">
        {/* STEP 1: Name & Overview */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                What should we call this expedition?
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Give your journey an inspiring title and optional summary notes.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                  Trip Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Japan Autumn Discovery, Amalfi Coast Retreat"
                  className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3.5 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#007AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                  Trip Description / Purpose
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10 days of ancient temples, culinary discovery, photography and train travel."
                  className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] p-3 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#007AFF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Destination City */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Choose your primary destination
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Select from our curated global cities or enter a custom location.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
              {cities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                return (
                  <div
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className={`rounded-xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#007AFF] dark:border-[#0A84FF] ring-2 ring-[#007AFF]/20 shadow-xs'
                        : 'border-black/[0.08] dark:border-white/[0.10] hover:border-black/[0.20]'
                    }`}
                  >
                    <div className="relative h-20 w-full overflow-hidden bg-black/[0.04]">
                      <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 p-1 bg-[#007AFF] text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                        {city.name}
                      </h4>
                      <p className="text-[10px] text-[#6E6E73] dark:text-[#98989D] truncate">{city.country}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                Or Enter Custom City / Region:
              </label>
              <input
                type="text"
                value={customDestination}
                onChange={(e) => {
                  setCustomDestination(e.target.value);
                  setSelectedCity(null);
                }}
                placeholder="e.g. Patagonia, Reykjavik, Jaipur"
                className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#007AFF]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Dates & Budget */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                When are you traveling and what is your budget?
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Specify travel dates to calculate the day schedule and budget limits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                  Departure Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#007AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                  Return Date *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-2 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#007AFF]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-[#6E6E73] dark:text-[#98989D]">Expedition Duration:</span>
              <span className="font-bold text-[#007AFF] dark:text-[#0A84FF]">
                {durationDays} Travel Days
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Total Estimated Budget ($ USD)
                </label>
                <span className="font-bold text-[#007AFF] dark:text-[#0A84FF] text-sm">
                  {formatCurrency(budget)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#007AFF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8E8E93] dark:text-[#98989D] mt-1">
                <span>$500 Backpacker</span>
                <span>$5,000 Standard</span>
                <span>$15,000+ Luxury</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Travel Style */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                What is the vibe of this trip?
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Select a primary travel style to receive tailored activity suggestions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRIP_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = tripType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setTripType(type.id)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-500/5 dark:bg-blue-500/10 border-[#007AFF] dark:border-[#0A84FF] ring-1 ring-[#007AFF]'
                        : 'border-black/[0.08] dark:border-white/[0.10] hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-[#007AFF] text-white dark:bg-[#0A84FF]'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#6E6E73] dark:text-[#98989D]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{type.label}</h4>
                      <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">{type.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Select Activities */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Schedule Experiences ({selectedActivityIds.length} selected)
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Select tours, food tastings, and landmarks to automatically seed into your itinerary days.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
              {cityFilteredActivities.map((act) => {
                const isSelected = selectedActivityIds.includes(act.id);
                return (
                  <div
                    key={act.id}
                    onClick={() => handleToggleActivity(act.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-500/5 dark:bg-blue-500/10 border-[#007AFF] dark:border-[#0A84FF]'
                        : 'border-black/[0.08] dark:border-white/[0.10] hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={act.image} alt={act.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">{act.name}</h4>
                        <p className="text-[10px] text-[#6E6E73] dark:text-[#98989D] truncate">
                          {act.category} • {act.durationMinutes} min • {act.cost > 0 ? `$${act.cost}` : 'Free'}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#007AFF] border-[#007AFF] text-white'
                          : 'border-black/[0.20] dark:border-white/[0.20]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Review & Finalize */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Review your journey plan
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Confirm details and create your interactive travel itinerary workspace.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.03] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[#6E6E73] dark:text-[#98989D]">Trip Title:</span>
                <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{title}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[#6E6E73] dark:text-[#98989D]">Destination:</span>
                <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {selectedCity?.name || customDestination} ({selectedCity?.country || 'World'})
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[#6E6E73] dark:text-[#98989D]">Dates & Duration:</span>
                <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {startDate} to {endDate} ({durationDays} days)
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-[#6E6E73] dark:text-[#98989D]">Budget Allocation:</span>
                <span className="font-bold text-[#34C759] dark:text-[#30D158]">{formatCurrency(budget)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6E6E73] dark:text-[#98989D]">Scheduled Activities:</span>
                <span className="font-bold text-[#007AFF] dark:text-[#0A84FF]">
                  {selectedActivityIds.length} items
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-between border-t border-black/[0.06] dark:border-white/[0.08] mt-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="text-xs"
          >
            Back
          </Button>

          {currentStep < 6 ? (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleNext}
              className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white text-xs font-medium"
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={handleCreateTrip}
              isLoading={isSubmitting}
              className="bg-[#34C759] hover:bg-[#28A745] dark:bg-[#30D158] text-white text-xs font-bold shadow-xs"
            >
              Create Trip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
