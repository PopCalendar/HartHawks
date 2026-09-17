# Hart Hawks Baseball website

A plain HTML/CSS/JS site, no build tools required. Roster, schedule, and
photos are powered by a Google Sheet — nobody needs to touch code to update
those. Everything else (Home, Coaches, Dugout Club, Gear, Hart Pride, Stats)
is regular content edited directly in the HTML files.

## 1. Set up the Google Sheet

Create one Google Sheet with three tabs, using these exact column headers:

**Schedule tab**
`Team, Date, Time, Opponent, Location, HomeAway`
- `Team` must be exactly `Varsity`, `JV`, or `Freshman`
- `Date` must be in `YYYY-MM-DD` format (e.g. `2026-03-17`)
- `HomeAway` must be exactly `Home` or `Away`

**Roster tab**
`Team, Number, Name, Position, Grade`

**Photos tab**
`Team, Caption, ImageURL`
- `ImageURL` is a direct link to an image (upload photos to Google Drive,
  Imgur, or similar, and use the direct image link — not a share link)

See `data/sample-schedule.csv`, `data/sample-roster.csv`, and
`data/sample-photos.csv` in this folder for the exact format — the live site
falls back to these sample files automatically until the real sheet is
connected, so the site never looks broken or empty.

## 2. Publish each tab as CSV

For each of the three tabs:
1. File > Share > Publish to web
2. Under "Link", choose the specific sheet/tab (not "Entire document")
3. Choose "Comma-separated values (.csv)" as the format
4. Click Publish, copy the link

## 3. Paste the links into the config

Open `js/config.js` and replace the three placeholder values under
`sheets` with the links from step 2:

```js
sheets: {
  schedule: "https://docs.google.com/.../pub?output=csv",
  roster: "https://docs.google.com/.../pub?output=csv",
  photos: "https://docs.google.com/.../pub?output=csv"
}
```

## 4. Fill in the other placeholders (also in js/config.js)

- `stats.url` — your MaxPreps or GameChanger team page link
- `donate.paypalUrl` — your PayPal.me link
- `donate.zelleQrImage` — path to a real Zelle QR image (drop the image file
  in the `assets` folder and update the path)
- `donate.zelleHandle` — the email or phone number tied to Zelle
- `social.instagram` / `social.x` / `social.facebook` — leave blank to hide
  an icon
- `gearStoreUrl` — link to your spirit wear store

## 5. Replace placeholder content

- `coaches.html` — swap in real coach names, roles, and photos
- `assets/logo.png` — already set to the real Hart Hawks logo

## 6. Publish with GitHub Pages

1. Push this folder to a GitHub repository
2. Repo Settings > Pages > set the source to the branch you pushed
3. Your site will be live at `https://<username>.github.io/<repo-name>/`
4. Point your custom domain at it under Settings > Pages > Custom domain, if
   you have one

## Updating the site day to day

- **New game, updated score, new roster entry, new photo** — edit the Google
  Sheet. The site updates automatically within a few minutes (Google's
  publish-to-web cache refreshes periodically).
- **Coach info, donation links, social links, gear store link** — edit the
  relevant HTML file or `js/config.js` directly and re-push to GitHub.
