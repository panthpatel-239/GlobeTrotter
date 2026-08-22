import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { CreateTripInput, UpdateTripInput } from '../validators/trip.validator';
import { TripSummary } from '../types';

export class TripService {
  static async getUserTrips(userId: string): Promise<TripSummary[]> {
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: {
            city: {
              select: {
                id: true,
                name: true,
                country: true,
                image: true,
              },
            },
          },
        },
        expenses: {
          select: {
            amount: true,
          },
        },
      },
    });

    return trips.map((trip) => {
      const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const uniqueCityIds = new Set(trip.stops.map((s) => s.cityId));

      return {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        coverImage: trip.coverImage,
        budgetLimit: trip.budgetLimit,
        isPublic: trip.isPublic,
        shareId: trip.shareId,
        destinationCount: uniqueCityIds.size || trip.stops.length,
        totalExpenses,
        stops: trip.stops.map((stop) => ({
          id: stop.id,
          cityId: stop.cityId,
          cityName: stop.city.name,
          cityCountry: stop.city.country,
          cityImage: stop.city.image,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          order: stop.order,
        })),
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt,
      };
    });
  }

  static async createTrip(userId: string, input: CreateTripInput) {
    const trip = await prisma.trip.create({
      data: {
        userId,
        title: input.title,
        description: input.description || null,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        coverImage: input.coverImage || null,
        budgetLimit: input.budgetLimit || null,
        isPublic: input.isPublic || false,
      },
    });

    return trip;
  }

  static async getTripById(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        stops: {
          orderBy: { order: 'asc' },
          include: {
            city: true,
            tripActivities: {
              orderBy: { date: 'asc' },
              include: {
                activity: true,
              },
            },
          },
        },
        expenses: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!trip) {
      throw ApiError.notFound('Trip not found');
    }

    if (trip.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to view this trip');
    }

    const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      ...trip,
      totalExpenses,
    };
  }

  static async updateTrip(tripId: string, userId: string, input: UpdateTripInput) {
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw ApiError.notFound('Trip not found');
    }

    if (existingTrip.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to modify this trip');
    }

    const dataToUpdate: any = {};
    if (input.title !== undefined) dataToUpdate.title = input.title;
    if (input.description !== undefined) dataToUpdate.description = input.description;
    if (input.startDate !== undefined) dataToUpdate.startDate = new Date(input.startDate);
    if (input.endDate !== undefined) dataToUpdate.endDate = new Date(input.endDate);
    if (input.coverImage !== undefined) dataToUpdate.coverImage = input.coverImage;
    if (input.budgetLimit !== undefined) dataToUpdate.budgetLimit = input.budgetLimit;
    if (input.isPublic !== undefined) dataToUpdate.isPublic = input.isPublic;

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: dataToUpdate,
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: {
            city: true,
            tripActivities: {
              include: {
                activity: true,
              },
            },
          },
        },
      },
    });

    return updatedTrip;
  }

  static async deleteTrip(tripId: string, userId: string) {
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw ApiError.notFound('Trip not found');
    }

    if (existingTrip.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to delete this trip');
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return { message: 'Trip successfully deleted' };
  }
}
