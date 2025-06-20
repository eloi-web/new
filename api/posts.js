const connectDB = require('../utils/db');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const { IncomingForm } = require('formidable');
const fs = require('fs');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Form parse error' });

    const token = req.headers.authorization?.split(' ')[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { title, body, targetPage } = fields;
    const imageFile = files.image;

    if (!title || !body || !targetPage || !imageFile) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const imageData = fs.readFileSync(imageFile.filepath);

    const newPost = new Post({
      title,
      body,
      targetPage,
      imageType: imageFile.mimetype,
      imageData
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  });
};
