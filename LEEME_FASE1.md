# Nova Transports — Fase 1 (Cimientos premium)

## ✅ Qué incluye esta fase

- Estructura de carpetas modular (`/styles`, `/services`, `/utils`, `/components`)
- Sistema de diseño completo (dark emerald luxury) en `tokens.css`
- Login premium con glassmorphism
- Shell responsive: header compacto + sidebar drawer + bottom navigation
- Navegación funcionando entre secciones
- Modo claro/oscuro con el botón ☀️/🌙
- Conectado a TU mismo Firebase (proyecto `nova-transports`) → tus datos intactos
- Optimizado para iPhone/Android (área segura, touch, sin zoom indeseado)

> Las páginas todavía muestran placeholders. Los datos reales (servicios,
> KPIs, timeline, mapa) y las tablas-a-tarjetas llegan en **Fase 2**.

---

## 📤 Cómo subirlo a GitHub (importante)

A diferencia de antes (un solo archivo), ahora subes una **carpeta completa**.
**No borres tu archivo viejo todavía** — primero prueba que esto funcione.

### Opción A — Probar primero sin tocar lo viejo (recomendado)
1. En tu repo de GitHub, entra a la carpeta `nova-transports/` (donde está tu HTML actual).
2. Sube TODOS los archivos de esta carpeta nueva, **manteniendo la estructura de carpetas**:
   - `index.html`
   - `app.js`
   - carpeta `styles/` (con sus 4 archivos)
   - carpeta `services/` (con sus 3 archivos)
   - carpeta `utils/` (con sus 2 archivos)
   - carpeta `components/` (con sus 2 archivos)
3. GitHub te tomará unos minutos en publicar.
4. Abre en tu celular: `https://novatransports.github.io/nova-transports/`
   (el `index.html` se abre solo, no hay que ponerlo en la URL)
5. Haz **Cmd+Shift+R** (o recarga fuerte en el móvil) para evitar caché.

### Importante sobre la estructura
Los archivos DEBEN quedar en sus carpetas. Si subes todo "aplastado" en una
sola carpeta, los `import` no van a encontrar los archivos. La estructura es:

```
nova-transports/
├── index.html
├── app.js
├── styles/    (tokens, base, layout, components)
├── services/  (firebase, config, auth)
├── utils/     (format, dom)
└── components/(drawer, bottom-nav)
```

### Cuando confirmes que funciona
Una vez que pruebes el login, la navegación, el modo oscuro y que se ve bien
en tu celular, ya puedes borrar el archivo viejo `nova_transports_FIREBASE.html`.
Pero **solo cuando estés seguro.**

---

## 🔑 Datos de acceso (los mismos de siempre)
- Front Desk: `recepcion` / `1234`
- Admin: `admin` / `admin2024`

---

## 🎨 Cambiar colores (para el futuro)
Todo el diseño sale de `styles/tokens.css`. Si algún día quieres ajustar el
verde, el negro, el spacing, etc., solo cambias ahí y se actualiza en toda la app.
