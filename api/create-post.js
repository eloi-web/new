import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs'; // Needed for fs.readFileSync
import connectDB from '../utils/db.js';
import Post from '../models/Post.js';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to let formidable handle it
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Authentication check (remains the same)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  await connectDB(); // Connect to MongoDB

  const form = new IncomingForm({
    multiples: true, // Allows handling multiple files for inputs like 'jobImages'
    keepExtensions: true, // Keeps original file extensions (e.g., .png, .jpg)
    allowEmptyFiles: true, // Allows files with 0 size
    minFileSize: 0, // No minimum file size constraint
  });

  // Parse the incoming form data (fields and files)
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Form parsing error', error: err.message });
    }

    try {
      // Form fields from req.body (formidable parses them into `fields` as arrays by default if `multiples:true`)
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const body = Array.isArray(fields.body) ? fields.body[0] : fields.body;
      const targetPage = Array.isArray(fields.targetPage) ? fields.targetPage[0] : fields.targetPage;
      const companyName = Array.isArray(fields.companyName) ? fields.companyName[0] : fields.companyName;
      const jobLocation = Array.isArray(fields.jobLocation) ? fields.jobLocation[0] : fields.jobLocation;
      const jobType = Array.isArray(fields.jobType) ? fields.jobType[0] : fields.jobType;
      const jobDescription = Array.isArray(fields.jobDescription) ? fields.jobDescription[0] : fields.jobDescription;
      const jobTagsRaw = fields.jobTags; // This could be an array or string
      const published = fields.published === 'true'; // Checkbox value `on` becomes 'true' if checked

      // Basic validation for required fields
      if (!title || !body || !targetPage) {
        return res.status(400).json({ message: 'Missing required fields (title, body, targetPage)' });
      }

      // --- Processing General Post Image (e.g., for popup imageSrc) ---
      // This corresponds to <input type="file" name="image" id="postImage">
      let imageData = null;
      let imageType = null;
      // files.image will be an array if multiples: true in IncomingForm and input name matches
      if (files.image && Array.isArray(files.image) && files.image.length > 0 && files.image[0].size > 0) {
        const file = files.image[0]; // Get the first (and likely only) file
        imageData = fs.readFileSync(file.filepath);
        imageType = file.mimetype;
      } else {
        console.log('Backend (create-post): General Post Image (name="image") not received or is empty.');
        console.log('files.image object:', files.image);
      }

      // --- Processing Company Logo ---
      // This corresponds to <input type="file" name="companyLogo" id="companyLogo">
      // **This is the one we specifically need to fix.**
      let companyLogoData = null; // Will store the Buffer
      let companyLogoType = null; // Will store the MIME type

      if (files.companyLogo && Array.isArray(files.companyLogo) && files.companyLogo.length > 0 && files.companyLogo[0].size > 0) {
        // If file is present and has content
        const logoFile = files.companyLogo[0]; // Get the first (and only) company logo file
        companyLogoData = fs.readFileSync(logoFile.filepath);
        companyLogoType = logoFile.mimetype;
        console.log('Backend (create-post): Company Logo received. Size:', companyLogoData.length, 'bytes. Type:', companyLogoType);
      } else {
        console.log('Backend (create-post): Company Logo (name="companyLogo") NOT received or is empty.');
        console.log('files.companyLogo object (from formidable):', files.companyLogo);
        // You mentioned it's optional but you need it:
        // If it's truly required, you would add a return res.status(400) here
        // e.g., return res.status(400).json({ message: 'Company Logo is required for Job posts.' });
      }

      // --- Processing Job Images (multiple) ---
      // This corresponds to <input type="file" name="jobImages" id="jobImages" multiple>
      let jobImagesData = [];
      let jobImagesType = []; // Assuming you'll store arrays of buffers/types in your Post model

      if (files.jobImages && Array.isArray(files.jobImages) && files.jobImages.length > 0) {
        for (const file of files.jobImages) {
          if (file.size > 0) { // Only process if file has content
            jobImagesData.push(fs.readFileSync(file.filepath));
            jobImagesType.push(file.mimetype);
          }
        }
        console.log(`Backend (create-post): Processed ${jobImagesData.length} job images.`);
      } else {
          console.log('Backend (create-post): Job Images (name="jobImages") not received or are empty.');
          console.log('files.jobImages object:', files.jobImages);
      }

      // Prepare jobTags: ensure it's an array of trimmed strings
      const jobTags = jobTagsRaw
        ? (Array.isArray(jobTagsRaw)
          ? jobTagsRaw[0].split(',').map(tag => tag.trim()) // formidable might give single field as array
          : jobTagsRaw.split(',').map(tag => tag.trim())
        ) : [];

      // Create a new Post document
      const post = new Post({
        title,
        body,
        targetPage,
        // General post image data
        imageData,
        imageType,
        // Job-specific fields
        companyName,
        jobLocation,
        jobType,
        jobDescription,
        jobTags,
        // Company Logo data (CORRECTED FIELD NAMES)
        companyLogo: companyLogoData, // This maps to the 'companyLogo' field in your Mongoose Post model
        companyLogoType,            // This maps to the 'companyLogoType' field
        // Multiple job images data
        jobImages: jobImagesData,   // You'll need to define this as [Buffer] in your Post model schema
        jobImagesType: jobImagesType, // You'll need to define this as [String] in your Post model schema
        // Other fields
        published: published,
        createdAt: new Date(),
      });

      await post.save();

      return res.status(201).json({ message: 'Post created successfully', post });
    } catch (e) {
      console.error('Error saving post:', e);
      // Clean up temp files if formidable stored them on disk and an error occurred before save
      // This requires more complex formidable event handling, but good to be aware
      return res.status(500).json({ message: 'Error saving post', error: e.message });
    } finally {
      // Formidable saves temporary files, clean them up after processing
      // This is important for disk space
      if (files.image && Array.isArray(files.image)) {
        files.image.forEach(file => fs.unlink(file.filepath, (err) => err && console.error("Error deleting temp file:", err)));
      }
      if (files.companyLogo && Array.isArray(files.companyLogo)) {
        files.companyLogo.forEach(file => fs.unlink(file.filepath, (err) => err && console.error("Error deleting temp file:", err)));
      }
      if (files.jobImages && Array.isArray(files.jobImages)) {
        files.jobImages.forEach(file => fs.unlink(file.filepath, (err) => err && console.error("Error deleting temp file:", err)));
      }
      // Add similar cleanup for other file inputs if you implement them
    }
  });
}