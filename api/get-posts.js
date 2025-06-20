const connectDB = require('../utils/db');
const Post = require('../models/Post');

module.exports = async function (req, res) {
  await connectDB();
  const target = req.query.target;

  const posts = await Post.find({ targetPage: target });
  res.status(200).json(posts);
};
