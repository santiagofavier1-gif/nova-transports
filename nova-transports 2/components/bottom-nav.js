// ============================================================
// NOVA TRANSPORTS · components/bottom-nav.js
// Navegación inferior fija (móvil) con botón central FAB
// ============================================================

import { $, $$ } from '../utils/dom.js';

const BN_ITEMS = [
  { id: 'dashboard',  label: 'Inicio',    icon: 'ti-layout-dashboard' },
  { id: 'servicios',  label: 'Servicios', icon: 'ti-list' },
  { id: '__fab__',    label: '',          icon: 'ti-plus' },   // botón central
  { id: 'calendario', label: 'Agenda',    icon: 'ti-calendar' },
  { id: '__more__',   label: 'Más',       icon: 'ti-menu-2' }
];

export function renderBottomNav(onNavigate, onFab, onMore) {
  const nav = $('#bottomnav');
  nav.innerHTML = BN_ITEMS.map(it => {
    if (it.id === '__fab__') {
      return `<button class="bn-fab" id="bn-fab" aria-label="Nuevo servicio"><i class="ti ${it.icon}"></i></button>`;
    }
    return `
      <button class="bn-item" data-page="${it.id}" aria-label="${it.label}">
        <i class="ti ${it.icon}"></i>
        <span>${it.label}</span>
      </button>`;
  }).join('');

  $$('.bn-item', nav).forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === '__more__') { onMore(); return; }
      onNavigate(page);
    });
  });

  $('#bn-fab', nav).addEventListener('click', onFab);
}

export function setActiveBottomNav(pageId) {
  $$('.bn-item').forEach(i =>
    i.classList.toggle('active', i.dataset.page === pageId));
}
