import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  course: { type: String, trim: true, default: '' },
  year: { type: String, trim: true, default: '' },
  guardianName: { type: String, trim: true, default: '' },
  guardianPhone: { type: String, trim: true, default: '' },
  address: { type: String, trim: true, default: '' }
}, { timestamps: true });
export default mongoose.model('Student', studentSchema);
