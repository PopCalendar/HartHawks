let ALL_GAMES = [];
let currentTeamFilter = 'Varsity';
let viewDate = new Date();

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

document.addEventListener('DOMContentLoaded', async () => {
  ALL_GAMES = await fetchSheet(SITE_CONFIG.sheets.schedule, 'data/sample-schedule.csv');

  // Default the calendar to the month of the first upcoming game, if any
  const upcoming = ALL_GAMES.map(g => new Date(g.Date)).filter(d => !isNaN(d)).sort((a,b) => a - b);
  if (upcoming.length) viewDate = new Date(upcoming[0].getFullYear(), upcoming[0].getMonth(), 1);

  document.querySelectorAll('.team-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.team-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTeamFilter = tab.dataset.team;
      render();
    });
  });

  document.getElementById('prevMonth').addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    render();
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    render();
  });

  render();
});

function gamesForTeam() {
  return ALL_GAMES.filter(g => g.Team === currentTeamFilter);
}

function render() {
  renderCalendar();
  renderList();
}

function renderCalendar() {
  const label = document.querySelector('.month-label');
  label.textContent = `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const games = gamesForTeam();

  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell empty';
    grid.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    const num = document.createElement('div');
    num.className = 'date-num';
    num.textContent = day;
    cell.appendChild(num);

    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    games.filter(g => g.Date === dateStr).forEach(g => {
      const chip = document.createElement('div');
      chip.className = 'game-chip' + (g.HomeAway === 'Away' ? ' away' : '');
      chip.textContent = `${g.HomeAway === 'Away' ? '@' : 'vs'} ${g.Opponent}`;
      cell.appendChild(chip);
    });

    grid.appendChild(cell);
  }
}

function renderList() {
  const list = document.getElementById('scheduleList');
  list.innerHTML = '';
  const games = gamesForTeam().slice().sort((a,b) => new Date(a.Date) - new Date(b.Date));

  if (!games.length) {
    list.innerHTML = '<p>No games on the schedule yet for this team.</p>';
    return;
  }

  games.forEach(g => {
    const d = new Date(g.Date + 'T00:00:00');
    const ticket = document.createElement('div');
    ticket.className = 'ticket';
    ticket.innerHTML = `
      <div class="date-block">
        <div class="d">${isNaN(d) ? '--' : d.getDate()}</div>
        <div class="m">${isNaN(d) ? '' : MONTH_NAMES[d.getMonth()].slice(0,3)}</div>
      </div>
      <div>
        <div class="opp">${g.HomeAway === 'Away' ? '@' : 'vs'} ${g.Opponent}</div>
        <div class="meta">${g.Time || ''} · ${g.Location || ''}</div>
      </div>
      <div class="tag">${g.HomeAway || ''}</div>
    `;
    list.appendChild(ticket);
  });
}
