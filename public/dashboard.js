const output = document.getElementById('output');
const userNameEl = document.getElementById('userName');
const userRoleEl = document.getElementById('userRole');

async function checkAuth() {
    try {
        const res = await fetch('/auth/status');
        const data = await res.json();

        if (data.authenticated) {
            userNameEl.innerText = data.user.name;
            userRoleEl.innerText = data.user.role;
        } else {
            window.location.href = '/index.html';
        }
    } catch (err) {
        console.error('Помилка перевірки авторизації');
    }
}

async function fetchData(url) {
    output.innerText = 'Завантаження...';
    try {
        const res = await fetch(url);
        if (res.status === 401) {
            window.location.href = '/index.html';
            return;
        }
        const data = await res.json();
        output.innerText = JSON.stringify(data, null, 2);
    } catch (err) {
        output.innerText = 'Помилка з\'єднання';
    }
}

document.getElementById('btnLines').addEventListener('click', () => fetchData('/api/consumption/lines'));
document.getElementById('btnReports').addEventListener('click', () => fetchData('/api/kpi/reports'));

document.getElementById('btnLogout').addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/index.html';
});

checkAuth();