// admin-dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken'); // Get the JWT
    const postsContainer = document.getElementById('postsContainer');
    const postForm = document.getElementById('postForm');
    const logoutButton = document.getElementById('logoutButton');

    // --- Authentication Check ---
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = '/log-in.html'; // Redirect to login if no token
        return; // Stop execution
    }

    // Optional: Verify token with backend upon page load (more secure)
    // For simplicity, we'll assume the token in localStorage is valid for now.
    // A robust app would have a /api/verify-token or similar on page load.

    // --- Logout Functionality ---
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('adminToken'); // Clear the token
        alert('You have been logged out.');
        window.location.href = '/log-in.html'; // Redirect to login
    });

    // --- Post Creation Form Submission ---
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('postTitle').value;
            const content = document.getElementById('postContent').value;
            const published = document.getElementById('postPublished').checked;

            try {
                const response = await fetch('/api/posts', { // Send to admin-only endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include the JWT!
                    },
                    body: JSON.stringify({ title, content, published }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Post created successfully: ${data.message}`);
                    postForm.reset(); // Clear the form
                    await loadPosts(); // Reload posts list
                } else {
                    // Handle authentication errors (e.g., token expired/invalid)
                    if (response.status === 401 || response.status === 403) {
                        alert(`Authentication Error: ${data.message || 'Please log in again.'}`);
                        localStorage.removeItem('adminToken');
                        window.location.href = '/log-in.html';
                    } else {
                        alert(`Error creating post: ${data.message || 'An unexpected error occurred.'}`);
                    }
                }
            } catch (error) {
                console.error('Error creating post:', error);
                alert('A network error occurred while creating the post. Please try again.');
            }
        });
    }

    // --- Function to Load Posts (for Admin Dashboard) ---
    async function loadPosts() {
        postsContainer.innerHTML = '<p>Loading posts...</p>'; // Clear and show loading
        try {
            // Admin can view all posts (including unpublished ones) via /api/posts GET
            const response = await fetch('/api/posts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Admin access required here too
                }
            });

            const posts = await response.json();

            if (response.ok) {
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<p>No posts found.</p>';
                } else {
                    postsContainer.innerHTML = ''; // Clear loading message
                    posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'post-item';
                        postElement.innerHTML = `
                            <h4><span class="math-inline">\{post\.title\}</h4\>
                            Okay, perfect! The admin login works. Now, let's build on that to allow the admin to create posts that are visible to others.

For storing the posts, since you've expressed a desire to avoid new database technologies like MongoDB from scratch, and considering your previous interaction with Firebase, the best solution here is to use Firebase Firestore (via the Firebase Admin SDK on your Node.js backend).

Why Firebase Admin SDK for posts?

It's a secure, server-side way to interact with your Firebase project.
It avoids the client-side initializeApp issues you faced.
You won't need to learn a whole new database system (SQL or another NoSQL).
It integrates seamlessly with Vercel serverless functions.
Architecture for "Admin Posts"
Authentication (Backend):
Your /api/admin-login function will now, upon successful login, generate a JSON Web Token (JWT).
This JWT will be sent back to the frontend.
Admin Dashboard (Frontend):
A new HTML page (admin-dashboard.html) accessible only after login.
Its JavaScript will store the JWT securely (e.g., in localStorage).
Any requests from this dashboard to create/manage posts will include this JWT in their headers.
Post Management API (Backend - Admin Only):
A new Node.js serverless function (e.g., /api/posts).
It will have a middleware that verifies the JWT from the incoming request. If the token is valid and identifies an admin, it proceeds; otherwise, it rejects.
This function will interact with Firebase Firestore (using the Admin SDK) to save/update/delete posts.
Public Post Viewing API (Backend - Public):
Another Node.js serverless function (e.g., /api/public-posts).
This one will not require authentication.
It will fetch only "published" posts from Firestore and return them.
Public Display (Frontend):
Your index.html will fetch posts from the /api/public-posts endpoint to display them.
Step-by-Step Implementation
Phase 1: Update Backend - api/admin-login.js (Add JWT Generation)

First, let's make your existing login endpoint issue a token.

Install jsonwebtoken:

Bash

npm install jsonwebtoken
Modify api/admin-login.js:

JavaScript

// api/admin-login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const app = express();

app.use(express.json());

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    const JWT_SECRET = process.env.JWT_SECRET; // New: Get JWT secret from env

    // For local development, if you use .env:
    // require('dotenv').config();
    // ADMIN_EMAIL=youradmin@example.com
    // ADMIN_PASSWORD_HASH=$2a$10$YOUR_BCRYPT_HASH_HERE
    // JWT_SECRET=aVeryLongRandomStringForJwtSecret (e.g., generated by `openssl rand -base64 32`)

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        if (email !== ADMIN_EMAIL) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a JWT
        const token = jwt.sign(
            { isAdmin: true, email: email }, // Payload: simple flag and email
            JWT_SECRET,                      // Your secret key from environment variables
            { expiresIn: '1h' }              // Token expires in 1 hour
        );

        // Respond with the token
        res.status(200).json({ message: 'Admin login successful!', token: token });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
Add JWT_SECRET to Vercel Environment Variables:

Go to your Vercel Project Settings -> "Environment Variables".
Add a new variable: JWT_SECRET.
Generate a long, random string for its value (e.g., openssl rand -base64 32 or a strong password generator). This must be kept secret and never committed to Git.
Phase 2: Set up Firebase Admin SDK for Post Storage

Generate Firebase Service Account Key:

Go to your Firebase project in the Firebase console.
Navigate to Project settings (gear icon).
Go to the Service accounts tab.
Click "Generate new private key". This downloads a JSON file.
KEEP THIS FILE SECURE! Do NOT commit it to Git.
Install firebase-admin:

Bash

npm install firebase-admin
Centralized Admin SDK Initialization (config/firebaseAdmin.js):

Create a new folder config in your project root: mkdir config.
Create config/firebaseAdmin.js inside it:
JavaScript

// config/firebaseAdmin.js
const admin = require('firebase-admin');

// This path is for local development if you put the key file there
// Make sure `keys/your-project-name-firebase-adminsdk.json` is in your .gitignore!
// const serviceAccountLocal = require('../keys/your-project-name-firebase-adminsdk.json');

// For Vercel deployment: The content of the JSON file is stored in an environment variable
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) { // Prevents re-initialization if imported multiple times
    try {
        // Try initializing from the environment variable (Vercel)
        const serviceAccountConfig = JSON.parse(serviceAccountJson);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountConfig)
        });
        console.log('Firebase Admin SDK initialized from environment variable.');
    } catch (error) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize from env. Attempting local file...', error);
        // Fallback for local development if the env var isn't set or is invalid
        try {
            // Make sure you place your downloaded key file in a 'keys' folder
            // and adjust the path accordingly:
            const serviceAccountLocal = require('../keys/your-firebase-admin-sdk-key.json'); // RENAME THIS to your actual file
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountLocal)
            });
            console.log('Firebase Admin SDK initialized from local file.');
        } catch (localError) {
            console.error('Failed to initialize Firebase Admin SDK from local file. Ensure file path is correct and key is valid.', localError);
        }
    }
}

