import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { hashPassword, comparePassword } from '../utils/jwt';
import { UpdateUserInput } from '../validators/user.validator';
import { UserResponse } from '../types';

export class UserService {
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

  static async updateMe(userId: string, input: UpdateUserInput): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const dataToUpdate: any = {};

    if (input.name !== undefined) {
      dataToUpdate.name = input.name;
    }

    if (input.profileImage !== undefined) {
      dataToUpdate.profileImage = input.profileImage;
    }

    if (input.newPassword) {
      const isMatch = await comparePassword(input.currentPassword!, user.passwordHash);
      if (!isMatch) {
        throw ApiError.badRequest('Current password does not match');
      }
      dataToUpdate.passwordHash = await hashPassword(input.newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  static async deleteMe(userId: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User account and associated data successfully deleted' };
  }
}
