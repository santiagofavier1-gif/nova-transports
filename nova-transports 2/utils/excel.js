// ============================================================
// NOVA TRANSPORTS · utils/excel.js
// Exporta servicios a Excel (.xlsx). Misma lógica que expXLS.
// Requiere SheetJS (XLSX) cargado globalmente.
// ============================================================

import { fmtDate, today } from './format.js';
import { toast } from './dom.js';
import { getServices } from '../services/services.js';

// exporta servicios. Si pasas from/to (YYYY-MM-DD), filtra por rango.
export function exportServiciosExcel(from = '', to = '') {
  if (typeof XLSX === 'undefined') {
    toast('La librería de Excel no cargó. Recarga la página.', 'err');
    return;
  }

  let l = getServices().slice();
  let fname = 'nova_transports_' + today();

  if (from && to) {
    l = l.filter(x => x.date >= from && x.date <= to);
    fname = 'nova_transports_' + from + '_al_' + to;
  }

  l = l.sort((a, b) =>
    ((a.date || '') + (a.time || '')).localeCompare((b.date || '') + (b.time || '')));

  const rows = l.map(s => ({
    'Fecha': fmtDate(s.date),
    'Hora': s.time,
    'Cliente': s.name,
    'Telefono': s.phone || '',
    'Pasajeros': s.pax,
    'Vuelo': s.flight || '',
    'Origen': s.origin,
    'Destino': s.dest,
    'Vehiculo': s.vehicle,
    'Vendedor': s.driver || '',
    'Metodo de pago': s.payment,
    'Costo MXN': s.cost != null ? Number(s.cost) : 0,
    'Estado': s.status,
    'Creado por': s.createdBy || '',
    'Fecha creacion': s.createdAt || ''
  }));

  if (!rows.length) { toast('No hay servicios para exportar', 'warn'); return; }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Servicios');
  XLSX.writeFile(wb, fname + '.xlsx');
  toast('Excel: ' + rows.length + ' servicios exportados', 'ok');
}
