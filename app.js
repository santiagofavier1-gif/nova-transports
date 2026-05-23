// ============================================================
// NOVA TRANSPORTS · app.js
// Orquestador principal: login, navegación, tema, shell.
// FASE 1: shell responsive completo. Las páginas con datos
// reales llegan en Fase 2.
// ============================================================

import { $, toast } from './utils/dom.js';
import { login, getUser, logout, restoreSession } from './services/auth.js';
import { renderDrawer, openDrawer, closeDrawer, setActiveNav } from './components/drawer.js';
import { renderBottomNav, setActiveBottomNav } from './components/bottom-nav.js';
import { fmtPretty } from './utils/format.js';

// títulos de página
const TITLES = {
  dashboard: 'Dashboard',
  servicios: 'Servicios',
  calendario: 'Calendario',
  cotizacion: 'Cotización',
  reportes: 'Reportes',
  colaboradores: 'Colaboradores',
  usuarios: 'Usuarios'
};

let currentPage = 'dashboard';

// ============================================================
// ARRANQUE
// ============================================================
function init() {
  // tema guardado
  applyTheme(localStorage.getItem('nova_theme') || 'dark');

  // ¿sesión activa?
  const u = restoreSession();
  if (u) { enterApp(); }

  // listeners del login
  $('#login-btn').addEventListener('click', doLogin);
  $('#lu').addEventListener('keydown', e => { if (e.key === 'Enter') $('#lp').focus(); });
  $('#lp').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
}

// ============================================================
// LOGIN
// ============================================================
function doLogin() {
  const user = $('#lu').value;
  const pass = $('#lp').value;
  const err = $('#login-err');

  if (!user || !pass) { err.textContent = 'Escribe usuario y contraseña'; return; }

  const u = login(user, pass);
  if (!u) {
    err.textContent = 'Usuario o contraseña incorrectos';
    $('#lp').value = '';
    return;
  }
  err.textContent = '';
  enterApp();
}

function enterApp() {
  $('#login').classList.add('hidden');
  $('#app').classList.remove('hidden');

  const u = getUser();
  $('#header-avatar').textContent = u ? u.ini : '--';

  // montar navegación
  renderDrawer(handleNavigate);
  renderBottomNav(handleNavigate, handleFab, openDrawer);

  // listeners del shell
  $('#menu-btn').addEventListener('click', openDrawer);
  $('#drawer-overlay').addEventListener('click', closeDrawer);
  $('#theme-btn').addEventListener('click', toggleTheme);
  $('#notif-btn').addEventListener('click', () => toast('Sin notificaciones nuevas', 'ok'));
  // logout (el botón se crea dentro del drawer)
  document.addEventListener('click', e => {
    if (e.target.closest('#btn-logout')) doLogout();
  });

  navigate('dashboard');
}

function doLogout() {
  logout();
  closeDrawer();
  $('#app').classList.add('hidden');
  $('#login').classList.remove('hidden');
  $('#lu').value = ''; $('#lp').value = '';
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function handleNavigate(page, label) {
  if (page === '__soon__') {
    toast(`"${label}" llega en la próxima fase`, 'warn');
    return;
  }
  navigate(page);
  closeDrawer();
}

function handleFab() {
  toast('Nuevo Servicio — llega en Fase 2', 'ok');
}

function navigate(page) {
  currentPage = page;
  $('#page-title').textContent = TITLES[page] || 'Nova';
  setActiveNav(page);
  setActiveBottomNav(page);
  renderView(page);
}

// ============================================================
// VISTAS (placeholders premium — Fase 2 trae los datos reales)
// ============================================================
function renderView(page) {
  const view = $('#view');

  if (page === 'dashboard') {
    view.innerHTML = `
      <div class="fade-up" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <div class="live"><span class="live-dot"></span> En vivo</div>
        <div style="font-size:12px;color:var(--text-3)">${fmtPretty()}</div>
      </div>

      <div class="kpi-grid fade-up" style="margin-bottom:16px;animation-delay:.05s">
        <div class="kpi kpi-accent">
          <div class="kpi-label">Servicios hoy</div>
          <div class="kpi-value">—</div>
          <div class="kpi-sub">conectando datos…</div>
        </div>
        <div class="kpi kpi-plain">
          <div class="kpi-label">Ingresos</div>
          <div class="kpi-value">—</div>
          <div class="kpi-sub">del día</div>
        </div>
        <div class="kpi kpi-plain">
          <div class="kpi-label">Próximo</div>
          <div class="kpi-value" style="font-size:20px">—</div>
          <div class="kpi-sub">servicio</div>
        </div>
        <div class="kpi kpi-plain">
          <div class="kpi-label">7 días</div>
          <div class="kpi-value" style="color:var(--emerald-br)">—</div>
          <div class="kpi-sub">servicios</div>
        </div>
      </div>

      <div class="card fade-up" style="animation-delay:.1s">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:12px;background:color-mix(in srgb,var(--emerald) 14%,transparent);display:flex;align-items:center;justify-content:center;color:var(--emerald-glow)">
            <i class="ti ti-rocket" style="font-size:22px"></i>
          </div>
          <div>
            <div style="font-weight:600;font-size:15px">Fase 1 lista ✓</div>
            <div style="font-size:13px;color:var(--text-2)">Diseño premium + responsive. Los datos reales llegan en Fase 2.</div>
          </div>
        </div>
      </div>
    `;
  } else {
    // placeholder para otras páginas
    view.innerHTML = `
      <div class="empty fade-up">
        <i class="ti ti-windmill"></i>
        <div class="empty-title">${TITLES[page] || 'Página'}</div>
        <div class="empty-text">Esta sección conserva su lógica y se rediseña en la siguiente fase.</div>
      </div>
    `;
  }
}

// ============================================================
// TEMA (claro / oscuro)
// ============================================================
function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const btn = $('#theme-btn');
  if (btn) btn.innerHTML = theme === 'dark'
    ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
  document.querySelector('meta[name=theme-color]')
    ?.setAttribute('content', theme === 'dark' ? '#0B0F0D' : '#FAFBFA');
}
function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem('nova_theme', next);
  applyTheme(next);
}

// arrancar
init();
