document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };

    const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Реєстрація успішна! Тепер ви можете увійти.');
        window.location.href = '/index.html';
    } else {
        const data = await res.json();
        document.getElementById('message').innerText = data.error || JSON.stringify(data.errors);
    }
});