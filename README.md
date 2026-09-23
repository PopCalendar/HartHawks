# Hart Hawks Baseball website

A plain HTML/CSS/JS site, no build tools required. Roster, schedule, and
photos are powered by a Google Sheet — nobody needs to touch code to update
those. Everything else (Home, Coaches, Dugout Club, Gear, Hart Pride, Stats)
is regular content edited directly in the HTML files.

## 1. Set up the Google Sheet

Create one Google Sheet with three tabs, using these exact column headers:

**Schedule tab**
`Team, Date, Time, Opponent, OpponentLogo, Location, HomeAway, Result, Score`
- `Team` must be exactly `Varsity`, `JV`, or `Freshman`
- `Date` must be in `YYYY-MM-DD` format (e.g. `2026-03-17`)
- `HomeAway` must be exactly `Home` or `Away`
- `OpponentLogo` is a direct link to a small logo image for the opposing
  school (same rule as photo links below — a direct image link, not a
  share link)
- `Result` and `Score` stay **blank** until the game has been played, then
  fill in `Result` as exactly `W` or `L` and `Score` as e.g. `5-4`. Once
  filled in, the calendar automatically shows the score instead of the
  game time for that day.

**Roster tab**
`Team, Number, Name, Position, Grade`

**Photos tab**
`Team, Caption, Folder`
- Each row is one **album**, not one photo
- `Folder` is the path to a folder in this GitHub repo containing all the
  photos for that event — e.g. `Photos/OpeningDay`
- Upload every photo for that event into that exact folder (same upload
  process as the Opponents and Coaches folders — see "Adding photos to an
  album" below). The site automatically finds and shows every image in
  that folder when someone clicks the album card, with a photo viewer
  (arrows to go through them, click to close)
- The first photo in the folder (alphabetically) becomes the album's cover
  thumbnail automatically — no separate cover image needed

**Coaches tab**
`Team, Role, Name, Bio, Photo`
- `Team` can be `Varsity`, `JV`, `Freshman`, or left blank for a coach not
  tied to one team level
- `Photo` is a direct image link, same rule as the Photos tab above

**News tab**
`Date, Headline, Body, Photo`
- `Date` in `YYYY-MM-DD` format
- `Photo` is optional — a direct image link, same rule as the Photos tab.
  Leave it blank for a text-only update.
- The homepage automatically shows whichever row has the most recent date
  — just add a new row for each update, no need to delete old ones

**Alumni tab**
`Category, Name, GradYear, Teams, Photo, Bio, ProLink`
- `Category` must be exactly `Pro` or `College` — this controls both the
  tab filter and the display style:
  - **Pro** rows show as photo cards with a "Read bio" popup, same as
    Coaches
  - **College** rows show as a plain list (photo, name, grad year,
    college) with no bio popup — `Bio` and `ProLink` are ignored for
    College rows, so they can be left blank
- `GradYear` is the year they graduated Hart
- `Teams` — for Pro, holds every team they played for in one cell,
  separated by semicolons, e.g.
  `Tampa Bay Rays 2006-2012; New York Yankees 2013-2015` (each shows on
  its own line). For College, just put the college name, e.g. `UCLA Bruins`.
- `Photo` is a direct image link, same rule as the other photo columns.
  For **Pro** rows, photos display at a standard baseball-card ratio
  (2.5" × 3.5" portrait) — a portrait player photo looks best. For
  **College** rows, the photo box is wide (3:1) and shows the whole
  image without cropping — built for a horizontal college logo rather
  than a portrait photo.
- `ProLink` is optional (Pro rows only) — a link to the player's pro
  team/league page. Leave blank to hide the button.

**Press Room tab** and **Archived Clippings tab** (same format for both)
`Title, Excerpt, ImageURL, Source, SourceLogo, URL, Date`
- `Title` is the article headline, shown as a clickable link
- `Excerpt` is a short snippet/summary — ends with a "Continue reading"
  link to `URL`
- `ImageURL` is a direct link to a thumbnail image for the article
- `Source` is the publication name (e.g. "Santa Clarita Valley Signal")
- `SourceLogo` is optional — a small icon next to the source name
- `URL` is the link to the actual article — both the title and
  "Continue reading" point here
- `Date` in `YYYY-MM-DD` format — used to sort newest first (optional;
  if left blank, rows just show in sheet order)

See `data/sample-schedule.csv`, `data/sample-roster.csv`,
`data/sample-photos.csv`, `data/sample-coaches.csv`, `data/sample-news.csv`,
and `data/sample-alumni.csv` in this folder for the exact format — the live
site falls back to these sample files automatically until the real sheet is
connected, so the site never looks broken or empty.

## 2. Publish each tab as CSV

For each of the six tabs:
1. File > Share > Publish to web
2. Under "Link", choose the specific sheet/tab (not "Entire document")
3. Choose "Comma-separated values (.csv)" as the format
4. Click Publish, copy the link

## 3. Paste the links into the config

Open `js/config.js` and replace the placeholder values under
`sheets` with the links from step 2:

```js
sheets: {
  schedule: "https://docs.google.com/.../pub?output=csv",
  roster: "https://docs.google.com/.../pub?output=csv",
  photos: "https://docs.google.com/.../pub?output=csv",
  coaches: "https://docs.google.com/.../pub?output=csv",
  news: "https://docs.google.com/.../pub?output=csv",
  alumni: "https://docs.google.com/.../pub?output=csv"
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

- `assets/logo.png` — already set to the real Hart Hawks logo

## 6. Publish with GitHub Pages

1. Push this folder to a GitHub repository
2. Repo Settings > Pages > set the source to the branch you pushed
3. Your site will be live at `https://<username>.github.io/<repo-name>/`
4. Point your custom domain at it under Settings > Pages > Custom domain, if
   you have one

## Adding photos to an album

1. In your GitHub repo, create a folder for the event — e.g. a folder
   named `Photos`, and inside it, one subfolder per event like
   `Photos/OpeningDay`. (To create a new folder on GitHub: "Add file >
   Create new file", then type the full path like
   `Photos/OpeningDay/placeholder.txt` in the file name box — GitHub
   creates the folders automatically. See the full walkthrough for this in
   past chat history if you need the detailed steps.)
2. Upload all the photos for that event into that folder.
3. In the spreadsheet's Photos tab, add one row: `Team`, a `Caption`
   (used as the album title), and `Folder` set to that exact path, e.g.
   `Photos/OpeningDay`.
4. That's it — the album card appears on Hart Pride automatically, using
   the first photo as the cover, and clicking it shows every photo in
   that folder.

This relies on GitHub's public API to list the folder's contents, which
has a modest rate limit for a site with no sign-in (currently 60 requests
per hour per visitor's network). For a small team site's traffic this is
normally a complete non-issue — but if album covers ever fail to load
after a lot of activity, that's why, and they'll recover within the hour.

## Updating the site day to day

- **New game, updated score, new roster entry, new photo, coach update,
  news update** — edit the Google Sheet. The site updates automatically
  within a few minutes (Google's publish-to-web cache refreshes
  periodically).
- **Donation links, social links, gear store link** — edit the
  relevant HTML file or `js/config.js` directly and re-push to GitHub.
