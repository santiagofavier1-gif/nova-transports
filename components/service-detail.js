// ============================================================
// NOVA TRANSPORTS · components/service-detail.js
// Detalle del servicio: ver todo, cambiar estado, editar.
// Cambio de estado con historial (igual que apSt).
// ============================================================

import { $, $$, esc, toast } from '../utils/dom.js';
import { openModal, closeModal } from './modal.js';
import { fmtDate, fmtTime, fmtMoney, fv, now } from '../utils/format.js';
import { getService, saveService } from '../services/services.js';
import { ESTADOS } from '../services/config.js';
import { canAccess, getUser } from '../services/auth.js';
import { openServiceForm } from './service-form.js';

function badgeClass(status) {
  const map = {
    'Solicitado': 'solicitado', 'Confirmado': 'confirmado',
    'Chofer Asignado': 'chofer', 'En Proceso': 'proceso',
    'Completado': 'completado', 'Cancelado': 'cancelado', 'No Show': 'noshow'
  };
  return map[status] || 'noshow';
}

export function openServiceDetail(id) {
  const s = getService(id);
  if (!s) { toast('Servicio no encontrado', 'err'); return; }
  const admin = canAccess();

  const row = (icon, label, value) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <i class="ti ${icon}" style="font-size:18px;color:var(--text-3);width:20px;text-align:center"></i>
      <div style="font-size:12px;color:var(--text-2);width:90px;flex-shrink:0">${label}</div>
      <div style="font-size:14px;font-weight:500;text-align:right;flex:1;word-break:break-word">${value}</div>
    </div>`;

  const body = `
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:20px;font-weight:700;margin-bottom:8px">${esc(fv(s.name))}</div>
      <span class="badge badge-${badgeClass(s.status)}" style="font-size:12px">${s.status || '—'}</span>
    </div>

    <div style="margin-bottom:20px">
      ${row('ti-route', 'Ruta', esc(fv(s.origin)) + ' → ' + esc(fv(s.dest)))}
      ${row('ti-calendar', 'Fecha', fmtDate(s.date) + ' · ' + fmtTime(s.time))}
      ${row('ti-car', 'Vehículo', esc(fv(s.vehicle)))}
      ${row('ti-users', 'Pasajeros', esc(fv(s.pax)))}
      ${s.flight ? row('ti-plane', 'Vuelo', esc(s.flight)) : ''}
      ${s.phone ? row('ti-phone', 'Teléfono', esc(s.phone)) : ''}
      ${row('ti-user', 'Vendedor', esc(fv(s.driver)))}
      ${row('ti-credit-card', 'Pago', esc(fv(s.payment)))}
      ${admin ? row('ti-cash', 'Costo', fmtMoney(s.cost)) : ''}
      ${s.notes ? row('ti-note', 'Notas', esc(s.notes)) : ''}
    </div>

    <div class="field-label" style="margin-bottom:10px">Cambiar estado</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px" id="status-chips">
      ${ESTADOS.map(st => `
        <button class="status-chip" data-st="${st}"
          style="padding:8px 12px;border-radius:var(--r-full);font-size:12px;font-weight:600;
          border:1px solid ${s.status === st ? 'var(--emerald-br)' : 'var(--border)'};
          background:${s.status === st ? 'color-mix(in srgb,var(--emerald) 14%,transparent)' : 'transparent'};
          color:${s.status === st ? 'var(--emerald-glow)' : 'var(--text-2)'}">
          ${st}
        </button>`).join('')}
    </div>

    <div style="display:flex;gap:10px">
      <button class="btn btn-outline btn-block" id="d-edit"><i class="ti ti-edit"></i> Editar</button>
    </div>
  `;

  openModal({
    title: 'Detalle del servicio',
    body,
    onMount() {
      // cambiar estado
      $$('.status-chip').forEach(chip => {
        chip.addEventListener('click', () => changeStatus(id, chip.dataset.st));
      });
      // editar
      $('#d-edit').addEventListener('click', () => {
        closeModal();
        setTimeout(() => openServiceForm(id), 300);
      });
    }
  });
}

function changeStatus(id, newStatus) {
  const s = getService(id);
  if (!s || s.status === newStatus) return;
  const user = getUser();
  const hist = (s.history || []).slice();
  hist.push({ ts: now(), txt: `"${s.status}" a "${newStatus}" por ${user.name}` });

  saveService({ status: newStatus, history: hist }, id)
    .then(() => { toast('Estado: ' + newStatus, 'ok'); closeModal(); })
    .catch(() => toast('Error al cambiar estado', 'err'));
}
