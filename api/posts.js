const admin = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/auth');

const db = admin.firestore();

const postsHandler = async (req, res) => {
    switch (req.method) {
        case 'POST':
            try {
                // Destructure all expected fields, including the new image URLs
                const {
                    category,
                    title,
                    content,
                    published = true,
                    // Job specific fields
                    companyName,
                    jobLocation,
                    jobType,
                    jobDescription,
                    jobTags,
                    companyLogoUrl, // New: Cloudinary URL for company logo
                    jobImageUrls    // New: Array of Cloudinary URLs for job images
                } = req.body;

                // Validate required fields (adjust as per your exact requirements)
                if (!category || !title) {
                    return res.status(400).json({ message: 'Category and title are required.' });
                }
                // If category is 'Jobs', then companyName and jobLocation might be required
                if (category === 'Jobs' && (!companyName || !jobLocation || !jobType || !jobDescription)) {
                    return res.status(400).json({ message: 'Company name, location, type, and description are required for Job posts.' });
                }

                const newPostRef = db.collection('posts').doc();
                const postData = {
                    category,
                    title,
                    content,
                    published,
                    authorEmail: req.user.email,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                };

                // Conditionally add job-specific fields if category is 'Jobs'
                if (category === 'Jobs') {
                    postData.companyName = companyName;
                    postData.jobLocation = jobLocation;
                    postData.jobType = jobType;
                    postData.jobDescription = jobDescription;
                    postData.jobTags = jobTags ? jobTags.split(',').map(tag => tag.trim()) : []; // Split tags into an array
                    postData.companyLogoUrl = companyLogoUrl || null; // Save logo URL
                    postData.jobImageUrls = jobImageUrls || [];     // Save array of image URLs
                }

                await newPostRef.set(postData);

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
                // Destructure all fields that can be updated, including the new image URLs
                const {
                    category, // Category might be included but should not be updated for existing posts usually
                    title,
                    content,
                    published,
                    // Job specific fields
                    companyName,
                    jobLocation,
                    jobType,
                    jobDescription,
                    jobTags,
                    companyLogoUrl, // New: Cloudinary URL for company logo
                    jobImageUrls    // New: Array of Cloudinary URLs for job images
                } = req.body;

                if (!id) return res.status(400).json({ message: 'Post ID is required for update.' });

                const updatedData = {
                    title,
                    content,
                    published,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                };

                // Add job-specific fields to update data if they are present in the request body
                // Only include if they are not undefined, allowing partial updates
                if (companyName !== undefined) updatedData.companyName = companyName;
                if (jobLocation !== undefined) updatedData.jobLocation = jobLocation;
                if (jobType !== undefined) updatedData.jobType = jobType;
                if (jobDescription !== undefined) updatedData.jobDescription = jobDescription;
                if (jobTags !== undefined) updatedData.jobTags = jobTags ? jobTags.split(',').map(tag => tag.trim()) : [];
                if (companyLogoUrl !== undefined) updatedData.companyLogoUrl = companyLogoUrl;
                if (jobImageUrls !== undefined) updatedData.jobImageUrls = jobImageUrls;

                await db.collection('posts').doc(id).update(updatedData);
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

                // Optional: If you want to delete images from Cloudinary when a post is deleted,
                // you would fetch the post first, get the image URLs/public_ids, and then
                // call Cloudinary's delete API for each image.
                // For now, we'll just delete the Firestore document.

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