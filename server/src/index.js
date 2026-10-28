import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import roomRoutes from './routes/rooms.js';
import allocationRoutes from './routes/allocations.js';
import feeRoutes from './routes/fees.js';
import { protect } from './middleware/auth.js';
import Student from './models/Student.js';
import Room from './models/Room.js';
import Fee from './models/Fee.js';
import Allocation from './models/Allocation.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'hostel-management-api' }));
app.get('/api/dashboard', protect, async (_req, res) => {
  const [students, rooms, occupied, pendingFees, paidFees, recentStudents] = await Promise.all([
    Student.countDocuments(),
    Room.countDocuments(),
    Allocation.countDocuments({ status: 'active' }),
    Fee.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Fee.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Student.find().sort({ createdAt: -1 }).limit(5).select('fullName studentId course year')
  ]);
  const roomDocs = await Room.find().select('capacity');
  const capacity = roomDocs.reduce((sum, room) => sum + room.capacity, 0);
  res.json({
    students, rooms, occupiedBeds: occupied,
    availableBeds: Math.max(0, capacity - occupied),
    occupancyRate: capacity ? Math.round((occupied / capacity) * 100) : 0,
    pendingFees: pendingFees[0]?.total || 0,
    collectedFees: paidFees[0]?.total || 0,
    recentStudents
  });
});

app.use('/api/students', protect, studentRoutes);
app.use('/api/rooms', protect, roomRoutes);
app.use('/api/allocations', protect, allocationRoutes);
app.use('/api/fees', protect, feeRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with this value already exists.' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid record ID.' });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_management')
  .then(() => app.listen(port, () => console.log(`Hostel API running on http://localhost:${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
