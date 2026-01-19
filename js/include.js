/**
 * include.js
 * Injecte les widgets declarés via [data-widget] (ou [data-include] legacy).
 * - data-widget="clock" => widgets/clock/clock.html
 * - data-include="path.html" => fetch tel quel
 *
 * Expose: window.includeAll() -> Promise<{ok:boolean, widgets:string[]}>
 */
window.includeAll = async function includeAll() {
  const placeholders = Array.from(document.querySelectorAll("[data-widget], [data-include]"));
  const widgets = [];

  for (const placeholder of placeholders) {
    const widgetName = placeholder.getAttribute("data-widget");
    const includePath = placeholder.getAttribute("data-include");
    const path = widgetName
      ? `widgets/${widgetName}/${widgetName}.html`
      : includePath;

    if (!path) continue;

    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();

      if (widgetName) widgets.push(widgetName);

      // Remplace la div placeholder par le HTML du widget
      placeholder.outerHTML = html;
    } catch (err) {
      console.error(`❌ Failed to include ${path}`, err);
      placeholder.outerHTML = `
        <div class="card">
          <div class="title">Erreur de chargement</div>
          <div class="small">Impossible de charger ${path}</div>
        </div>
      `;
    }
  }

  window.__WIDGETS_READY__ = true;
  window.dispatchEvent(new Event("widgets:ready"));
  return { ok: true, widgets: [...new Set(widgets)] };
};
