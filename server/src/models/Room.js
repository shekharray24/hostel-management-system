import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  block: { type: String, trim: true, default: 'A' },
  floor: { type: Number, default: 0 },
  roomType: { type: String, enum: ['Single', 'Double', 'Triple', 'Dormitory'], default: 'Double' },
  capacity: { type: Number, required: true, min: 1, default: 2 },
  monthlyFee: { type: Number, min: 0, default: 0 },
  facilities: [{ type: String, trim: true }]
}, { timestamps: true });
export default mongoose.model('Room', roomSchema);
