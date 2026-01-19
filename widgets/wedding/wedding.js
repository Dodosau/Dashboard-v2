export function init(){
  const el = document.getElementById("weddingDays");
  if (!el) return;

  const dateISO = window.DASH_CONFIG?.wedding?.dateISO ?? "2026-06-17";
  const target = new Date(dateISO);

  function tick(){
    const t = new Date(), w = new Date(target);
    t.setHours(0,0,0,0);
    w.setHours(0,0,0,0);
    const d = Math.ceil((w - t) / 86400000);
    el.textContent = d > 0 ? d : (d === 0 ? "C’est aujourd’hui 🎉" : "Déjà mariés ❤️");
  }

  tick();
  setInterval(tick, 60*60*1000);
}
