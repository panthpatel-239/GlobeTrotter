import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { ActivityQueryInput } from '../validators/activity.validator';

export class ActivityService {
  static async getActivities(query: ActivityQueryInput) {
    const where: any = {};

    if (query.cityId) {
      where.cityId = query.cityId;
    }

    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: [{ estimatedCost: 'asc' }, { name: 'asc' }],
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
    });

    return activities;
  }

  static async getActivityById(id: string) {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        city: true,
      },
    });

    if (!activity) {
      throw ApiError.notFound('Activity not found');
    }

    return activity;
  }
}
