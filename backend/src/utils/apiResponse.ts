import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static created<T>(res: Response, data: T) {
    return res.status(201).json({
      success: true,
      data,
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, errors?: any[]) {
    const responseBody: ApiResponseData = {
      success: false,
      message,
    };
    if (errors && errors.length > 0) {
      responseBody.errors = errors;
    }
    return res.status(statusCode).json(responseBody);
  }
}
