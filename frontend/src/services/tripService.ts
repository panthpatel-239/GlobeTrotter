import apiClient from './api';
import { Trip } from '../types';
import { TripFormData } from '../utils/validators';
import { mockHandlers } from './mockStorage';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    try {
      const response = await apiClient.get<Trip[]>('/trips');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using dynamic trip data fallback:', error);
      return mockHandlers.getTrips();
    }
  },

  async getTripById(id: string): Promise<Trip> {
    try {
      const response = await apiClient.get<Trip>(`/trips/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, using dynamic trip data for trip ${id}:`, error);
      const trip = mockHandlers.getTripById(id);
      if (!trip) throw new Error('Trip not found');
      return trip;
    }
  },

  async createTrip(data: TripFormData & { stops?: any[] }): Promise<Trip> {
    try {
      const response = await apiClient.post<Trip>('/trips', data);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, saving trip in local fallback:', error);
      return mockHandlers.createTrip(data);
    }
  },

  async updateTrip(id: string, data: Partial<TripFormData>): Promise<Trip> {
    try {
      const response = await apiClient.put<Trip>(`/trips/${id}`, data);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, updating trip ${id} in local fallback:`, error);
      return mockHandlers.updateTrip(id, data);
    }
  },

  async deleteTrip(id: string): Promise<void> {
    try {
      await apiClient.delete(`/trips/${id}`);
    } catch (error) {
      console.warn(`Backend unavailable, deleting trip ${id} in local fallback:`, error);
      mockHandlers.deleteTrip(id);
    }
  }
};
