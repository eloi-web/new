import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: String,
  targetPage: String,
  imageData: Buffer,
  imageType: String,
  companyLogoData: Buffer,
  companyLogoType: String,

  createdAt: { type: Date, default: Date.now },

  companyName: String,
  jobLocation: String,
  jobType: String,
  jobDescription: String,
  jobTags: [String],
});

export default mongoose.models.JobPost || mongoose.model('JobPost', PostSchema);
