// ============================================================
// NOVA TRANSPORTS · services/config.js
// Credenciales de login, tarifas y constantes.
// (El login se queda en código, como decidiste — igual que hoy.)
// ============================================================

// ---- USUARIOS (mismos que tu app actual) ----
export const USERS = [
  { id: 'u1', name: 'Front Desk',    username: 'recepcion', password: '1234',      role: 'frontdesk', ini: 'FD' },
  { id: 'u2', name: 'Administrador', username: 'admin',     password: 'admin2024', role: 'admin',     ini: 'AD' }
];

// ---- ESTADOS DE SERVICIO (los 7) ----
export const ESTADOS = [
  'Solicitado', 'Confirmado', 'Chofer Asignado',
  'En Proceso', 'Completado', 'Cancelado', 'No Show'
];

// mapea estado → clase CSS de badge
export const BADGE_CLASS = {
  'Solicitado':      'badge-solicitado',
  'Confirmado':      'badge-confirmado',
  'Chofer Asignado': 'badge-chofer',
  'En Proceso':      'badge-proceso',
  'Completado':      'badge-completado',
  'Cancelado':       'badge-cancelado',
  'No Show':         'badge-noshow'
};

// ---- TARIFA POR KM (cálculo Google Maps) ----
export const TARIFA_KM = {
  'Sedan ejecutivo':    { base: 250, km: 28, min: 250 },
  'SUV ejecutiva':      { base: 400, km: 38, min: 450 },
  'Van de lujo':        { base: 500, km: 45, min: 600 },
  'Sprinter / Transit': { base: 700, km: 55, min: 900 }
};

// ---- API KEY de Google Maps (restringida a tu dominio) ----
export const GMAPS_KEY = 'AIzaSyB0re04XINyYJ0d5MbxXskmnuo4tAyV_-k';

