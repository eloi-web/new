import mongoose from 'mongoose';

const venuePostSchema = new mongoose.Schema({
  title: String,
  content: String,
  published: Boolean,
}, { timestamps: true });

export default mongoose.models.VenuePost || mongoose.model('VenuePost', venuePostSchema);
