// ============================================================
// NOVA TRANSPORTS · components/timeline.js
// Línea del día: servicios de hoy en una barra temporal.
// Misma lógica que renderTimeline.
// ============================================================

import { $, $$, esc } from '../utils/dom.js';
import { today, fmtTime } from '../utils/format.js';
import { getServices } from '../services/services.js';

const COLOR = {
  'Solicitado': 'var(--st-solicitado)', 'Confirmado': 'var(--st-confirmado)',
  'Chofer Asignado': 'var(--st-chofer)', 'En Proceso': 'var(--st-proceso)',
  'Completado': 'var(--st-completado)', 'No Show': 'var(--st-noshow)'
};

function toMin(hm) {
  const p = (hm || '0:0').split(':');
  return (+p[0]) * 60 + (+p[1] || 0);
}

// devuelve el HTML de la timeline (se inserta en un contenedor)
export function renderTimelineHTML() {
  const t = today();
  const tod = getServices()
    .filter(x => x.date === t && x.time && x.status !== 'Cancelado')
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  if (!tod.length) {
    return `
      <div class="card">
        <div style="display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--emerald-glow);margin-bottom:14px">
          <i class="ti ti-timeline"></i> Línea del día
        </div>
        <div style="text-align:center;color:var(--text-3);font-size:13px;padding:20px 0">No hay servicios programados para hoy</div>
      </div>`;
  }

  const times = tod.map(x => toMin(x.time));
  const minT = Math.min(...times), maxT = Math.max(...times);
  const start = Math.max(0, Math.min(minT - 60, 360));
  let end = Math.min(1440, Math.max(maxT + 60, 1320));
  if (end - start < 240) end = start + 240;
  const span = end - start;
  const pct = min => ((min - start) / span) * 100;

  // marcas de hora
  let hourMarks = '';
  const step = span > 720 ? 180 : 120;
  for (let m = Math.ceil(start / step) * step; m <= end; m += step) {
    const hh = Math.floor(m / 60);
    hourMarks += `<div style="position:absolute;left:${pct(m).toFixed(1)}%;transform:translateX(-50%);font-size:9px;color:var(--text-3);bottom:-18px">${String(hh).padStart(2, '0')}:00</div>`;
  }

  // línea del ahora
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let nowMark = '';
  if (nowMin >= start && nowMin <= end) {
    nowMark = `<div style="position:absolute;left:${pct(nowMin).toFixed(1)}%;top:0;bottom:0;width:2px;background:var(--danger);z-index:2"><div style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:8px;font-weight:600;color:var(--danger);white-space:nowrap">AHORA</div></div>`;
  }

  // puntos de servicio
  const dots = tod.map(s => {
    const col = COLOR[s.status] || 'var(--emerald)';
    return `
      <div class="tl-svc" data-id="${s.id}" style="position:absolute;left:${pct(toMin(s.time)).toFixed(1)}%;transform:translateX(-50%);top:50%;margin-top:-7px;cursor:pointer;z-index:3">
        <div class="tl-tip" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:var(--surface-2);border:1px solid var(--border-2);border-radius:6px;padding:3px 7px;font-size:10px;white-space:nowrap;opacity:0;transition:opacity .15s;pointer-events:none">${s.time} · ${esc((s.name || '').split(' ')[0])}</div>
        <div style="width:14px;height:14px;border-radius:50%;background:${col};border:2px solid var(--surface)"></div>
      </div>`;
  }).join('');

  return `
    <div class="card">
      <div style="display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--emerald-glow);margin-bottom:24px">
        <i class="ti ti-timeline"></i> Línea del día — ${tod.length} servicio${tod.length === 1 ? '' : 's'}
      </div>
      <div style="position:relative;height:32px;margin-bottom:24px">
        <div style="position:absolute;top:50%;left:0;right:0;height:2px;background:var(--border-2)"></div>
        ${hourMarks}${nowMark}${dots}
      </div>
    </div>`;
}

// engancha los clicks de los puntos
export function bindTimeline(onOpenDetail) {
  $$('.tl-svc').forEach(el => {
    el.addEventListener('click', () => onOpenDetail(el.dataset.id));
    el.addEventListener('mouseenter', () => {
      const tip = el.querySelector('.tl-tip');
      if (tip) tip.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      const tip = el.querySelector('.tl-tip');
      if (tip) tip.style.opacity = '0';
    });
  });
}