export const TARIFAS = {
  // AEROPUERTO
  'Hotel - Aeropuerto': {sedan:1250, suburban:1850, van:2400},
  'Aeropuerto - Hotel': {sedan:1700, suburban:2400, van:2800},
  // DISPOSICION POR HORA
  'Disposicion por hora (min 3hrs)': {sedan:700, suburban:850, van:1000},
  // PAQUETES SIN GUIA
  'Centro Historico (paquete)': {sedan:2100, suburban:2950, van:3200},
  'Tlaquepaque / Tonala (paquete)': {sedan:2200, suburban:3100, van:3600},
  'Chapala / Ajijic / Jocotepec (paquete)': {sedan:3600, suburban:4600, van:5400},
  'Tequila / Guachimontones (paquete)': {sedan:3800, suburban:4750, van:5750},
  // ZONAS TURISTICAS
  'Centro Historico GDL': {sedan:500, suburban:700, van:850},
  'Basilica de Zapopan': {sedan:300, suburban:500, van:750},
  'Ferromex / J.Cuervo Express': {sedan:500, suburban:700, van:1000},
  'Trompo Magico': {sedan:450, suburban:650, van:750},
  'Parque Avila Camacho': {sedan:250, suburban:450, van:650},
  'Parque Metropolitano': {sedan:600, suburban:800, van:950},
  'Acuario Michin / Parque Alcalde': {sedan:450, suburban:650, van:800},
  'Zoologico GDL / Selva Magica': {sedan:600, suburban:800, van:950},
  'Zona Chapultepec': {sedan:300, suburban:500, van:700},
  'Zona Minerva': {sedan:300, suburban:500, van:600},
  'Zona Providencia': {sedan:200, suburban:450, van:650},
  'Zona Chapalita': {sedan:450, suburban:650, van:750},
  'Zona Punto Sao Paulo': {sedan:200, suburban:450, van:650},
  'Zona Expo / Plaza del Sol': {sedan:400, suburban:600, van:750},
  'Chapala / Ajijic / Jocotepec': {sedan:1750, suburban:2150, van:3500},
  'Tequila / Guachimontones': {sedan:2000, suburban:2400, van:3800},
  'Tlaquepaque': {sedan:650, suburban:950, van:1250},
  'Tonala': {sedan:750, suburban:1050, van:1350},
  'Edisa': {sedan:750, suburban:1000, van:1350},
  'Palcco / Japi / Tequila Lab': {sedan:450, suburban:650, van:750},
  'Andares': {sedan:350, suburban:550, van:650},
  // TEATROS Y ESPECTACULOS
  'Auditorio Telmex': {sedan:450, suburban:700, van:850},
  'Arena VFG': {sedan:1100, suburban:1650, van:1850},
  'Calle 2': {sedan:450, suburban:700, van:850},
  'Conjunto Santander (CAE - UdeG)': {sedan:450, suburban:700, van:850},
  'Palcco': {sedan:450, suburban:650, van:750},
  'Teatro Diana': {sedan:500, suburban:700, van:850},
  'Teatro Degollado': {sedan:500, suburban:700, van:850},
  'Teatro Galerias': {sedan:400, suburban:600, van:750},
  '3 de Marzo': {sedan:350, suburban:550, van:650},
  // RESTAURANTES
  'Sonora Grill Prime (Real Acueducto)': {sedan:350, suburban:550, van:650},
  'Sonora Grill La Rioja': {sedan:750, suburban:1100, van:1250},
  'Casa Bariachi': {sedan:300, suburban:500, van:600},
  'La Tequila / La Madalena / Mochomo': {sedan:350, suburban:550, van:600},
  'La I Latina / Anita Li': {sedan:350, suburban:550, van:650},
  'Santo Coyote Lerdo de Tejada': {sedan:400, suburban:600, van:700},
  'Santo Coyote Real': {sedan:450, suburban:650, van:750},
  'Zona Andares (restaurantes)': {sedan:350, suburban:550, van:600},
  'Alcalde / La Matera / Polanco': {sedan:300, suburban:500, van:600},
  'Carnes Garibaldi / Xokol': {sedan:250, suburban:450, van:600},
  // TERRAZAS Y SALONES
  'Barberini': {sedan:700, suburban:850, van:950},
  'Benasuza / La Escoba / La Magdalena': {sedan:800, suburban:1000, van:1100},
  'Lago del Rey': {sedan:650, suburban:850, van:950},
  'Benavento': {sedan:800, suburban:1000, van:1100},
  'Hda. Santa Lucia': {sedan:850, suburban:1050, van:1150},
  'Hacienda La Chabacana': {sedan:800, suburban:1000, van:1100},
  'La Gotera': {sedan:800, suburban:1000, van:1100},
  'Viveros San Miguel': {sedan:900, suburban:1100, van:1300},
  'La Fresneda': {sedan:300, suburban:500, van:600},
  // CENTROS DEPORTIVOS
  'Arena Coliseo': {sedan:450, suburban:650, van:750},
  'Estadio 3 de Marzo': {sedan:350, suburban:550, van:650},
  'Estadio Akron': {sedan:600, suburban:800, van:950},
  'Estadio de los Charros': {sedan:400, suburban:600, van:700},
  'Estadio Jalisco': {sedan:500, suburban:700, van:800},
  'Centro Acuatico': {sedan:600, suburban:800, van:950},
  'Club de Atlas Colomos': {sedan:300, suburban:500, van:600},
  'Club de Atlas Aeropuerto': {sedan:950, suburban:1200, van:1300},
  'Club de Golf Santa Anita': {sedan:750, suburban:950, van:1100},
  'El Cielo': {sedan:850, suburban:1050, van:1150},
  'Country Club': {sedan:200, suburban:450, van:600},
  'El Rio Country Club': {sedan:1100, suburban:1300, van:1400},
  'Las Canadas': {sedan:650, suburban:850, van:950},
  'Rancho Contento': {sedan:750, suburban:950, van:950},
  // CENTRAL DE AUTOBUSES
  'Central Nueva Tlaquepaque': {sedan:700, suburban:900, van:1000},
  'Central Centro Sur': {sedan:750, suburban:1000, van:1350},
  'Central Zapopan / Terminal Nuevo Milenio': {sedan:600, suburban:800, van:900},
  'Central Vieja': {sedan:450, suburban:650, van:750},
  // PLAZAS
  'Plaza Galerias': {sedan:500, suburban:700, van:800},
  'La Gran Plaza': {sedan:400, suburban:600, van:700},
  'Plazas Outlet': {sedan:850, suburban:1050, van:1150},
  'La Gourmeteria / El Palomar': {sedan:700, suburban:900, van:1000},
  'Real Center': {sedan:450, suburban:650, van:750},
  'Punto Sao Paulo / Midtown': {sedan:200, suburban:450, van:600},
  'Plaza Andares': {sedan:350, suburban:550, van:650},
  'La Perla / Plaza del Sol': {sedan:400, suburban:600, van:700},
  // HOTELES
  'Hotel Riu': {sedan:300, suburban:500, van:700},
  'Camino Real': {sedan:400, suburban:600, van:700},
  'Hotel Demetria': {sedan:350, suburban:550, van:650},
  'Quinta Real': {sedan:300, suburban:500, van:600},
  'Westin / Zona Expo': {sedan:400, suburban:600, van:700},
  // CONSULADOS
  'Consulado Americano': {sedan:300, suburban:500, van:600},
  'CAS Centro de Atencion': {sedan:300, suburban:500, van:600},
  'Consulado Aleman': {sedan:550, suburban:750, van:850},
  'Consulado Nuevo': {sedan:300, suburban:500, van:600},
  // ESCUELAS
  'IPADE': {sedan:1100, suburban:1300, van:1400},
  'ITESO': {sedan:700, suburban:900, van:1350},
  'Tec de Monterrey': {sedan:550, suburban:750, van:850},
  'UAG': {sedan:350, suburban:550, van:650},
  // PARQUES INDUSTRIALES
  'Flextronics Norte': {sedan:550, suburban:750, van:850},
  'Flextronics Sur': {sedan:750, suburban:950, van:1050},
  'Jabil / Zona Belenes': {sedan:500, suburban:700, van:800},
  'Sanmina Corp Planta 1': {sedan:850, suburban:1050, van:1150},
  'Sanmina Planta 2/3 Carretera Chapala': {sedan:1000, suburban:1300, van:1200},
  'IBM / Honda / Hersheys / Zona El Salto': {sedan:950, suburban:1200, van:1300},
  'Technology Park': {sedan:700, suburban:900, van:1000},
  // HOSPITALES
  'Puerta de Hierro Andares': {sedan:350, suburban:550, van:650},
  'Hospital Puerta de Hierro Sur': {sedan:750, suburban:950, van:1050},
  'Hospital Real San Jose Chapalita': {sedan:350, suburban:550, van:750},
  'Hospital Real San Jose Zona Real': {sedan:450, suburban:650, van:750},
  'Hospital San Javier': {sedan:250, suburban:450, van:550}
};

export const DESTINOS = Object.keys(TARIFAS);
