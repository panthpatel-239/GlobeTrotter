import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

// In-memory persistent state across request cycles
let notificationsStore = [
  {
    id: 'notif-1',
    category: 'planning',
    title: 'Itinerary Ready',
    message: 'Your Japan Autumn expedition itinerary was saved with 8 activities.',
    time: '10m ago',
    unread: true,
    link: '/trips/trip-1',
  },
  {
    id: 'notif-2',
    category: 'budget',
    title: 'Budget Target Configured',
    message: 'Estimated budget limit set to $4,500 for upcoming travels.',
    time: '1h ago',
    unread: true,
    link: '/budget',
  },
  {
    id: 'notif-3',
    category: 'travel',
    title: 'Shinkansen Bullet Train Booking',
    message: 'JR Pass reserved for Tokyo to Kyoto journey on Oct 17.',
    time: '2h ago',
    unread: false,
    link: '/reservations',
  },
];

let reservationsStore: any[] = [
  {
    id: 'res-1',
    tripId: 'trip-1',
    type: 'flight',
    provider: 'Japan Airlines',
    title: 'Flight JL 005 (SFO -> HND)',
    date: '2026-10-15',
    time: '11:30 AM',
    location: 'San Francisco Int Airport (SFO) Terminal I',
    confirmationNumber: 'JL-994827',
    cost: 1150,
    currency: 'USD',
    status: 'confirmed',
    notes: 'Seat 14A (Window). Passport verification completed online.',
  },
  {
    id: 'res-2',
    tripId: 'trip-1',
    type: 'hotel',
    provider: 'Park Hyatt Tokyo',
    title: 'Park Hyatt Tokyo (3 Nights)',
    date: '2026-10-15',
    time: '03:00 PM Check-in',
    location: '3-7-1-2 Nishi-Shinjuku, Tokyo',
    confirmationNumber: 'HYATT-88310',
    cost: 920,
    currency: 'USD',
    status: 'confirmed',
    notes: 'Deluxe King room with Mount Fuji view. Breakfast included.',
  },
  {
    id: 'res-3',
    tripId: 'trip-1',
    type: 'train',
    provider: 'JR Tokaido Shinkansen',
    title: 'Nozomi Bullet Train (Tokyo -> Kyoto)',
    date: '2026-10-18',
    time: '09:00 AM',
    location: 'Tokyo Station Track 14',
    confirmationNumber: 'JR-551042',
    cost: 130,
    currency: 'USD',
    status: 'confirmed',
    notes: 'Reserved seats Car 5, Seats 8D & 8E (Mount Fuji side).',
  },
  {
    id: 'res-4',
    tripId: 'trip-1',
    type: 'restaurant',
    provider: 'Sukiyabashi Jiro Roppongi',
    title: 'Omakase Sushi Dinner (Chef Takashi)',
    date: '2026-10-16',
    time: '07:30 PM',
    location: 'Roppongi Hills, Tokyo',
    confirmationNumber: 'JIRO-7729',
    cost: 280,
    currency: 'USD',
    status: 'confirmed',
    notes: '2 Guests. Strict 15-minute seating policy.',
  },
];

let documentsStore: any[] = [
  {
    id: 'doc-1',
    tripId: 'trip-1',
    name: 'US Passport',
    type: 'passport',
    documentNumber: 'P-984219803',
    issuer: 'US Dept of State',
    expirationDate: '2032-05-18',
    status: 'valid',
    notes: 'Valid for all international trips through 2032.',
  },
  {
    id: 'doc-2',
    tripId: 'trip-1',
    name: 'Japan Tourist eVisa',
    type: 'visa',
    documentNumber: 'JPN-V-2026-8812',
    issuer: 'Ministry of Foreign Affairs Japan',
    expirationDate: '2026-11-30',
    status: 'valid',
    notes: 'Single entry 90-day tourist visa approved.',
  },
  {
    id: 'doc-3',
    tripId: 'trip-1',
    name: 'Allianz World Travel Protection',
    type: 'insurance',
    documentNumber: 'ALZ-99381-TR',
    issuer: 'Allianz Global Assistance',
    expirationDate: '2026-10-31',
    status: 'valid',
    notes: 'Comprehensive emergency medical & trip cancellation insurance.',
  },
];

