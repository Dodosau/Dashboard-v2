export function init(){
  const cfg = window.DASH_CONFIG?.stm ?? {};
  const stopId = cfg.stopId ?? "52103";
  const apiBase = cfg.apiNext55Two ?? "https://stm-bus.doriansauzede.workers.dev/api/next55-two";
  const refreshMs = cfg.refreshMs ?? 15000;

  const badge = document.getElementById("busBadge");
  const text1 = document.getElementById("busNextText");
  const text2 = document.getElementById("busNext2Text");
  if (!badge || !text1 || !text2) return;

  function setBadge(min){
    badge.classList.remove("good","warn","bad","na");
    if (min == null){
      badge.textContent = "—";
      badge.classList.add("na");
      return;
    }
    badge.textContent = `${min}`;
    if (min > 10) badge.classList.add("good");
    else if (min >= 8) badge.classList.add("warn");
    else badge.classList.add("bad");
  }

  async function refresh(){
    try{
      const API = `${apiBase}?stop=${encodeURIComponent(stopId)}`;
      const res = await fetch(API, { cache:"no-store" });
      const data = await res.json();
      if (!data.ok) throw new Error("API not ok");

      const m1 = data.nextBusMinutes;
      const m2 = data.nextBus2Minutes;

      setBadge(m1);
      text1.textContent = m1 == null ? "Aucun passage prévu" : "prochain bus";
      text2.textContent = m2 == null ? "" : `suivant dans ${m2} min`;
    } catch(e){
      setBadge(null);
      text1.textContent = "STM indisponible";
      text2.textContent = "";
    }
  }

  refresh();
  setInterval(refresh, refreshMs);
}
