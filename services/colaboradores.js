// ============================================================
// NOVA TRANSPORTS · services/colaboradores.js
// CRUD de la colección "colaboradores" (expedientes de personal).
// Misma lógica que loadColabs / saveColab.
// ============================================================

import { colColaboradores } from './firebase.js';

let COLABS = [];

// cargar todos (ordenados por nombre)
export function loadColaboradores() {
  return colColaboradores.orderBy('name').get().then(snap => {
    COLABS = snap.docs.map(d => { const o = d.data(); o.id = d.id; return o; });
    return COLABS;
  }).catch(() => { return COLABS; });
}

export function getColaboradores() { return COLABS; }
export function getColaborador(id) { return COLABS.find(c => c.id === id) || null; }

// guardar (crear o actualizar)
export function saveColaborador(data, id = null) {
  const ref = id ? colColaboradores.doc(id) : colColaboradores.doc();
  return ref.set(data);
}
