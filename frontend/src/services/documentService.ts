import apiClient from './api';
import { TripDocument } from '../types';
import { mockHandlers } from './mockStorage';

export const documentService = {
  async getDocuments(tripId?: string): Promise<TripDocument[]> {
    try {
      const res = await apiClient.get<TripDocument[]>(tripId ? `/trips/${tripId}/documents` : '/documents');
      return res.data;
    } catch {
      return mockHandlers.getDocuments(tripId);
    }
  },

  async addDocument(data: Partial<TripDocument>): Promise<TripDocument> {
    try {
      const res = await apiClient.post<TripDocument>('/documents', data);
      return res.data;
    } catch {
      return mockHandlers.addDocument(data);
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      await apiClient.delete(`/documents/${id}`);
    } catch {
      mockHandlers.deleteDocument(id);
    }
  },
};
