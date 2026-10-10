/*
  Team page — reads the Roster tab of the Google Sheet.

  Works with either layout:
  1) Full rosters: rows have a Team column (Varsity / JV / Freshman)
     → shows a tab per team with #, Name, Position, Grade.
  2) Grade-year list: no Team values
     → groups players into Seniors / Juniors / Sophomores / Freshmen.

  Grade can be written 12 / 11 / 10 / 9, Senior / Sr, or a class year
  like 2027 or "Class of 2027". Blank rows are skipped.
*/

const TEAM_ORDER = ['Varsity', 'JV', 'Freshman'];

const CLASS_GROUPS = [
  { grade: 12, title: 'Seniors' },
  { grade: 11, title: 'Juniors' },
  { grade: 10, title: 'Sophomores' },
  { grade: 9,  title: 'Freshmen' }
];

// Seniors graduate this coming June: Aug–Dec counts toward next year.
function seniorClassYear() {
  const now = new Date();
  return now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
}

function players_(n) { return n + (n === 1 ? ' player' : ' players'); }

function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Read a column regardless of capitalization or extra spaces in the header.
function col(row, ...names) {
  const keys = Object.keys(row);
  for (const name of names) {
    const want = name.toLowerCase().replace(/\s+/g, '');
    const key = keys.find(k => k.toLowerCase().replace(/\s+/g, '') === want);
    if (key && String(row[key]).trim()) return String(row[key]).trim();
  }
  return '';
}

function normalizeTeam(v) {
  const t = v.toLowerCase();
  if (!t) return '';
  if (t.startsWith('var')) return 'Varsity';
  if (t === 'jv' || t.startsWith('junior v')) return 'JV';
  if (t.startsWith('fr') || t.startsWith('fresh')) return 'Freshman';
  return v;
}

function gradeNumber(v) {
  const t = String(v || '').toLowerCase().trim();
  if (!t) return null;
  const year = t.match(/(20\d\d)/);
  if (year) {
    const g = 12 - (Number(year[1]) - seniorClassYear());
    return g >= 9 && g <= 12 ? g : null;
  }
  const num = t.match(/\b(9|10|11|12)\b/);
  if (num) return Number(num[1]);
  if (t.startsWith('sr') || t.startsWith('sen')) return 12;
  if (t.startsWith('jr') || t.startsWith('jun')) return 11;
  if (t.startsWith('so')) return 10;
  if (t.startsWith('fr') || t.startsWith('fresh')) return 9;
  return null;
}

function gradeLabel(v) {
  const g = gradeNumber(v);
  return g ? ({ 12: 'Sr.', 11: 'Jr.', 10: 'So.', 9: 'Fr.' }[g]) : esc(v);
}

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('rosterRoot');
  let rows = [];
  try {
    rows = await fetchSheet(SITE_CONFIG.sheets.roster, 'data/roster-fallback.csv');
  } catch (e) {}

  const players = rows
    .map(r => ({
      team: normalizeTeam(col(r, 'Team', 'Level')),
      number: col(r, 'Number', '#', 'No', 'Jersey'),
      name: col(r, 'Name', 'Player', 'Player Name') ||
            [col(r, 'First', 'First Name'), col(r, 'Last', 'Last Name')].filter(Boolean).join(' '),
      position: col(r, 'Position', 'Pos'),
      grade: col(r, 'Grade', 'Class', 'Year', 'Grad Year')
    }))
    .filter(p => p.name);

  if (!players.length) {
    root.innerHTML = '<p class="roster-note">Roster coming soon.</p>';
    return;
  }

  const teams = TEAM_ORDER.filter(t => players.some(p => p.team === t));
  if (teams.length) renderTeams(root, players, teams);
  else renderClasses(root, players);
});

function renderTeams(root, players, teams) {
  const hasPos = players.some(p => p.position);
  const hasNum = players.some(p => p.number);
  root.innerHTML = `
    <div class="team-tabs" role="tablist">
      ${teams.map((t, i) => `<button class="team-tab${i === 0 ? ' active' : ''}" data-team="${t}" role="tab">${t}</button>`).join('')}
    </div>
    <div class="roster-scroll">
      <table class="roster">
        <thead><tr>${hasNum ? '<th>#</th>' : ''}<th>Name</th>${hasPos ? '<th>Position</th>' : ''}<th>Grade</th></tr></thead>
        <tbody id="rosterBody"></tbody>
      </table>
    </div>`;

  const show = team => {
    const list = players.filter(p => p.team === team).slice().sort((a, b) => {
      const na = parseInt(a.number, 10), nb = parseInt(b.number, 10);
      if (isNaN(na) && isNaN(nb)) return 0;
      if (isNaN(na)) return 1;
      if (isNaN(nb)) return -1;
      return na - nb;
    });
    document.getElementById('rosterBody').innerHTML = list.map(p => `
      <tr>
        ${hasNum ? `<td class="jersey">${p.number ? '#' + esc(p.number) : ''}</td>` : ''}
        <td>${esc(p.name)}</td>
        ${hasPos ? `<td>${esc(p.position)}</td>` : ''}
        <td>${gradeLabel(p.grade)}</td>
      </tr>`).join('');
    const count = document.getElementById('rosterCount');
    if (count) count.textContent = `${team} · ${players_(list.length)}`;
  };

  root.querySelectorAll('.team-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.team-tab').forEach(t => t.classList.toggle('active', t === tab));
      show(tab.dataset.team);
    });
  });
  show(teams[0]);
}

function renderClasses(root, players) {
  const senior = seniorClassYear();
  const other = players.filter(p => !gradeNumber(p.grade));
  const blocks = CLASS_GROUPS.map(g => {
    const list = players.filter(p => gradeNumber(p.grade) === g.grade);
    if (!list.length) return '';
    const classYear = senior + (12 - g.grade);
    return `
      <section class="class-group">
        <header class="class-head">
          <h2>${g.title}</h2>
          <p>Class of ${classYear} · Grade ${g.grade} · ${players_(list.length)}</p>
        </header>
        <ul class="class-names">
          ${list.map(p => `<li>${p.number ? `<span class="class-num">#${esc(p.number)}</span>` : ''}${esc(p.name)}${p.position ? `<span class="class-pos">${esc(p.position)}</span>` : ''}</li>`).join('')}
        </ul>
      </section>`;
  });
  if (other.length) {
    blocks.push(`
      <section class="class-group">
        <header class="class-head"><h2>Team</h2><p>${players_(other.length)}</p></header>
        <ul class="class-names">${other.map(p => `<li>${esc(p.name)}</li>`).join('')}</ul>
      </section>`);
  }
  root.innerHTML = `<div class="class-roster">${blocks.join('')}</div>`;
  const count = document.getElementById('rosterCount');
  if (count) count.textContent = `${players_(players.length)}, grades 9–12`;
}
