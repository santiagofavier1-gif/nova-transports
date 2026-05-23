// ============================================================
// NOVA TRANSPORTS · services/maps.js
// Cálculo de distancia real con Google Maps → precio sugerido.
// Misma lógica que calcDistPrice de tu app actual.
// ============================================================

import { TARIFA_KM } from './config.js';

// agrega contexto de Guadalajara si no lo tiene (mejora la búsqueda)
function withContext(t) {
  return /jalisco|guadalajara|zapopan|tlaquepaque|gdl|mexico/i.test(t)
    ? t : t + ', Guadalajara, Jalisco';
}

// calcula distancia y precio sugerido.
// Devuelve una promesa con { km, durMin, precio, veh } o lanza error.
export function calcDistancePrice(origen, destino, vehiculo) {
  return new Promise((resolve, reject) => {
    if (!origen || !destino) {
      reject(new Error('Escribe origen y destino primero'));
      return;
    }
    const tar = TARIFA_KM[vehiculo] || TARIFA_KM['Sedan ejecutivo'];

    if (typeof google === 'undefined' || !google.maps || !google.maps.DistanceMatrixService) {
      reject(new Error('Google Maps no cargó. Revisa tu conexión o pon el precio a mano.'));
      return;
    }

    const svc = new google.maps.DistanceMatrixService();
    svc.getDistanceMatrix({
      origins: [withContext(origen)],
      destinations: [withContext(destino)],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    }, (resp, status) => {
      if (status !== 'OK' || !resp || !resp.rows || !resp.rows[0]) {
        reject(new Error('No se pudo calcular la ruta. Verifica las direcciones.'));
        return;
      }
      const el = resp.rows[0].elements[0];
      if (!el || el.status !== 'OK' || !el.distance) {
        reject(new Error('No se encontró una de las direcciones. Escríbela más completa.'));
        return;
      }
      const km = el.distance.value / 1000;
      const durMin = el.duration ? Math.round(el.duration.value / 60) : null;
      let precio = Math.round((tar.base + tar.km * km) / 10) * 10;
      if (precio < tar.min) precio = tar.min;
      resolve({ km, durMin, precio, veh: vehiculo });
    });
  });
}
