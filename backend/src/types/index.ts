import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: AuthenticatedUser;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface TripSummary {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  coverImage: string | null;
  budgetLimit: number | null;
  isPublic: boolean;
  shareId: string | null;
  destinationCount: number;
  totalExpenses: number;
  stops: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetBreakdown {
  total: number;
  budgetLimit: number | null;
  remaining: number | null;
  isOverBudget: boolean;
  expenseCount: number;
  categories: {
    transport: number;
    accommodation: number;
    activities: number;
    food: number;
    other: number;
  };
}
