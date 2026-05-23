// ============================================================
// NOVA TRANSPORTS · utils/pdf.js
// Generación del PDF de cotización.
// Portado fiel de genCotPDF (mismo diseño Nova).
// Requiere jsPDF cargado globalmente (window.jspdf).
// ============================================================

import { fmtDate, fmtMoney, today } from './format.js';
import { toast } from './dom.js';

// genera y descarga el PDF de cotización.
// data: { name, origin, dest, date, dateEnd, time, vehicle, flight, pax, payment, cost, notes, room, phone }
export function generateCotizacionPDF(data) {
  const {
    name, origin: ori, dest, date, dateEnd = '', time = '—',
    vehicle: veh, flight = '', pax = '1', payment: pay,
    cost = 0, notes = '', room = '', phone = ''
  } = data;

  if (!name) { toast('Ingresa el nombre del huésped', 'warn'); return; }
  if (typeof window.jspdf === 'undefined') {
    toast('La librería de PDF no cargó. Recarga la página.', 'err'); return;
  }

  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const black = [10, 10, 10], gray = [100, 100, 100];

  // fondo blanco
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, 'F');

  // barra negra superior
  doc.setFillColor(black[0], black[1], black[2]); doc.rect(0, 0, W, 30, 'F');

  // NOVA (izquierda)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(255, 255, 255);
  doc.setCharSpace(3); doc.text('NOVA', 14, 16); doc.setCharSpace(0);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(180, 180, 180);
  doc.setCharSpace(1); doc.text('TRANSPORTACION EJECUTIVA', 14, 22);
  doc.text('EXECUTIVE TRANSPORTATION', 14, 27); doc.setCharSpace(0);

  // línea esmeralda (antes azul)
  doc.setDrawColor(27, 107, 79); doc.setLineWidth(0.5); doc.line(0, 30, W, 30);

  // título
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(black[0], black[1], black[2]);
  doc.setCharSpace(0); doc.text('COTIZACION DE SERVICIO / SERVICE QUOTE', W / 2, 43, { align: 'center' });
  doc.setDrawColor(black[0], black[1], black[2]); doc.setLineWidth(0.4); doc.line(W / 2 - 55, 46, W / 2 + 55, 46);

  // folio y fecha
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text('Folio: COT-' + Date.now().toString().slice(-6), 14, 55);
  doc.text('Fecha / Date: ' + (date ? fmtDate(date) : fmtDate(today())), W - 14, 55, { align: 'right' });

  // caja de huésped
  doc.setFillColor(248, 246, 241); doc.rect(14, 60, W - 28, 26, 'F');
  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2); doc.rect(14, 60, W - 28, 26, 'S');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.setCharSpace(1.5); doc.text('HUESPED / GUEST', 18, 68); doc.setCharSpace(0);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(black[0], black[1], black[2]);
  doc.text(name, 18, 75);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(gray[0], gray[1], gray[2]);
  const gInfo = [];
  if (phone && phone.trim() && phone !== 'N/a' && phone !== 'N/A') gInfo.push('Tel: ' + phone);
  if (room && room.trim() && room !== 'N/a' && room !== 'N/A') gInfo.push('Hab: ' + room);
  if (flight && flight.trim()) gInfo.push('Vuelo / Flight: ' + flight);
  gInfo.push('Pax: ' + pax);
  if (gInfo.length) doc.text(gInfo.join('   '), 18, 82);

  // detalle del servicio
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.setCharSpace(1.5); doc.text('DETALLE DEL SERVICIO / SERVICE DETAILS', 14, 96); doc.setCharSpace(0);
  doc.setDrawColor(black[0], black[1], black[2]); doc.setLineWidth(0.5); doc.line(14, 99, W - 14, 99);

  let dateStr = date ? fmtDate(date) : 'Por confirmar';
  if (dateEnd && dateEnd !== date) dateStr = fmtDate(date) + ' al ' + fmtDate(dateEnd);
  const rows = [
    ['FECHA / DATE', dateStr, 'HORA / TIME', time],
    ['ORIGEN / PICKUP', ori, 'DESTINO / DROP-OFF', dest],
    ['VEHICULO / VEHICLE', veh, 'METODO DE PAGO / PAYMENT', pay]
  ];
  let y = 108;
  rows.forEach(row => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setCharSpace(0.8); doc.text(row[0], 14, y); doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(black[0], black[1], black[2]);
    doc.text(String(row[1]).substring(0, 32), 14, y + 6);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setCharSpace(0.8); doc.text(row[2], W / 2 + 5, y); doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(black[0], black[1], black[2]);
    doc.text(String(row[3]).substring(0, 32), W / 2 + 5, y + 6);
    doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.2); doc.line(14, y + 10, W - 14, y + 10);
    y += 15;
  });

  // caja de precio
  const py = y + 6;
  doc.setFillColor(black[0], black[1], black[2]); doc.rect(14, py, W - 28, 22, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.setCharSpace(1); doc.text('TARIFA DEL SERVICIO / SERVICE RATE', 18, py + 9); doc.setCharSpace(0);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(255, 255, 255);
  doc.text(fmtMoney(cost) + ' MXN', W - 18, py + 14, { align: 'right' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(180, 180, 180);
  doc.text('Precio IVA incluido / VAT included', 18, py + 18);

  // notas
  if (notes) {
    const ny = py + 30;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setCharSpace(0.8); doc.text('NOTAS / NOTES', 14, ny); doc.setCharSpace(0);
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2); doc.line(14, ny + 2, W - 14, ny + 2);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(50, 50, 50);
    const nl = doc.splitTextToSize(notes, W - 28); doc.text(nl, 14, ny + 8);
  }

  // términos
  const ty = 235;
  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2); doc.line(14, ty, W - 14, ty);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.setCharSpace(1); doc.text('TERMINOS Y CONDICIONES / TERMS & CONDITIONS', 14, ty + 7); doc.setCharSpace(0);
  const terms = [
    'El conductor le esperara en llegadas del aeropuerto con letrero del hotel. / Driver will meet you at arrivals with hotel sign.',
    'Para factura, solicitar dentro de 72 hrs con Constancia de Situacion Fiscal. / For invoice, request within 72 hrs.',
    'Cancelaciones hasta 48 hrs sin cargo. No-show o tardias: cargo del 100%. / Cancellations up to 48hrs free. No-show: 100% fee.',
    'Cargo a habitacion incluye comision del 10%. / Room charge includes 10% commission.',
    'El tipo de cambio puede diferir del bancario. / Exchange rate may differ from banking institutions.',
    'Precios IVA incluido. Cambios en pax o vehiculo pueden modificar tarifa. / VAT included. Changes may affect pricing.'
  ];
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
  terms.forEach((t, i) => doc.text('• ' + t, 14, ty + 14 + (i * 5.5)));

  // pie de página
  doc.setFillColor(black[0], black[1], black[2]); doc.rect(0, H - 14, W, 14, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.setCharSpace(2); doc.text('NOVA TRANSPORTS', W / 2, H - 7, { align: 'center' }); doc.setCharSpace(0);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(180, 180, 180);
  doc.text('Transportacion Ejecutiva  |  Executive Transportation  |  Guadalajara, Mexico', W / 2, H - 3, { align: 'center' });

  const fname = 'Cotizacion_' + name.replace(/\s+/g, '_') + '_' +
    (date ? fmtDate(date).replace(/\//g, '-') : today()) + '.pdf';
  doc.save(fname);
  toast('PDF generado', 'ok');
}
