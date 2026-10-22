/*
  Sponsor banner — rotating sponsor logos.
  Used on the homepage and in the Dugout Club "Sponsors" locker.

  Sponsors come from the "Sponsors" tab of the Google Sheet
  (SITE_CONFIG.sheets.sponsors) with columns: Name, Logo, URL
    - Logo: path to the logo in the repo (e.g. assets/sponsors/acme.png)
    - URL:  optional website; clicking the logo opens it
  Until that tab is connected, data/sponsors.csv is used.
  Rows show in sheet order; blank rows are skipped.
*/
(function () {
  const ROTATE_MS = 4500;
  let sponsorsPromise = null;

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // Read a column no matter how its header is capitalized or spaced.
  function col(row, ...names) {
    const keys = Object.keys(row);
    for (const name of names) {
      const want = name.toLowerCase();
      const key = keys.find(k => k.trim().toLowerCase() === want);
      if (key && String(row[key]).trim()) return String(row[key]).trim();
    }
    return '';
  }

  function loadSponsors() {
    if (!sponsorsPromise) {
      const url = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.sheets && SITE_CONFIG.sheets.sponsors) || '';
      sponsorsPromise = fetchSheet(url, 'data/sponsors.csv')
        .then(rows => rows
          .map(r => ({
            name: col(r, 'Name', 'Sponsor', 'Business'),
            logo: col(r, 'Logo', 'Image', 'Photo'),
            url: col(r, 'URL', 'Website', 'Link')
          }))
          .filter(s => s.logo))
        .catch(() => []);
    }
    return sponsorsPromise;
  }

  async function mount(el) {
    if (!el || el.dataset.sponsorMounted) return;
    el.dataset.sponsorMounted = '1';
    const sponsors = await loadSponsors();
    if (!sponsors.length) { el.hidden = true; return; }

    const slides = sponsors.map((s, i) => {
      const img = `<img src="${esc(s.logo)}" alt="${esc(s.name || 'Sponsor')}" loading="lazy">`;
      const inner = s.url
        ? `<a class="sponsor-card" href="${esc(s.url)}" target="_blank" rel="noopener">${img}</a>`
        : `<div class="sponsor-card">${img}</div>`;
      return `<div class="sponsor-slide${i === 0 ? ' active' : ''}" aria-hidden="${i === 0 ? 'false' : 'true'}">${inner}</div>`;
    }).join('');

    const dots = sponsors.length > 1
      ? `<div class="sponsor-dots">${sponsors.map((s, i) =>
          `<button type="button" class="sponsor-dot${i === 0 ? ' active' : ''}" aria-label="Show ${esc(s.name || 'sponsor ' + (i + 1))}"></button>`).join('')}</div>`
      : '';

    el.classList.add('sponsor-banner');
    el.innerHTML = `
      <p class="sponsor-kicker">Thank you to our sponsors</p>
      <div class="sponsor-stage" aria-live="off">${slides}</div>
      ${dots}`;

    if (sponsors.length < 2) return;

    const slideEls = el.querySelectorAll('.sponsor-slide');
    const dotEls = el.querySelectorAll('.sponsor-dot');
    let index = 0;
    let timer = null;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const show = i => {
      index = (i + slideEls.length) % slideEls.length;
      slideEls.forEach((s, j) => {
        s.classList.toggle('active', j === index);
        s.setAttribute('aria-hidden', j === index ? 'false' : 'true');
      });
      dotEls.forEach((d, j) => d.classList.toggle('active', j === index));
    };
    const start = () => {
      if (reduced || timer) return;
      timer = setInterval(() => { if (!document.hidden) show(index + 1); }, ROTATE_MS);
    };
    const stop = () => { clearInterval(timer); timer = null; };

    dotEls.forEach((d, j) => d.addEventListener('click', () => { show(j); stop(); start(); }));
    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);
    el.addEventListener('focusin', stop);
    el.addEventListener('focusout', start);
    start();
  }

  window.mountSponsorBanners = function (root) {
    (root || document).querySelectorAll('[data-sponsor-banner]').forEach(mount);
  };

  document.addEventListener('DOMContentLoaded', () => window.mountSponsorBanners());
})();
