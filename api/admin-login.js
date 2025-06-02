const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const app = express();

app.use(express.json());

// Main handler function for Vercel Serverless Function
module.exports = async (req, res) => {
    // Only allow POST requests to this endpoint
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Get admin credentials from Vercel Environment Variables
    // These MUST be set in your Vercel project settings
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // This will be the hashed password

    // For local development, you can create a .env file at your project root:
    // ADMIN_EMAIL=youradmin@example.com
    // ADMIN_PASSWORD_HASH=$2a$10$YOUR_BCRYPT_HASH_HERE (get this from a bcrypt generator or script)
    // Then, add `require('dotenv').config();` at the very top of this file for local testing.
    // REMOVE `require('dotenv').config();` before deploying to Vercel production as Vercel handles env vars.

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if the provided email matches the admin email
        if (email !== ADMIN_EMAIL) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // If email and password match, admin is authenticated
        res.status(200).json({ message: 'Admin login successful!' });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};