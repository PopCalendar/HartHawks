// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
});

/**
 * Fetch a published Google Sheet CSV and return an array of row objects
 * keyed by the header row. Falls back to a local sample file (for local
 * preview / before the real sheet is connected) if the fetch fails.
 */
async function fetchSheet(url, fallbackPath) {
  try {
    if (!url || url.startsWith('PLACEHOLDER')) throw new Error('not configured');
    const res = await fetch(url);
    if (!res.ok) throw new Error('bad response');
    return parseCSV(await res.text());
  } catch (err) {
    const res = await fetch(fallbackPath);
    return parseCSV(await res.text());
  }
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).filter(l => l.trim().length).map(line => {
    const cells = splitCSVLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h.trim()] = (cells[i] || '').trim(); });
    return row;
  });
}

// Handles simple quoted CSV cells (commas inside quotes)
function splitCSVLine(line) {
  const result = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQuotes = !inQuotes; continue; }
    if (c === ',' && !inQuotes) { result.push(cur); cur = ''; continue; }
    cur += c;
  }
  result.push(cur);
  return result;
}
