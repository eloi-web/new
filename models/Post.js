const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imageData: { type: Buffer },
  imageType: { type: String },
  targetPage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

postSchema.virtual('imageSrc').get(function () {
  if (this.imageData && this.imageType) {
    return `data:${this.imageType};base64,${this.imageData.toString('base64')}`;
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;