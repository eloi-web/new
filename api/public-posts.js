// api/public-posts.js
const admin = require('../config/firebaseAdmin'); // Import initialized Firebase Admin SDK

const db = admin.firestore(); // Get a reference to Firestore

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Fetch only posts where 'published' is true, ordered by creation time
        const postsSnapshot = await db.collection('posts')
                                        .where('published', '==', true)
                                        .orderBy('createdAt', 'desc')
                                        .get();

        const posts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() // Get all fields from the document
        }));

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching public posts:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};