import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Plus,
  Trash2,
  MapPin,
  Sparkles,
  DollarSign,
  Star,
  FolderHeart,
  ArrowRight,
} from 'lucide-react';
import { savedService } from '../../services/savedService';
import { cityService } from '../../services/cityService';
import { activityService } from '../../services/activityService';
import { SavedItem, City, Activity } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { AddToTripModal } from '../../components/activities/AddToTripModal';
import { CityDetailModal } from '../../components/cities/CityDetailModal';
import { ActivityDetailModal } from '../../components/activities/ActivityDetailModal';
import { useToast } from '../../context/ToastContext';

export const SavedItemsPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('All');

  // Modals state
  const [selectedCityForDetail, setSelectedCityForDetail] = useState<City | null>(null);
  const [selectedActivityForDetail, setSelectedActivityForDetail] = useState<Activity | null>(null);
  const [addToTripCity, setAddToTripCity] = useState<City | null>(null);
  const [addToTripActivity, setAddToTripActivity] = useState<Activity | null>(null);

  const fetchSaved = async () => {
    setIsLoading(true);
    try {
      const [items, c, a] = await Promise.all([
        savedService.getSavedItems(),
        cityService.getCities(),
        activityService.getActivities(),
      ]);
      setSavedItems(items);
      setCities(c);
      setActivities(a);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (itemId: string) => {
    try {
      await savedService.removeSavedItem(itemId);
      setSavedItems((prev) => prev.filter((i) => i.itemId !== itemId && i.id !== itemId));
      success('Item Removed', 'Removed from your saved wishlists.');
    } catch (err: any) {
      toastError('Error', err.message);
    }
  };

  const collections = ['All', 'Japan 2026', 'Food Experiences', 'Weekend Ideas'];

  const filteredItems =
    selectedCollection === 'All'
      ? savedItems
      : savedItems.filter((i) => i.collection === selectedCollection);

  const handleItemClick = (item: SavedItem) => {
    if (item.type === 'destination') {
      const city = cities.find((c) => c.id === item.itemId || c.name === item.title);
      if (city) setSelectedCityForDetail(city);
    } else {
      const act = activities.find((a) => a.id === item.itemId || a.name === item.title);
      if (act) setSelectedActivityForDetail(act);
    }
  };

  const handleAddToTrip = (item: SavedItem) => {
    if (item.type === 'destination') {
      const city = cities.find((c) => c.id === item.itemId || c.name === item.title) || {
        id: item.itemId,
        name: item.title,
        country: item.subtitle?.split('•')[0]?.trim() || 'World',
        description: '',
        image: item.image,
        costIndex: 'moderate' as const,
        popularityScore: 90,
        averageDailyCost: item.cost || 100,
      };
      setAddToTripCity(city);
    } else {
      const act = activities.find((a) => a.id === item.itemId || a.name === item.title) || {
        id: item.itemId,
        cityId: 'city-1',
        name: item.title,
        category: 'Sightseeing' as const,
        cost: item.cost || 0,
        durationMinutes: 120,
        description: '',
        image: item.image,
      };
      setAddToTripActivity(act);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Wishlist & Saved Collections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-sand-900 dark:text-[#F4F7F5] tracking-tight">
            Saved Places & Activities
          </h1>
          <p className="text-sm text-sand-600 dark:text-[#A7B3AD] mt-0.5">
            Curate your bucket list destinations, dining spots, and cultural experiences across custom collections.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Sparkles className="w-4 h-4" />}
          onClick={() => navigate('/explore/cities')}
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:text-sand-950 font-bold"
        >
          Discover More
        </Button>
      </div>

      {/* Collection Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {collections.map((col) => {
          const count =
            col === 'All' ? savedItems.length : savedItems.filter((i) => i.collection === col).length;
          return (
            <button
              key={col}
              onClick={() => setSelectedCollection(col)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCollection === col
                  ? 'bg-sand-900 dark:bg-brand-500 text-white dark:text-sand-950 shadow-2xs'
                  : 'bg-white dark:bg-[#121A18] border border-sand-300 dark:border-[#28342F] text-sand-600 dark:text-[#A7B3AD] hover:text-sand-900 dark:hover:text-white'
              }`}
            >
              {col} ({count})
            </button>
          );
        })}
      </div>

      {/* Saved Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={280} className="rounded-3xl" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#121A18] rounded-3xl border border-sand-300 dark:border-[#28342F] shadow-card hover:shadow-soft transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative h-44 w-full overflow-hidden bg-sand-100 dark:bg-[#18221F]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sand-950/80 via-transparent to-transparent" />

                {/* Collection Chip */}
                <div className="absolute top-3 left-3 bg-sand-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold">
                  {item.collection}
                </div>

                {/* Remove heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.itemId);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Remove from saved"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-white" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold truncate drop-shadow">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-xs text-sand-200 truncate font-medium">{item.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sand-400 block tracking-wider">
                    {item.type === 'destination' ? 'Avg. Daily' : 'Activity Cost'}
                  </span>
                  <span className="text-sm font-extrabold text-sand-900 dark:text-[#F4F7F5]">
                    {item.cost && item.cost > 0 ? formatCurrency(item.cost) : 'Free / Varies'}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToTrip(item);
                  }}
                >
                  Add to Trip
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Saved Items in Collection"
          description="Explore destinations and activities and click the heart bookmark icon to save them here."
          actionText="Explore Destinations"
          onAction={() => navigate('/explore/cities')}
          actionIcon={<Sparkles className="w-4 h-4" />}
        />
      )}

      {/* City Detail Modal */}
      <CityDetailModal
        isOpen={!!selectedCityForDetail}
        onClose={() => setSelectedCityForDetail(null)}
        city={selectedCityForDetail}
        onAddToTrip={(c) => {
          setSelectedCityForDetail(null);
          setAddToTripCity(c);
        }}
      />

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        isOpen={!!selectedActivityForDetail}
        onClose={() => setSelectedActivityForDetail(null)}
        activity={selectedActivityForDetail}
        onAddToItinerary={(a) => {
          setSelectedActivityForDetail(null);
          setAddToTripActivity(a);
        }}
      />

      {/* Add To Trip Modals */}
      <AddToTripModal
        isOpen={!!addToTripCity}
        onClose={() => setAddToTripCity(null)}
        cityItem={addToTripCity}
      />

      <AddToTripModal
        isOpen={!!addToTripActivity}
        onClose={() => setAddToTripActivity(null)}
        activityItem={addToTripActivity}
      />
    </div>
  );
};
