import apiClient from './api';
import { ChecklistItem } from '../types';
import { mockHandlers } from './mockStorage';

export const checklistService = {
  async getChecklist(tripId?: string): Promise<ChecklistItem[]> {
    try {
      const res = await apiClient.get<ChecklistItem[]>(tripId ? `/trips/${tripId}/checklist` : '/checklist');
      return res.data;
    } catch {
      return mockHandlers.getChecklist(tripId);
    }
  },

  async addChecklistItem(data: Partial<ChecklistItem>): Promise<ChecklistItem> {
    try {
      const res = await apiClient.post<ChecklistItem>('/checklist', data);
      return res.data;
    } catch {
      return mockHandlers.addChecklistItem(data);
    }
  },

  async toggleChecklistItem(id: string): Promise<ChecklistItem> {
    try {
      const res = await apiClient.patch<ChecklistItem>(`/checklist/${id}/toggle`);
      return res.data;
    } catch {
      return mockHandlers.toggleChecklistItem(id);
    }
  },

  async deleteChecklistItem(id: string): Promise<void> {
    try {
      await apiClient.delete(`/checklist/${id}`);
    } catch {
      mockHandlers.deleteChecklistItem(id);
    }
  },
};
