// routes/uploadRoute.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const router = express.Router();

// Setup multer storage (upload temp file to 'uploads/')
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
    cloud_name: 'dy40yogai',  // Replace with your Cloudinary cloud name
    api_key: '799887153723792',       // Replace with your Cloudinary API key
    api_secret: 'NTkG_ahctcVuY9Vmz5hJSJn9S1s'  // Replace with your Cloudinary API secret
});

// Post route to upload a photo
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Upload the image from 'uploads/' folder to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        
        // Delete the temporary file from the 'uploads' folder
        fs.unlinkSync(req.file.path);
        
        // Send back the secure URL of the uploaded image
        res.status(200).send({ imageUrl: result.secure_url });
    } catch (error) {
        // Handle errors (e.g. file not uploaded)
        res.status(500).send(error);
    }
});

module.exports = router;  // Export the router
