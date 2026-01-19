// js/config.js
window.DASH_CONFIG = {
  locale: "fr-CA",
  timezone: "America/Montreal",

  wedding: {
    dateISO: "2026-06-17",
  },

  weather: {
    latitude: 45.5017,
    longitude: -73.5673,
    refreshMs: 10 * 60 * 1000, // 10 min
  },

  // ✅ STM: on ralentit + backoff en cas d’erreur
  stm: {
    stopId: "52103",

    // Ton Worker Cloudflare
    apiNext55Two: "https://stm-bus.doriansauzede.workers.dev/api/next55-two",

    // ✅ 60s au lieu de 15s
    refreshMs: 60 * 1000,

    // ✅ Si erreur (1102, API down, etc.), on attend 3 minutes avant de réessayer
    cooldownOnErrorMs: 3 * 60 * 1000,
  },

  // ✅ Calendrier: inutile de spammer
  calendar: {
    apiToday: "https://calendar.doriansauzede.workers.dev/api/today",
    apiUpcoming: "https://calendar.doriansauzede.workers.dev/api/upcoming",
    days: 7,
    refreshMs: 5 * 60 * 1000, // 5 min
  },

  // (Optionnel) Maps
  maps: {
    origin: "267 Rue Rachel Est, Montréal, QC",
    destination: "6666 Rue Saint-Urbain, Montréal, QC",
  },
};
