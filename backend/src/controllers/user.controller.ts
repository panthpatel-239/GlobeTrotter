import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class UserController {
  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getMe(req.user!.id);
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedUser = await UserService.updateMe(req.user!.id, req.body);
      ApiResponse.success(res, updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await UserService.deleteMe(req.user!.id);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
