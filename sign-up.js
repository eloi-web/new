// src/js/sign-up.js
import { auth, createUserWithEmailAndPassword } from 'firebase.js'; // Adjust path relative to this file

document.addEventListener('DOMContentLoaded', () => {
    // Get the form element by its class name
    const signUpForm = document.querySelector('.signup-form');

    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const email = signUpForm.elements['email'].value;
            const password = signUpForm.elements['password'].value;
            const confirmPassword = signUpForm.elements['confirm-password'].value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return; // Stop the function if passwords don't match
            }

            try {
                // Create user with email and password using Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log("Account created successfully:", user);
                alert("Account created successfully! You can now log in.");

                // Redirect to the login page after successful account creation
                window.location.href = '/login.html'; // Ensure this path is correct for your project

            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error creating account:", errorCode, errorMessage);

                let displayMessage = "An unexpected error occurred.";
                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        displayMessage = "This email address is already in use.";
                        break;
                    case 'auth/weak-password':
                        displayMessage = "Password should be at least 6 characters.";
                        break;
                    case 'auth/invalid-email':
                        displayMessage = "Please enter a valid email address.";
                        break;
                    default:
                        displayMessage = errorMessage;
                }
                alert(`Account Creation Error: ${displayMessage}`);
            }
        });
    }

    // Handle the back arrow functionality
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