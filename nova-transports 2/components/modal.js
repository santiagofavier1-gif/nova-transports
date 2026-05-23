// ============================================================
// NOVA TRANSPORTS · components/modal.js
// Modal reutilizable. En móvil sube desde abajo (bottom sheet),
// en desktop aparece centrado. Premium y touch-friendly.
// ============================================================

import { $, el } from '../utils/dom.js';

let modalRoot = null;

function ensureRoot() {
  if (!modalRoot) {
    modalRoot = el('div', { id: 'modal-root' });
    document.body.appendChild(modalRoot);
  }
  return modalRoot;
}

// abre un modal con título y contenido HTML.
// onMount(modalEl) se llama después de insertar (para enganchar listeners).
export function openModal({ title, body, onMount }) {
  const root = ensureRoot();
  root.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-sheet" id="modal-sheet" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div class="modal-title">${title}</div>
          <button class="icon-btn" id="modal-close" aria-label="Cerrar"><i class="ti ti-x"></i></button>
        </div>
        <div class="modal-body">${body}</div>
      </div>
    </div>
  `;
  // forzar reflow y animar entrada
  requestAnimationFrame(() => {
    $('#modal-overlay', root).classList.add('open');
  });

  $('#modal-close', root).addEventListener('click', closeModal);
  $('#modal-overlay', root).addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  if (onMount) onMount($('#modal-sheet', root));
}

export function closeModal() {
  if (!modalRoot) return;
  const ov = $('#modal-overlay', modalRoot);
  if (ov) {
    ov.classList.remove('open');
    setTimeout(() => { modalRoot.innerHTML = ''; }, 280);
  }
}
