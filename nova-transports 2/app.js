// ============================================================
// NOVA TRANSPORTS · app.js
// Orquestador principal: login, navegación, tema, shell.
// FASE 2: dashboard y servicios con datos reales de Firestore.
// ============================================================

import { $, toast } from './utils/dom.js';
import { login, getUser, logout, restoreSession } from './services/auth.js';
import { renderDrawer, openDrawer, closeDrawer, setActiveNav } from './components/drawer.js';
import { renderBottomNav, setActiveBottomNav } from './components/bottom-nav.js';
import { startListen, onServicesChange } from './services/services.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderServicios } from './pages/servicios.js';
import { openServiceForm } from './components/service-form.js';
import { openServiceDetail } from './components/service-detail.js';
import { renderCalendario } from './pages/calendario.js';
import { renderCotizacion } from './pages/cotizacion.js';
import { renderReportes } from './pages/reportes.js';
import { renderColaboradores } from './pages/colaboradores.js';

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
let listenStarted = false;

// ============================================================
// ARRANQUE
// ============================================================
function init() {
  applyTheme(localStorage.getItem('nova_theme') || 'dark');

  const u = restoreSession();
  if (u) { enterApp(); }

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

  renderDrawer(handleNavigate);
  renderBottomNav(handleNavigate, handleFab, openDrawer);

  $('#menu-btn').addEventListener('click', openDrawer);
  $('#drawer-overlay').addEventListener('click', closeDrawer);
  $('#theme-btn').addEventListener('click', toggleTheme);
  $('#notif-btn').addEventListener('click', () => toast('Sin notificaciones nuevas', 'ok'));
  document.addEventListener('click', e => {
    if (e.target.closest('#btn-logout')) doLogout();
  });

  // ---- arrancar escucha de Firestore (datos reales en tiempo real) ----
  if (!listenStarted) {
    startListen();
    // cuando lleguen/cambien los datos, re-renderiza la página activa
    onServicesChange(() => {
      if (currentPage === 'dashboard') renderDashboard(openDetail);
      else if (currentPage === 'servicios') renderServicios(openDetail);
    });
    listenStarted = true;
  }

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
  openServiceForm();   // abre el formulario de nuevo servicio
}

function openDetail(id) {
  openServiceDetail(id);   // abre el detalle del servicio
}

function navigate(page) {
  currentPage = page;
  $('#page-title').textContent = TITLES[page] || 'Nova';
  setActiveNav(page);
  setActiveBottomNav(page);
  renderView(page);
}

// ============================================================
// VISTAS
// ============================================================
function renderView(page) {
  if (page === 'dashboard') {
    renderDashboard(openDetail);
  } else if (page === 'servicios') {
    renderServicios(openDetail);
  } else if (page === 'calendario') {
    renderCalendario(openDetail);
  } else if (page === 'cotizacion') {
    renderCotizacion();
  } else if (page === 'reportes') {
    renderReportes();
  } else if (page === 'colaboradores') {
    renderColaboradores();
  } else {
    // placeholder para secciones futuras (Clientes, Choferes, Vehículos, Usuarios)
    $('#view').innerHTML = `
      <div class="empty fade-up">
        <i class="ti ti-windmill"></i>
        <div class="empty-title">${TITLES[page] || 'Página'}</div>
        <div class="empty-text">Esta sección llegará en una próxima actualización.</div>
      </div>`;
  }
}

// ============================================================
// TEMA
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

init();
