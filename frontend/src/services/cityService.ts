import apiClient from './api';
import { City } from '../types';
import { getStoredCities } from './mockStorage';

export interface CityQueryParams {
  search?: string;
  costIndex?: string;
  region?: string;
}

export const cityService = {
  async getCities(params?: CityQueryParams): Promise<City[]> {
    try {
      const response = await apiClient.get<City[]>('/cities', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using dynamic cities fallback:', error);
      let cities = getStoredCities();
      if (params?.search) {
        const q = params.search.toLowerCase();
        cities = cities.filter(
          c => c.name.toLowerCase().includes(q) || 
               c.country.toLowerCase().includes(q) || 
               c.description.toLowerCase().includes(q)
        );
      }
      if (params?.costIndex && params.costIndex !== 'all') {
        cities = cities.filter(c => c.costIndex === params.costIndex);
      }
      if (params?.region && params.region !== 'all') {
        cities = cities.filter(c => c.region?.toLowerCase() === params.region?.toLowerCase());
      }
      return cities;
    }
  },

  async getCityById(id: string): Promise<City> {
    try {
      const response = await apiClient.get<City>(`/cities/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, fetching city ${id} from fallback:`, error);
      const cities = getStoredCities();
      const city = cities.find(c => c.id === id);
      if (!city) throw new Error('City not found');
      return city;
    }
  }
};
