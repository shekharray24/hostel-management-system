import { Router } from 'express';
import Room from '../models/Room.js';
import Allocation from '../models/Allocation.js';
const router = Router();
router.get('/', async (_req, res) => {
  const rooms = await Room.find().sort({ block: 1, roomNumber: 1 });
  const counts = await Allocation.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$room', count: { $sum: 1 } } }]);
  const map = new Map(counts.map(c => [String(c._id), c.count]));
  res.json(rooms.map(r => ({ ...r.toObject(), occupied: map.get(String(r._id)) || 0, available: Math.max(0, r.capacity - (map.get(String(r._id)) || 0)) })));
});
router.post('/', async (req, res) => res.status(201).json(await Room.create(req.body)));
router.put('/:id', async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  const activeCount = await Allocation.countDocuments({ room: room._id, status: 'active' });
  if (req.body.capacity !== undefined && Number(req.body.capacity) < activeCount) return res.status(400).json({ message: `Capacity cannot be lower than current occupancy (${activeCount}).` });
  Object.assign(room, req.body);
  await room.save();
  res.json(room);
});
router.delete('/:id', async (req, res) => {
  if (await Allocation.exists({ room: req.params.id, status: 'active' })) return res.status(409).json({ message: 'Room has active allocations. Deallocate students first.' });
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  res.json({ message: 'Room deleted.' });
});
export default router;
