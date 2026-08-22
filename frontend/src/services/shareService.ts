import apiClient from './api';
import { SharedItinerary } from '../types';
import { mockHandlers, getStoredTrips, saveStoredTrips } from './mockStorage';

export const shareService = {
  async generateShareLink(tripId: string): Promise<{ shareId: string; shareUrl: string }> {
    try {
      const response = await apiClient.post<{ shareId: string; shareUrl: string }>(`/trips/${tripId}/share`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, generating local share link for trip ${tripId}:`, error);
      const trips = getStoredTrips();
      const trip = trips.find(t => t.id === tripId);
      const shareId = trip?.shareId || `share-${Date.now()}`;
      if (trip) {
        trip.shareId = shareId;
        trip.isPublic = true;
        saveStoredTrips(trips);
      }
      return {
        shareId,
        shareUrl: `${window.location.origin}/shared/${shareId}`,
      };
    }
  },

  async getSharedItinerary(shareId: string): Promise<SharedItinerary> {
    try {
      const response = await apiClient.get<SharedItinerary>(`/share/${shareId}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, fetching shared itinerary ${shareId} from fallback:`, error);
      const data = mockHandlers.getSharedItinerary(shareId);
      if (!data) throw new Error('Shared itinerary not found or has expired');
      return data;
    }
  }
};
