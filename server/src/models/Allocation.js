import mongoose from 'mongoose';
const allocationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  allocatedAt: { type: Date, default: Date.now },
  notes: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  endedAt: { type: Date, default: null }
}, { timestamps: true });
allocationSchema.index({ student: 1, status: 1 });
export default mongoose.model('Allocation', allocationSchema);
