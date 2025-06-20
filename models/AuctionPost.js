import mongoose from 'mongoose';

const auctionPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  published: Boolean,
 
}, { timestamps: true });

export default mongoose.models.AuctionPost || mongoose.model('AuctionPost', auctionPostSchema);
