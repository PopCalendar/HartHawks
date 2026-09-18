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
    schedule: "PLACEHOLDER_SCHEDULE_CSV_URL",
    roster: "PLACEHOLDER_ROSTER_CSV_URL",
    photos: "PLACEHOLDER_PHOTOS_CSV_URL",
    coaches: "PLACEHOLDER_COACHES_CSV_URL"
  },

  // External stats provider — link to the team's MaxPreps or GameChanger page.
  stats: {
    label: "MaxPreps",
    url: "PLACEHOLDER_MAXPREPS_OR_GAMECHANGER_URL"
  },

  // Dugout Club donations
  donate: {
    paypalUrl: "PLACEHOLDER_PAYPAL_ME_LINK",
    zelleQrImage: "assets/zelle-qr-placeholder.png",
    zelleHandle: "PLACEHOLDER_ZELLE_EMAIL_OR_PHONE"
  },

  // Social links — leave blank string to hide an icon
  social: {
    instagram: "PLACEHOLDER_INSTAGRAM_URL",
    x: "PLACEHOLDER_X_URL",
    facebook: "PLACEHOLDER_FACEBOOK_URL"
  },

  // Gear / spirit wear store
  gearStoreUrl: "PLACEHOLDER_GEAR_STORE_URL",

  teamLevels: ["Varsity", "JV", "Freshman"]
};
