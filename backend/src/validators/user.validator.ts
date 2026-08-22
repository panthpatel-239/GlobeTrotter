import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100).optional(),
  profileImage: z.string().url('Profile image must be a valid URL').optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long').optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Current password is required to set a new password',
    path: ['currentPassword'],
  }
);

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
