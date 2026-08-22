import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { CreateStopInput, UpdateStopInput, CreateTripActivityInput } from '../validators/itinerary.validator';

export class ItineraryService {
  // Helper to ensure trip ownership
  private static async verifyTripOwner(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true, userId: true },
    });

    if (!trip) {
      throw ApiError.notFound('Trip not found');
    }

    if (trip.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to modify this trip');
    }

    return trip;
  }

  // --- TRIP STOPS ---
  static async addStop(tripId: string, userId: string, input: CreateStopInput) {
    await this.verifyTripOwner(tripId, userId);

    // Verify city exists
    const city = await prisma.city.findUnique({
      where: { id: input.cityId },
    });
    if (!city) {
      throw ApiError.notFound('City not found');
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
        cityId: input.cityId,
        arrivalDate: new Date(input.arrivalDate),
        departureDate: new Date(input.departureDate),
        order,
      },
      include: {
        city: true,
      },
    });

    return stop;
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

    return updatedStop;
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
    const stop = await prisma.tripStop.findFirst({
      where: { id: input.tripStopId, tripId },
    });

    if (!stop) {
      throw ApiError.notFound('Trip stop not found or does not belong to this trip');
    }

    // Verify activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: input.activityId },
    });

    if (!activity) {
      throw ApiError.notFound('Activity not found');
    }

    const cost = input.cost !== undefined ? input.cost : activity.estimatedCost;

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripStopId: input.tripStopId,
        activityId: input.activityId,
        date: new Date(input.date),
        startTime: input.startTime || null,
        cost,
      },
      include: {
        activity: true,
      },
    });

    return tripActivity;
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
