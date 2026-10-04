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

/**
 * Renders a list of link-preview cards (title, thumbnail + excerpt,
 * source logo/name, "Continue reading" link) into a container element.
 * Used by Press Room and Archived Clippings, sorted newest first when a
 * Date column is present.
 */
function renderLinkPreviewCards(container, rows, emptyMessage) {
  if (!rows.length) {
    container.innerHTML = `<p>${emptyMessage}</p>`;
    return;
  }

  const sorted = rows.slice().sort((a, b) => {
    const da = new Date(a.Date), db = new Date(b.Date);
    if (isNaN(da) || isNaN(db)) return 0;
    return db - da;
  });

  container.innerHTML = sorted.map(r => {
    const d = new Date(r.Date + 'T00:00:00');
    const dateLabel = isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `
    <article class="link-preview-card">
      <h3>${r.URL ? `<a href="${r.URL}" target="_blank" rel="noopener">${r.Title || ''}</a>` : (r.Title || '')}</h3>
      ${dateLabel ? `<p class="link-preview-date">${dateLabel}</p>` : ''}
      <div class="link-preview-body">
        ${r.ImageURL ? `<img class="link-preview-thumb" src="${r.ImageURL}" alt="${r.Title || ''}">` : ''}
        <p class="link-preview-excerpt">${r.Excerpt || ''} ${r.URL ? `<a href="${r.URL}" target="_blank" rel="noopener">Continue reading</a>` : ''}</p>
      </div>
      <div class="link-preview-source">
        ${r.SourceLogo ? `<img src="${r.SourceLogo}" alt="">` : ''}
        <span>${r.Source || ''}</span>
      </div>
    </article>
  `;
  }).join('');
}

/**
 * List every image file inside a folder in the site's GitHub repo, using
 * GitHub's public contents API. Returns an array of direct image URLs,
 * sorted by file name. Returns an empty array if the folder doesn't exist
 * yet or the lookup fails for any reason (e.g. hitting GitHub's public rate
 * limit), so callers should handle an empty result gracefully.
 */
// One shared list of every file in the repo, fetched from GitHub once and
// remembered for 10 minutes. This keeps the page to about one GitHub lookup
// per visit (GitHub allows ~60 per hour per network without signing in).
const REPO_TREE_CACHE_KEY = 'hh-repo-tree-v1';
const REPO_TREE_MAX_AGE = 10 * 60 * 1000;
let repoTreePromise = null;

function readTreeCache() {
  try {
    const raw = localStorage.getItem(REPO_TREE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function getRepoFileList() {
  if (repoTreePromise) return repoTreePromise;
  repoTreePromise = (async () => {
    const cached = readTreeCache();
    if (cached && Array.isArray(cached.paths) && Date.now() - cached.time < REPO_TREE_MAX_AGE) {
      return cached.paths;
    }
    const { owner, name, branch } = SITE_CONFIG.repo;
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${name}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
      if (!res.ok) throw new Error('GitHub lookup failed (' + res.status + ')');
      const data = await res.json();
      const paths = (data.tree || []).filter(f => f.type === 'blob').map(f => f.path);
      try { localStorage.setItem(REPO_TREE_CACHE_KEY, JSON.stringify({ time: Date.now(), paths })); } catch (e) {}
      return paths;
    } catch (err) {
      // GitHub busy or rate-limited: fall back to the last list we had, even if old.
      if (cached && Array.isArray(cached.paths)) return cached.paths;
      repoTreePromise = null; // allow a retry later
      return [];
    }
  })();
  return repoTreePromise;
}

/**
 * List every image file directly inside a folder of the site's repo.
 * Accepts a plain folder path ("Photos/Opening Day") or a full site link
 * ("https://popcalendar.github.io/HartHawks/Photos/Opening Day").
 * Returns image URLs sorted by file name, or [] if the folder isn't found.
 */
async function fetchFolderImages(folderPath) {
  const { name } = SITE_CONFIG.repo;
  let cleanPath = String(folderPath || '').trim();
  const repoMarker = new RegExp('^.*?/' + name + '/', 'i');
  if (/^https?:\/\//i.test(cleanPath)) cleanPath = cleanPath.replace(repoMarker, '');
  try { cleanPath = decodeURIComponent(cleanPath); } catch (e) {}
  cleanPath = cleanPath.replace(/^\/+|\/+$/g, '');
  if (!cleanPath) return [];

  const prefix = cleanPath.toLowerCase() + '/';
  const paths = await getRepoFileList();
  return paths
    .filter(p => {
      if (!p.toLowerCase().startsWith(prefix)) return false;
      const rest = p.slice(prefix.length);
      return rest && !rest.includes('/') && /\.(jpe?g|png|gif|webp)$/i.test(rest);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    // Photos are served by the site itself (same address as the pages)
    .map(p => p.split('/').map(encodeURIComponent).join('/'));
}
