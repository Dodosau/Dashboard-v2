export function init(root=document){
  const elTime = root.querySelector('[data-clock="time"]');
  const elDate = root.querySelector('[data-clock="date"]');
  if (!elTime || !elDate) return;

  const locale = window.DASH_CONFIG?.locale ?? "fr-CA";

  const fmtTime = new Intl.DateTimeFormat(locale, { hour:"2-digit", minute:"2-digit" });
  const fmtDate = new Intl.DateTimeFormat(locale, { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  let lastDayKey = "";

  function render(){
    const now = new Date();
    elTime.textContent = fmtTime.format(now);
    const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    if (dayKey !== lastDayKey){
      lastDayKey = dayKey;
      elDate.textContent = fmtDate.format(now);
    }
  }

  render();
  setInterval(render, 10_000);
}
