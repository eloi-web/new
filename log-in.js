import { auth, signInWithEmailAndPassword } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = loginForm['username'].value;
            const password = loginForm['password'].value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log("User logged in:", user);
                alert("Login successful! Redirecting to admin dashboard.");
                window.location.href = '/dashboard.html';

            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error logging in:", errorCode, errorMessage);

                let displayMessage = "An unexpected error occurred.";
                switch (errorCode) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        displayMessage = "Invalid email or password.";
                        break;
                    case 'auth/invalid-email':
                        displayMessage = "Please enter a valid email address.";
                        break;
                    default:
                        displayMessage = errorMessage;
                }
                alert(`Login Error: ${displayMessage}`);
            }
        });
    }

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