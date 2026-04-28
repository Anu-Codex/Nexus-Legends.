const API_URL = 'https://YOUR_BACKEND_URL.onrender.com/api'; // CHANGE THIS TO YOUR RENDER URL

async function fetchData() {
    const[playersRes, toursRes] = await Promise.all([
        fetch(`${API_URL}/players`),
        fetch(`${API_URL}/tournaments`)
    ]);
    const players = await playersRes.json();
    const tournaments = await toursRes.json();

    renderHome(players, tournaments);
    renderRankings(players);
    renderTournaments(tournaments);
}

function renderHome(players, tournaments) {
    const liveTours = tournaments.filter(t => t.status === 'live').slice(0, 2);
    document.getElementById('live-tournaments').innerHTML = liveTours.map(t => 
        `<div class="card"><h3>${t.name}</h3><span class="badge live">LIVE</span></div>`
    ).join('');

    const top3 = players.slice(0, 3);
    document.getElementById('top-3-players').innerHTML = top3.map((p, index) => 
        `<div class="card">
            <img src="${p.photoUrl || 'default.jpg'}" width="50" style="border-radius:50%">
            <h3>#${index+1} ${p.name}</h3>
            <p>${p.points} Pts</p>
        </div>`
    ).join('');
}

function renderRankings(players) {
    document.getElementById('full-rankings').innerHTML = players.map((p, index) => {
        let trend = '<span style="color:gray">-</span>';
        if (p.currentRank < p.previousRank) trend = '<span style="color:lime">▲</span>';
        if (p.currentRank > p.previousRank) trend = '<span style="color:red">▼</span>';
        
        return `
        <tr>
            <td>${index + 1}</td>
            <td><img src="${p.photoUrl || 'default.jpg'}" width="30" style="border-radius:50%"></td>
            <td>${p.name}</td>
            <td>${p.points}</td>
            <td>${trend}</td>
        </tr>`;
    }).join('');
}

function renderTournaments(tournaments) {
    document.getElementById('all-tournaments').innerHTML = tournaments.map(t => `
        <div class="list-item">
            <h3>${t.name} <span class="badge ${t.status}">${t.status.toUpperCase()}</span></h3>
            ${t.status === 'past' ? `<p>🏆 Winner: ${t.winner} | 🥈 2nd: ${t.secondPlace} | 🥉 3rd: ${t.thirdPlace}</p>` : ''}
        </div>
    `).join('');
}

async function subscribe() {
    const email = document.getElementById('sub-email').value;
    await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    alert('Subscribed!');
    document.getElementById('sub-email').value = '';
}

// Load data on page load
window.onload = fetchData;
