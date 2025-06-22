import connectDB from '../utils/db';
import ConsultantPost from '../models/ConsultantPost';

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'GET') {
    try {
      const posts = await ConsultantPost.find().sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (err) {
      console.error('Fetch consultants error:', err);
      res.status(500).json({ message: 'Server error fetching consultants.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
