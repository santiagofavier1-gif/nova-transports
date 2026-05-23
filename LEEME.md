# Nova Transports — Versión Premium COMPLETA ✅

Reconstrucción completa con diseño premium responsive (celular + compu)
y TODAS las funciones de tu app anterior.

## ✅ Todo lo que incluye (igual que tu app vieja, pero premium)

- **Dashboard** con datos reales en vivo: servicios hoy, ingresos, próximo servicio, últimos 7 días, línea del día (timeline) y mapa de servicios.
- **Servicios**: lista en tarjetas (celular) o grid (compu), buscador, filtros por estado, exportar a Excel.
- **Nuevo / Editar servicio**: formulario completo con cálculo de precio por Google Maps.
- **Detalle de servicio**: ver todo, cambiar entre los 7 estados (con historial), editar.
- **Calendario** mensual con servicios marcados por color de estado.
- **Cotización**: con tarifa fija o Google Maps, y generación de PDF idéntico al tuyo.
- **Sala de Directivos / Reportes** (admin): facturación por rango, desglose por pago, PDF ejecutivo.
- **Colaboradores** (admin): expedientes de personal con todos sus datos.
- **Modo claro/oscuro**, navegación inferior en celular, sidebar fijo en compu.
- Conectado a TU mismo Firebase → mismos datos, nada se pierde.

## 🔑 Acceso (los mismos de siempre)
- Front Desk: `recepcion` / `1234`
- Admin: `admin` / `admin2024`

---

## 📤 Cómo subirlo a GitHub (la subida final)

1. Descarga `nova-transports.zip` y descomprímelo (doble clic en tu Mac).
2. Entra a tu repo en GitHub → carpeta `nova-transports`.
3. "Add file" → "Upload files".
4. Arrastra TODO el contenido de la carpeta descomprimida (las carpetas
   `styles`, `services`, `utils`, `components`, `pages` y los archivos
   `index.html`, `app.js`), manteniendo la estructura.
5. Commit changes.
6. Espera 2-3 minutos y abre en tu celular: `novatransports.github.io/nova-transports/`

> Esto sobrescribe los archivos viejos del diseño nuevo, pero tu app original
> `nova_transports_FIREBASE.html` sigue intacta como respaldo.

## ⚠️ MUY IMPORTANTE: prueba antes de borrar lo viejo

Tu app vieja sigue disponible en:
`novatransports.github.io/nova-transports/nova_transports_FIREBASE.html`

**Prueba a fondo la nueva** (login, crear un servicio, cambiar estado,
generar un PDF, ver el mapa, los reportes). Cuando confirmes que TODO
funciona igual o mejor, recién entonces puedes borrar el archivo viejo.

## 📁 Estructura del proyecto
```
nova-transports/
├── index.html          (punto de entrada)
├── app.js              (orquestador)
├── styles/   → tokens, base, layout, components
├── services/ → firebase, config, auth, services, maps, colaboradores
├── utils/    → format, dom, pdf, excel
├── components/→ drawer, bottom-nav, modal, service-form,
│                service-detail, timeline, map-widget
└── pages/    → dashboard, servicios, calendario, cotizacion,
                reportes, colaboradores
```

## 🎨 Para el futuro
Todo el diseño sale de `styles/tokens.css`. Cambiar un color ahí lo
actualiza en toda la app. Las secciones Clientes, Choferes, Vehículos y
Usuarios están en el menú marcadas como "pronto" para una próxima etapa.
