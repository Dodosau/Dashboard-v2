export function init(){
  const gmTransit = document.getElementById("gmTransit");
  const gmBus55 = document.getElementById("gmBus55");
  if (!gmTransit || !gmBus55) return;

  const cfg = window.DASH_CONFIG?.maps ?? {};
  const origin = cfg.origin ?? "267 Rue Rachel Est, Montréal, QC";
  const destination = cfg.destination ?? "6666 Rue Saint-Urbain, Montréal, QC";

  gmTransit.href =
    "https://www.google.com/maps/dir/?api=1&origin=" +
    encodeURIComponent(origin) +
    "&destination=" +
    encodeURIComponent(destination) +
    "&travelmode=transit";

  gmBus55.href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`Bus 55 Montréal ${origin} vers ${destination}`);
}
