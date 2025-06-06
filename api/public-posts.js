const admin = require('../config/firebaseAdmin'); 
const db = admin.firestore();

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { category } = req.query;

        let postsRef = db.collection('posts')
            .where('published', '==', true);

        if (category) {
            // If a category is specified, add a filter for it
            postsRef = postsRef.where('category', '==', category);
        }

        // Order the results by creation time
        postsRef = postsRef.orderBy('createdAt', 'desc');

        const postsSnapshot = await postsRef.get();

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