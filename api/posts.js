
const connectDB = require('../utils/db');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, body, imageUrl } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const newPost = new Post({
      title,
      body,
      imageUrl
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token or internal error' });
  }
};
