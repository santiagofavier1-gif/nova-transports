// ============================================================
// NOVA TRANSPORTS · pages/cotizacion.js
// Cotización: formulario + precio (tarifa fija o Google Maps) + PDF.
// ============================================================

import { $, esc, toast } from '../utils/dom.js';
import { TARIFAS, DESTINOS, VEHICULOS, PAGOS } from '../services/config.js';
import { calcDistancePrice } from '../services/maps.js';
import { generateCotizacionPDF } from '../utils/pdf.js';

// mapea vehículo → clave de columna en TARIFAS
function tarifaKey(veh) {
  if (veh === 'Sedan ejecutivo') return 'sedan';
  if (veh === 'SUV ejecutiva') return 'suburban';
  return 'van';   // Van de lujo y Sprinter usan columna van
}

export function renderCotizacion() {
  const view = $('#view');
  const destOptions = DESTINOS.map(d => `<option value="${esc(d)}">`).join('');
  const vehOptions = VEHICULOS.map(v => `<option value="${v}">${v}</option>`).join('');
  const pagoOptions = PAGOS.map(p => `<option value="${p}">${p}</option>`).join('');

  view.innerHTML = `
    <div class="fade-up">
      <datalist id="dl-dest-cot">${destOptions}</datalist>

      <div class="card" style="margin-bottom:16px">
        <div class="field">
          <label class="field-label">Huésped / Cliente *</label>
          <input class="input" id="c-name" placeholder="Nombre del huésped">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field">
            <label class="field-label">Teléfono</label>
            <input class="input" id="c-phone" type="tel" placeholder="33...">
          </div>
          <div class="field">
            <label class="field-label">Habitación</label>
            <input class="input" id="c-room" placeholder="Opcional">
          </div>
        </div>

        <div class="field">
          <label class="field-label">Origen</label>
          <input class="input" id="c-origin" list="dl-dest-cot" placeholder="Punto de recogida">
        </div>
        <div class="field">
          <label class="field-label">Destino</label>
          <input class="input" id="c-dest" list="dl-dest-cot" placeholder="Destino">
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field">
            <label class="field-label">Fecha</label>
            <input class="input" id="c-date" type="date">
          </div>
          <div class="field">
            <label class="field-label">Hora</label>
            <input class="input" id="c-time" type="time">
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field">
            <label class="field-label">Vehículo</label>
            <select class="select" id="c-vehicle">${vehOptions}</select>
          </div>
          <div class="field">
            <label class="field-label">Pasajeros</label>
            <input class="input" id="c-pax" type="number" min="1" value="1">
          </div>
        </div>

        <div class="field">
          <label class="field-label">Vuelo (opcional)</label>
          <input class="input" id="c-flight" placeholder="AM123">
        </div>

        <div class="field">
          <label class="field-label">Precio</label>
          <div style="display:flex;gap:8px">
            <input class="input" id="c-cost" type="number" placeholder="0" style="flex:1">
            <button class="btn btn-ghost" id="c-tarifa" style="min-width:48px;padding:0 12px" title="Tarifa fija"><i class="ti ti-list"></i></button>
            <button class="btn btn-ghost" id="c-maps" style="min-width:48px;padding:0 12px" title="Google Maps"><i class="ti ti-map-2"></i></button>
          </div>
          <div id="c-price-result" style="font-size:12px;color:var(--text-2);margin-top:6px"></div>
        </div>

        <div class="field">
          <label class="field-label">Forma de pago</label>
          <select class="select" id="c-payment">${pagoOptions}</select>
        </div>

        <div class="field">
          <label class="field-label">Notas</label>
          <textarea class="textarea" id="c-notes" placeholder="Notas para la cotización…"></textarea>
        </div>
      </div>

      <button class="btn btn-primary btn-block" id="c-pdf">
        <i class="ti ti-file-download"></i> Generar PDF de cotización
      </button>
    </div>
  `;

  // tarifa fija (busca por destino exacto en la tabla TARIFAS)
  $('#c-tarifa').addEventListener('click', () => {
    const dest = $('#c-dest').value.trim();
    const veh = $('#c-vehicle').value;
    const res = $('#c-price-result');
    const tarifa = TARIFAS[dest];
    if (tarifa) {
      const price = tarifa[tarifaKey(veh)];
      $('#c-cost').value = price;
      res.innerHTML = `<span style="color:var(--ok)">Tarifa fija: ${dest} · ${veh} · $${price.toLocaleString('es-MX')}</span>`;
    } else {
      res.innerHTML = `<span style="color:var(--warn)">"${esc(dest)}" no está en la lista de tarifas fijas. Usa Google Maps o escribe el precio.</span>`;
    }
  });

  // Google Maps
  $('#c-maps').addEventListener('click', async () => {
    const origen = $('#c-origin').value.trim();
    const destino = $('#c-dest').value.trim();
    const veh = $('#c-vehicle').value;
    const res = $('#c-price-result');
    res.innerHTML = '<i class="ti ti-loader"></i> Calculando ruta real…';
    try {
      const r = await calcDistancePrice(origen, destino, veh);
      $('#c-cost').value = r.precio;
      const dur = r.durMin != null ? ` · ~${r.durMin} min` : '';
      res.innerHTML = `<span style="color:var(--ok)">${r.km.toFixed(1)} km${dur} · sugerido $${r.precio.toLocaleString('es-MX')}</span>`;
    } catch (e) {
      res.innerHTML = `<span style="color:var(--danger)">${e.message}</span>`;
    }
  });

  // generar PDF
  $('#c-pdf').addEventListener('click', () => {
    generateCotizacionPDF({
      name: $('#c-name').value.trim(),
      phone: $('#c-phone').value.trim(),
      room: $('#c-room').value.trim(),
      origin: $('#c-origin').value.trim(),
      dest: $('#c-dest').value.trim(),
      date: $('#c-date').value,
      time: $('#c-time').value || '—',
      vehicle: $('#c-vehicle').value,
      pax: $('#c-pax').value || '1',
      flight: $('#c-flight').value.trim(),
      cost: parseFloat($('#c-cost').value || '0'),
      payment: $('#c-payment').value,
      notes: $('#c-notes').value.trim()
    });
  });
}
