// ============================================================
// NOVA TRANSPORTS · pages/reportes.js
// Sala de Directivos: facturación por rango de fechas.
// Solo admin. Misma lógica que genReport.
// ============================================================

import { $, esc, toast } from '../utils/dom.js';
import { today, fmtMoney, fmtDate } from '../utils/format.js';
import { getServices } from '../services/services.js';
import { isAdmin } from '../services/auth.js';

export function renderReportes() {
  const view = $('#view');

  if (!isAdmin()) {
    view.innerHTML = `
      <div class="empty fade-up">
        <i class="ti ti-lock"></i>
        <div class="empty-title">Acceso restringido</div>
        <div class="empty-text">La Sala de Directivos es solo para administradores.</div>
      </div>`;
    return;
  }

  // por defecto: del primer día del mes a hoy
  const tdy = today();
  const firstOfMonth = tdy.slice(0, 8) + '01';

  view.innerHTML = `
    <div class="fade-up">
      <div class="card" style="margin-bottom:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div class="field" style="margin:0">
            <label class="field-label">Desde</label>
            <input class="input" id="rep-from" type="date" value="${firstOfMonth}">
          </div>
          <div class="field" style="margin:0">
            <label class="field-label">Hasta</label>
            <input class="input" id="rep-to" type="date" value="${tdy}">
          </div>
        </div>
        <button class="btn btn-primary btn-block" id="rep-go">
          <i class="ti ti-chart-bar"></i> Generar reporte
        </button>
      </div>
      <div id="rep-results"></div>
    </div>
  `;

  $('#rep-go').addEventListener('click', generate);
  generate();   // generar de una vez con el rango por defecto
}

