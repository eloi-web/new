import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: String,
  targetPage: String,
  imageData: Buffer,
  imageType: String,
  createdAt: { type: Date, default: Date.now },

  // Extra fields for jobs
  companyName: String,
  jobLocation: String,
  jobType: String,
  jobDescription: String,
  jobTags: [String],
});

export default mongoose.models.JobPost || mongoose.model('JobPost', PostSchema);
