// ============================================================
// NOVA TRANSPORTS · pages/servicios.js
// Lista de servicios: TARJETAS en móvil, TABLA en desktop.
// Filtros por estado y búsqueda. Mantiene la lógica de estados.
// ============================================================

import { $, $$, esc } from '../utils/dom.js';
import { fmtDate, fmtTime, fmtMoney, fv } from '../utils/format.js';
import { isAdmin } from '../services/auth.js';
import { getServices } from '../services/services.js';
import { ESTADOS } from '../services/config.js';
import { exportServiciosExcel } from '../utils/excel.js';

let filterStatus = 'todos';
let searchText = '';

function badgeClass(status) {
  const map = {
    'Solicitado': 'solicitado', 'Confirmado': 'confirmado',
    'Chofer Asignado': 'chofer', 'En Proceso': 'proceso',
    'Completado': 'completado', 'Cancelado': 'cancelado', 'No Show': 'noshow'
  };
  return map[status] || 'noshow';
}

function getFiltered() {
  let list = [...getServices()].reverse();   // más recientes primero
  if (filterStatus !== 'todos') {
    list = list.filter(s => s.status === filterStatus);
  }
  if (searchText) {
    const q = searchText.toLowerCase();
    list = list.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.flight || '').toLowerCase().includes(q) ||
      (s.dest || '').toLowerCase().includes(q) ||
      (s.origin || '').toLowerCase().includes(q)
    );
  }
  return list;
}

export function renderServicios(onOpenDetail) {
  const view = $('#view');
  const admin = isAdmin();

  view.innerHTML = `
    <div class="fade-up" style="margin-bottom:16px">
      <div style="display:flex;gap:10px;margin-bottom:12px">
        <div style="position:relative;flex:1">
          <i class="ti ti-search" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-3);font-size:18px"></i>
          <input class="input" id="svc-search" placeholder="Buscar cliente, vuelo, destino…"
            style="padding-left:42px" value="${esc(searchText)}">
        </div>
        ${admin ? `<button class="btn btn-ghost" id="svc-excel" style="flex-shrink:0" title="Exportar a Excel"><i class="ti ti-file-spreadsheet"></i></button>` : ''}
      </div>
      <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch" id="svc-filters">
        ${['todos', ...ESTADOS].map(st => `
          <button class="filter-chip ${filterStatus === st ? 'active' : ''}" data-st="${st}"
            style="flex-shrink:0;padding:7px 14px;border-radius:var(--r-full);font-size:12px;font-weight:600;white-space:nowrap;
            border:1px solid ${filterStatus === st ? 'var(--emerald-br)' : 'var(--border)'};
            background:${filterStatus === st ? 'color-mix(in srgb,var(--emerald) 14%,transparent)' : 'transparent'};
            color:${filterStatus === st ? 'var(--emerald-glow)' : 'var(--text-2)'}">
            ${st === 'todos' ? 'Todos' : st}
          </button>`).join('')}
      </div>
    </div>
    <div id="svc-list" class="fade-up" style="animation-delay:.05s"></div>
  `;

  // listeners de filtros
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      filterStatus = chip.dataset.st;
      renderServicios(onOpenDetail);
    });
  });
  const search = $('#svc-search');
  search.addEventListener('input', e => {
    searchText = e.target.value;
    renderList(onOpenDetail, admin);
  });

  // botón de exportar a Excel (solo admin)
  const excelBtn = $('#svc-excel');
  if (excelBtn) excelBtn.addEventListener('click', () => exportServiciosExcel());

  renderList(onOpenDetail, admin);
}

function renderList(onOpenDetail, admin) {
  const list = getFiltered();
  const container = $('#svc-list');

  if (!list.length) {
    container.innerHTML = `
      <div class="empty">
        <i class="ti ti-inbox"></i>
        <div class="empty-title">Sin servicios</div>
        <div class="empty-text">No hay servicios que coincidan con el filtro.</div>
      </div>`;
    return;
  }

  // TARJETAS (se ven en móvil; en desktop el CSS las pone en grid)
  container.innerHTML = `
    <div class="svc-cards">
      ${list.map(s => `
        <div class="card card-hover svc-card" data-id="${s.id}" style="margin-bottom:10px;cursor:pointer">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px">
            <div style="min-width:0;flex:1">
              <div style="font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(fv(s.name))}</div>
              <div style="font-size:12px;color:var(--text-3);margin-top:2px">${fmtDate(s.date)} · ${fmtTime(s.time)}</div>
            </div>
            <span class="badge badge-${badgeClass(s.status)}">${s.status || '—'}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:4px">
            <i class="ti ti-route" style="font-size:15px;flex-shrink:0"></i>
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(fv(s.origin))} → ${esc(fv(s.dest))}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2)">
              <i class="ti ti-car" style="font-size:14px"></i>${esc(fv(s.vehicle))}
            </div>
            ${admin ? `<div style="font-weight:600;font-size:14px;color:var(--emerald-br)">${fmtMoney(s.cost)}</div>` : ''}
          </div>
        </div>`).join('')}
    </div>
  `;

  $$('.svc-card').forEach(card => {
    card.addEventListener('click', () => onOpenDetail(card.dataset.id));
  });
}