module.exports = admin;
Add FIREBASE_SERVICE_ACCOUNT_KEY to Vercel Environment Variables:

Open the JSON service account key file you downloaded from Firebase. Copy its entire content.
Go to your Vercel Project Settings -> "Environment Variables".
Add a new variable: FIREBASE_SERVICE_ACCOUNT_KEY.
Paste the entire JSON content (as a single string) as the value.
Phase 3: Backend - middleware/auth.js (JWT Verification)

This middleware will protect your admin-only API routes.

Create middleware directory: mkdir middleware
Create middleware/auth.js:
JavaScript

// middleware/auth.js
const jwt = require('jsonwebtoken');

// This is a higher-order function that takes a handler and returns a new handler
// that includes authentication logic.
module.exports = (handler) => async (req, res) => {
    const authHeader = req.headers.authorization;
    const JWT_SECRET = process.env.JWT_SECRET; // Get JWT secret from env

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required: No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Check if the token payload indicates an admin
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Not an administrator.' });
        }
        req.user = decoded; // Attach decoded token payload to the request for handler use

        // If authentication is successful, call the original handler function
        return handler(req, res);
    } catch (err) {
        console.error('JWT verification failed:', err);
        // Different error codes for more specific messages
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication failed: Token expired.' });
        }
        return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
    }
};
Phase 4: Backend - api/posts.js (Admin-Only Post Management)

