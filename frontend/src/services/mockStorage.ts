import {
  Trip,
  City,
  Activity,
  User,
  Expense,
  TripStop,
  TripActivity,
  SharedItinerary,
  Reservation,
  TripDocument,
  ChecklistItem,
  SavedItem,
  NotificationItem,
  TripMember,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TRIPS,
  INITIAL_CITIES,
  INITIAL_ACTIVITIES,
  INITIAL_RESERVATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_CHECKLIST,
  INITIAL_SAVED_ITEMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEMBERS,
} from '../utils/mockData';

const TRIPS_KEY = 'globetrotter_trips_data_v2';
const CITIES_KEY = 'globetrotter_cities_data_v2';
const ACTIVITIES_KEY = 'globetrotter_activities_data_v2';
const USER_KEY = 'globetrotter_user_data_v2';
const RESERVATIONS_KEY = 'globetrotter_reservations_data_v2';
const DOCUMENTS_KEY = 'globetrotter_documents_data_v2';
const CHECKLIST_KEY = 'globetrotter_checklist_data_v2';
const SAVED_ITEMS_KEY = 'globetrotter_saved_items_data_v2';
const NOTIFICATIONS_KEY = 'globetrotter_notifications_data_v2';

// Initialize mock storage if empty
export const initMockStorage = () => {
  if (!localStorage.getItem(TRIPS_KEY)) {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
  }
  if (!localStorage.getItem(CITIES_KEY)) {
    localStorage.setItem(CITIES_KEY, JSON.stringify(INITIAL_CITIES));
  }
  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
  }
  if (!localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, JSON.stringify(INITIAL_USER));
  }
  if (!localStorage.getItem(RESERVATIONS_KEY)) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(INITIAL_RESERVATIONS));
  }
  if (!localStorage.getItem(DOCUMENTS_KEY)) {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem(CHECKLIST_KEY)) {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(INITIAL_CHECKLIST));
  }
  if (!localStorage.getItem(SAVED_ITEMS_KEY)) {
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(INITIAL_SAVED_ITEMS));
  }
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

export const getStoredTrips = (): Trip[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]');
  } catch {
    return INITIAL_TRIPS;
  }
};

export const saveStoredTrips = (trips: Trip[]) => {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
};

export const getStoredCities = (): City[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(CITIES_KEY) || '[]');
  } catch {
    return INITIAL_CITIES;
  }
};

export const getStoredActivities = (): Activity[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
  } catch {
    return INITIAL_ACTIVITIES;
  }
};

export const getStoredUser = (): User => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || JSON.stringify(INITIAL_USER));
  } catch {
    return INITIAL_USER;
  }
};

export const saveStoredUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredReservations = (): Reservation[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
  } catch {
    return INITIAL_RESERVATIONS;
  }
};

export const saveStoredReservations = (reservations: Reservation[]) => {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
};

export const getStoredDocuments = (): TripDocument[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]');
  } catch {
    return INITIAL_DOCUMENTS;
  }
};

export const saveStoredDocuments = (documents: TripDocument[]) => {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export const getStoredChecklist = (): ChecklistItem[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '[]');
  } catch {
    return INITIAL_CHECKLIST;
  }
};

export const saveStoredChecklist = (items: ChecklistItem[]) => {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
};

export const getStoredSavedItems = (): SavedItem[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(SAVED_ITEMS_KEY) || '[]');
  } catch {
    return INITIAL_SAVED_ITEMS;
  }
};

export const saveStoredSavedItems = (items: SavedItem[]) => {
  localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
};

