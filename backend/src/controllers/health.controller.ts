import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { ApiResponse } from '../utils/apiResponse';

export class HealthController {
  static async check(req: Request, res: Response): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        success: true,
        message: 'GlobeTrotter API is running',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'GlobeTrotter API is running but database is unreachable',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      });
    }
  }
}
