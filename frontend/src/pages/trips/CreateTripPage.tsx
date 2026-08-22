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
  X,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { cityService } from '../../services/cityService';
import { activityService } from '../../services/activityService';
import { itineraryService } from '../../services/itineraryService';
import { City, Activity } from '../../types';
import { Button } from '../../components/common/Button';
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

  // Form State across 6 steps (Multi-select enabled for destinations and styles)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [customDestination, setCustomDestination] = useState('');
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>(['Culture']);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
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
          const defaultCity = c[1] || c[0];
          setSelectedCities([defaultCity]);
          setCoverImage(defaultCity.image);
          setTitle(`Expedition to ${defaultCity.name}`);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadInitialData();
  }, []);

  // Multi-City Toggle
  const handleToggleCity = (city: City) => {
    setSelectedCities((prev) => {
      const isSelected = prev.some((c) => c.id === city.id);
      let updated: City[];
      if (isSelected) {
        if (prev.length === 1 && !customDestination.trim()) {
          // Keep at least one or allow unselecting if custom destination is entered
          updated = [];
        } else {
          updated = prev.filter((c) => c.id !== city.id);
        }
      } else {
        updated = [...prev, city];
      }

      // Update default title & cover image if appropriate
      if (updated.length > 0) {
        setCoverImage(updated[updated.length - 1].image);
        const cityNames = updated.map((c) => c.name);
        if (cityNames.length === 1) {
          setTitle(`Expedition to ${cityNames[0]}`);
        } else if (cityNames.length === 2) {
          setTitle(`Expedition to ${cityNames[0]} & ${cityNames[1]}`);
        } else {
          setTitle(`Grand Expedition to ${cityNames.slice(0, 2).join(', ')} +${cityNames.length - 2}`);
        }
      }
      return updated;
    });
  };

  // Multi-Style Toggle
  const handleToggleTripType = (typeId: string) => {
    setSelectedTripTypes((prev) => {
      if (prev.includes(typeId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((t) => t !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
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
      if (selectedCities.length === 0 && !customDestination.trim()) {
        toastError('Destination Required', 'Please select at least one destination city or enter a custom location.');
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
    if (step === 4) {
      if (selectedTripTypes.length === 0) {
        toastError('Travel Style Required', 'Please select at least one travel vibe.');
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
      const cityNames = selectedCities.map((c) => c.name);
      const destinationSummary =
        cityNames.length > 0
          ? cityNames.join(', ')
          : customDestination || 'Global Explorer';

      const styleLabels = selectedTripTypes
        .map((t) => TRIP_TYPES.find((item) => item.id === t)?.label || t)
        .join(' & ');

      const matchedActivities = activities.filter((a) => selectedActivityIds.includes(a.id));
      const totalDays = Math.max(1, calculateDaysBetween(startDate, endDate));
      const numStops = Math.max(1, selectedCities.length);
      const daysPerStop = Math.max(1, Math.floor(totalDays / numStops));

      // Build stops for each selected city
      const generatedStops =
        selectedCities.length > 0
          ? selectedCities.map((city, idx) => {
              const arrival = new Date(startDate);
              arrival.setDate(arrival.getDate() + idx * daysPerStop);
              const departure = new Date(arrival);
              if (idx === selectedCities.length - 1) {
                departure.setTime(new Date(endDate).getTime());
              } else {
                departure.setDate(departure.getDate() + daysPerStop);
              }

              const cityActs = matchedActivities.filter((a) => a.cityId === city.id);

              return {
                id: `stop-${Date.now()}-${idx}`,
                cityId: city.id,
                cityName: city.name,
                country: city.country,
                coverImage: city.image,
                arrivalDate: arrival.toISOString().split('T')[0],
                departureDate: departure.toISOString().split('T')[0],
                order: idx + 1,
                activities: cityActs.map((act, aIdx) => ({
                  id: `act-${Date.now()}-${idx}-${aIdx}`,
                  name: act.name,
                  category: act.category,
                  cost: act.cost,
                  durationMinutes: act.durationMinutes,
                  location: act.cityName,
                  dayNumber: (aIdx % daysPerStop) + 1,
                  startTime: aIdx % 2 === 0 ? '10:00 AM' : '02:30 PM',
                  isCompleted: false,
                })),
              };
            })
          : [
              {
                id: `stop-${Date.now()}`,
                cityId: 'city-custom',
                cityName: customDestination || 'Global Explorer',
                country: 'International',
                coverImage: coverImage,
                arrivalDate: startDate,
                departureDate: endDate,
                order: 1,
                activities: matchedActivities.map((act, aIdx) => ({
                  id: `act-${Date.now()}-${aIdx}`,
                  name: act.name,
                  category: act.category,
                  cost: act.cost,
                  durationMinutes: act.durationMinutes,
                  location: act.cityName,
                  dayNumber: (aIdx % totalDays) + 1,
                  startTime: aIdx % 2 === 0 ? '10:00 AM' : '02:30 PM',
                  isCompleted: false,
                })),
              },
            ];

      const newTripData = {
        title: title || `Trip to ${destinationSummary}`,
        description:
          description ||
          `An incredible ${styleLabels} journey across ${destinationSummary}, curated with ${matchedActivities.length} custom experiences.`,
        destinationSummary,
        startDate,
        endDate,
        budget: Number(budget) || 2500,
        budgetLimit: Number(budget) || 2500,
        currency: 'USD',
        status: 'planned' as const,
        coverImage: coverImage || (selectedCities[0]?.image ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'),
        stops: generatedStops,
        expenses: [],
      };

      const created = await tripService.createTrip(newTripData);
      
      // If trip was created on backend, also seed the stops & activities if needed
      if (created && created.id && selectedCities.length > 0) {
        for (const stop of generatedStops) {
          try {
            const addedStop = await itineraryService.addStop(created.id, {
              cityName: stop.cityName,
              country: stop.country,
              arrivalDate: stop.arrivalDate,
              departureDate: stop.departureDate,
              coverImage: stop.coverImage,
            });
            if (addedStop && addedStop.id && stop.activities.length > 0) {
              for (const act of stop.activities) {
                await itineraryService.addActivity(created.id, addedStop.id, {
                  name: act.name,
                  category: act.category,
                  cost: act.cost,
                  dayNumber: act.dayNumber,
                  startTime: act.startTime,
                  location: act.location,
                });
              }
            }
          } catch (e) {
            // Non-blocking if stops were already handled
          }
        }
      }

      success('Journey Created!', `"${created.title}" is ready with ${selectedCities.length} destination stop(s).`);
      navigate(`/trips/${created.id}`);
    } catch (err: any) {
      toastError('Creation Failed', err.response?.data?.message || err.message || 'Could not create trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const durationDays = calculateDaysBetween(startDate, endDate);

  // Filter activities based on selected cities and filter tab
  const cityFilteredActivities = activities.filter((a) => {
    if (selectedCityFilter !== 'all') {
      return a.cityId === selectedCityFilter;
    }
    if (selectedCities.length > 0) {
      return selectedCities.some((c) => c.id === a.cityId);
    }
    return true;
  });

  const stepsList = [
    { num: 1, label: 'Name' },
    { num: 2, label: 'Destinations' },
    { num: 3, label: 'Dates' },
    { num: 4, label: 'Styles' },
    { num: 5, label: 'Activities' },
    { num: 6, label: 'Review' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Plan Your Next Journey</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Follow our 6-step guided planner to customize destinations, duration, budget, and daily activities.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
          {stepsList.map((st) => (
            <button
              key={st.num}
              onClick={() => {
                if (st.num < currentStep) setCurrentStep(st.num);
              }}
              disabled={st.num > currentStep}
              className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                st.num === currentStep
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : st.num < currentStep
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-slate-400 dark:text-slate-500 opacity-40'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  st.num === currentStep
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : st.num < currentStep
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {st.num < currentStep ? '✓' : st.num}
              </div>
              <span className="hidden sm:inline text-[11px] font-semibold">{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[420px] flex flex-col justify-between">
        {/* STEP 1: Name & Overview */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                What should we call this expedition?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Give your journey an inspiring title and optional summary notes.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                  Trip Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Japan Autumn Discovery, European Grand Tour"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                  Trip Description / Purpose
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Multi-city journey exploring ancient temples, culinary discovery, photography and train travel."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Destination Cities (Multi-Select) */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Choose your destinations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select one or more cities for your expedition, or enter a custom location.
                </p>
              </div>

              {selectedCities.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800/60 self-start sm:self-auto">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedCities.length} {selectedCities.length === 1 ? 'City Selected' : 'Cities Selected'}</span>
                </div>
              )}
            </div>

            {/* Selected Pills */}
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 self-center mr-1">
                  Stops:
                </span>
                {selectedCities.map((city, idx) => (
                  <span
                    key={city.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs border border-slate-200 dark:border-slate-700"
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{city.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCity(city);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Cities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
              {cities.map((city) => {
                const selectedIndex = selectedCities.findIndex((c) => c.id === city.id);
                const isSelected = selectedIndex >= 0;

                return (
                  <div
                    key={city.id}
                    onClick={() => handleToggleCity(city)}
                    className={`rounded-xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="relative h-20 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-md shadow-sm">
                          <Check className="w-3 h-3" />
                          <span>Stop #{selectedIndex + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {city.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{city.country}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Or Add Custom City / Region:
              </label>
              <input
                type="text"
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="e.g. Patagonia, Reykjavik, Jaipur"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Dates & Budget */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                When are you traveling and what is your budget?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specify travel dates to calculate the schedule across your {selectedCities.length || 1} destination stop(s).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                  Departure Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                  Return Date *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Expedition Duration:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {durationDays} Travel Days ({selectedCities.length} {selectedCities.length === 1 ? 'Destination' : 'Destinations'})
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-900 dark:text-slate-100">
                  Total Estimated Budget ($ USD)
                </label>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
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
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>$500 Backpacker</span>
                <span>$5,000 Standard</span>
                <span>$15,000+ Luxury</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Travel Styles (Multi-Select) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  What is the vibe of this trip?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select all travel styles that match your trip (multiple styles supported).
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800/60 self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedTripTypes.length} {selectedTripTypes.length === 1 ? 'Style Selected' : 'Styles Selected'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TRIP_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedTripTypes.includes(type.id);
                return (
                  <div
                    key={type.id}
                    onClick={() => handleToggleTripType(type.id)}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-600 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{type.label}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{type.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
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

        {/* STEP 5: Select Activities */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Schedule Experiences ({selectedActivityIds.length} selected)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select experiences to automatically schedule into your destination stops.
                </p>
              </div>

              {/* City Filter Pills if multiple destinations */}
              {selectedCities.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCityFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCityFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    All Cities
                  </button>
                  {selectedCities.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCityFilter(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        selectedCityFilter === c.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
              {cityFilteredActivities.map((act) => {
                const isSelected = selectedActivityIds.includes(act.id);
                return (
                  <div
                    key={act.id}
                    onClick={() => handleToggleActivity(act.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-600 ring-1 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={act.image} alt={act.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{act.name}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {act.cityName && <span className="font-semibold text-blue-600 dark:text-blue-400">{act.cityName} • </span>}
                          {act.category} • {act.durationMinutes} min • {act.cost > 0 ? `$${act.cost}` : 'Free'}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Review your journey plan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirm details and create your interactive multi-city travel workspace.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Trip Title:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{title}</span>
              </div>
              
              <div className="flex items-start justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 mt-1">Destinations ({selectedCities.length}):</span>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
                  {selectedCities.map((c, i) => (
                    <span key={c.id} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-800/50">
                      #{i + 1} {c.name}
                    </span>
                  ))}
                  {customDestination && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                      {customDestination}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 mt-1">Travel Styles:</span>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
                  {selectedTripTypes.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800/50">
                      {TRIP_TYPES.find((item) => item.id === t)?.label || t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Dates & Duration:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {startDate} to {endDate} ({durationDays} days)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Budget Allocation:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(budget)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Scheduled Experiences:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedActivityIds.length} items
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="text-xs rounded-xl"
          >
            Back
          </Button>

          {currentStep < 6 ? (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-4 py-2"
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-500/25 rounded-xl px-5 py-2"
            >
              Create Trip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
