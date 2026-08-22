import apiClient from './api';
import { SavedItem } from '../types';
import { mockHandlers } from './mockStorage';

export const savedService = {
  async getSavedItems(collection?: string): Promise<SavedItem[]> {
    try {
      const res = await apiClient.get<SavedItem[]>('/saved', { params: { collection } });
      return res.data;
    } catch {
      return mockHandlers.getSavedItems(collection);
    }
  },

  async saveItem(data: Partial<SavedItem>): Promise<SavedItem> {
    try {
      const res = await apiClient.post<SavedItem>('/saved', data);
      return res.data;
    } catch {
      return mockHandlers.saveItem(data);
    }
  },

  async removeSavedItem(itemId: string): Promise<void> {
    try {
      await apiClient.delete(`/saved/${itemId}`);
    } catch {
      mockHandlers.removeSavedItem(itemId);
    }
  },
};
