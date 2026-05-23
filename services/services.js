// ============================================================
// NOVA TRANSPORTS · services/services.js
// CRUD + escucha en tiempo real de la colección "services".
// Misma lógica que tu app actual (startListen + saveSvc).
// ============================================================

import { colServices } from './firebase.js';

// estado en memoria (igual que la variable SVC de tu app vieja)
let SVC = [];
let _unsub = null;
const listeners = [];   // funciones que se llaman cuando cambian los datos

// suscribir un callback a los cambios de datos
export function onServicesChange(cb) {
  listeners.push(cb);
  if (SVC.length) cb(SVC);   // disparar de inmediato si ya hay datos
}

// arrancar la escucha en tiempo real (= tu startListen)
export function startListen() {
  if (_unsub) _unsub();
  _unsub = colServices.orderBy('date', 'asc').onSnapshot(
    snap => {
      SVC = snap.docs.map(d => { const o = d.data(); o.id = d.id; return o; });
      listeners.forEach(cb => cb(SVC));
    },
    err => console.error('Firestore listen error:', err)
  );
}

export function stopListen() {
  if (_unsub) { _unsub(); _unsub = null; }
}

// obtener todos los servicios (en memoria)
export function getServices() { return SVC; }

// obtener uno por id
export function getService(id) { return SVC.find(s => s.id === id) || null; }

// guardar (crear o actualizar) un servicio
export function saveService(data, id = null) {
  if (id) {
    return colServices.doc(id).update(data);
  }
  return colServices.add(data);
}

// cambiar solo el estado
export function setStatus(id, status) {
  return colServices.doc(id).update({ status });
}

// ---- helpers de cálculo (para KPIs) ----

// servicios de una fecha (YYYY-MM-DD)
export function servicesOfDate(date) {
  return SVC.filter(s => s.date === date);
}

// próximo servicio a partir de ahora
export function nextService() {
  const now = new Date();
  const todayStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const upcoming = SVC
    .filter(s => {
      if (s.status === 'Cancelado' || s.status === 'Completado' || s.status === 'No Show') return false;
      if (s.date > todayStr) return true;
      if (s.date === todayStr && s.time) {
        const [h, m] = s.time.split(':').map(Number);
        return (h * 60 + m) >= nowMin;
      }
      return false;
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return upcoming[0] || null;
}

// ingresos de una fecha (suma de costos)
export function incomeOfDate(date) {
  return servicesOfDate(date)
    .filter(s => s.status !== 'Cancelado' && s.status !== 'No Show')
    .reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
}

// conteo de los últimos N días
export function countLastDays(n) {
  const today = new Date();
  let count = 0;
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
    count += servicesOfDate(ds).length;
  }
  return count;
}
