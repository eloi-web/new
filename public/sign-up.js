import { auth, createUserWithEmailAndPassword } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.querySelector('.signup-form');

    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = signUpForm.elements['email'].value;
            const password = signUpForm.elements['password'].value;
            const confirmPassword = signUpForm.elements['confirm-password'].value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log("Account created successfully:", user);
                alert("Account created successfully! You can now log in.");

                window.location.href = './log-in.html'; 
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