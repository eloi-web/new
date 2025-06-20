import mongoose from 'mongoose';

const consultantPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  published: Boolean,
}, { timestamps: true });

export default mongoose.models.ConsultantPost || mongoose.model('ConsultantPost', consultantPostSchema);
