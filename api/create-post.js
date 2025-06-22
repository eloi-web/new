import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
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

  const form = new IncomingForm({ multiples: true, uploadDir: '/tmp', keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Form parsing error' });

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

      const Model = modelMap[category];
      if (!Model) return res.status(400).json({ message: 'Invalid category' });

      const jobImageUrls = [];
      const companyLogoUrl = files.companyLogo?.filepath || null;

      if (files.jobImages) {
        const imageFiles = Array.isArray(files.jobImages) ? files.jobImages : [files.jobImages];
        for (const file of imageFiles) {
          jobImageUrls.push(file.filepath);
        }
      }

      const newPost = new Model({
        title,
        content,
        category,
        published: published === 'true',
        createdAt: new Date(),
        ...(category === 'Jobs' && {
          companyName,
          jobLocation,
          jobType,
          jobDescription,
          jobTags: jobTags ? jobTags.split(',').map(tag => tag.trim()) : [],
          companyLogoUrl,
          jobImageUrls
        })
      });

      await newPost.save();

      return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (e) {
      console.error('Error saving post:', e);
      return res.status(500).json({ message: 'Error saving post' });
    }
  });
}
