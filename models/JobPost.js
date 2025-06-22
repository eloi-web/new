import mongoose from 'mongoose';
const jobPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  published: Boolean,
  companyName: String,
  jobLocation: String,
  jobType: String,
  jobDescription: String,
  jobTags: [String],
  companyLogoUrl: String,
  jobImageUrls: [String],
}, { timestamps: true });

export default mongoose.models.JobPost || mongoose.model('JobPost', jobPostSchema);
