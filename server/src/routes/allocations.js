import { Router } from 'express';
import Allocation from '../models/Allocation.js';
import Student from '../models/Student.js';
import Room from '../models/Room.js';
const router = Router();
router.get('/', async (_req, res) => res.json(await Allocation.find().populate('student', 'fullName studentId course').populate('room', 'roomNumber block capacity').sort({ createdAt: -1 })));
router.post('/', async (req, res) => {
  const { student, room, notes } = req.body;
  if (!student || !room) return res.status(400).json({ message: 'Choose a student and a room.' });
  if (!await Student.exists({ _id: student })) return res.status(404).json({ message: 'Student not found.' });
  const roomDoc = await Room.findById(room);
  if (!roomDoc) return res.status(404).json({ message: 'Room not found.' });
  if (await Allocation.exists({ student, status: 'active' })) return res.status(409).json({ message: 'This student already has an active room allocation.' });
  const occupied = await Allocation.countDocuments({ room, status: 'active' });
  if (occupied >= roomDoc.capacity) return res.status(409).json({ message: 'This room is already at capacity.' });
  const allocation = await Allocation.create({ student, room, notes });
  res.status(201).json(await allocation.populate([{ path: 'student', select: 'fullName studentId course' }, { path: 'room', select: 'roomNumber block capacity' }]));
});
router.patch('/:id/deallocate', async (req, res) => {
  const allocation = await Allocation.findOneAndUpdate({ _id: req.params.id, status: 'active' }, { status: 'ended', endedAt: new Date() }, { new: true }).populate('student', 'fullName studentId').populate('room', 'roomNumber block');
  if (!allocation) return res.status(404).json({ message: 'Active allocation not found.' });
  res.json(allocation);
});
export default router;
