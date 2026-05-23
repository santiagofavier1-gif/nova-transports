// ============================================================
// NOVA TRANSPORTS · pages/dashboard.js
// Dashboard con datos REALES de Firestore.
// KPIs vivos: servicios hoy, ingresos, próximo, últimos 7 días.
// ============================================================

import { $ } from '../utils/dom.js';
import { today, fmtPretty, fmtMoney, fmtTime, fv } from '../utils/format.js';
import { isAdmin } from '../services/auth.js';
import {
  getServices, servicesOfDate, nextService,
  incomeOfDate, countLastDays
} from '../services/services.js';
import { renderTimelineHTML, bindTimeline } from '../components/timeline.js';
import { mapWidgetHTML, initMap } from '../components/map-widget.js';

// anima un número de 0 a su valor final
function animateNumber(el, target, opts = {}) {
  const dur = 600;
  const start = performance.now();
  const isMoney = opts.money;
  function frame(t) {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);   // ease-out
    const val = Math.round(target * eased);
    el.textContent = isMoney ? fmtMoney(val).replace('.00', '') : val;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = isMoney ? fmtMoney(target).replace('.00', '') : target;
  }
  requestAnimationFrame(frame);
}

export function renderDashboard(onOpenDetail) {
  const view = $('#view');
  const admin = isAdmin();
  const tdy = today();

  const svcsToday = servicesOfDate(tdy);
  const confirmados = svcsToday.filter(s => s.status === 'Confirmado').length;
  const pendientes = svcsToday.filter(s => s.status === 'Solicitado').length;
  const income = incomeOfDate(tdy);
  const next = nextService();
  const last7 = countLastDays(7);

  view.innerHTML = `
    <div class="fade-up" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div class="live"><span class="live-dot"></span> En vivo</div>
      <div style="font-size:12px;color:var(--text-3)">${fmtPretty()}</div>
    </div>

    <div class="kpi-grid fade-up" style="margin-bottom:16px;animation-delay:.05s">
      <div class="kpi kpi-accent">
        <div class="kpi-label">Servicios hoy</div>
        <div class="kpi-value" id="kpi-today">0</div>
        <div class="kpi-sub">${confirmados} confirmados · ${pendientes} por atender</div>
      </div>
      ${admin ? `
      <div class="kpi kpi-plain">
        <div class="kpi-label">Ingresos</div>
        <div class="kpi-value" id="kpi-income">$0</div>
        <div class="kpi-sub">del día</div>
      </div>` : `
      <div class="kpi kpi-plain">
        <div class="kpi-label">Confirmados</div>
        <div class="kpi-value" id="kpi-conf">0</div>
        <div class="kpi-sub">de hoy</div>
      </div>`}
      <div class="kpi kpi-plain">
        <div class="kpi-label">Próximo</div>
        <div class="kpi-value" style="font-size:20px">${next && next.time ? fmtTime(next.time) : '—'}</div>
        <div class="kpi-sub">${next ? fv(next.name).slice(0, 18) : 'sin servicios'}</div>
      </div>
      <div class="kpi kpi-plain">
        <div class="kpi-label">7 días</div>
        <div class="kpi-value" id="kpi-7d" style="color:var(--emerald-br)">0</div>
        <div class="kpi-sub">servicios</div>
      </div>
    </div>

    ${next ? `
    <div class="card fade-up" style="animation-delay:.1s;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-2);margin-bottom:6px">Próximo servicio</div>
          <div style="font-weight:600;font-size:15px;margin-bottom:4px">${fv(next.name)}</div>
          <div style="font-size:13px;color:var(--text-2);display:flex;align-items:center;gap:5px">
            <i class="ti ti-map-pin" style="font-size:14px"></i>
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${fv(next.dest)}</span>
          </div>
          <div style="display:flex;gap:6px;margin-top:10px">
            <span class="badge badge-${badgeClass(next.status)}">${next.status}</span>
            <span class="badge badge-noshow">${fmtTime(next.time)}</span>
          </div>
        </div>
      </div>
    </div>` : ''}

    <div class="fade-up" style="animation-delay:.15s;margin-bottom:16px">
      ${renderTimelineHTML()}
    </div>

    <div class="fade-up" style="animation-delay:.2s">
      ${mapWidgetHTML()}
    </div>
  `;

  // animar los KPIs
  animateNumber($('#kpi-today'), svcsToday.length);
  if ($('#kpi-income')) animateNumber($('#kpi-income'), income, { money: true });
  if ($('#kpi-conf')) animateNumber($('#kpi-conf'), confirmados);
  animateNumber($('#kpi-7d'), last7);

  // enganchar timeline y arrancar el mapa
  if (onOpenDetail) bindTimeline(onOpenDetail);
  initMap();
}

// mapea estado → sufijo de clase badge
function badgeClass(status) {
  const map = {
    'Solicitado': 'solicitado', 'Confirmado': 'confirmado',
    'Chofer Asignado': 'chofer', 'En Proceso': 'proceso',
    'Completado': 'completado', 'Cancelado': 'cancelado', 'No Show': 'noshow'
  };
  return map[status] || 'noshow';
}
