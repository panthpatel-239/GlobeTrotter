import apiClient from './api';
import { Reservation } from '../types';
import { mockHandlers } from './mockStorage';

export const reservationService = {
  async getReservations(tripId?: string): Promise<Reservation[]> {
    try {
      const res = await apiClient.get<Reservation[]>(tripId ? `/trips/${tripId}/reservations` : '/reservations');
      return res.data;
    } catch {
      return mockHandlers.getReservations(tripId);
    }
  },

  async addReservation(data: Partial<Reservation>): Promise<Reservation> {
    try {
      const res = await apiClient.post<Reservation>('/reservations', data);
      return res.data;
    } catch {
      return mockHandlers.addReservation(data);
    }
  },

  async updateReservation(id: string, data: Partial<Reservation>): Promise<Reservation> {
    try {
      const res = await apiClient.put<Reservation>(`/reservations/${id}`, data);
      return res.data;
    } catch {
      return mockHandlers.updateReservation(id, data);
    }
  },

  async deleteReservation(id: string): Promise<void> {
    try {
      await apiClient.delete(`/reservations/${id}`);
    } catch {
      mockHandlers.deleteReservation(id);
    }
  },
};
