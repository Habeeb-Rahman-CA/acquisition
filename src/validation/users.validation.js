import { z } from 'zod';

export const userIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .transform(val => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error('ID must be a positive integer');
      }
      return parsed;
    }),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(255, 'Name must be less than 255 characters')
      .trim()
      .optional(),
    email: z
      .string()
      .email('Invalid email format')
      .max(255, 'Email must be less than 255 characters')
      .toLowerCase()
      .trim()
      .optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password must be less than 128 characters')
      .optional(),
    role: z
      .enum(['user', 'admin'], {
        errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
      })
      .optional(),
  })
  .refine(
    data => {
      // Ensure at least one field is provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );
