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

            loginMessage.textContent = 'Signing in...';
            loginMessage.style.color = 'white';

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('adminToken', data.token);

                    loginMessage.style.color = 'green';
                    loginMessage.textContent = 'Login successful! Redirecting to admin dashboard.';

                    emailInput.value = '';
                    passwordInput.value = '';

                    setTimeout(() => {
                        window.location.href = '/admin-dashboard.html';
                    }, 1000);
                } else {
                    loginMessage.style.color = 'red';
                    loginMessage.textContent = data.error || 'Login failed. Please try again.';
                }
            } catch (error) {
                console.error('Login Error:', error);
                loginMessage.style.color = 'red';
                loginMessage.textContent = 'Login failed. Please check your internet connection.';
            }
        });
    }

    const backArrow = document.getElementById('backArrow');
    if (backArrow) {
        backArrow.addEventListener('click', function () {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'inde.html';
            }
        });
    }
});