export const getStoredNotifications = (): NotificationItem[] => {
  initMockStorage();
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveStoredNotifications = (notifications: NotificationItem[]) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

// ==========================================
// Mock Handlers for Local Fallback Operations
// ==========================================
export const mockHandlers = {
  // Trips
  getTrips: (): Trip[] => getStoredTrips(),

  getTripById: (id: string): Trip | undefined => {
    const trips = getStoredTrips();
    return trips.find((t) => t.id === id);
  },

  createTrip: (tripData: any): Trip => {
    const trips = getStoredTrips();
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      userId: 'user-1',
      title: tripData.title || 'New Journey',
      description: tripData.description || '',
      startDate: tripData.startDate || new Date().toISOString().split('T')[0],
      endDate: tripData.endDate || new Date().toISOString().split('T')[0],
      coverImage:
        tripData.coverImage ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      budget: tripData.budget || 1000,
      status: tripData.status || 'planned',
      destinationSummary: tripData.destinationSummary || 'Destination',
      shareId: `share-${Date.now()}`,
      isPublic: true,
      stops: tripData.stops || [],
      expenses: [],
      reservations: [],
      documents: [],
      checklist: [],
      members: [
        {
          id: `mem-${Date.now()}`,
          tripId: `trip-${Date.now()}`,
          name: 'Alex Rivera',
          email: 'alex@globetrotter.io',
          role: 'owner',
          status: 'accepted',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    trips.unshift(newTrip);
    saveStoredTrips(trips);
    return newTrip;
  },

  updateTrip: (id: string, tripData: Partial<Trip>): Trip => {
    const trips = getStoredTrips();
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    trips[index] = { ...trips[index], ...tripData, updatedAt: new Date().toISOString() };
    saveStoredTrips(trips);
    return trips[index];
  },

  deleteTrip: (id: string): void => {
    const trips = getStoredTrips();
    const updated = trips.filter((t) => t.id !== id);
    saveStoredTrips(updated);
  },

  // Stops
  addStop: (tripId: string, stopData: Partial<TripStop>): TripStop => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    if (!trip.stops) trip.stops = [];

    const newStop: TripStop = {
      id: `stop-${Date.now()}`,
      tripId,
      cityName: stopData.cityName || 'Destination',
      country: stopData.country || 'Country',
      arrivalDate: stopData.arrivalDate || trip.startDate,
      departureDate: stopData.departureDate || trip.endDate,
      order: (trip.stops.length || 0) + 1,
      notes: stopData.notes || '',
      coverImage:
        stopData.coverImage ||
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
      activities: [],
      createdAt: new Date().toISOString(),
    };

    trip.stops.push(newStop);
    const uniqueCities = Array.from(new Set(trip.stops.map((s) => s.cityName)));
    trip.destinationSummary = uniqueCities.join(' → ');
    saveStoredTrips(trips);
    return newStop;
  },

  updateStop: (tripId: string, stopId: string, stopData: Partial<TripStop>): TripStop => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !trip.stops) throw new Error('Trip not found');
    const idx = trip.stops.findIndex((s) => s.id === stopId);
    if (idx === -1) throw new Error('Stop not found');
    trip.stops[idx] = { ...trip.stops[idx], ...stopData };
    saveStoredTrips(trips);
    return trip.stops[idx];
  },

  deleteStop: (tripId: string, stopId: string): void => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (trip && trip.stops) {
      trip.stops = trip.stops.filter((s) => s.id !== stopId);
      const uniqueCities = Array.from(new Set(trip.stops.map((s) => s.cityName)));
      trip.destinationSummary = uniqueCities.join(' → ');
      saveStoredTrips(trips);
    }
  },

  // Activities
  addActivity: (tripId: string, activityData: Partial<TripActivity>): TripActivity => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !trip.stops) throw new Error('Trip or stops not found');

    const stop = trip.stops.find((s) => s.id === activityData.stopId) || trip.stops[0];
    if (!stop) throw new Error('Stop not found');
    if (!stop.activities) stop.activities = [];

    const newActivity: TripActivity = {
      id: `ta-${Date.now()}`,
      tripId,
      stopId: stop.id,
      activityId: activityData.activityId,
      name: activityData.name || 'New Activity',
      category: activityData.category || 'Sightseeing',
      dayNumber: activityData.dayNumber || 1,
      date: activityData.date || stop.arrivalDate,
      startTime: activityData.startTime || '10:00',
      endTime: activityData.endTime || '12:00',
      cost: activityData.cost || 0,
      notes: activityData.notes || '',
      location: activityData.location || stop.cityName,
      isCompleted: false,
    };

    stop.activities.push(newActivity);
    saveStoredTrips(trips);
    return newActivity;
  },

  updateActivity: (tripId: string, activityId: string, activityData: Partial<TripActivity>): TripActivity => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !trip.stops) throw new Error('Trip not found');
    for (const stop of trip.stops) {
      if (stop.activities) {
        const actIndex = stop.activities.findIndex((a) => a.id === activityId);
        if (actIndex !== -1) {
          stop.activities[actIndex] = { ...stop.activities[actIndex], ...activityData };
          saveStoredTrips(trips);
          return stop.activities[actIndex];
        }
      }
    }
    throw new Error('Activity not found');
  },

  deleteActivity: (tripId: string, activityId: string): void => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (trip && trip.stops) {
      trip.stops.forEach((stop) => {
        if (stop.activities) {
          stop.activities = stop.activities.filter((a) => a.id !== activityId);
        }
      });
      saveStoredTrips(trips);
    }
  },

  // Expenses
  getExpenses: (tripId?: string): Expense[] => {
    const trips = getStoredTrips();
    if (tripId) {
      const trip = trips.find((t) => t.id === tripId);
      return trip?.expenses || [];
    }
    return trips.flatMap((t) => t.expenses || []);
  },

  addExpense: (tripId: string, expenseData: Partial<Expense>): Expense => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    if (!trip.expenses) trip.expenses = [];

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      tripId,
      title: expenseData.title || 'Expense',
      category: expenseData.category || 'other',
      amount: expenseData.amount || 0,
      currency: expenseData.currency || 'USD',
      date: expenseData.date || new Date().toISOString().split('T')[0],
      notes: expenseData.notes || '',
    };

    trip.expenses.push(newExpense);
    saveStoredTrips(trips);
    return newExpense;
  },

  updateExpense: (tripId: string, expenseId: string, expenseData: Partial<Expense>): Expense => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !trip.expenses) throw new Error('Trip not found');
    const idx = trip.expenses.findIndex((e) => e.id === expenseId);
    if (idx === -1) throw new Error('Expense not found');
    trip.expenses[idx] = { ...trip.expenses[idx], ...expenseData };
    saveStoredTrips(trips);
    return trip.expenses[idx];
  },

  deleteExpense: (tripId: string, expenseId: string): void => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (trip && trip.expenses) {
      trip.expenses = trip.expenses.filter((e) => e.id !== expenseId);
      saveStoredTrips(trips);
    }
  },

  // Reservations
  getReservations: (tripId?: string): Reservation[] => {
    const list = getStoredReservations();
    if (tripId) return list.filter((r) => r.tripId === tripId);
    return list;
  },

  addReservation: (resData: Partial<Reservation>): Reservation => {
    const list = getStoredReservations();
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      tripId: resData.tripId || 'trip-1',
      type: resData.type || 'hotel',
      provider: resData.provider || 'Booking Provider',
      title: resData.title || 'Reservation Item',
      date: resData.date || new Date().toISOString().split('T')[0],
      time: resData.time || '12:00 PM',
      location: resData.location || 'Destination',
      confirmationNumber: resData.confirmationNumber || `CN-${Math.floor(100000 + Math.random() * 900000)}`,
      cost: resData.cost || 0,
      currency: resData.currency || 'USD',
      status: resData.status || 'confirmed',
      notes: resData.notes || '',
    };
    list.unshift(newRes);
    saveStoredReservations(list);
    return newRes;
  },

  updateReservation: (id: string, resData: Partial<Reservation>): Reservation => {
    const list = getStoredReservations();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Reservation not found');
    list[idx] = { ...list[idx], ...resData };
    saveStoredReservations(list);
    return list[idx];
  },

  deleteReservation: (id: string): void => {
    const list = getStoredReservations().filter((r) => r.id !== id);
    saveStoredReservations(list);
  },

  // Documents
  getDocuments: (tripId?: string): TripDocument[] => {
    const list = getStoredDocuments();
    if (tripId) return list.filter((d) => !d.tripId || d.tripId === tripId);
    return list;
  },

  addDocument: (docData: Partial<TripDocument>): TripDocument => {
    const list = getStoredDocuments();
    const newDoc: TripDocument = {
      id: `doc-${Date.now()}`,
      tripId: docData.tripId || 'trip-1',
      name: docData.name || 'Travel Document',
      type: docData.type || 'passport',
      documentNumber: docData.documentNumber || '',
      issuer: docData.issuer || 'Official Issuer',
      expirationDate: docData.expirationDate || '2028-12-31',
      status: docData.status || 'valid',
      notes: docData.notes || '',
    };
    list.unshift(newDoc);
    saveStoredDocuments(list);
    return newDoc;
  },

  deleteDocument: (id: string): void => {
    const list = getStoredDocuments().filter((d) => d.id !== id);
    saveStoredDocuments(list);
  },

  // Checklist
  getChecklist: (tripId?: string): ChecklistItem[] => {
    const list = getStoredChecklist();
    if (tripId) return list.filter((c) => !c.tripId || c.tripId === tripId);
    return list;
  },

  addChecklistItem: (itemData: Partial<ChecklistItem>): ChecklistItem => {
    const list = getStoredChecklist();
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      tripId: itemData.tripId || 'trip-1',
      title: itemData.title || 'Checklist Item',
      category: itemData.category || 'Documents',
      isCompleted: false,
      dueDate: itemData.dueDate,
    };
    list.push(newItem);
    saveStoredChecklist(list);
    return newItem;
  },

  toggleChecklistItem: (id: string): ChecklistItem => {
    const list = getStoredChecklist();
    const item = list.find((c) => c.id === id);
    if (!item) throw new Error('Item not found');
    item.isCompleted = !item.isCompleted;
    saveStoredChecklist(list);
    return item;
  },

  deleteChecklistItem: (id: string): void => {
    const list = getStoredChecklist().filter((c) => c.id !== id);
    saveStoredChecklist(list);
  },

  // Saved Items
  getSavedItems: (collection?: string): SavedItem[] => {
    const list = getStoredSavedItems();
    if (collection && collection !== 'All') {
      return list.filter((s) => s.collection === collection);
    }
    return list;
  },

  saveItem: (item: Partial<SavedItem>): SavedItem => {
    const list = getStoredSavedItems();
    const exists = list.find((s) => s.itemId === item.itemId);
    if (exists) return exists;

    const newItem: SavedItem = {
      id: `save-${Date.now()}`,
      type: item.type || 'destination',
      itemId: item.itemId || `item-${Date.now()}`,
      title: item.title || 'Saved Item',
      subtitle: item.subtitle || '',
      image: item.image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      category: item.category || 'Travel',
      cost: item.cost,
      rating: item.rating,
      collection: item.collection || 'All Saved',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newItem);
    saveStoredSavedItems(list);
    return newItem;
  },

  removeSavedItem: (itemId: string): void => {
    const list = getStoredSavedItems().filter((s) => s.itemId !== itemId && s.id !== itemId);
    saveStoredSavedItems(list);
  },

  // Notifications
  getNotifications: (): NotificationItem[] => getStoredNotifications(),

  markAllNotificationsRead: (): NotificationItem[] => {
    const list = getStoredNotifications().map((n) => ({ ...n, unread: false }));
    saveStoredNotifications(list);
    return list;
  },

  // Collaboration Members
  getTripMembers: (tripId: string): TripMember[] => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    return trip?.members || INITIAL_MEMBERS;
  },

  inviteMember: (tripId: string, email: string, name: string, role: 'editor' | 'viewer'): TripMember => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    if (!trip.members) trip.members = [];

    const newMember: TripMember = {
      id: `mem-${Date.now()}`,
      tripId,
      name: name || email.split('@')[0],
      email,
      role,
      status: 'invited',
    };
    trip.members.push(newMember);
    saveStoredTrips(trips);
    return newMember;
  },

  removeMember: (tripId: string, memberId: string): void => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (trip && trip.members) {
      trip.members = trip.members.filter((m) => m.id !== memberId);
      saveStoredTrips(trips);
    }
  },

  // Share Service
  getSharedItinerary: (shareId: string): SharedItinerary => {
    const trips = getStoredTrips();
    const trip = trips.find((t) => t.shareId === shareId) || trips[0];
    const totalCost = (trip.expenses || []).reduce((sum, e) => sum + e.amount, 0);
    return {
      shareId,
      trip,
      user: {
        name: 'Alex Rivera',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
      totalEstimatedCost: totalCost,
    };
  },
};
