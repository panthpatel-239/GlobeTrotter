import apiClient, { setAuthToken, removeAuthToken, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api';
import { User, AuthResponse } from '../types';
import { LoginFormData, SignupFormData } from '../utils/validators';
import { mockHandlers, getStoredUser, saveStoredUser } from './mockStorage';

export const authService = {
  async register(data: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (response.data?.token) {
        setAuthToken(response.data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Offline fallback
      console.warn('Backend unavailable, using dynamic fallback for registration:', error);
      const user: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        preferredCurrency: 'USD',
        travelStyle: 'Adventurer',
        createdAt: new Date().toISOString(),
      };
      const token = `jwt-mock-${Date.now()}`;
      setAuthToken(token);
      saveStoredUser(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return { user, token };
    }
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      if (response.data?.token) {
        setAuthToken(response.data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Offline fallback
      console.warn('Backend unavailable, using dynamic fallback for login:', error);
      const user = getStoredUser();
      user.email = data.email;
      const token = `jwt-mock-${Date.now()}`;
      setAuthToken(token);
      saveStoredUser(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return { user, token };
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      // Offline fallback
      const cached = localStorage.getItem(USER_STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
      return getStoredUser();
    }
  },

  logout(): void {
    removeAuthToken();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  }
};
