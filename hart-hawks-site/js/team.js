let ALL_PLAYERS = [];
let currentTeam = 'Varsity';

document.addEventListener('DOMContentLoaded', async () => {
  ALL_PLAYERS = await fetchSheet(SITE_CONFIG.sheets.roster, 'data/sample-roster.csv');

  document.querySelectorAll('.team-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.team-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTeam = tab.dataset.team;
      renderRoster();
    });
  });

  renderRoster();
});

function renderRoster() {
  const body = document.getElementById('rosterBody');
  const players = ALL_PLAYERS
    .filter(p => p.Team === currentTeam)
    .sort((a, b) => Number(a.Number) - Number(b.Number));

  if (!players.length) {
    body.innerHTML = '<tr><td colspan="4">Roster not posted yet for this team.</td></tr>';
    return;
  }

  body.innerHTML = players.map(p => `
    <tr>
      <td class="jersey">#${p.Number}</td>
      <td>${p.Name}</td>
      <td>${p.Position}</td>
      <td>${p.Grade}</td>
    </tr>
  `).join('');
}
