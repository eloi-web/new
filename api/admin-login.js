// api/admin-login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const app = express();

app.use(express.json());

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    const JWT_SECRET = process.env.JWT_SECRET; // New: Get JWT secret from env

    
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