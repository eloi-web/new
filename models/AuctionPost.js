const mongoose = require('mongoose');

const auctionPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageData: Buffer,
  imageType: String,
  createdAt: { type: Date, default: Date.now }
});

auctionPostSchema.virtual('imageSrc').get(function () {
  if (this.imageData && this.imageType) {
    return `data:${this.imageType};base64,${this.imageData.toString('base64')}`;
  }
});

module.exports = mongoose.model('AuctionPost', auctionPostSchema);
