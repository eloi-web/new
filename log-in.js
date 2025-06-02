// log-in.js (client-side)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = loginForm['username'].value;
            const password = loginForm['password'].value;

            try {
                const response = await fetch('/api/admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Admin login successful:", data.message);
                    // Store the JWT token securely
                    localStorage.setItem('adminToken', data.token); // Store the token!
                    alert("Admin login successful! Redirecting to admin dashboard.");
                    window.location.href = '/mainpage.html'; // Redirect to new dashboard
                } else {
                    console.error("Admin login failed:", data.message);
                    alert(`Login Failed: ${data.message || 'An unexpected error occurred.'}`);
                }

            } catch (error) {
                console.error("Network or client-side error during login:", error);
                alert("A network error occurred. Please try again.");
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