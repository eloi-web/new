// api/posts.js
const admin = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/auth'); // Import authentication middleware

const db = admin.firestore(); // Get a reference to Firestore

// The core handler for post operations (protected by authMiddleware)
const postsHandler = async (req, res) => {
    // req.user is populated by authMiddleware if token is valid and isAdmin is true

    switch (req.method) {
        case 'POST': // Create a new post
            try {
                const { title, content, published = true } = req.body; // 'published' defaults to true
                if (!title || !content) {
                    return res.status(400).json({ message: 'Title and content are required.' });
                }

                const newPostRef = db.collection('posts').doc(); // Firestore generates unique ID
                await newPostRef.set({
                    title,
                    content,
                    published,
                    authorEmail: req.user.email, // Store who posted it (from JWT payload)
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                res.status(201).json({ message: 'Post created successfully', postId: newPostRef.id });

            } catch (error) {
                console.error('Error creating post:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
            break;

        case 'GET': // Get all posts (for admin view - including unpublished)
            try {
                const postsSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
                const posts = postsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                res.status(200).json(posts);
            } catch (error) {
                console.error('Error fetching all posts for admin:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
            break;

        case 'PUT':
            try {
                const { id } = req.query;
                const { title, content, published } = req.body;
                if (!id) return res.status(400).json({ message: 'Post ID is required for update.' });

                await db.collection('posts').doc(id).update({
                    title,
                    content,
                    published,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                res.status(200).json({ message: 'Post updated successfully.' });
            } catch (error) {
                console.error('Error updating post:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
            break;
        case 'DELETE':
            try {
                const { id } = req.query;
                if (!id) return res.status(400).json({ message: 'Post ID is required for deletion.' });

                await db.collection('posts').doc(id).delete();
                res.status(200).json({ message: 'Post deleted successfully.' });
            } catch (error) {
                console.error('Error deleting post:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
    }
};

// Wrap the handler with the authentication middleware
module.exports = authMiddleware(postsHandler);