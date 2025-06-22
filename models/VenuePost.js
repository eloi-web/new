import mongoose from 'mongoose';

const venuePostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  capacity: { type: Number },
  description: { type: String },
  imageUrls: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.VenuePost || mongoose.model('VenuePost', venuePostSchema);
