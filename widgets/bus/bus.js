// widgets/bus/bus.js
export function init() {
  const cfg = window.DASH_CONFIG?.stm ?? {};
  const stopId = cfg.stopId ?? "52103";
  const apiBase =
    cfg.apiNext55Two ?? "https://stm-bus.doriansauzede.workers.dev/api/next55-two";

  const refreshMs = cfg.refreshMs ?? 60_000;
  const cooldownOnErrorMs = cfg.cooldownOnErrorMs ?? 180_000;

  const badge = document.getElementById("busBadge");
  const text1 = document.getElementById("busNextText");
  const text2 = document.getElementById("busNext2Text");
  if (!badge || !text1 || !text2) return;

  let timer = null;
  let aborted = false;

  function setBadge(min) {
    badge.classList.remove("good", "warn", "bad", "na");

    if (min == null) {
      badge.textContent = "—";
      badge.classList.add("na");
      return;
    }

    badge.textContent = String(min);

    if (min > 10) badge.classList.add("good");
    else if (min >= 8) badge.classList.add("warn");
    else badge.classList.add("bad");
  }

  function scheduleNext(ms) {
    if (aborted) return;
    clearTimeout(timer);

    // ✅ jitter 0–3s : évite que plusieurs devices se synchronisent
    const jitter = Math.floor(Math.random() * 3000);
    timer = setTimeout(tick, ms + jitter);
  }

  async function tick() {
    if (aborted) return;

    // ✅ si l’onglet est en arrière-plan (iPad lock / autre app), on ralentit beaucoup
    if (document.visibilityState !== "visible") {
      scheduleNext(5 * 60 * 1000); // 5 minutes
      return;
    }

    const controller = new AbortController();
    const kill = setTimeout(() => controller.abort("timeout"), 5000);

    try {
      // ✅ “cache buster” doux : change toutes les 30s seulement
      // (bypasse caches foireux sans tuer ton cache edge)
      const bucket = Math.floor(Date.now() / 30000);
      const url = `${apiBase}?stop=${encodeURIComponent(stopId)}&_=${bucket}`;

      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
        headers: { "Cache-Control": "no-cache" },
      });

      // Si Cloudflare renvoie HTML (1102), res.json() va throw → catch
      const data = await res.json();
      if (!data.ok) throw new Error("API not ok");

      const m1 = data.nextBusMinutes;
      const m2 = data.nextBus2Minutes;

      setBadge(m1);
      text1.textContent = m1 == null ? "Aucun passage prévu" : "prochain bus";
      text2.textContent = m2 == null ? "" : `suivant dans ${m2} min`;

      scheduleNext(refreshMs);
    } catch (e) {
      console.warn("[bus] refresh failed:", e);

      setBadge(null);
      text1.textContent = "STM indisponible";
      text2.textContent = "";

      // ✅ backoff si erreur (très important contre 1102)
      scheduleNext(cooldownOnErrorMs);
    } finally {
      clearTimeout(kill);
    }
  }

  // ✅ Quand on revient sur l’onglet, on rafraîchit rapidement
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      scheduleNext(1000);
    }
  });

  tick();
}
