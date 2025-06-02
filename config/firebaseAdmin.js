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