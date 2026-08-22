import apiClient, { setAuthToken, removeAuthToken, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api';
import { User, AuthResponse } from '../types';
import { LoginFormData, SignupFormData } from '../utils/validators';
import { mockHandlers, getStoredUser, saveStoredUser } from './mockStorage';

export const authService = {
  async register(data: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<any>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const authData = response.data?.token ? response.data : response.data?.data || response.data;
      if (authData?.token) {
        setAuthToken(authData.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData.user));
      }
      return authData;
    } catch (error: any) {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      // Offline fallback only on network failure
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
      const response = await apiClient.post<any>('/auth/login', data);
      const authData = response.data?.token ? response.data : response.data?.data || response.data;
      if (authData?.token) {
        setAuthToken(authData.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData.user));
      }
      return authData;
    } catch (error: any) {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      // Offline fallback only on network failure
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
      const response = await apiClient.get<any>('/auth/me');
      const userData = response.data?.id ? response.data : response.data?.data || response.data;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
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
