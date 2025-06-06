const admin = require('firebase-admin');
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) { 
    try {
        // Try initializing from the environment variable (Vercel)
        const serviceAccountConfig = JSON.parse(serviceAccountJson);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountConfig)
        });
        console.log('Firebase Admin SDK initialized from environment variable.');
    } catch (error) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize from env. Attempting local file...', error);
        try {

            const serviceAccountLocal = require('./serviceAccountKey.json');
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