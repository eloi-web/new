const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const multer = require('multer'); // Import multer for file uploads
const cloudinary = require('cloudinary').v2; // Import cloudinary

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================================
// 1. Firebase Admin SDK Initialization
// ===============================================
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: "gba-marketplace",
        databaseURL: "https://gba-marketplace.firebaseio.com",
    });

    console.log('Firebase Admin SDK initialized successfully.');

} catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    process.exit(1);
}

// ===============================================
// 2. Cloudinary Configuration
// ===============================================
// Make sure to use environment variables for these in production!
cloudinary.config({
    cloud_name: 'dy40yogai',
    api_key: '799887153723792',
    api_secret: 'NTkG_ahctcVuY9Vmz5hJSJn9S1s'
});

// Configure Multer for in-memory storage (files will be available in req.file or req.files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ===============================================
// 3. Middleware & Routes
// ===============================================

// Middleware to parse JSON request bodies
app.use(express.json());

app.post('/api/upload-single-image', upload.single('image'), async (req, res) => { // <-- CONFIRM THIS LINE
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const folder = req.body.folder || 'misc_uploads';

        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: folder
        });

        res.status(200).json({
            message: 'Image uploaded successfully!',
            url: result.secure_url
        });

    } catch (error) {
        console.error('Error uploading single image to Cloudinary:', error);
        res.status(500).json({ message: 'Error uploading image.', error: error.message });
    }
});

// API route to handle multiple image uploads
// IMPORTANT: Use '/api/upload-multiple-images' for multiple uploads
app.post('/api/upload-multiple-images', upload.array('images', 10), async (req, res) => { // <-- CONFIRM THIS LINE
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        const folder = req.body.folder || 'misc_uploads';
        const uploadedUrls = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
                folder: folder
            });
            uploadedUrls.push(result.secure_url);
        }

        res.status(200).json({
            message: 'Images uploaded successfully!',
            urls: uploadedUrls
        });

    } catch (error) {
        console.error('Error uploading multiple images to Cloudinary:', error);
        res.status(500).json({ message: 'Error uploading multiple images.', error: error.message });
    }
});


// Example API route using Firebase Admin SDK (your existing GET route)
app.get('/api/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const db = admin.firestore();
        const docRef = db.collection('posts').doc(postId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json({ id: doc.id, ...doc.data() });

    } catch (error) {
        console.error('Error fetching single post (backend):', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Your existing static file serving and catch-all route
app.use(express.static(path.join(__dirname, 'new')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'new', 'mainpage.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});