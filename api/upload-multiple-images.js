// pages/api/upload-multiple-images.js
import { IncomingForm } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Ensure you have an admin token check here as well, if needed

  const form = new IncomingForm({ multiples: true }); // Enable multiple file uploads

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const imageFiles = files.images || []; // Assuming 'images' is the field name for multiple files
    if (imageFiles.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const folder = fields.folder?.[0] || 'misc_uploads';
    const uploadedUrls = [];

    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: folder,
      });
      uploadedUrls.push(result.secure_url);
    }

    res.status(200).json({
      message: 'Images uploaded successfully!',
      urls: uploadedUrls
    });

  } catch (error) {
    console.error('Cloudinary upload error (multiple):', error);
    res.status(500).json({ message: 'Error uploading multiple images.', error: error.message });
  }
}