import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import connectDB from '../utils/db.js';
import JobPost from '../models/Post.js';
import AuctionPost from '../models/AuctionPost.js';
import ConsultantPost from '../models/ConsultantPost.js';
import TenderPost from '../models/TenderPost.js';
import VenuePost from '../models/VenuePost.js';

export const config = {
  api: {
    bodyParser: false
  }
};

const modelMap = {
  Jobs: JobPost,
  Auction: AuctionPost,
  Consultants: ConsultantPost,
  Tenders: TenderPost,
  Venues: VenuePost
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing.' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  await connectDB();

  const form = new IncomingForm({ multiples: true, keepExtensions: true, uploadDir: '/tmp' });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Form parsing error', error: err.message });
    }

    try {
      const {
        title,
        content,
        category,
        published,
        companyName,
        jobLocation,
        jobType,
        jobDescription,
        jobTags
      } = fields;

      if (!category || !modelMap[category]) {
        return res.status(400).json({ message: 'Invalid category' });
      }

      // Debug: log all fields and files
      console.log('Received fields:', fields);
      console.log('Received files:', files);

      // Prepare image URLs from uploaded files (adjust if you process or upload files somewhere else)
      const jobImageUrls = [];
      if (files.jobImages) {
        const imageFiles = Array.isArray(files.jobImages) ? files.jobImages : [files.jobImages];
        for (const file of imageFiles) {
          jobImageUrls.push(file.filepath);
        }
      }

      const companyLogoUrl = files.companyLogo?.filepath || null;

      // Construct new post data depending on category
      const postData = {
        title,
        content,
        category,
        published: published === 'true',
        createdAt: new Date()
      };

      if (category === 'Jobs') {
        postData.companyName = companyName || '';
        postData.jobLocation = jobLocation || '';
        postData.jobType = jobType || '';
        postData.jobDescription = jobDescription || '';
        postData.jobTags = jobTags ? jobTags.split(',').map(tag => tag.trim()) : [];
        postData.companyLogoUrl = companyLogoUrl;
        postData.jobImageUrls = jobImageUrls;
      }

      const Model = modelMap[category];
      const newPost = new Model(postData);

      // Debug before saving
      console.log('Saving new post:', newPost);

      await newPost.save();

      return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (e) {
      console.error('Error saving post:', e);
      return res.status(500).json({ message: 'Error saving post', error: e.message, stack: e.stack });
    }
  });
}
