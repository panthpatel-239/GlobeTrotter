import { Trip, City, Activity, TripActivity } from '../types';
import { tripService } from './tripService';
import { cityService } from './cityService';
import { activityService } from './activityService';

export interface SearchResults {
  destinations: City[];
  trips: Trip[];
  activities: Activity[];
  itineraryItems: { activity: TripActivity; tripTitle: string; tripId: string }[];
}

export const searchService = {
  async searchAll(query: string): Promise<SearchResults> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { destinations: [], trips: [], activities: [], itineraryItems: [] };
    }

    try {
      const [trips, cities, activities] = await Promise.all([
        tripService.getTrips(),
        cityService.getCities({ search: q }),
        activityService.getActivities({ search: q }),
      ]);

      const matchedTrips = trips.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destinationSummary?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );

      // Search through itinerary stops and activities across user trips
      const matchedItineraryItems: { activity: TripActivity; tripTitle: string; tripId: string }[] = [];
      trips.forEach((t) => {
        (t.stops || []).forEach((stop) => {
          (stop.activities || []).forEach((act) => {
            if (
              act.name.toLowerCase().includes(q) ||
              act.location?.toLowerCase().includes(q) ||
              act.category.toLowerCase().includes(q)
            ) {
              matchedItineraryItems.push({
                activity: act,
                tripTitle: t.title,
                tripId: t.id,
              });
            }
          });
        });
      });

      return {
        destinations: cities.slice(0, 4),
        trips: matchedTrips.slice(0, 4),
        activities: activities.slice(0, 4),
        itineraryItems: matchedItineraryItems.slice(0, 4),
      };
    } catch (err) {
      console.error('Search query failed:', err);
      return { destinations: [], trips: [], activities: [], itineraryItems: [] };
    }
  },
};
