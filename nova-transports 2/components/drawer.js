// ============================================================
// NOVA TRANSPORTS · components/drawer.js
// Sidebar (desktop) / Drawer deslizable (móvil)
// ============================================================

import { $, $$ } from '../utils/dom.js';
import { isAdmin, getUser } from '../services/auth.js';

// definición de los items del menú
const NAV_ITEMS = [
  { group: 'Principal', items: [
    { id: 'dashboard',  label: 'Dashboard',  icon: 'ti-layout-dashboard' },
    { id: 'servicios',  label: 'Servicios',  icon: 'ti-list-details' },
    { id: 'calendario', label: 'Calendario', icon: 'ti-calendar' },
    { id: 'cotizacion', label: 'Cotización', icon: 'ti-file-invoice' }
  ]},
  { group: 'Gestión', items: [
    { id: 'clientes',  label: 'Clientes',  icon: 'ti-users',     soon: true },
    { id: 'choferes',  label: 'Choferes',  icon: 'ti-steering-wheel', soon: true },
    { id: 'vehiculos', label: 'Vehículos', icon: 'ti-car',       soon: true }
  ]},
  { group: 'Administración', adminOnly: true, items: [
    { id: 'reportes',     label: 'Reportes',      icon: 'ti-chart-bar' },
    { id: 'colaboradores',label: 'Colaboradores', icon: 'ti-id-badge-2' },
    { id: 'usuarios',     label: 'Usuarios',      icon: 'ti-user-cog', soon: true }
  ]}
];

export function renderDrawer(onNavigate) {
  const user = getUser();
  const admin = isAdmin();

  let navHtml = '';
  for (const grp of NAV_ITEMS) {
    if (grp.adminOnly && !admin) continue;
    navHtml += `<div class="nav-group-label">${grp.group}</div>`;
    for (const it of grp.items) {
      navHtml += `
        <div class="nav-item" data-page="${it.id}" ${it.soon ? 'data-soon="1"' : ''}>
          <i class="ti ${it.icon}"></i>
          <span>${it.label}</span>
          ${it.soon ? '<span style="margin-left:auto;font-size:9px;color:var(--text-3);text-transform:uppercase;letter-spacing:.1em">pronto</span>' : ''}
        </div>`;
    }
  }

  const sidebar = $('#sidebar');
  sidebar.innerHTML = `
    <div class="sidebar-head">
      <div class="header-logo"><i class="ti ti-car"></i></div>
      <div>
        <div class="sidebar-brand">NOVA</div>
        <div class="sidebar-sub">Transportación Ejecutiva</div>
      </div>
    </div>
    <nav class="nav">${navHtml}</nav>
    <div class="sidebar-foot">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar">${user ? user.ini : '--'}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user ? user.name : ''}</div>
          <div style="font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em">${user ? user.role : ''}</div>
        </div>
        <button class="icon-btn" id="btn-logout" aria-label="Cerrar sesión"><i class="ti ti-logout"></i></button>
      </div>
    </div>
  `;

  // clicks de navegación
  $$('.nav-item', sidebar).forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (item.dataset.soon) {
        onNavigate('__soon__', item.querySelector('span').textContent);
        return;
      }
      onNavigate(page);
      closeDrawer();
    });
  });
}

export function openDrawer() {
  $('#sidebar').classList.add('open');
  $('#drawer-overlay').classList.add('open');
}
export function closeDrawer() {
  $('#sidebar').classList.remove('open');
  $('#drawer-overlay').classList.remove('open');
}

// marca el item activo
export function setActiveNav(pageId) {
  $$('.nav-item').forEach(i =>
    i.classList.toggle('active', i.dataset.page === pageId));
}
