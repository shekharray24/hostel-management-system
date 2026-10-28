import mongoose from 'mongoose';
const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true, trim: true, default: 'Hostel Fee' },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidAt: { type: Date, default: null },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'], default: 'Other' },
  notes: { type: String, trim: true, default: '' }
}, { timestamps: true });
export default mongoose.model('Fee', feeSchema);
