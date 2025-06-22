import jwt from 'jsonwebtoken';
import connectDB from '../utils/db.js';
import JobPost from '../models/Post.js';
import AuctionPost from '../models/AuctionPost.js';
import ConsultantPost from '../models/ConsultantPost.js';
import TenderPost from '../models/TenderPost.js';
import VenuePost from '../models/VenuePost.js';


const modelMap = {
  Jobs: JobPost,
  Auction: AuctionPost,
  Consultants: ConsultantPost,
  Tenders: TenderPost,
  Venues: VenuePost
};

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing.' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.method === 'PUT') {
    const updateData = req.body;
    if (!id) return res.status(400).json({ message: 'Post ID is required for update.' });

    const category = updateData.category;
    const Model = modelMap[category];
    if (!Model) return res.status(400).json({ message: 'Invalid category for update.' });

    try {
      const result = await Model.findByIdAndUpdate(id, updateData, { new: true });
      if (!result) return res.status(404).json({ message: 'Post not found.' });
      return res.status(200).json({ message: 'Post updated successfully.', result });
    } catch (error) {
      console.error('Update failed:', error);
      return res.status(500).json({ message: 'Failed to update post.' });
    }
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Post ID is required for deletion.' });

    try {
      let deleted = null;
      for (let Model of Object.values(modelMap)) {
        deleted = await Model.findByIdAndDelete(id);
        if (deleted) break;
      }

      if (!deleted) return res.status(404).json({ message: 'Post not found in any category.' });
      return res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
      console.error('Delete failed:', error);
      return res.status(500).json({ message: 'Failed to delete post.' });
    }
  }

  if (req.method === 'GET') {
    if (id) {
      try {
        for (const [category, Model] of Object.entries(modelMap)) {
          const post = await Model.findById(id).lean();
          if (post) {
            const result = {
              ...post,
              id: post._id,
              category
            };

            if (post.imageData && post.imageType) {
  result.imageSrc = `data:${post.imageType};base64,${Buffer.from(post.imageData).toString('base64')}`;
}

if (post.companyLogo && post.companyLogoType) {
  result.companyLogoSrc = `data:${post.companyLogoType};base64,${Buffer.from(post.companyLogo).toString('base64')}`;
}


            return res.status(200).json(result);

          }
        }
        return res.status(404).json({ message: 'Post not found' });
      } catch (err) {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      try {
        const allPosts = [];

        for (const [category, Model] of Object.entries(modelMap)) {
          const docs = await Model.find().lean();
          docs.forEach(doc => {
            const transformed = {
              ...doc,
              id: doc._id,
              category
            };

            if (doc.imageData && doc.imageType) {
              transformed.imageSrc = `data:${doc.imageType};base64,${doc.imageData.toString('base64')}`;
            }

            if (doc.companyLogo && doc.companyLogoType) {
              transformed.companyLogoSrc = `data:${doc.companyLogoType};base64,${doc.companyLogo.toString('base64')}`;
            }

            allPosts.push(transformed);
          });

        }

        return res.status(200).json(allPosts);
      } catch (error) {
        console.error('Fetch error:', error);
        return res.status(500).json({ message: 'Failed to load posts.' });
      }
    }
  }

  return res.status(405).json({ message: 'Method not allowed.' });
}
