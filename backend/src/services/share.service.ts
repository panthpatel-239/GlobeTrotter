import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { env } from '../config/env';

export class ShareService {
  static async enableTripSharing(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw ApiError.notFound('Trip not found');
    }

    if (trip.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to share this trip');
    }

    let shareId = trip.shareId;
    if (!shareId) {
      shareId = `gt-${crypto.randomBytes(6).toString('hex')}`;
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        isPublic: true,
        shareId,
      },
    });

    const shareUrl = `${env.FRONTEND_URL}/share/${shareId}`;

    return {
      shareId: updatedTrip.shareId,
      isPublic: updatedTrip.isPublic,
      shareUrl,
    };
  }

  static async getPublicSharedTrip(shareId: string) {
    const trip = await prisma.trip.findUnique({
      where: { shareId },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        coverImage: true,
        isPublic: true,
        shareId: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        stops: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            arrivalDate: true,
            departureDate: true,
            order: true,
            city: {
              select: {
                id: true,
                name: true,
                country: true,
                description: true,
                image: true,
                costIndex: true,
              },
            },
            tripActivities: {
              orderBy: { date: 'asc' },
              select: {
                id: true,
                date: true,
                startTime: true,
                cost: true,
                activity: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true,
                    duration: true,
                    image: true,
                    estimatedCost: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!trip || !trip.isPublic) {
      throw ApiError.notFound('Shared itinerary not found or is no longer public');
    }

    return trip;
  }
}
