import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Auth header:', authHeader);
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    jwt.verify(token, env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      console.log('Token verified, user:', user);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export default authenticateToken;
