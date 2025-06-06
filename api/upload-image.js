// server.js (inside your API routes)
app.post('/api/upload-image', async (req, res) => {
    try {
        // You'll need middleware like 'multer' or 'express-fileupload' to handle file uploads
        // Example with a conceptual 'file' object from req
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "your_project_folder/job_images" // Organize your images
        });
        res.status(200).json({ url: result.secure_url, public_id: result.public_id });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ message: 'Image upload failed.' });
    }
});