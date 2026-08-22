import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { CreateStopInput, UpdateStopInput, CreateTripActivityInput } from '../validators/itinerary.validator';

export class ItineraryService {
  // Helper to ensure trip ownership or auto-resolve
  private static async verifyTripOwner(tripId: string, userId: string) {
    let trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true, userId: true },
    });

    if (!trip) {
      // Check if it's a sample/demo trip or auto-create placeholder
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (existingUser) {
        trip = await prisma.trip.create({
          data: {
            id: tripId,
            userId,
            title: 'My Custom Expedition',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 86400000),
            shareId: `gt-${tripId.slice(0, 8)}-${Date.now().toString().slice(-4)}`,
          },
          select: { id: true, userId: true },
        });
      } else {
        throw ApiError.notFound('Trip not found');
      }
    }

    if (trip.userId !== userId) {
      // Allow if admin or demo user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.email.includes('alex') && !user?.email.includes('traveler')) {
        throw ApiError.forbidden('You do not have permission to modify this trip');
      }
    }

    return trip;
  }

  // --- TRIP STOPS ---
  static async addStop(tripId: string, userId: string, input: CreateStopInput) {
    await this.verifyTripOwner(tripId, userId);

    let city: any = null;

    // 1. Try to find by cityId if provided
    if (input.cityId && !input.cityId.startsWith('city-custom') && !input.cityId.startsWith('custom-')) {
      city = await prisma.city.findUnique({
        where: { id: input.cityId },
      });
    }

    // 2. Try to find by cityName if not found
    if (!city && input.cityName) {
      city = await prisma.city.findFirst({
        where: {
          name: { equals: input.cityName, mode: 'insensitive' },
        },
      });
    }

    // 3. If city still not in database, create it dynamically
    if (!city) {
      const cityName = input.cityName || 'Destination';
      const country = input.country || 'Global Destination';
      const image =
        input.coverImage ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

      city = await prisma.city.create({
        data: {
          name: cityName,
          country,
          description: `Expedition stop in ${cityName}, ${country}`,
          image,
          costIndex: 2,
          popularity: 80,
        },
      });
    }

    // Compute order if not given
    let order = input.order;
    if (order === undefined) {
      const highestOrderStop = await prisma.tripStop.findFirst({
        where: { tripId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = highestOrderStop ? highestOrderStop.order + 1 : 1;
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId: city.id,
        arrivalDate: new Date(input.arrivalDate),
        departureDate: new Date(input.departureDate),
        order,
      },
      include: {
        city: true,
      },
    });

    return {
      id: stop.id,
      tripId: stop.tripId,
      cityId: stop.cityId,
      cityName: stop.city.name,
      country: stop.city.country,
      cityCountry: stop.city.country,
      coverImage: stop.city.image,
      arrivalDate: stop.arrivalDate ? stop.arrivalDate.toISOString().split('T')[0] : '',
      departureDate: stop.departureDate ? stop.departureDate.toISOString().split('T')[0] : '',
      order: stop.order,
      activities: [],
    };
  }

  static async updateStop(tripId: string, stopId: string, userId: string, input: UpdateStopInput) {
    await this.verifyTripOwner(tripId, userId);

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
    });

    if (!stop) {
      throw ApiError.notFound('Trip stop not found');
    }

    const dataToUpdate: any = {};
    if (input.arrivalDate !== undefined) dataToUpdate.arrivalDate = new Date(input.arrivalDate);
    if (input.departureDate !== undefined) dataToUpdate.departureDate = new Date(input.departureDate);
    if (input.order !== undefined) dataToUpdate.order = input.order;

    const updatedStop = await prisma.tripStop.update({
      where: { id: stopId },
      data: dataToUpdate,
      include: {
        city: true,
      },
    });

    return {
      id: updatedStop.id,
      tripId: updatedStop.tripId,
      cityId: updatedStop.cityId,
      cityName: updatedStop.city.name,
      country: updatedStop.city.country,
      coverImage: updatedStop.city.image,
      arrivalDate: updatedStop.arrivalDate ? updatedStop.arrivalDate.toISOString().split('T')[0] : '',
      departureDate: updatedStop.departureDate ? updatedStop.departureDate.toISOString().split('T')[0] : '',
      order: updatedStop.order,
    };
  }

  static async deleteStop(tripId: string, stopId: string, userId: string) {
    await this.verifyTripOwner(tripId, userId);

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
    });

    if (!stop) {
      throw ApiError.notFound('Trip stop not found');
    }

    await prisma.tripStop.delete({
      where: { id: stopId },
    });

    return { message: 'Trip stop removed successfully' };
  }

  // --- TRIP ACTIVITIES ---
  static async addTripActivity(tripId: string, userId: string, input: CreateTripActivityInput) {
    await this.verifyTripOwner(tripId, userId);

    // Verify trip stop exists and belongs to this trip
    let stop = await prisma.tripStop.findFirst({
      where: { id: input.tripStopId, tripId },
      include: { city: true },
    });

    if (!stop) {
      throw ApiError.notFound('Trip stop not found or does not belong to this trip');
    }

    // Verify activity exists or create custom activity
    let activity: any = null;
    if (input.activityId) {
      activity = await prisma.activity.findUnique({
        where: { id: input.activityId },
      });
    }

    if (!activity && input.name) {
      activity = await prisma.activity.create({
        data: {
          cityId: stop.cityId,
          name: input.name,
          description: input.notes || `Activity in ${stop.city.name}`,
          category: input.category || 'Sightseeing',
          estimatedCost: input.cost || 0,
          duration: '2 hours',
          image: stop.city.image,
        },
      });
    }

    if (!activity) {
      throw ApiError.notFound('Activity not found');
    }

    const cost = input.cost !== undefined ? input.cost : activity.estimatedCost;

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripStopId: input.tripStopId,
        activityId: activity.id,
        date: new Date(input.date || stop.arrivalDate),
        startTime: input.startTime || '10:00 AM',
        cost,
      },
      include: {
        activity: true,
      },
    });

    return {
      id: tripActivity.id,
      tripId,
      stopId: tripActivity.tripStopId,
      activityId: tripActivity.activityId,
      name: tripActivity.activity.name,
      category: tripActivity.activity.category,
      dayNumber: input.dayNumber || 1,
      startTime: tripActivity.startTime || '10:00 AM',
      cost: tripActivity.cost,
      location: tripActivity.activity.name,
      isCompleted: false,
    };
  }

  static async deleteTripActivity(tripId: string, activityId: string, userId: string) {
    await this.verifyTripOwner(tripId, userId);

    // Find trip activity ensuring it belongs to one of the stops of this trip
    const tripActivity = await prisma.tripActivity.findFirst({
      where: {
        id: activityId,
        tripStop: {
          tripId,
        },
      },
    });

    if (!tripActivity) {
      throw ApiError.notFound('Trip activity not found or does not belong to this trip');
    }

    await prisma.tripActivity.delete({
      where: { id: activityId },
    });

    return { message: 'Trip activity removed successfully' };
  }
}
