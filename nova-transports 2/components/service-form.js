// ============================================================
// NOVA TRANSPORTS · components/service-form.js
// Formulario de Nuevo / Editar servicio.
// Misma lógica de guardado que saveSvc (incluye history).
// Botón de cálculo de precio con Google Maps.
// ============================================================

import { $, esc, toast } from '../utils/dom.js';
import { openModal, closeModal } from './modal.js';
import { VEHICULOS, PAGOS, DESTINOS } from '../services/config.js';
import { saveService, getService } from '../services/services.js';
import { getUser, canAccess } from '../services/auth.js';
import { calcDistancePrice } from '../services/maps.js';
import { now } from '../utils/format.js';

// abre el formulario. Si pasas id, es edición; si no, es nuevo.
export function openServiceForm(id = null) {
  const editing = !!id;
  const s = editing ? (getService(id) || {}) : {};
  const admin = canAccess();

  // opciones de destino (datalist para autocompletar)
  const destOptions = DESTINOS.map(d => `<option value="${esc(d)}">`).join('');
  const vehOptions = VEHICULOS.map(v =>
    `<option value="${v}" ${s.vehicle === v ? 'selected' : ''}>${v}</option>`).join('');
  const pagoOptions = PAGOS.map(p =>
    `<option value="${p}" ${s.payment === p ? 'selected' : ''}>${p}</option>`).join('');

  const body = `
    <datalist id="dl-dest">${destOptions}</datalist>

    <div class="field">
      <label class="field-label">Cliente *</label>
      <input class="input" id="f-name" value="${esc(s.name || '')}" placeholder="Nombre del cliente">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="field">
        <label class="field-label">Teléfono</label>
        <input class="input" id="f-phone" type="tel" value="${esc(s.phone || '')}" placeholder="33...">
      </div>
      <div class="field">
        <label class="field-label">Pasajeros</label>
        <input class="input" id="f-pax" type="number" min="1" value="${esc(s.pax || '1')}">
      </div>
    </div>

    <div class="field">
      <label class="field-label">Vuelo (opcional)</label>
      <input class="input" id="f-flight" value="${esc(s.flight || '')}" placeholder="AM123">
    </div>

    <div class="field">
      <label class="field-label">Origen *</label>
      <input class="input" id="f-origin" list="dl-dest" value="${esc(s.origin || '')}" placeholder="Punto de recogida">
    </div>
    <div class="field">
      <label class="field-label">Destino *</label>
      <input class="input" id="f-dest" list="dl-dest" value="${esc(s.dest || '')}" placeholder="Destino">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="field">
        <label class="field-label">Fecha *</label>
        <input class="input" id="f-date" type="date" value="${esc(s.date || '')}">
      </div>
      <div class="field">
        <label class="field-label">Hora *</label>
        <input class="input" id="f-time" type="time" value="${esc(s.time || '')}">
      </div>
    </div>

    <div class="field">
      <label class="field-label">Vehículo</label>
      <select class="select" id="f-vehicle">${vehOptions}</select>
    </div>

    ${admin ? `
    <div class="field">
      <label class="field-label">Precio</label>
      <div style="display:flex;gap:8px">
        <input class="input" id="f-cost" type="number" value="${esc(s.cost ?? '')}" placeholder="0" style="flex:1">
        <button class="btn btn-ghost" id="f-calc" style="min-width:48px;padding:0 14px" title="Calcular con Google Maps"><i class="ti ti-map-2"></i></button>
      </div>
      <div id="f-calc-result" style="font-size:12px;color:var(--text-2);margin-top:6px"></div>
    </div>` : ''}

    <div class="field">
      <label class="field-label">Forma de pago</label>
      <select class="select" id="f-payment">${pagoOptions}</select>
    </div>

    <div class="field">
      <label class="field-label">Vendedor</label>
      <input class="input" id="f-driver" value="${esc(s.driver || '')}" placeholder="Quién vendió el servicio">
    </div>

    <div class="field">
      <label class="field-label">Notas</label>
      <textarea class="textarea" id="f-notes" placeholder="Notas adicionales…">${esc(s.notes || '')}</textarea>
    </div>

    <button class="btn btn-primary btn-block" id="f-save" style="margin-top:8px">
      <i class="ti ti-check"></i> ${editing ? 'Guardar cambios' : 'Crear servicio'}
    </button>
  `;

  openModal({
    title: editing ? 'Editar servicio' : 'Nuevo servicio',
    body,
    onMount() {
      // botón calcular precio (Google Maps)
      const calcBtn = $('#f-calc');
      if (calcBtn) {
        calcBtn.addEventListener('click', async () => {
          const origen = $('#f-origin').value.trim();
          const destino = $('#f-dest').value.trim();
          const veh = $('#f-vehicle').value;
          const res = $('#f-calc-result');
          res.innerHTML = '<i class="ti ti-loader"></i> Calculando ruta real…';
          calcBtn.disabled = true;
          try {
            const r = await calcDistancePrice(origen, destino, veh);
            $('#f-cost').value = r.precio;
            const dur = r.durMin != null ? ` · ~${r.durMin} min` : '';
            res.innerHTML = `<span style="color:var(--ok)">${r.km.toFixed(1)} km${dur} · sugerido $${r.precio.toLocaleString('es-MX')}</span> <span style="color:var(--text-3)">(editable)</span>`;
          } catch (e) {
            res.innerHTML = `<span style="color:var(--danger)">${e.message}</span>`;
          } finally {
            calcBtn.disabled = false;
          }
        });
      }

      // botón guardar
      $('#f-save').addEventListener('click', () => doSave(id, editing));
    }
  });
}

function doSave(id, editing) {
  const user = getUser();
  const name = $('#f-name').value.trim();
  const origin = $('#f-origin').value.trim();
  const dest = $('#f-dest').value.trim();
  const date = $('#f-date').value;
  const time = $('#f-time').value;

  // validación (igual que la app vieja: cliente, origen, destino, fecha, hora)
  if (!name || !origin || !dest || !date || !time) {
    toast('Faltan campos requeridos (cliente, origen, destino, fecha, hora)', 'warn');
    return;
  }

  const costEl = $('#f-cost');
  const cost = costEl && costEl.value !== '' ? parseFloat(costEl.value) : null;

  const data = {
    name, phone: $('#f-phone').value.trim(),
    pax: $('#f-pax').value, flight: $('#f-flight').value.trim(),
    origin, dest, date, time,
    vehicle: $('#f-vehicle').value,
    driver: $('#f-driver').value.trim(),
    payment: $('#f-payment').value,
    cost, notes: $('#f-notes').value.trim(),
    agent: ''
  };

  if (editing) {
    const prev = getService(id);
    const hist = (prev && prev.history) ? prev.history.slice() : [];
    hist.push({ ts: now(), txt: 'Editado por ' + user.name });
    data.history = hist;
    saveService(data, id)
      .then(() => { toast('Servicio actualizado', 'ok'); closeModal(); })
      .catch(e => toast('Error: ' + e.message, 'err'));
  } else {
    data.status = 'Solicitado';
    data.createdBy = user.name;
    data.createdAt = now();
    data.history = [{ ts: now(), txt: 'Creado por ' + user.name }];
    saveService(data)
      .then(() => { toast('Servicio creado', 'ok'); closeModal(); })
      .catch(e => toast('Error: ' + e.message, 'err'));
  }
}
