// ============================================================
// NOVA TRANSPORTS · pages/colaboradores.js
// Expedientes de personal (choferes/empleados). Solo admin.
// Misma estructura de datos que la app vieja.
// ============================================================

import { $, $$, esc, toast } from '../utils/dom.js';
import { fmtDate, fv, now } from '../utils/format.js';
import { isAdmin } from '../services/auth.js';
import { openModal, closeModal } from '../components/modal.js';
import {
  loadColaboradores, getColaboradores, getColaborador, saveColaborador
} from '../services/colaboradores.js';

const PUESTOS = ['Chofer', 'Chofer ejecutivo', 'Supervisor', 'Coordinador', 'Administrativo', 'Otro'];

export function renderColaboradores() {
  const view = $('#view');

  if (!isAdmin()) {
    view.innerHTML = `
      <div class="empty fade-up">
        <i class="ti ti-lock"></i>
        <div class="empty-title">Acceso restringido</div>
        <div class="empty-text">Los expedientes son solo para administradores.</div>
      </div>`;
    return;
  }

  view.innerHTML = `
    <div class="fade-up">
      <div style="display:flex;gap:10px;margin-bottom:16px">
        <div style="position:relative;flex:1">
          <i class="ti ti-search" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-3);font-size:18px"></i>
          <input class="input" id="col-search" placeholder="Buscar colaborador…" style="padding-left:42px">
        </div>
        <button class="btn btn-primary" id="col-new" style="flex-shrink:0"><i class="ti ti-plus"></i></button>
      </div>
      <div id="col-grid"><div class="skeleton" style="height:120px;border-radius:var(--r-lg)"></div></div>
    </div>
  `;

  $('#col-new').addEventListener('click', () => openColabForm());
  $('#col-search').addEventListener('input', e => drawGrid(e.target.value.toLowerCase()));

  // cargar de Firestore
  loadColaboradores().then(() => drawGrid(''));
}

function drawGrid(q) {
  const all = getColaboradores();
  const list = q ? all.filter(c => (c.name || '').toLowerCase().includes(q)) : all;
  const grid = $('#col-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty">
        <i class="ti ti-users"></i>
        <div class="empty-title">Sin colaboradores</div>
        <div class="empty-text">Registra tu primer colaborador con el botón +</div>
      </div>`;
    return;
  }

  grid.innerHTML = `
    <div class="svc-cards">
      ${list.map(c => `
        <div class="card" style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
            <div style="min-width:0;flex:1">
              <div style="font-weight:700;font-size:15px">${esc(fv(c.name))}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
                <span style="background:var(--emerald);color:#fff;padding:2px 8px;border-radius:var(--r-full);font-size:9px;font-weight:600;letter-spacing:.08em">${esc(c.puesto || 'Chofer')}</span>
                <span style="font-size:11px;color:var(--text-3)">${esc(fv(c.unit))}</span>
              </div>
            </div>
            <button class="btn btn-ghost col-edit" data-id="${c.id}" style="min-height:36px;padding:0 12px;font-size:12px">Editar</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;color:var(--text-2);padding-top:10px;border-top:1px solid var(--border)">
            <div><span style="color:var(--text-3)">Tel:</span> ${esc(fv(c.phone))}</div>
            <div><span style="color:var(--text-3)">Ingreso:</span> ${c.start ? fmtDate(c.start) : '—'}</div>
            <div><span style="color:var(--text-3)">Licencia:</span> ${esc(fv(c.licTipo))}</div>
            <div><span style="color:var(--text-3)">Vig. lic:</span> ${c.licVig ? fmtDate(c.licVig) : '—'}</div>
          </div>
        </div>`).join('')}
    </div>
  `;

  $$('.col-edit').forEach(btn =>
    btn.addEventListener('click', () => openColabForm(btn.dataset.id)));
}

function openColabForm(id = null) {
  const editing = !!id;
  const c = editing ? (getColaborador(id) || {}) : {};
  const puestoOpts = PUESTOS.map(p =>
    `<option value="${p}" ${c.puesto === p ? 'selected' : ''}>${p}</option>`).join('');

  const txt = (lbl, key, type = 'text', extra = '') => `
    <div class="field">
      <label class="field-label">${lbl}</label>
      <input class="input" id="cf-${key}" type="${type}" value="${esc(c[key] || '')}" ${extra}>
    </div>`;

  const body = `
    ${txt('Nombre completo *', 'name')}
    <div class="field">
      <label class="field-label">Puesto</label>
      <select class="select" id="cf-puesto">${puestoOpts}</select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${txt('Teléfono', 'phone', 'tel')}
      ${txt('Unidad asignada', 'unit')}
    </div>
    ${txt('Correo', 'email', 'email')}
    ${txt('Dirección', 'address')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${txt('Fecha nacimiento', 'dob', 'date')}
      ${txt('Fecha ingreso', 'start', 'date')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${txt('CURP', 'curp')}
      ${txt('RFC', 'rfc')}
    </div>
    ${txt('NSS', 'nss')}
    <div style="border-top:1px solid var(--border);margin:8px 0 12px;padding-top:12px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3)">Documentos</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${txt('INE', 'ine')}
      ${txt('Vigencia INE', 'ineVig', 'date')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${txt('Tipo licencia', 'licTipo')}
      ${txt('Vigencia licencia', 'licVig', 'date')}
    </div>
    <div class="field">
      <label class="field-label">Notas</label>
      <textarea class="textarea" id="cf-notes">${esc(c.notes || '')}</textarea>
    </div>
    <button class="btn btn-primary btn-block" id="cf-save" style="margin-top:8px">
      <i class="ti ti-check"></i> ${editing ? 'Guardar cambios' : 'Registrar colaborador'}
    </button>
  `;

  openModal({
    title: editing ? 'Editar colaborador' : 'Nuevo colaborador',
    body,
    onMount() {
      $('#cf-save').addEventListener('click', () => doSaveColab(id, editing));
    }
  });
}

function doSaveColab(id, editing) {
  const name = $('#cf-name').value.trim();
  if (!name) { toast('Ingresa el nombre del colaborador', 'warn'); return; }

  const get = k => ($('#cf-' + k) ? $('#cf-' + k).value : '');
  const data = {
    name,
    puesto: $('#cf-puesto').value,
    phone: get('phone'), unit: get('unit'),
    email: get('email'), address: get('address'),
    dob: get('dob'), start: get('start'),
    curp: get('curp').toUpperCase(), rfc: get('rfc').toUpperCase(), nss: get('nss'),
    ine: get('ine'), ineVig: get('ineVig'),
    licTipo: get('licTipo'), licVig: get('licVig'),
    notes: get('notes'),
    updatedAt: now()
  };

  saveColaborador(data, id)
    .then(() => {
      toast(editing ? 'Colaborador actualizado' : 'Colaborador registrado', 'ok');
      closeModal();
      loadColaboradores().then(() => drawGrid(''));
    })
    .catch(e => toast('Error: ' + e.message, 'err'));
}
