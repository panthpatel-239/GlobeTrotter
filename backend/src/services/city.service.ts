import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { CityQueryInput } from '../validators/city.validator';

export class CityService {
  static async getAllCities(query: CityQueryInput) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { country: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.country) {
      where.country = { contains: query.country, mode: 'insensitive' };
    }

    if (query.costIndex !== undefined && !isNaN(query.costIndex)) {
      where.costIndex = query.costIndex;
    }

    const cities = await prisma.city.findMany({
      where,
      orderBy: [{ popularity: 'desc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { activities: true },
        },
      },
    });

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      description: city.description,
      image: city.image,
      costIndex: city.costIndex,
      popularity: city.popularity,
      activityCount: city._count.activities,
      createdAt: city.createdAt,
    }));
  }

  static async getCityById(id: string) {
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!city) {
      throw ApiError.notFound('City not found');
    }

    return city;
  }
}
