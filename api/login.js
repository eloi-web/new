const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // Clear previous messages
        loginMessage.textContent = '';
        loginMessage.style.color = 'red';

        try {
            // Send POST request to the backend login API
            const response = await fetch('gba.rubyvercel.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // If the response is successful, store the JWT token and redirect
            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Store the JWT token in localStorage
                localStorage.setItem('adminToken', token);

                // Show success message and redirect after 1 second
                loginMessage.style.color = 'green';
                loginMessage.textContent = 'Login successful! Redirecting to admin dashboard...';

                setTimeout(() => {
                    window.location.href = '/admin-dashboard.html'; // Redirect to dashboard
                }, 1000);
            } else {
                const errorData = await response.json();
                loginMessage.textContent = errorData.message; // Show error message
            }
        } catch (error) {
            loginMessage.textContent = 'An error occurred. Please try again later.';
        }
    });
});