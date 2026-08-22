import { Response, NextFunction } from 'express';
import { TripService } from '../services/trip.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class TripController {
  static async getTrips(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trips = await TripService.getUserTrips(req.user!.id);
      ApiResponse.success(res, trips);
    } catch (error) {
      next(error);
    }
  }

  static async createTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await TripService.createTrip(req.user!.id, req.body);
      ApiResponse.created(res, trip);
    } catch (error) {
      next(error);
    }
  }

  static async getTripById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await TripService.getTripById(req.params.id, req.user!.id);
      ApiResponse.success(res, trip);
    } catch (error) {
      next(error);
    }
  }

  static async updateTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedTrip = await TripService.updateTrip(req.params.id, req.user!.id, req.body);
      ApiResponse.success(res, updatedTrip);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await TripService.deleteTrip(req.params.id, req.user!.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
