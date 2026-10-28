import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Please log in to continue.' });
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'development-only-secret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired or token is invalid. Please log in again.' });
  }
}
