import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import connectDB from '../utils/db.js';
import Post from '../models/Post.js';

export const config = {
  api: {
    bodyParser: false
  }
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

  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    allowEmptyFiles: false,
    maxFileSize: 5 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Form parsing error', error: err.message });
    }

    try {
      const { title, body, targetPage } = fields;

      if (!title || !body || !targetPage) {
        return res.status(400).json({ message: 'title, body, and targetPage are required' });
      }

      let imageData = null;
      let imageType = null;

      if (files.image && files.image.size > 0) {
        const imageFile = files.auctionImages?.[0] || files.auctionImages;
        if (imageFile) {
          const imageBuffer = fs.readFileSync(imageFile.filepath);
          postData.imageData = imageBuffer;
          postData.imageType = imageFile.mimetype;
        }
      }

      const newPost = new Post({
        title: Array.isArray(title) ? title[0] : title,
        body: Array.isArray(body) ? body[0] : body,
        targetPage: Array.isArray(targetPage) ? targetPage[0] : targetPage,
        imageData,
        imageType,
        createdAt: new Date()
      });

      await newPost.save();

      return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (e) {
      console.error('Error saving post:', e);
      return res.status(500).json({ message: 'Error saving post', error: e.message });
    }
  });
}
