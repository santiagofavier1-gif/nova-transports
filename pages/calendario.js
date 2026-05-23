// ============================================================
// NOVA TRANSPORTS · pages/calendario.js
// Calendario mensual con puntos de servicio por estado.
// Misma lógica que rCal (semana inicia lunes).
// ============================================================

import { $, $$, esc } from '../utils/dom.js';
import { MESES } from '../utils/format.js';
import { getServices } from '../services/services.js';

// mes/año visibles (estado del calendario)
let cy = new Date().getFullYear();
let cm = new Date().getMonth();

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// color del punto según estado
const DOT_COLOR = {
  'Solicitado': 'var(--st-solicitado)',
  'Confirmado': 'var(--st-confirmado)',
  'Chofer Asignado': 'var(--st-chofer)',
  'En Proceso': 'var(--st-proceso)',
  'Completado': 'var(--st-completado)',
  'Cancelado': 'var(--st-cancelado)',
  'No Show': 'var(--st-noshow)'
};

export function renderCalendario(onOpenDetail) {
  const view = $('#view');
  view.innerHTML = `
    <div class="fade-up" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <button class="icon-btn" id="cal-prev" aria-label="Mes anterior"><i class="ti ti-chevron-left"></i></button>
      <div style="font-size:17px;font-weight:600" id="cal-title"></div>
      <button class="icon-btn" id="cal-next" aria-label="Mes siguiente"><i class="ti ti-chevron-right"></i></button>
    </div>
    <div class="card fade-up" style="animation-delay:.05s;padding:12px">
      <div class="cal-grid" id="cal-grid"></div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;font-size:11px;color:var(--text-2)">
      <span style="display:flex;align-items:center;gap:5px"><span style="width:8px;height:8px;border-radius:50%;background:var(--st-solicitado)"></span>Solicitado</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:8px;height:8px;border-radius:50%;background:var(--st-confirmado)"></span>Confirmado</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:8px;height:8px;border-radius:50%;background:var(--st-proceso)"></span>En proceso</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:8px;height:8px;border-radius:50%;background:var(--st-completado)"></span>Completado</span>
    </div>
  `;

  $('#cal-prev').addEventListener('click', () => {
    cm--; if (cm < 0) { cm = 11; cy--; }
    drawGrid(onOpenDetail);
  });
  $('#cal-next').addEventListener('click', () => {
    cm++; if (cm > 11) { cm = 0; cy++; }
    drawGrid(onOpenDetail);
  });

  drawGrid(onOpenDetail);
}

function drawGrid(onOpenDetail) {
  $('#cal-title').textContent = MESES[cm] + ' ' + cy;
  const SVC = getServices();
  const first = new Date(cy, cm, 1);
  const sd = (first.getDay() + 6) % 7;          // lunes = 0
  const dim = new Date(cy, cm + 1, 0).getDate();
  const tod = todayStr();
  const prevDim = new Date(cy, cm, 0).getDate();

  let h = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    .map(d => `<div class="cal-dh">${d}</div>`).join('');

  // días del mes anterior (relleno)
  for (let i = sd - 1; i >= 0; i--) {
    h += `<div class="cal-d om"><div class="cal-dn">${prevDim - i}</div></div>`;
  }

  // días del mes
  for (let d = 1; d <= dim; d++) {
    const ds = cy + '-' + String(cm + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const svcs = SVC.filter(x => x.date === ds);
    const dots = svcs.slice(0, 3).map(s => {
      const col = DOT_COLOR[s.status] || 'var(--text-3)';
      const nm = (s.name || '').split(' ')[0];
      return `<div class="cal-dot" data-id="${s.id}" style="background:color-mix(in srgb,${col} 20%,transparent);color:${col}">${s.time || ''} ${esc(nm)}</div>`;
    }).join('');
    const more = svcs.length > 3 ? `<div class="cal-more">+${svcs.length - 3} más</div>` : '';
    h += `<div class="cal-d${ds === tod ? ' cal-today' : ''}"><div class="cal-dn">${d}</div>${dots}${more}</div>`;
  }

  // relleno final
  const tot = sd + dim, tr = (7 - tot % 7) % 7;
  for (let d2 = 1; d2 <= tr; d2++) {
    h += `<div class="cal-d om"><div class="cal-dn">${d2}</div></div>`;
  }

  $('#cal-grid').innerHTML = h;

  // clicks en los puntos → detalle
  $$('.cal-dot').forEach(dot => {
    dot.addEventListener('click', e => {
      e.stopPropagation();
      onOpenDetail(dot.dataset.id);
    });
  });
}
