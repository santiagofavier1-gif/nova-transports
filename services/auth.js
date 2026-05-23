// ============================================================
// NOVA TRANSPORTS · services/auth.js
// Login / logout / roles. Misma lógica que tu app actual.
// ============================================================

import { USERS } from './config.js';

let currentUser = null;

// intentar login con usuario + contraseña
export function login(username, password) {
  const u = USERS.find(x =>
    x.username === username.trim() && x.password === password
  );
  if (u) {
    currentUser = u;
    // recordar sesión en este dispositivo
    try { localStorage.setItem('nova_user', u.id); } catch (e) {}
    return u;
  }
  return null;
}

export function logout() {
  currentUser = null;
  try { localStorage.removeItem('nova_user'); } catch (e) {}
}

export function getUser() { return currentUser; }

// ¿es admin?
export function isAdmin() {
  return currentUser && currentUser.role === 'admin';
}

// ¿tiene acceso general (admin o frontdesk)?
export function canAccess() {
  return currentUser && (currentUser.role === 'admin' || currentUser.role === 'frontdesk');
}

// restaurar sesión guardada (si la hay)
export function restoreSession() {
  try {
    const id = localStorage.getItem('nova_user');
    if (id) {
      const u = USERS.find(x => x.id === id);
      if (u) { currentUser = u; return u; }
    }
  } catch (e) {}
  return null;
}
