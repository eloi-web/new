import mongoose from 'mongoose';

const tenderPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  published: Boolean,
}, { timestamps: true });

export default mongoose.models.TenderPost || mongoose.model('TenderPost', tenderPostSchema);
