let ALL_GAMES = [];
let currentTeamFilter = 'Varsity';
// Calendar always opens on the current month (day 1, so Prev/Next never
// skip a month at the end of long months).
const TODAY = new Date();
let viewDate = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

document.addEventListener('DOMContentLoaded', async () => {
  ALL_GAMES = await fetchSheet(SITE_CONFIG.sheets.schedule, 'data/sample-schedule.csv');


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
  document.getElementById('todayMonth').addEventListener('click', () => {
    viewDate = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    render();
  });

  render();
});

// Read a sheet date as a local calendar day. Accepts 2026-03-03 or 3/3/2026.
function parseGameDate(value) {
  const v = String(value || '').trim();
  let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (m) return new Date(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[1] - 1, +m[2]);
  return null;
}

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const TODAY_KEY = dayKey(TODAY);

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
  const onThisMonth = viewDate.getFullYear() === TODAY.getFullYear() && viewDate.getMonth() === TODAY.getMonth();
  document.getElementById('todayMonth').hidden = onThisMonth;

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
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    cell.className = 'calendar-cell' +
      (dateStr === TODAY_KEY ? ' today' : dateStr < TODAY_KEY ? ' past' : '');
    const num = document.createElement('div');
    num.className = 'date-num';
    num.textContent = day;
    cell.appendChild(num);

    games.filter(g => { const d = parseGameDate(g.Date); return d && dayKey(d) === dateStr; }).forEach(g => {
      cell.appendChild(buildGameCard(g));
    });

    grid.appendChild(cell);
  }
}

function buildGameCard(g) {
  const card = document.createElement('div');
  card.className = 'game-card' + (g.HomeAway === 'Away' ? ' away' : '');

  const hasResult = g.Result && g.Result.trim().length > 0;
  const resultClass = g.Result === 'W' ? 'win' : g.Result === 'L' ? 'loss' : '';

  card.innerHTML = `
    ${g.OpponentLogo ? `<img class="opp-logo" src="${g.OpponentLogo}" alt="${g.Opponent} logo">` : ''}
    <div class="matchup">${g.HomeAway === 'Away' ? '@' : 'vs.'} ${g.Opponent}</div>
    ${hasResult
      ? `<div class="game-result ${resultClass}">${g.Result}, ${g.Score}</div>`
      : `<div class="game-time">${g.Time || ''}</div>`}
  `;
  return card;
}

function renderList() {
  const list = document.getElementById('scheduleList');
  list.innerHTML = '';
  const games = gamesForTeam()
    .map(g => ({ g, d: parseGameDate(g.Date) }))
    .sort((a, b) => (a.d || 0) - (b.d || 0));

  if (!games.length) {
    list.innerHTML = '<p>No games on the schedule yet for this team.</p>';
    return;
  }

  // Today's game counts as upcoming; anything before today is in the past.
  const upcoming = games.filter(x => !x.d || dayKey(x.d) >= TODAY_KEY);
  const past = games.filter(x => x.d && dayKey(x.d) < TODAY_KEY).reverse();

  if (upcoming.length) {
    upcoming.forEach(x => list.appendChild(buildTicket(x.g, x.d, false)));
  } else {
    const done = document.createElement('p');
    done.className = 'schedule-note';
    done.textContent = 'No upcoming games right now — check back when the next season schedule is posted.';
    list.appendChild(done);
  }

  if (past.length) {
    const head = document.createElement('div');
    head.className = 'past-results-head';
    head.innerHTML = '<h3>Past Results</h3>';
    list.appendChild(head);
    past.forEach(x => list.appendChild(buildTicket(x.g, x.d, true)));
  }
}

function buildTicket(g, d, isPast) {
  const ticket = document.createElement('div');
  ticket.className = 'ticket' + (isPast ? ' past' : '');
  const hasResult = g.Result && g.Result.trim().length > 0;
  const resultClass = g.Result === 'W' ? 'win' : g.Result === 'L' ? 'loss' : '';

  ticket.innerHTML = `
    <div class="date-block">
      <div class="d">${d ? d.getDate() : '--'}</div>
      <div class="m">${d ? MONTH_NAMES[d.getMonth()].slice(0,3) : ''}</div>
    </div>
    <div>
      <div class="opp">${g.HomeAway === 'Away' ? '@' : 'vs'} ${g.Opponent}</div>
      <div class="meta">
        ${hasResult
          ? `<span class="result-inline ${resultClass}">${g.Result}, ${g.Score}</span>`
          : (g.Time || '')} · ${g.Location || ''}
      </div>
    </div>
    <div class="tag">${g.HomeAway || ''}</div>
  `;
  return ticket;
}
