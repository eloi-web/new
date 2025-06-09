import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
signInWithEmailAndPassword(auth, email, password)
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the form elements
    const loginForm = document.getElementById('loginForm'); // Now using the ID
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');

    // Initialize Firebase Auth instance (assuming firebase.initializeApp is done in HTML)
    const auth = getAuth(); // For type="module" import
    // If not using type="module", use: const auth = firebase.auth();

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value; // Get value by ID
            const password = passwordInput.value; // Get value by ID

            loginMessage.textContent = ''; // Clear previous messages
            loginMessage.style.color = 'red'; // Default to red for errors

            try {
                // Use Firebase Authentication to sign in the user
                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                // Get the Firebase ID Token (this is a JWT issued by Firebase)
                const idToken = await userCredential.user.getIdToken();

                // Store this token for future authenticated requests to your backend
                localStorage.setItem('adminToken', idToken);

                loginMessage.style.color = 'green';
                loginMessage.textContent = 'Login successful! Redirecting to admin dashboard.';
                console.log("Admin login successful. Firebase ID Token obtained.");

                // Redirect to the admin dashboard after a short delay for message visibility
                setTimeout(() => {
                    window.location.href = '/admin-dashboard.html';
                }, 1000);

            } catch (error) {
                console.error("Firebase Login Error:", error);
                let errorMessage = 'Login failed. Please check your credentials.';

                // Provide user-friendly messages for common Firebase Auth errors
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage = 'Invalid email or password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'The email address is not valid.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed login attempts. Please try again later.';
                        break;
                    default:
                        errorMessage = `Login failed: ${error.message}`;
                }
                loginMessage.textContent = errorMessage;
            }
        });
    }

    // Existing back arrow logic (keep as is)
    const backArrow = document.getElementById('backArrow');
    if (backArrow) {
        backArrow.addEventListener('click', function() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'inde.html';
            }
        });
    }
});