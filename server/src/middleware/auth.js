import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_ALGORITHM = 'HS256';

export async function getUser(token) {
  if (!token) return null;

  try {
    const clean = token.startsWith('Bearer ') ? token.slice(7) : token;
    const { userId } = jwt.verify(clean, process.env.JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });
    return await User.findById(userId).lean();
  } catch {
    return null;
  }
}

export function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function requireAuth(user) {
  if (!user) throw new Error('Authentication required');
  return user;
}

export function requireAdmin(user) {
  requireAuth(user);
  if (user.role !== 'admin') throw new Error('Admin access required');
  return user;
}
