const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
        console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON:', error);
        throw error;
    }
} else {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY is missing! Cannot initialize Firebase.');
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing');
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

module.exports = admin;
