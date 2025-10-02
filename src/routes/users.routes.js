import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controller/users.controller.js';
import { authenticateToken } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// GET /users - Get all users (public for now, you can add authentication if needed)
router.get('/', fetchAllUsers);

// GET /users/:id - Get user by ID (public for now, you can add authentication if needed)
router.get('/:id', fetchUserById);

// PUT /users/:id - Update user (requires authentication)
router.put('/:id', authenticateToken, updateUserById);

// DELETE /users/:id - Delete user (requires authentication)
router.delete('/:id', authenticateToken, deleteUserById);

export default router;
