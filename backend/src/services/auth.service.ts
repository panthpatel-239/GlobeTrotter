import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { hashPassword, comparePassword, signToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AuthResponse, UserResponse } from '../types';

export class AuthService {
  static async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        profileImage: input.profileImage || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = signToken({ userId: user.id, email: user.email });

    return {
      token,
      user,
    };
  }

  static async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = signToken({ userId: user.id, email: user.email });

    const safeUser: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      token,
      user: safeUser,
    };
  }

  static async getMe(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }
}
