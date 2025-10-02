import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validation/users.validation.js';
import { formatValidationError } from '#utils/format.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    logger.info(`Getting user by ID: ${id}`);

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
    }

    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (e) {
    logger.error('Error fetching user by ID:', e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Validate ID parameter
    const idValidation = userIdSchema.safeParse({ id: req.params.id });
    if (!idValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idValidation.error),
      });
    }

    // Validate request body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = idValidation.data;
    const updates = bodyValidation.data;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Authorization checks
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user.id === id;

    // Users can only update their own profile, admins can update any profile
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile',
      });
    }

    // Only admins can change roles
    if (updates.role && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can change user roles',
      });
    }

    logger.info(`User ${req.user.email} updating user ID: ${id}`);

    const updatedUser = await updateUser(id, updates);

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error('Error updating user:', e);
    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
    }
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Authorization checks
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user.id === id;

    // Users can delete their own profile, admins can delete any profile
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own profile',
      });
    }

    // Prevent users from deleting themselves if they are the only admin
    if (isAdmin && isOwnProfile) {
      // Check if there are other admins
      const allUsers = await getAllUsers();
      const adminCount = allUsers.filter(user => user.role === 'admin').length;

      if (adminCount <= 1) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Cannot delete the last admin account',
        });
      }
    }

    logger.info(`User ${req.user.email} deleting user ID: ${id}`);

    const deletedUser = await deleteUser(id);

    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (e) {
    logger.error('Error deleting user:', e);
    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
    }
    next(e);
  }
};
