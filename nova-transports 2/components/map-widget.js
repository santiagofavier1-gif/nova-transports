// ============================================================
// NOVA TRANSPORTS · components/map-widget.js
// Mapa de servicios de hoy (Leaflet). Misma lógica que renderMap.
// ============================================================

import { $ } from '../utils/dom.js';
import { today } from '../utils/format.js';
import { getServices } from '../services/services.js';
import { ZONE_COORDS } from '../services/config.js';

let _map = null;
let _layer = null;

const COLOR = {
  'Solicitado': '#B8760A', 'Confirmado': '#1B6B4F', 'Chofer Asignado': '#1A7A7A',
  'En Proceso': '#C2691B', 'Completado': '#0E4435', 'No Show': '#888'
};

// HTML del contenedor del mapa
export function mapWidgetHTML() {
  return `
    <div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px">
        <div style="display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--emerald-glow)">
          <i class="ti ti-map-pin"></i> Mapa de servicios de hoy
        </div>
      </div>
      <div id="map-canvas" style="height:260px;width:100%"></div>
      <div id="map-empty" style="display:none;text-align:center;color:var(--text-3);font-size:13px;padding:30px 0">No hay servicios con ubicación conocida hoy</div>
    </div>`;
}

// inicializa/actualiza el mapa (llamar después de insertar el HTML)
export function initMap() {
  const canvas = $('#map-canvas');
  const empty = $('#map-empty');
  if (!canvas || typeof L === 'undefined') {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const t = today();
  const tod = getServices().filter(x =>
    x.date === t && x.status !== 'Cancelado' && ZONE_COORDS[x.origin]);

  if (!tod.length) {
    canvas.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  canvas.style.display = 'block';

  // inicializar una vez
  if (!_map) {
    _map = L.map('map-canvas', { scrollWheelZoom: false, attributionControl: false })
      .setView([20.67, -103.38], 11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(_map);
  }
  if (_layer) _map.removeLayer(_layer);
  _layer = L.layerGroup();

  // agrupar por zona de origen
  const byZone = {};
  tod.forEach(s => { (byZone[s.origin] = byZone[s.origin] || []).push(s); });
  const bounds = [];

  Object.keys(byZone).forEach(z => {
    const coords = ZONE_COORDS[z];
    bounds.push(coords);
    const svcs = byZone[z];
    const col = COLOR[svcs[0].status] || '#1B6B4F';
    const icon = L.divIcon({
      className: '',
      html: `<div style="background:${col};width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);color:#fff;font-size:12px;font-weight:600">${svcs.length}</span></div>`,
      iconSize: [24, 24], iconAnchor: [12, 24]
    });
    const pop = `<b>${z}</b><br>` + svcs.map(s => `${s.time} · ${s.name || ''} → ${s.dest || ''}`).join('<br>');
    L.marker(coords, { icon }).bindPopup(pop).addTo(_layer);
  });

  _layer.addTo(_map);
  if (bounds.length > 1) _map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  else if (bounds.length === 1) _map.setView(bounds[0], 12);
  setTimeout(() => _map.invalidateSize(), 100);
}

// resetea el mapa (al salir del dashboard)
export function destroyMap() {
  if (_map) { _map.remove(); _map = null; _layer = null; }
}
