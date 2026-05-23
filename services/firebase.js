// ============================================================
// NOVA TRANSPORTS · services/firebase.js
// Inicializa Firebase y exporta la referencia a Firestore.
// USA LA MISMA CONFIG QUE TU APP ACTUAL → mismos datos, nada se pierde.
// ============================================================

// Firebase SDK 9 (compat) cargado vía CDN en index.html como `firebase` global.

const firebaseConfig = {
  apiKey: "AIzaSyBQEg-RNt36L2ibgmO6wHrQ0rmlv1z-a00",
  authDomain: "nova-transports.firebaseapp.com",
  projectId: "nova-transports",
  storageBucket: "nova-transports.firebasestorage.app",
  messagingSenderId: "950283139818",
  appId: "1:950283139818:web:0aef9c973ca6222b377593"
};

// Inicializar (solo una vez)
if (!window.firebase.apps.length) {
  window.firebase.initializeApp(firebaseConfig);
}

export const db = window.firebase.firestore();

// Modo offline: la app funciona sin internet y sincroniza al reconectar.
db.enablePersistence({ synchronizeTabs: true }).catch(() => {
  // si falla (varias pestañas abiertas), no pasa nada, sigue online
});

// Referencias a las colecciones que ya existen
export const colServices = db.collection('services');
export const colColaboradores = db.collection('colaboradores');
export const colDevices = db.collection('devices');
