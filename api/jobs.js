import connectDB from '../utils/db.js';
import Post from '../models/Post.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    const jobs = await Post.find({ targetPage: 'Jobs' }).sort({ createdAt: -1 });
    
    const result = jobs.map(job => ({
      id: job._id.toString(),
      title: job.title,
      body: job.body,
      imageSrc: job.imageData && job.imageType
        ? `data:${job.imageType};base64,${job.imageData.toString('base64')}`
        : null,
      companyLogoSrc: job.companyLogoData && job.companyLogoType
    ? `data:${job.companyLogoType};base64,${job.companyLogoData.toString('base64')}`
    : null,
      createdAt: job.createdAt
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error loading jobs:', error);
    res.status(500).json({ message: 'Failed to load jobs', error: error.message });
  }
}
