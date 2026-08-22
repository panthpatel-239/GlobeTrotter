import apiClient from './api';
import { TripStop, TripActivity } from '../types';
import { TripStopFormData, ActivityFormData } from '../utils/validators';
import { mockHandlers } from './mockStorage';

export const itineraryService = {
  // Stop management
  async addStop(tripId: string, data: TripStopFormData): Promise<TripStop> {
    try {
      const response = await apiClient.post<TripStop>(`/trips/${tripId}/stops`, data);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, adding stop to trip ${tripId} in fallback:`, error);
      return mockHandlers.addStop(tripId, data);
    }
  },

  async updateStop(tripId: string, stopId: string, data: Partial<TripStopFormData>): Promise<TripStop> {
    try {
      const response = await apiClient.put<TripStop>(`/trips/${tripId}/stops/${stopId}`, data);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, updating stop ${stopId} in fallback:`, error);
      return mockHandlers.updateStop(tripId, stopId, data);
    }
  },

  async deleteStop(tripId: string, stopId: string): Promise<void> {
    try {
      await apiClient.delete(`/trips/${tripId}/stops/${stopId}`);
    } catch (error) {
      console.warn(`Backend unavailable, deleting stop ${stopId} in fallback:`, error);
      mockHandlers.deleteStop(tripId, stopId);
    }
  },

  // Activity management
  async addActivity(tripId: string, stopId: string, data: ActivityFormData & { activityId?: string }): Promise<TripActivity> {
    try {
      const response = await apiClient.post<TripActivity>(`/trips/${tripId}/activities`, {
        stopId,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, adding activity to trip ${tripId} in fallback:`, error);
      return mockHandlers.addActivity(tripId, {
        stopId,
        ...data,
      });
    }
  },

  async updateActivity(tripId: string, activityId: string, data: Partial<TripActivity>): Promise<TripActivity> {
    try {
      const response = await apiClient.put<TripActivity>(`/trips/${tripId}/activities/${activityId}`, data);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, updating activity ${activityId} in fallback:`, error);
      return mockHandlers.updateActivity(tripId, activityId, data);
    }
  },

  async deleteActivity(tripId: string, activityId: string): Promise<void> {
    try {
      await apiClient.delete(`/trips/${tripId}/activities/${activityId}`);
    } catch (error) {
      console.warn(`Backend unavailable, deleting activity ${activityId} in fallback:`, error);
      mockHandlers.deleteActivity(tripId, activityId);
    }
  }
};