function generate() {
  const from = $('#rep-from').value;
  const to = $('#rep-to').value;
  const results = $('#rep-results');
  if (!from || !to) { toast('Selecciona rango de fechas', 'warn'); return; }

  const svcs = getServices().filter(s =>
    s.date >= from && s.date <= to && s.status === 'Completado');

  if (!svcs.length) {
    results.innerHTML = `
      <div class="empty">
        <i class="ti ti-chart-dots"></i>
        <div class="empty-title">Sin datos</div>
        <div class="empty-text">No hay servicios completados en ese rango.</div>
      </div>`;
    return;
  }

  const total = svcs.reduce((a, s) => a + (Number(s.cost) || 0), 0);
  const count = svcs.length;
  const avg = count ? total / count : 0;
  const activeDays = new Set(svcs.map(s => s.date)).size;

  // desglose por forma de pago
  const pay = {};
  svcs.forEach(s => { const p = s.payment || 'N/A'; pay[p] = (pay[p] || 0) + (Number(s.cost) || 0); });
  const payMax = Math.max(...Object.values(pay));
  const payRows = Object.entries(pay).sort((a, b) => b[1] - a[1]).map(e => {
    const pct = payMax ? Math.round(e[1] / payMax * 100) : 0;
    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
          <span style="color:var(--text-2)">${esc(e[0])}</span>
          <span style="font-weight:600;color:var(--text)">${fmtMoney(e[1])}</span>
        </div>
        <div style="background:var(--surface-3);border-radius:var(--r-full);height:7px;overflow:hidden">
          <div style="background:linear-gradient(90deg,var(--emerald),var(--emerald-br));height:7px;border-radius:var(--r-full);width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');

  results.innerHTML = `
    <div class="kpi-grid fade-up" style="margin-bottom:16px">
      <div class="kpi kpi-accent">
        <div class="kpi-label">Total facturado</div>
        <div class="kpi-value" style="font-size:24px">${fmtMoney(total)}</div>
      </div>
      <div class="kpi kpi-plain">
        <div class="kpi-label">Servicios</div>
        <div class="kpi-value">${count}</div>
        <div class="kpi-sub">completados</div>
      </div>
      <div class="kpi kpi-plain">
        <div class="kpi-label">Promedio</div>
        <div class="kpi-value" style="font-size:20px">${fmtMoney(avg)}</div>
        <div class="kpi-sub">por servicio</div>
      </div>
      <div class="kpi kpi-plain">
        <div class="kpi-label">Días activos</div>
        <div class="kpi-value" style="color:var(--emerald-br)">${activeDays}</div>
      </div>
    </div>

    <div class="card fade-up" style="animation-delay:.05s;margin-bottom:16px">
      <div style="font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--emerald-glow);margin-bottom:16px">
        <i class="ti ti-credit-card"></i> Por forma de pago
      </div>
      ${payRows}
    </div>

    <button class="btn btn-outline btn-block fade-up" id="rep-pdf" style="animation-delay:.1s">
      <i class="ti ti-file-download"></i> Descargar reporte PDF
    </button>
  `;

  $('#rep-pdf').addEventListener('click', () =>
    generateReportPDF({ from, to, total, count, avg, activeDays, pay, svcs }));
}

// PDF del reporte (diseño ejecutivo Nova)
function generateReportPDF({ from, to, total, count, avg, activeDays, pay }) {
  if (typeof window.jspdf === 'undefined') {
    toast('La librería de PDF no cargó', 'err'); return;
  }
  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const black = [10, 10, 10], gray = [100, 100, 100];

  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, 'F');
  doc.setFillColor(black[0], black[1], black[2]); doc.rect(0, 0, W, 30, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(255, 255, 255);
  doc.setCharSpace(3); doc.text('NOVA', 14, 16); doc.setCharSpace(0);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(180, 180, 180);
  doc.setCharSpace(1); doc.text('REPORTE EJECUTIVO', 14, 22);
  doc.text('EXECUTIVE REPORT', 14, 27); doc.setCharSpace(0);
  doc.setDrawColor(27, 107, 79); doc.setLineWidth(0.5); doc.line(0, 30, W, 30);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(black[0], black[1], black[2]);
  doc.text('REPORTE DE FACTURACIÓN', W / 2, 44, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text(fmtDate(from) + ' al ' + fmtDate(to), W / 2, 51, { align: 'center' });

  // tarjetas de resumen
  const cards = [
    ['TOTAL FACTURADO', fmtMoney(total)],
    ['SERVICIOS COMPLETADOS', String(count)],
    ['PROMEDIO POR SERVICIO', fmtMoney(avg)],
    ['DÍAS CON ACTIVIDAD', String(activeDays)]
  ];
  let cy = 62;
  cards.forEach((c, i) => {
    const x = i % 2 === 0 ? 14 : W / 2 + 2;
    if (i % 2 === 0 && i > 0) cy += 26;
    doc.setFillColor(248, 246, 241); doc.rect(x, cy, W / 2 - 16, 22, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setCharSpace(1); doc.text(c[0], x + 4, cy + 7); doc.setCharSpace(0);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(27, 107, 79);
    doc.text(c[1], x + 4, cy + 17);
  });

  // desglose de pagos
  let py = cy + 36;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.setCharSpace(1); doc.text('DESGLOSE POR FORMA DE PAGO', 14, py); doc.setCharSpace(0);
  doc.setDrawColor(black[0], black[1], black[2]); doc.setLineWidth(0.4); doc.line(14, py + 3, W - 14, py + 3);
  py += 11;
  Object.entries(pay).sort((a, b) => b[1] - a[1]).forEach(e => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(black[0], black[1], black[2]);
    doc.text(e[0], 14, py);
    doc.text(fmtMoney(e[1]), W - 14, py, { align: 'right' });
    py += 8;
  });

  // pie
  doc.setFillColor(black[0], black[1], black[2]); doc.rect(0, H - 14, W, 14, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.setCharSpace(2); doc.text('NOVA TRANSPORTS', W / 2, H - 7, { align: 'center' }); doc.setCharSpace(0);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(180, 180, 180);
  doc.text('Reporte confidencial · Uso interno · Guadalajara, México', W / 2, H - 3, { align: 'center' });

  doc.save('Reporte_Nova_' + from + '_a_' + to + '.pdf');
  toast('Reporte PDF generado', 'ok');
}
