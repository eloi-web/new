import mongoose from 'mongoose';

const tenderPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String },
  deadline: { type: Date, required: true },
  details: { type: String },
  documentUrls: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.TenderPost || mongoose.model('TenderPost', tenderPostSchema);
