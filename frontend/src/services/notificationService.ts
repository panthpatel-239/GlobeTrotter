import apiClient from './api';
import { NotificationItem } from '../types';
import { mockHandlers } from './mockStorage';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await apiClient.get<NotificationItem[]>('/notifications');
      return res.data;
    } catch {
      return mockHandlers.getNotifications();
    }
  },

  async markAllRead(): Promise<NotificationItem[]> {
    try {
      const res = await apiClient.post<NotificationItem[]>('/notifications/read-all');
      return res.data;
    } catch {
      return mockHandlers.markAllNotificationsRead();
    }
  },
};
