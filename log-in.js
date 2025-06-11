
document.addEventListener('DOMContentLoaded', () => {
const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');


    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value;
            const password = passwordInput.value;

            loginMessage.textContent = ''; // Clear previous messages
            loginMessage.style.color = 'red'; // Default to red for errors

            try {
                const response = await fetch('https://gba-pk9srjlwa-miguel-s-projects-3ef37130.vercel.app/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store JWT token in localStorage or sessionStorage
                    localStorage.setItem('adminToken', data.token);

                    loginMessage.style.color = 'green';
                    loginMessage.textContent = 'Login successful! Redirecting to admin dashboard.';
                    console.log('Admin login successful.');

                    // Redirect to admin dashboard
                    setTimeout(() => {
                        window.location.href = '/admin-dashboard.html';
                    }, 1000);
                } else {
                    loginMessage.textContent = data.error || 'Login failed. Please try again.';
                }
            } catch (error) {
                console.error('Login Error:', error);
                loginMessage.textContent = 'Login failed. Please check your internet connection.';
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