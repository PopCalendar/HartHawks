/*
  HART HAWKS SITE CONFIG
  -----------------------
  This is the one file a non-technical volunteer needs to edit for most
  updates that aren't roster/schedule/photos (those live in the Google Sheet).

  Replace every PLACEHOLDER value below with the real link or ID.
  See README.md for step-by-step instructions.
*/

const SITE_CONFIG = {
  // Published Google Sheet CSV links.
  // In Google Sheets: File > Share > Publish to web > choose the tab > CSV.
  sheets: {
    schedule: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGiToWoxDDXDsBQq_xYTBRGJrevXES0PpkgGFhdVzWfUOtJDoFwSKanfZ1S0s2iYX-5rvP6SDr2IqA/pub?gid=0&single=true&output=csv",
    roster: "PLACEHOLDER_ROSTER_CSV_URL",
    photos: "PLACEHOLDER_PHOTOS_CSV_URL",
    coaches: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGiToWoxDDXDsBQq_xYTBRGJrevXES0PpkgGFhdVzWfUOtJDoFwSKanfZ1S0s2iYX-5rvP6SDr2IqA/pub?gid=356609670&single=true&output=csv",
    alumni: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGiToWoxDDXDsBQq_xYTBRGJrevXES0PpkgGFhdVzWfUOtJDoFwSKanfZ1S0s2iYX-5rvP6SDr2IqA/pub?gid=1513896004&single=true&output=csv",
    pressRoom: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGiToWoxDDXDsBQq_xYTBRGJrevXES0PpkgGFhdVzWfUOtJDoFwSKanfZ1S0s2iYX-5rvP6SDr2IqA/pub?gid=1295516705&single=true&output=csv",
    archivedClippings: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGiToWoxDDXDsBQq_xYTBRGJrevXES0PpkgGFhdVzWfUOtJDoFwSKanfZ1S0s2iYX-5rvP6SDr2IqA/pub?gid=1213269122&single=true&output=csv",
    events: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGiToWoxDDXDsBQq_xYTBRGJrevXES0PpkgGFhdVzWfUOtJDoFwSKanfZ1S0s2iYX-5rvP6SDr2IqA/pub?gid=222442044&single=true&output=csv"
  },

  // External stats provider — link to the team's MaxPreps or GameChanger page.
  stats: {
    label: "MaxPreps",
    url: "PLACEHOLDER_MAXPREPS_OR_GAMECHANGER_URL"
  },

  // Dugout Club donations
  donate: {
    paypalUrl: "https://www.paypal.com/donate/?hosted_button_id=7EP5WYB7CZGS2",
    zelleQrImage: "assets/zelle-qr-placeholder.png",
    zelleHandle: "hartdugoutclub@gmail.com"
  },

  // Social links — leave blank string to hide an icon
  social: {
    instagram: "PLACEHOLDER_INSTAGRAM_URL",
    x: "PLACEHOLDER_X_URL",
    facebook: "PLACEHOLDER_FACEBOOK_URL"
  },

  // Gear / spirit wear store
  gearStoreUrl: "PLACEHOLDER_GEAR_STORE_URL",

  // Your GitHub repo info — needed so the site can look up what's inside a
  // photo album folder automatically. Already set to your repo.
  repo: {
    owner: "PopCalendar",
    name: "HartHawks",
    branch: "main"
  },

  teamLevels: ["Varsity", "JV", "Freshman"]
};
