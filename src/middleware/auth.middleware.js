import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required'
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    
    logger.info(`User ${decoded.email} authenticated for ${req.method} ${req.path}`);
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    
    if (token) {
      const decoded = jwttoken.verify(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens, just continue without user
    logger.warn('Optional auth token verification failed:', error);
    next();
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin privileges required'
    });
  }

  next();
};