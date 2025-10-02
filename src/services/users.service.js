import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '#services/auth.service.js';

export const getAllUsers = async () => {
  try {
    return await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
    }).from(users);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

export const getUserById = async (id) => {
  try {
    const [user] = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
    }).from(users).where(eq(users.id, id)).limit(1);
    
    return user;
  } catch (e) {
    logger.error(`Error fetching user by ID ${id}:`, e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Prepare updates object
    const updateData = { ...updates };
    
    // Hash password if it's being updated
    if (updates.password) {
      updateData.password = await hashPassword(updates.password);
    }
    
    // Add updated timestamp
    updateData.updated_at = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
      });

    logger.info(`User ${updatedUser.email} updated successfully`);
    return updatedUser;
  } catch (e) {
    logger.error(`Error updating user ${id}:`, e);
    throw e;
  }
};

export const deleteUser = async (id) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role
      });

    logger.info(`User ${deletedUser.email} deleted successfully`);
    return deletedUser;
  } catch (e) {
    logger.error(`Error deleting user ${id}:`, e);
    throw e;
  }
};
