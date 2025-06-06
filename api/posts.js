const admin = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/auth');

const db = admin.firestore();

const postsHandler = async (req, res) => {
    switch (req.method) {
        case 'POST':t
            try {
                const { title, content, published = true } = req.body; 
                if (!title || !content) {
                    return res.status(400).json({ message: 'Title and content are required.' });
                }

                const newPostRef = db.collection('posts').doc();
                await newPostRef.set({
                    title,
                    content,
                    published,
                    authorEmail: req.user.email,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                res.status(201).json({ message: 'Post created successfully', postId: newPostRef.id });

            } catch (error) {
                console.error('Error creating post:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
            break;

        case 'GET':
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

module.exports = authMiddleware(postsHandler);