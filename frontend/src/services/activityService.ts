import apiClient from './api';
import { Activity } from '../types';
import { getStoredActivities } from './mockStorage';

export interface ActivityQueryParams {
  cityId?: string;
  search?: string;
  category?: string;
  maxCost?: number;
}

export const activityService = {
  async getActivities(params?: ActivityQueryParams): Promise<Activity[]> {
    try {
      const response = await apiClient.get<Activity[]>('/activities', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using dynamic activities fallback:', error);
      let activities = getStoredActivities();
      if (params?.cityId && params.cityId !== 'all') {
        activities = activities.filter(a => a.cityId === params.cityId);
      }
      if (params?.category && params.category !== 'all') {
        activities = activities.filter(a => a.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        activities = activities.filter(
          a => a.name.toLowerCase().includes(q) || 
               a.description.toLowerCase().includes(q) || 
               a.cityName?.toLowerCase().includes(q)
        );
      }
      if (params?.maxCost && params.maxCost > 0) {
        activities = activities.filter(a => a.cost <= params.maxCost!);
      }
      return activities;
    }
  },

  async getActivityById(id: string): Promise<Activity> {
    try {
      const response = await apiClient.get<Activity>(`/activities/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, fetching activity ${id} from fallback:`, error);
      const activities = getStoredActivities();
      const act = activities.find(a => a.id === id);
      if (!act) throw new Error('Activity not found');
      return act;
    }
  }
};
