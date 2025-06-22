const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String },
  targetPage: { type: String }, 
  imageData: Buffer,             
  imageType: String,             

  companyLogoData: Buffer,       
  companyLogoType: String,

  companyName: String,
  jobLocation: String,
  jobType: String,
  jobDescription: String,
  jobTags: [String],
  published: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

postSchema.virtual('imageSrc').get(function () {
  if (this.imageData && this.imageType) {
    return `data:${this.imageType};base64,${this.imageData.toString('base64')}`;
  }
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);