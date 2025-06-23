import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  targetPage: String,
  imageData: Buffer, 
  imageType: String,
  companyName: String,
  jobLocation: String,
  jobType: String,
  jobDescription: String,
  jobTags: [String],
  published: Boolean,
  companyLogo: Buffer,     
  companyLogoType: String, 
  jobImages: [Buffer],     
  jobImagesType: [String], 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.JobPost || mongoose.model('JobPost', PostSchema);
