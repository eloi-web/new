import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs'; // Import fs for reading file buffers
import connectDB from '../utils/db.js';
import JobPost from '../models/Post.js';
import AuctionPost from '../models/AuctionPost.js';
import ConsultantPost from '../models/ConsultantPost.js';
import TenderPost from '../models/TenderPost.js';
import VenuePost from '../models/VenuePost.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  // handle PUT
  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'Post ID is required for update.' });

    // Use formidable
    const form = new IncomingForm({
      multiples: true,
      keepExtensions: true,
      allowEmptyFiles: true,
      minFileSize: 0,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error during PUT:', err);
        return res.status(500).json({ message: 'Form parsing error during update.', error: err.message });
      }

      try {

        const updateData = {};
        for (const key in fields) {
          updateData[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        }

   
        const category = updateData.category;
        const Model = modelMap[category];

        if (!Model) return res.status(400).json({ message: 'Invalid category for update.' });


        if (files.image && Array.isArray(files.image) && files.image.length > 0 && files.image[0].size > 0) {
          const file = files.image[0];
          updateData.imageData = fs.readFileSync(file.filepath);
          updateData.imageType = file.mimetype;
        } else if (updateData.removeImage === 'true') { 
             updateData.imageData = null;
             updateData.imageType = null;
        }

        // Company Logo
        if (files.companyLogo && Array.isArray(files.companyLogo) && files.companyLogo.length > 0 && files.companyLogo[0].size > 0) {
          const logoFile = files.companyLogo[0];
          updateData.companyLogo = fs.readFileSync(logoFile.filepath);
          updateData.companyLogoType = logoFile.mimetype;
        } else if (updateData.removeCompanyLogo === 'true') { 
            updateData.companyLogo = null;
            updateData.companyLogoType = null;
        }

        // Job Images (multiple)
        const newJobImagesData = [];
        const newJobImagesType = [];
        if (files.jobImages && Array.isArray(files.jobImages) && files.jobImages.length > 0) {
            for (const file of files.jobImages) {
                if (file.size > 0) {
                    newJobImagesData.push(fs.readFileSync(file.filepath));
                    newJobImagesType.push(file.mimetype);
                }
            }
        }

        if (newJobImagesData.length > 0) {
            updateData.jobImages = newJobImagesData;
            updateData.jobImagesType = newJobImagesType;
        } else if (updateData.removeJobImages === 'true') { 
            updateData.jobImages = [];
            updateData.jobImagesType = [];
        }
        if (updateData.published !== undefined) {
          updateData.published = updateData.published === 'true';
        }

        
        if (updateData.jobTags && typeof updateData.jobTags === 'string') {
          updateData.jobTags = updateData.jobTags.split(',').map(tag => tag.trim());
        }


        // Perform the update
        const result = await Model.findByIdAndUpdate(id, updateData, { new: true });

        if (!result) return res.status(404).json({ message: 'Post not found.' });

        return res.status(200).json({ message: 'Post updated successfully.', result });

      } catch (error) {
        console.error('Update failed:', error);
        return res.status(500).json({ message: 'Failed to update post.', error: error.message });
      } finally {
    
        if (files.image && Array.isArray(files.image)) {
            files.image.forEach(file => fs.unlink(file.filepath, (err) => err && console.error("Error deleting temp file (image):", err)));
        }
        if (files.companyLogo && Array.isArray(files.companyLogo)) {
            files.companyLogo.forEach(file => fs.unlink(file.filepath, (err) => err && console.error("Error deleting temp file (companyLogo):", err)));
        }
        if (files.jobImages && Array.isArray(files.jobImages)) {
            files.jobImages.forEach(file => fs.unlink(file.filepath, (err) => err && console.error("Error deleting temp file (jobImages):", err)));
        }
      }
    });
    return; 
  }

  // Handle DELETE
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

  // Handle GET requests
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
            if (post.jobImages && post.jobImagesType && Array.isArray(post.jobImages) && post.jobImages.length > 0) {
                result.jobImageUrls = post.jobImages.map((imgBuffer, index) => {
                    if (imgBuffer && post.jobImagesType[index]) {
                        return `data:${post.jobImagesType[index]};base64,${Buffer.from(imgBuffer).toString('base64')}`;
                    }
                    return null;
                }).filter(url => url !== null); 
            }

            return res.status(200).json(result);
          }
        }
        return res.status(404).json({ message: 'Post not found' });
      } catch (err) {
        console.error('Error fetching single post:', err);
        return res.status(500).json({ message: 'Server error fetching single post.', error: err.message });
      }
    } else {
     try{
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
              transformed.imageSrc = `data:${doc.imageType};base64,${Buffer.from(doc.imageData).toString('base64')}`;
            }
            if (doc.companyLogo && doc.companyLogoType) {
              transformed.companyLogoSrc = `data:${doc.companyLogoType};base64,${Buffer.from(doc.companyLogo).toString('base64')}`;
            }
            if (doc.jobImages && doc.jobImagesType && Array.isArray(doc.jobImages) && doc.jobImages.length > 0) {
                transformed.jobImageUrls = doc.jobImages.map((imgBuffer, index) => {
                    if (imgBuffer && doc.jobImagesType[index]) {
                        return `data:${doc.jobImagesType[index]};base64,${Buffer.from(imgBuffer).toString('base64')}`;
                    }
                    return null;
                }).filter(url => url !== null); 
            }

            allPosts.push(transformed);
          });
        }

        return res.status(200).json(allPosts);
      } catch (error) {
        console.error('Fetch all posts error:', error);
        return res.status(500).json({ message: 'Failed to load all posts.', error: error.message });
      }
    }
  }

  return res.status(405).json({ message: 'Method not allowed.' });
}