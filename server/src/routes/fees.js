import { Router } from 'express';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
const router = Router();
router.get('/', async (req, res) => {
  const filter = req.query.status && ['paid', 'pending'].includes(req.query.status) ? { status: req.query.status } : {};
  res.json(await Fee.find(filter).populate('student', 'fullName studentId').sort({ dueDate: 1 }));
});
router.post('/', async (req, res) => {
  if (!await Student.exists({ _id: req.body.student })) return res.status(404).json({ message: 'Student not found.' });
  res.status(201).json(await (await Fee.create(req.body)).populate('student', 'fullName studentId'));
});
router.patch('/:id/pay', async (req, res) => {
  const fee = await Fee.findByIdAndUpdate(req.params.id, { status: 'paid', paidAt: new Date(), ...(req.body.paymentMethod ? { paymentMethod: req.body.paymentMethod } : {}) }, { new: true, runValidators: true }).populate('student', 'fullName studentId');
  if (!fee) return res.status(404).json({ message: 'Fee record not found.' });
  res.json(fee);
});
router.put('/:id', async (req, res) => {
  const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('student', 'fullName studentId');
  if (!fee) return res.status(404).json({ message: 'Fee record not found.' });
  res.json(fee);
});
router.delete('/:id', async (req, res) => {
  const fee = await Fee.findByIdAndDelete(req.params.id);
  if (!fee) return res.status(404).json({ message: 'Fee record not found.' });
  res.json({ message: 'Fee record deleted.' });
});
export default router;
