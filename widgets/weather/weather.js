function icon(code){
  if(code===0)return"☀️";
  if(code<=2)return"⛅";
  if(code<=3)return"☁️";
  if(code>=61&&code<=82)return"🌧️";
  if(code>=71&&code<=86)return"❄️";
  if(code>=95)return"⛈️";
  return"🌡️";
}
function text(code){
  if(code===0)return"Ensoleillé";
  if(code<=2)return"Partiellement nuageux";
  if(code<=3)return"Couvert";
  if(code>=61&&code<=82)return"Pluie";
  if(code>=71&&code<=86)return"Neige";
  if(code>=95)return"Orage";
  return"Variable";
}

export function init(){
  const tempNow = document.getElementById("tempNow");
  const weatherIcon = document.getElementById("weatherIcon");
  const weatherText = document.getElementById("weatherText");
  const tempRange = document.getElementById("tempRange");
  const precipProb = document.getElementById("precipProb");
  if (!tempNow || !weatherIcon || !weatherText || !tempRange || !precipProb) return;

  const cfg = window.DASH_CONFIG?.weather ?? {};
  const lat = cfg.latitude ?? 45.5017;
  const lon = cfg.longitude ?? -73.5673;
  const tz = window.DASH_CONFIG?.timezone ?? "America/Montreal";
  const refreshMs = cfg.refreshMs ?? (10*60*1000);

  async function weather(){
    try{
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}` +
        `&longitude=${encodeURIComponent(lon)}` +
        `&current=temperature_2m,weather_code` +
        `&hourly=precipitation_probability` +
        `&daily=temperature_2m_min,temperature_2m_max` +
        `&timezone=${encodeURIComponent(tz)}`;
      const r = await fetch(url, { cache:"no-store" });
      const d = await r.json();

      tempNow.textContent = Math.round(d.current.temperature_2m) + "°C";
      weatherIcon.textContent = icon(d.current.weather_code);
      weatherText.textContent = text(d.current.weather_code);
      tempRange.textContent =
        Math.round(d.daily.temperature_2m_min[0]) + "° / " +
        Math.round(d.daily.temperature_2m_max[0]) + "°";
      precipProb.textContent = Math.round(d.hourly.precipitation_probability[0]) + "%";
    } catch(e){
      weatherText.textContent = "Météo indisponible";
    }
  }

  weather();
  setInterval(weather, refreshMs);
}
