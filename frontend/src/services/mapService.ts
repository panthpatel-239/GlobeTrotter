// ==========================================
// GLOBETROTTER MAP SERVICE & ABSTRACTION
// ==========================================

export interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
  type: 'destination' | 'activity' | 'hotel' | 'restaurant' | 'transit';
  cityName?: string;
  country?: string;
  address?: string;
  category?: string;
  cost?: number;
  time?: string;
}

export interface MapRouteSegment {
  id: string;
  from: GeoLocation;
  to: GeoLocation;
  transportType: 'flight' | 'train' | 'drive' | 'walk';
  distanceKm?: number;
  durationHours?: number;
}

export interface MapViewport {
  center: [number, number]; // [lat, lng]
  zoom: number;
}

export interface IMapProvider {
  getDestinationCoordinates(cityName: string): GeoLocation;
  getTripMapData(tripId: string): Promise<{
    points: GeoLocation[];
    routes: MapRouteSegment[];
    viewport: MapViewport;
  }>;
}

// Built-in Geocoding Cache for Destinations & Landmarks
export const CITY_COORDINATES: Record<string, [number, number]> = {
  Tokyo: [35.6762, 139.6503],
  Kyoto: [35.0116, 135.7681],
  Osaka: [34.6937, 135.5023],
  Jaipur: [26.9124, 75.7873],
  Paris: [48.8566, 2.3522],
  Bali: [-8.4095, 115.1889],
  Rome: [41.9028, 12.4964],
  Santorini: [36.3932, 25.4615],
  London: [51.5074, -0.1278],
  NewYork: [40.7128, -74.0060],
};

export const mapService: IMapProvider = {
  getDestinationCoordinates(cityName: string): GeoLocation {
    const coords = CITY_COORDINATES[cityName] || [35.6762, 139.6503];
    return {
      latitude: coords[0],
      longitude: coords[1],
      name: cityName,
      type: 'destination',
      cityName,
    };
  },

  async getTripMapData(tripId: string) {
    // In a real API integration, this would call Mapbox / Google Maps / Leaflet API
    const points: GeoLocation[] = [
      {
        latitude: 35.6762,
        longitude: 139.6503,
        name: 'Tokyo Central',
        cityName: 'Tokyo',
        country: 'Japan',
        type: 'destination',
        category: 'Hub Stop 1',
      },
      {
        latitude: 35.6938,
        longitude: 139.7034,
        name: 'Hotel Gracery Shinjuku',
        cityName: 'Tokyo',
        type: 'hotel',
        category: 'Accommodation',
        address: '1-19-1 Kabukicho, Shinjuku',
        cost: 680,
      },
      {
        latitude: 35.6595,
        longitude: 139.7005,
        name: 'Shibuya Crossing & Izakaya',
        cityName: 'Tokyo',
        type: 'activity',
        category: 'Nightlife',
        cost: 40,
        time: '18:30',
      },
      {
        latitude: 35.6655,
        longitude: 139.7708,
        name: 'Tsukiji Outer Market Sushi Workshop',
        cityName: 'Tokyo',
        type: 'restaurant',
        category: 'Food & Dining',
        cost: 65,
        time: '08:30',
      },
      {
        latitude: 35.0116,
        longitude: 135.7681,
        name: 'Kyoto Machiya Gion',
        cityName: 'Kyoto',
        country: 'Japan',
        type: 'destination',
        category: 'Hub Stop 2',
      },
      {
        latitude: 34.9671,
        longitude: 135.7727,
        name: 'Fushimi Inari Torii Gates',
        cityName: 'Kyoto',
        type: 'activity',
        category: 'Culture & History',
        cost: 0,
        time: '07:00',
      },
      {
        latitude: 34.6937,
        longitude: 135.5023,
        name: 'Dotonbori Neon Canal & Food',
        cityName: 'Osaka',
        country: 'Japan',
        type: 'destination',
        category: 'Hub Stop 3',
      },
    ];

    const routes: MapRouteSegment[] = [
      {
        id: 'route-1',
        from: points[0],
        to: points[4],
        transportType: 'train',
        distanceKm: 476,
        durationHours: 2.2,
      },
      {
        id: 'route-2',
        from: points[4],
        to: points[6],
        transportType: 'train',
        distanceKm: 56,
        durationHours: 0.5,
      },
    ];

    return {
      points,
      routes,
      viewport: {
        center: [35.2, 137.5],
        zoom: 7,
      },
    };
  },
};
