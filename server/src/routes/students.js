import { Router } from 'express';
import Student from '../models/Student.js';
import Allocation from '../models/Allocation.js';
import Fee from '../models/Fee.js';
const router = Router();
router.get('/', async (req, res) => {
  const q = String(req.query.search || '').trim();
  const filter = q ? { $or: ['fullName', 'studentId', 'email', 'course', 'phone'].map(k => ({ [k]: { $regex: q, $options: 'i' } })) } : {};
  res.json(await Student.find(filter).sort({ createdAt: -1 }));
});
router.post('/', async (req, res) => res.status(201).json(await Student.create(req.body)));
router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found.' });
  res.json(student);
});
router.put('/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!student) return res.status(404).json({ message: 'Student not found.' });
  res.json(student);
});
router.delete('/:id', async (req, res) => {
  const active = await Allocation.exists({ student: req.params.id, status: 'active' });
  if (active) return res.status(409).json({ message: 'Deallocate this student before deleting the record.' });
  await Fee.deleteMany({ student: req.params.id });
  const deleted = await Student.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Student not found.' });
  res.json({ message: 'Student deleted.' });
});
export default router;
