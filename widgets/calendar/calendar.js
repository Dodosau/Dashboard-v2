function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

export function init(){
  const locale = window.DASH_CONFIG?.locale ?? "fr-CA";
  const cfg = window.DASH_CONFIG?.calendar ?? {};

  const API_TODAY = cfg.apiToday;
  const API_UPCOMING = cfg.apiUpcoming;
  const REFRESH_MS = cfg.refreshMs ?? 5*60*1000;
  const DAYS = cfg.days ?? 7;

  const elTodayDate = document.getElementById("calTodayDate");
  const elBadge = document.getElementById("calTodayBadge");
  const elTodayEvents = document.getElementById("calTodayEvents");
  const elNext = document.getElementById("calNextEvents");

  if (!elTodayEvents || !elNext) return;

  function fmtTodayDate() {
    return new Date().toLocaleDateString(locale, {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }
  function fmtDayShort(unixSec) {
    return new Date(unixSec * 1000).toLocaleDateString(locale, { weekday:"short", day:"numeric", month:"short" });
  }
  function fmtTime(unixSec) {
    return new Date(unixSec * 1000).toLocaleTimeString(locale, { hour:"2-digit", minute:"2-digit" });
  }
  function setBadge(countToday) {
    if (!elBadge) return;
    elBadge.classList.remove("badge-green", "badge-orange", "badge-red");
    if (countToday <= 1) { elBadge.classList.add("badge-green"); elBadge.textContent="Tranquille ✅"; }
    else if (countToday <= 3) { elBadge.classList.add("badge-orange"); elBadge.textContent="Occupé"; }
    else { elBadge.classList.add("badge-red"); elBadge.textContent="Chargé"; }
  }

  async function refresh(){
    try{
      const r1 = await fetch(API_TODAY, { cache:"no-store" });
      const today = await r1.json();
      if (!today.ok) throw new Error("today not ok");

      if (elTodayDate) elTodayDate.textContent = fmtTodayDate();
      setBadge(today.count ?? (today.events?.length ?? 0));

      const tEvents = Array.isArray(today.events) ? today.events : [];
      elTodayEvents.innerHTML = tEvents.length === 0
        ? `<div class="small">Aucun événement aujourd’hui ✅</div>`
        : tEvents
            .sort((a,b)=>(a.startUnix??0)-(b.startUnix??0))
            .map(ev=>{
              const time = ev.allDay ? "Toute la journée" : fmtTime(ev.startUnix);
              const loc = ev.location ? `<div class="small">${esc(ev.location)}</div>` : "";
              return `
                <div class="todayEvent">
                  <div class="eventTime">${esc(time)}</div>
                  <div>
                    <div class="eventTitle">${esc(ev.title || "Sans titre")}</div>
                    ${loc}
                  </div>
                </div>
              `;
            }).join("");

      const urlUp = `${API_UPCOMING}?days=${encodeURIComponent(DAYS)}`;
      const r2 = await fetch(urlUp, { cache:"no-store" });
      const up = await r2.json();
      if (!up.ok) throw new Error("upcoming not ok");

      const uEvents = Array.isArray(up.events) ? up.events : [];
      elNext.innerHTML = uEvents.length === 0
        ? `<div class="small">Rien de prévu sur les prochains jours.</div>`
        : uEvents
            .sort((a,b)=>(a.startUnix??0)-(b.startUnix??0))
            .slice(0,12)
            .map(ev=>{
              const day = fmtDayShort(ev.startUnix);
              const time = ev.allDay ? "Journée" : fmtTime(ev.startUnix);
              return `
                <div class="nextItem">
                  <div class="nextDay">${esc(day)}</div>
                  <div class="nextMain">
                    <div class="nextTime">${esc(time)}</div>
                    <div class="nextTitle">${esc(ev.title || "Sans titre")}</div>
                  </div>
                </div>
              `;
            }).join("");
    } catch(e){
      console.error("[calendar] refresh error:", e);
      elTodayEvents.innerHTML = `<div class="small">Calendrier indisponible</div>`;
      elNext.innerHTML = `<div class="small">—</div>`;
      if (elBadge){
        elBadge.classList.remove("badge-green","badge-orange","badge-red");
        elBadge.textContent="Erreur";
      }
    }
  }

  if (window.__CAL_TIMER__) clearInterval(window.__CAL_TIMER__);
  refresh();
  window.__CAL_TIMER__ = setInterval(refresh, REFRESH_MS);
}