let checklistStore: any[] = [
  { id: 'chk-1', tripId: 'trip-1', title: 'Passport valid for at least 6 months', category: 'Documents', isCompleted: true },
  { id: 'chk-2', tripId: 'trip-1', title: 'Japan Rail Pass voucher printed / activated', category: 'Documents', isCompleted: true },
  { id: 'chk-3', tripId: 'trip-1', title: 'International travel insurance policy saved in wallet', category: 'Documents', isCompleted: true },
  { id: 'chk-4', tripId: 'trip-1', title: 'eSIM / Pocket WiFi rented for Tokyo arrival', category: 'Health & Tech', isCompleted: true },
  { id: 'chk-5', tripId: 'trip-1', title: 'Universal power plug adapters (Type A/B for Japan)', category: 'Health & Tech', isCompleted: false },
  { id: 'chk-6', tripId: 'trip-1', title: 'Comfortable walking / hiking shoes for temple walks', category: 'Clothing & Gear', isCompleted: false },
  { id: 'chk-7', tripId: 'trip-1', title: 'Notify bank of international card usage', category: 'Financial', isCompleted: false },
  { id: 'chk-8', tripId: 'trip-1', title: 'Confirm Park Hyatt & Ryokan reservations', category: 'Bookings', isCompleted: true },
];

export class UtilityController {
  // --- Notifications ---
  static async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      ApiResponse.success(res, notificationsStore);
    } catch (err) {
      next(err);
    }
  }

  static async markAllNotificationsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      notificationsStore = notificationsStore.map((n) => ({ ...n, unread: false }));
      ApiResponse.success(res, notificationsStore);
    } catch (err) {
      next(err);
    }
  }

  // --- Reservations ---
  static async getReservations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const data = tripId
        ? reservationsStore.filter((r) => r.tripId === tripId)
        : reservationsStore;
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async addReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = {
        id: `res-${Date.now()}`,
        status: 'confirmed',
        currency: 'USD',
        ...req.body,
      };
      reservationsStore.push(newItem);
      ApiResponse.created(res, newItem);
    } catch (err) {
      next(err);
    }
  }

  static async updateReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const index = reservationsStore.findIndex((r) => r.id === id);
      if (index >= 0) {
        reservationsStore[index] = { ...reservationsStore[index], ...req.body };
        ApiResponse.success(res, reservationsStore[index]);
      } else {
        ApiResponse.success(res, { id, ...req.body });
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      reservationsStore = reservationsStore.filter((r) => r.id !== id);
      ApiResponse.success(res, { message: 'Reservation deleted' });
    } catch (err) {
      next(err);
    }
  }

  // --- Documents ---
  static async getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const data = tripId
        ? documentsStore.filter((d) => d.tripId === tripId)
        : documentsStore;
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async addDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = {
        id: `doc-${Date.now()}`,
        status: 'valid',
        ...req.body,
      };
      documentsStore.push(newItem);
      ApiResponse.created(res, newItem);
    } catch (err) {
      next(err);
    }
  }

  static async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      documentsStore = documentsStore.filter((d) => d.id !== id);
      ApiResponse.success(res, { message: 'Document deleted' });
    } catch (err) {
      next(err);
    }
  }

  // --- Checklist ---
  static async getChecklist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const data = tripId
        ? checklistStore.filter((c) => c.tripId === tripId)
        : checklistStore;
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async addChecklistItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = {
        id: `chk-${Date.now()}`,
        isCompleted: false,
        category: 'Custom',
        ...req.body,
      };
      checklistStore.push(newItem);
      ApiResponse.created(res, newItem);
    } catch (err) {
      next(err);
    }
  }

  static async toggleChecklistItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const index = checklistStore.findIndex((c) => c.id === id);
      if (index >= 0) {
        checklistStore[index].isCompleted = !checklistStore[index].isCompleted;
        ApiResponse.success(res, checklistStore[index]);
      } else {
        ApiResponse.success(res, { id, isCompleted: true });
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteChecklistItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      checklistStore = checklistStore.filter((c) => c.id !== id);
      ApiResponse.success(res, { message: 'Checklist item deleted' });
    } catch (err) {
      next(err);
    }
  }
}
