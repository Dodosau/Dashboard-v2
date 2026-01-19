export function byId(id, root = document){ return root.getElementById(id); }
export function setText(el, value){ if (el) el.textContent = value ?? ""; }
export function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}
