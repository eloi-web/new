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