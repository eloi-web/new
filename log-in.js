document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // This is still CRUCIAL!

            const email = loginForm['username'].value; // Assuming 'username' input is for email
            const password = loginForm['password'].value;

            try {
                // Send credentials to your Node.js serverless function
                const response = await fetch('/api/admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json(); // Parse the JSON response from your backend

                if (response.ok) { // Check for 2xx status codes (e.g., 200 OK)
                    console.log("Admin login successful:", data.message);
                    alert("Admin login successful! Redirecting to admin dashboard.");
                    // You would redirect to your admin dashboard page here
                    window.location.href = '/dashboard.html'; // Create this page later
                } else {
                    // Handle errors from your backend (e.g., 401 Invalid credentials)
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