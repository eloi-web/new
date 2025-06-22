import connectDB from '../utils/db.js';
import AuctionPost from '../models/AuctionPost.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    await connectDB();
    const posts = await AuctionPost.find().sort({ createdAt: -1 });
    const formattedPosts = posts.map(post => ({
      ...post.toObject(),
      imageData: post.imageData?.toString('base64')
    }));

    return res.status(200).json({ posts: formattedPosts });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching auction posts', error: e.message });
  }
}
