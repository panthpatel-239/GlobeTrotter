import { Response, NextFunction } from 'express';
import { ItineraryService } from '../services/itinerary.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class ItineraryController {
  // STOPS
  static async addStop(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripId = req.params.id;
      const stop = await ItineraryService.addStop(tripId, req.user!.id, req.body);
      ApiResponse.created(res, stop);
    } catch (error) {
      next(error);
    }
  }

  static async updateStop(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: tripId, stopId } = req.params;
      const stop = await ItineraryService.updateStop(tripId, stopId, req.user!.id, req.body);
      ApiResponse.success(res, stop);
    } catch (error) {
      next(error);
    }
  }

  static async deleteStop(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: tripId, stopId } = req.params;
      const result = await ItineraryService.deleteStop(tripId, stopId, req.user!.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  // TRIP ACTIVITIES
  static async addTripActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripId = req.params.id;
      const tripActivity = await ItineraryService.addTripActivity(tripId, req.user!.id, req.body);
      ApiResponse.created(res, tripActivity);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTripActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: tripId, activityId } = req.params;
      const result = await ItineraryService.deleteTripActivity(tripId, activityId, req.user!.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
