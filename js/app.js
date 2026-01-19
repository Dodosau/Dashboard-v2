import { loadCss } from "./utils/loadCss.js";

async function waitWidgetsReady(){
  if (window.__WIDGETS_READY__) return;
  await new Promise((resolve) =>
    window.addEventListener("widgets:ready", resolve, { once: true })
  );
}

async function boot(){
  // 1) Inject widgets HTML
  let widgets = [];
  if (typeof window.includeAll === "function"){
    const res = await window.includeAll();
    widgets = res.widgets || [];
  }
  await waitWidgetsReady();

  // 2) Load each widget css + module and init()
  for (const name of widgets){
    try {
      loadCss(`widgets/${name}/${name}.css`);
      const mod = await import(`../widgets/${name}/${name}.js`);
      const init = mod.init || mod.default;
      if (typeof init === "function") init();
      console.log(`✅ widget started: ${name}`);
    } catch (e) {
      console.error(`❌ widget failed: ${name}`, e);
    }
  }

  // 3) Register service worker (PWA offline cache)
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
      console.log("✅ service worker registered");
    } catch (e) {
      console.warn("service worker registration failed", e);
    }
  }
}

if (document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
