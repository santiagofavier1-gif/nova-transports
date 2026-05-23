// ============================================================
// NOVA TRANSPORTS · utils/format.js
// Helpers de formato (fecha, moneda, tiempo).
// Misma lógica que tu app actual, ahora reutilizable.
// ============================================================

// fecha de hoy en formato YYYY-MM-DD
export function today() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// fecha + hora actual: YYYY-MM-DD HH:MM
export function now() {
  const d = new Date();
  return today() + ' ' +
    String(d.getHours()).padStart(2, '0') + ':' +
    String(d.getMinutes()).padStart(2, '0');
}

// formatea fecha YYYY-MM-DD → DD/MM/YYYY
export function fmtDate(d) {
  if (!d) return '--';
  const p = d.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

// formatea número → $1,234.00
export function fmtMoney(n) {
  return (n != null && n !== '')
    ? '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })
    : '$0.00';
}

// valor o guion
export function fv(v) { return v || '--'; }

// convierte "HH:MM" a minutos del día
export function toMin(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// formatea hora "HH:MM" en 12h con am/pm
export function fmtTime(t) {
  if (!t) return '--';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}

// nombre del mes
export const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// fecha bonita: "viernes, 22 de mayo de 2026"
export function fmtPretty(dateStr) {
  const d = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
  const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  return `${dias[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()} de ${d.getFullYear()}`;
}
