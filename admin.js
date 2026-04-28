const API_URL = 'https://YOUR_BACKEND_URL.onrender.com/api'; // CHANGE THIS TO YOUR RENDER URL

// Check if already logged in
if(localStorage.getItem('adminToken')) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        location.reload();
    } else {
        alert('Login failed');
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    location.reload();
}

async function addPlayer() {
    const name = document.getElementById('p-name').value;
    const photoUrl = document.getElementById('p-photo').value;
    const wins = parseInt(document.getElementById('p-wins').value) || 0;
    const draws = parseInt(document.getElementById('p-draws').value) || 0;

    await fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ name, photoUrl, wins, draws })
    });
    alert('Player added/updated!');
}

async function addTournament() {
    const name = document.getElementById('t-name').value;
    const status = document.getElementById('t-status').value;

    await fetch(`${API_URL}/tournaments`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ name, status })
    });
    alert('Tournament Created!');
}
