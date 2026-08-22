// ==========================================
// GLOBETROTTER DOMAIN TYPES & INTERFACES
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  preferredCurrency?: string;
  travelStyle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TripStatus = 'planned' | 'ongoing' | 'completed' | 'draft';

export interface TripMember {
  id: string;
  tripId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'accepted' | 'invited';
}

export interface Reservation {
  id: string;
  tripId: string;
  type: 'flight' | 'hotel' | 'train' | 'restaurant' | 'activity';
  provider: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  confirmationNumber: string;
  cost: number;
  currency?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface TripDocument {
  id: string;
  tripId?: string;
  name: string;
  type: 'passport' | 'visa' | 'flight_ticket' | 'hotel_booking' | 'insurance' | 'reservation' | 'other';
  documentNumber?: string;
  issuer?: string;
  expirationDate?: string; // YYYY-MM-DD
  notes?: string;
  fileUrl?: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface ChecklistItem {
  id: string;
  tripId?: string;
  title: string;
  category: 'Documents' | 'Clothing & Gear' | 'Health & Tech' | 'Bookings' | 'Financial' | 'Custom';
  isCompleted: boolean;
  dueDate?: string;
}

export interface SavedItem {
  id: string;
  type: 'destination' | 'activity' | 'place';
  itemId: string;
  title: string;
  subtitle?: string;
  image: string;
  category?: string;
  cost?: number;
  rating?: number;
  collection: string; // e.g. "Japan 2026", "Food Experiences", "Weekend Ideas", "All Saved"
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  category: 'travel' | 'budget' | 'planning' | 'system';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  link?: string;
}

export interface Trip {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  coverImage?: string;
  budget?: number;
  status: TripStatus;
  destinationSummary?: string;
  stops?: TripStop[];
  expenses?: Expense[];
  reservations?: Reservation[];
  documents?: TripDocument[];
  checklist?: ChecklistItem[];
  members?: TripMember[];
  shareId?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId?: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  order: number;
  notes?: string;
  coverImage?: string;
  activities?: TripActivity[];
  createdAt?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region?: string;
  description: string;
  image: string;
  costIndex: 'budget' | 'moderate' | 'luxury'; // 1, 2, 3
  popularityScore: number; // 1-100
  averageDailyCost: number;
  topAttractions?: string[];
  climate?: string;
  bestTimeToVisit?: string;
  tags?: string[];
  whyVisit?: string;
  travelTips?: string[];
  neighborhoods?: string[];
}

export interface Activity {
  id: string;
  cityId: string;
  cityName?: string;
  name: string;
  category: 'Sightseeing' | 'Food & Dining' | 'Adventure' | 'Culture & History' | 'Nature' | 'Nightlife' | 'Shopping' | 'Relaxation';
  cost: number;
  durationMinutes: number;
  description: string;
  image: string;
  rating?: number;
  location?: string;
}

export interface TripActivity {
  id: string;
  tripId?: string;
  stopId: string;
  activityId?: string;
  name: string;
  category: string;
  dayNumber: number; // e.g. Day 1, Day 2
  date?: string;
  startTime?: string; // HH:mm
  endTime?: string;
  cost: number;
  notes?: string;
  location?: string;
  isCompleted?: boolean;
}

export type ExpenseCategory = 'transport' | 'accommodation' | 'activities' | 'food' | 'shopping' | 'other';

export interface Expense {
  id: string;
  tripId: string;
  stopId?: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  notes?: string;
  paidBy?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  forecast: number;
  isOverBudget: boolean;
  byCategory: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }[];
}

export interface SharedItinerary {
  shareId: string;
  trip: Trip;
  user: {
    name: string;
    avatarUrl?: string;
  };
  totalEstimatedCost: number;
}

// API Response interfaces
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}
