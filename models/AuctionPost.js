const mongoose = require('mongoose');

const auctionPostSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  startingBid: { type: Number, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

auctionPostSchema.virtual('imageSrc').get(function () {
  if (this.imageData && this.imageType) {
    return `data:${this.imageType};base64,${this.imageData.toString('base64')}`;
  }
});

module.exports = mongoose.model('AuctionPost', auctionPostSchema);
