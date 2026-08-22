export const APP_NAME = 'GlobeTrotter';
export const APP_TAGLINE = 'Plan. Explore. Experience.';

export const DEFAULT_CURRENCY = 'USD';
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

export const ACTIVITY_CATEGORIES = [
  'Sightseeing',
  'Food & Dining',
  'Adventure',
  'Culture & History',
  'Nature',
  'Nightlife',
  'Shopping',
  'Relaxation',
] as const;

export const EXPENSE_CATEGORIES: { id: string; label: string; color: string }[] = [
  { id: 'transport', label: 'Transport', color: '#0ea5e9' },
  { id: 'accommodation', label: 'Accommodation', color: '#8b5cf6' },
  { id: 'activities', label: 'Activities', color: '#14b8a6' },
  { id: 'food', label: 'Food & Dining', color: '#f97316' },
  { id: 'shopping', label: 'Shopping', color: '#ec4899' },
  { id: 'other', label: 'Other', color: '#64748b' },
];

export const TRIP_STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned', color: 'bg-sky-100 text-sky-800' },
  { value: 'ongoing', label: 'Ongoing', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'completed', label: 'Completed', color: 'bg-slate-100 text-slate-700' },
  { value: 'draft', label: 'Draft', color: 'bg-amber-100 text-amber-800' },
];

export const POPULAR_DESTINATIONS = [
  {
    id: 'c1',
    name: 'Jaipur',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'The Pink City of royalty, grand palaces, and rich culture.',
    costIndex: 'budget',
    popularityScore: 94,
    averageDailyCost: 45,
  },
  {
    id: 'c2',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'A dazzling blend of futuristic skyscrapers and historic temples.',
    costIndex: 'moderate',
    popularityScore: 98,
    averageDailyCost: 120,
  },
  {
    id: 'c3',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'The city of lights, world-class art, fashion, and culinary marvels.',
    costIndex: 'luxury',
    popularityScore: 99,
    averageDailyCost: 160,
  },
  {
    id: 'c4',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Tropical paradise featuring lush rice terraces, surfing, and serene temples.',
    costIndex: 'budget',
    popularityScore: 96,
    averageDailyCost: 55,
  },
  {
    id: 'c5',
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    description: 'Ancient ruins, vibrant piazzas, and unforgettable Italian gastronomy.',
    costIndex: 'moderate',
    popularityScore: 97,
    averageDailyCost: 130,
  },
  {
    id: 'c6',
    name: 'Reykjavik',
    country: 'Iceland',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
    description: 'Gateway to the northern lights, hot springs, and breathtaking glaciers.',
    costIndex: 'luxury',
    popularityScore: 91,
    averageDailyCost: 180,
  }
];
