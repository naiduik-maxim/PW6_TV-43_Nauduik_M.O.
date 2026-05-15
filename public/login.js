document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        window.location.href = '/dashboard.html';
    } else {
        document.getElementById('message').innerText = 'Невірний логін або пароль';
    }
});