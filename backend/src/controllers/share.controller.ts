import { Request, Response, NextFunction } from 'express';
import { ShareService } from '../services/share.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class ShareController {
  // POST /api/trips/:id/share (Protected)
  static async enableShare(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripId = req.params.id;
      const result = await ShareService.enableTripSharing(tripId, req.user!.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/share/:shareId (Public)
  static async getSharedTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shareId = req.params.shareId;
      const trip = await ShareService.getPublicSharedTrip(shareId);
      ApiResponse.success(res, trip);
    } catch (error) {
      next(error);
    }
  }
}
