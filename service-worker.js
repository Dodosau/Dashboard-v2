const CACHE_NAME = "dashboard-cache-v2"; // <- IMPORTANT: bump version
const ASSETS = [
  "./",
  "./index.html",
  "./css/base.css",
  "./css/layout.css",
  "./css/components.css",
  "./js/config.js",
  "./js/include.js",
  "./js/app.js",
  "./js/utils/dom.js",
  "./js/utils/loadCss.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",

  // Widgets (HTML/CSS/JS)
  "./widgets/clock/clock.html","./widgets/clock/clock.css","./widgets/clock/clock.js",
  "./widgets/weather/weather.html","./widgets/weather/weather.css","./widgets/weather/weather.js",
  "./widgets/wedding/wedding.html","./widgets/wedding/wedding.css","./widgets/wedding/wedding.js",
  "./widgets/bus/bus.html","./widgets/bus/bus.css","./widgets/bus/bus.js",
  "./widgets/calendar/calendar.html","./widgets/calendar/calendar.css","./widgets/calendar/calendar.js",
  "./widgets/maps/maps.html","./widgets/maps/maps.css","./widgets/maps/maps.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ✅ 1) Ne pas intercepter les appels API externes (STM/Calendar/Météo etc.)
  // (tout ce qui n'est pas sur le même domaine que le dashboard)
  if (url.origin !== self.location.origin) {
    return; // laisse le navigateur faire un fetch normal (pas de cache SW)
  }

  // ✅ 2) Ne pas cacher les endpoints dynamiques (si un jour tu ajoutes /api/* sur le même domaine)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(req));
    return;
  }

  // ✅ 3) Pour les assets du dashboard: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return resp;
      });
    })
  );
});
