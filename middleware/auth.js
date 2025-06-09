const admin = require('../config/firebaseAdmin');
module.exports = (handler) => async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required: No Firebase ID token provided.' });
    }

    const idToken = authHeader.split(' ')[1]; // Extract the Firebase ID Token

    try {
        // Verify the Firebase ID Token using the Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Optional: Check for custom claims if you've marked admins in Firebase Auth
        // For example, if you set a custom claim { admin: true } on admin users:
        if (!decodedToken.admin) { // Checks if the 'admin' custom claim is true
            return res.status(403).json({ message: 'Access denied: Not an administrator.' });
        }

        // Attach decoded token payload (which contains user info) to the request
        req.user = decodedToken;

        // If authentication is successful, call the original handler function
        return handler(req, res);
    } catch (error) {
        console.error('Firebase ID Token verification failed:', error);
        // Firebase Admin SDK's verifyIdToken can throw various errors (e.g., token-expired, invalid-argument, etc.)
        let errorMessage = 'Authentication failed: Invalid token or user session.';

        if (error.code === 'auth/id-token-expired') {
            errorMessage = 'Authentication failed: Your session has expired. Please log in again.';
        } else if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Authentication failed: Malformed or invalid token.';
        }

        return res.status(401).json({ message: errorMessage });
    }
};