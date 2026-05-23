// ============================================================
// NOVA TRANSPORTS · utils/dom.js
// Helpers de DOM: selección, toast, navegación.
// ============================================================

// selector corto
export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// crear elemento con atributos y contenido
export function el(tag, attrs = {}, html = '') {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  if (html) node.innerHTML = html;
  return node;
}

// ---- TOAST notifications ----
let toastWrap = null;
export function toast(msg, type = 'ok', ms = 3000) {
  if (!toastWrap) {
    toastWrap = el('div', { class: 'toast-wrap' });
    document.body.appendChild(toastWrap);
  }
  const icons = { ok: 'ti-check', warn: 'ti-alert-triangle', err: 'ti-x' };
  const t = el('div', { class: `toast ${type}` },
    `<i class="ti ${icons[type] || 'ti-info-circle'}"></i><span>${msg}</span>`);
  toastWrap.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(8px)';
    setTimeout(() => t.remove(), 250);
  }, ms);
}

// ---- escapar HTML (seguridad básica) ----
export function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
