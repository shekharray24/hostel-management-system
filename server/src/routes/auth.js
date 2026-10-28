import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const makeToken = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: '7d' });
const safeUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: makeToken(user), user: safeUser(user) });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').trim().toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
  res.json({ token: makeToken(user), user: safeUser(user) });
});
router.get('/me', protect, (req, res) => res.json({ user: safeUser(req.user) }));
export default router;
