import mongoose from 'mongoose';

const consultantPostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String },
  location: { type: String },
  bio: { type: String },
  photoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ConsultantPost || mongoose.model('ConsultantPost', consultantPostSchema);
