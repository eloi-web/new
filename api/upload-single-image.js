// pages/api/upload-single-image.js
import { IncomingForm } from 'formidable'; // For parsing form data
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary

// Disable default body parser for this route as we'll use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary (ensure environment variables are set in Vercel)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Ensure you have an admin token check here as well, if needed
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token || !await verifyAdminToken(token)) { // Implement verifyAdminToken
  //    return res.status(401).json({ message: 'Unauthorized' });
  // }

  const form = new IncomingForm();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const file = files.image?.[0]; // Assuming 'image' is the field name from formData.append('image', file)
                                   // formidable v3 returns files as an array under the field name

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const folder = fields.folder?.[0] || 'misc_uploads'; // formidable v3 returns fields as an array under the field name

    const result = await cloudinary.uploader.upload(file.filepath, { // Use file.filepath for temporary path
      folder: folder,
    });

    res.status(200).json({
      message: 'Image uploaded successfully!',
      url: result.secure_url
    });

  } catch (error) {
    console.error('Cloudinary upload error (single):', error);
    res.status(500).json({ message: 'Image upload failed.', error: error.message });
  }
}