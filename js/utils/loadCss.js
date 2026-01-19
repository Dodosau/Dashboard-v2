export function loadCss(href){
  const exists = Array.from(document.styleSheets).some(s => (s.href || "").includes(href));
  if (exists) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