This will be your endpoint for creating, updating, and deleting posts.

Create api/posts.js:
JavaScript

// api/posts.js
const admin = require('../config/firebaseAdmin'); // Import initialized Firebase Admin SDK
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

        // Optional: Add 'PUT' for updating posts and 'DELETE' for deleting posts
        /*
        case 'PUT': // Update a post by ID
            try {
                const { id } = req.query; // Expect ID as query param, e.g., /api/posts?id=xyz
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
        case 'DELETE': // Delete a post by ID
            try {
                const { id } = req.query; // Expect ID as query param
                if (!id) return res.status(400).json({ message: 'Post ID is required for deletion.' });

                await db.collection('posts').doc(id).delete();
                res.status(200).json({ message: 'Post deleted successfully.' });
            } catch (error) {
                console.error('Error deleting post:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
            break;
        */

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
    }
};

// Wrap the handler with the authentication middleware
module.exports = authMiddleware(postsHandler);
Phase 5: Backend - api/public-posts.js (Public Post Viewing)

This endpoint will be for anyone to view published posts.

Create api/public-posts.js:
JavaScript

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
Phase 6: Frontend - admin-dashboard.html and admin-dashboard.js

This is the new page for the admin to create posts.

Create admin-dashboard.html:
HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - GBA</title>
    <link rel="stylesheet" href="sign-up.css"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #f4f7f6; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .dashboard-container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 90%; max-width: 800px; }
        .dashboard-header { text-align: center; margin-bottom: 30px; }
        .dashboard-header h2 { color: #333; margin-bottom: 10px; }
        .post-form-group { margin-bottom: 20px; }
        .post-form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
        .post-form-group input[type="text"],
        .post-form-group textarea { width: calc(100% - 20px); padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; transition: border-color 0.3s; }
        .post-form-group input[type="text"]:focus,
        .post-form-group textarea:focus { border-color: #007bff; outline: none; }
        .post-form-group textarea { min-height: 150px; resize: vertical; }
        .create-post-button { background-color: #28a745; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; font-size: 17px; font-weight: bold; width: 100%; transition: background-color 0.3s ease; }
        .create-post-button:hover { background-color: #218838; }
        #logoutButton {
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: #dc3545;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        #logoutButton:hover {
            background-color: #c82333;
        }

        .posts-list { margin-top: 40px; border-top: 1px solid #eee; padding-top: 30px; }
        .posts-list h3 { text-align: center; color: #333; margin-bottom: 25px; }
        .post-item { background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
        .post-item h4 { margin-top: 0; color: #007bff; }
        .post-item p { color: #666; font-size: 15px; line-height: 1.6; }
        .post-meta { font-size: 13px; color: #888; margin-top: 10px; }
        .post-actions button {
            background-color: #007bff;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        }
        .post-actions button.delete { background-color: #dc3545; }
        .post-actions button:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <button id="logoutButton">Logout</button>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h2>Admin Dashboard</h2>
            <p>Create and manage your posts.</p>
        </div>

        <form id="postForm" class="post-form">
            <h3>Create New Post</h3>
            <div class="input-group post-form-group">
                <label for="postTitle">Post Title:</label>
                <input type="text" id="postTitle" placeholder="Enter post title" required>
            </div>
            <div class="input-group post-form-group">
                <label for="postContent">Post Content:</label>
                <textarea id="postContent" placeholder="Write your post content here..." required></textarea>
            </div>
            <div class="post-form-group">
                <input type="checkbox" id="postPublished" checked>
                <label for="postPublished">Publish Immediately</label>
            </div>
            <button type="submit" class="create-post-button">Create Post <i class="fas fa-plus"></i></button>
        </form>

        <div class="posts-list">
            <h3>Your Posts</h3>
            <div id="postsContainer">
                <p>Loading posts...</p>
            </div>
        </div>
    </div>

    <script src="admin-dashboard.js" type="module"></script>
</body>
</html>
Create admin-dashboard.js:
JavaScript

// admin-dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken'); // Get the JWT
    const postsContainer = document.getElementById('postsContainer');
    const postForm = document.getElementById('postForm');
    const logoutButton = document.getElementById('logoutButton');

    // --- Authentication Check ---
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = '/log-in.html'; // Redirect to login if no token
        return; // Stop execution
    }

    // Optional: Verify token with backend upon page load (more secure)
    // For simplicity, we'll assume the token in localStorage is valid for now.
    // A robust app would have a /api/verify-token or similar on page load.

    // --- Logout Functionality ---
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('adminToken'); // Clear the token
        alert('You have been logged out.');
        window.location.href = '/log-in.html'; // Redirect to login
    });

    // --- Post Creation Form Submission ---
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('postTitle').value;
            const content = document.getElementById('postContent').value;
            const published = document.getElementById('postPublished').checked;

            try {
                const response = await fetch('/api/posts', { // Send to admin-only endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include the JWT!
                    },
                    body: JSON.stringify({ title, content, published }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Post created successfully: ${data.message}`);
                    postForm.reset(); // Clear the form
                    await loadPosts(); // Reload posts list
                } else {
                    // Handle authentication errors (e.g., token expired/invalid)
                    if (response.status === 401 || response.status === 403) {
                        alert(`Authentication Error: ${data.message || 'Please log in again.'}`);
                        localStorage.removeItem('adminToken');
                        window.location.href = '/log-in.html';
                    } else {
                        alert(`Error creating post: ${data.message || 'An unexpected error occurred.'}`);
                    }
                }
            } catch (error) {
                console.error('Error creating post:', error);
                alert('A network error occurred while creating the post. Please try again.');
            }
        });
    }

    // --- Function to Load Posts (for Admin Dashboard) ---
    async function loadPosts() {
        postsContainer.innerHTML = '<p>Loading posts...</p>'; // Clear and show loading
        try {
            // Admin can view all posts (including unpublished ones) via /api/posts GET
            const response = await fetch('/api/posts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Admin access required here too
                }
            });

            const posts = await response.json();

            if (response.ok) {
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<p>No posts found.</p>';
                } else {
                    postsContainer.innerHTML = ''; // Clear loading message
                    posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'post-item';
                        postElement.innerHTML = `
                            <h4><span class="math-inline">\{post\.title\}</h4\>
<p>{post.content}</p>
<div class="post-meta">
Posted: ${new Date(post.createdAt._seconds * 1000).toLocaleDateString()}
!post.published? 
′
 <spanstyle="color:red;font−weight:bold;">(UNPUBLISHED)</span> 
′
 : 
′′
 </div><divclass="post−actions"><buttononclick="editPost( 
′
 {post.id}')">Edit</button>
<button class="delete" onclick="deletePost('${post.id}')">Delete</button>
</div>
; postsContainer.appendChild(postElement); }); } } else { // Handle authentication errors (e.g., token expired/invalid) if (response.status === 401 || response.status === 403) { alert(Error loading posts: ${data.message || 'Please log in again.'}); localStorage.removeItem('adminToken'); window.location.href = '/log-in.html'; } else { postsContainer.innerHTML =<p>Error loading posts: ${data.message || 'An unexpected error occurred.'}</p>`;
}
}

        } catch (error) {
            console.error('Network error loading posts:', error);
            postsContainer.innerHTML = '<p>Failed to load posts. Please check your internet connection.</p>';
        }
    }

    // Global functions for inline onclick (or attach event listeners properly)
    window.editPost = (postId) => {
        alert(`Edit functionality for post ID: ${postId} (Requires PUT method in backend)`);
        // You would typically fetch the post data, populate the form, and change button to "Update"
    };

    window.deletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }
        try {
            const response = await fetch(`/api/posts?id=${postId}`, { // Send ID as query param
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                await loadPosts(); // Reload posts after deletion
            } else {
                if (response.status === 401 || response.status === 403) {
                    alert(`Authentication Error: ${data.message || 'Please log in again.'}`);
                    localStorage.removeItem('adminToken');
                    window.location.href = '/log-in.html';
                } else {
                    alert(`Error deleting post: ${data.message || 'An unexpected error occurred.'}`);
                }
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('A network error occurred while deleting the post.');
        }
    };

    // Initial load of posts when dashboard loads
    await loadPosts();
});