import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import connectDB from '../utils/db.js';
import Post from '../models/Post.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  await connectDB();

  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    allowEmptyFiles: true,
    minFileSize: 1,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Form parsing error', error: err.message });
    }

    try {
      const {
        title,
        body,
        targetPage,
        companyName,
        jobLocation,
        jobType,
        jobDescription,
        jobTags,
        published,
      } = fields;

      if (!title || !body || !targetPage) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Main image (e.g., jobImages[0])
      let imageData = null;
      let imageType = null;

      if (files.jobImages && (Array.isArray(files.jobImages) ? files.jobImages.length > 0 : files.jobImages.size > 0)) {
        const firstImage = Array.isArray(files.jobImages) ? files.jobImages[0] : files.jobImages;
        const imageBuffer = fs.readFileSync(firstImage.filepath);
        imageData = imageBuffer;
        imageType = firstImage.mimetype;
      }

      // Optional: company logo
      let companyLogoData = null;
      let companyLogoType = null;
      if (files.companyLogo && files.companyLogo.size > 0) {
        const logoBuffer = fs.readFileSync(files.companyLogo.filepath);
        companyLogoData = logoBuffer;
        companyLogoType = files.companyLogo.mimetype;
      }

      const post = new Post({
        title: Array.isArray(title) ? title[0] : title,
        body: Array.isArray(body) ? body[0] : body,
        targetPage: Array.isArray(targetPage) ? targetPage[0] : targetPage,
        imageData,
        imageType,
        companyName: Array.isArray(companyName) ? companyName[0] : companyName,
        jobLocation: Array.isArray(jobLocation) ? jobLocation[0] : jobLocation,
        jobType: Array.isArray(jobType) ? jobType[0] : jobType,
        jobDescription: Array.isArray(jobDescription) ? jobDescription[0] : jobDescription,
        jobTags: jobTags ? (Array.isArray(jobTags) ? jobTags : jobTags.split(',').map(t => t.trim())) : [],
        published: published === 'true',
        companyLogoData,
        companyLogoType,
        createdAt: new Date(),
      });

      await post.save();

      return res.status(201).json({ message: 'Post created successfully', post });
    } catch (e) {
      console.error('Error saving post:', e);
      return res.status(500).json({ message: 'Error saving post', error: e.message });
    }
  });
}
