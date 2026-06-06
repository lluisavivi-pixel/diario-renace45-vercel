# Diario Renace 45+ · Vercel Edition

React + Vite SPA. Sin SSR, sin TanStack Start, sin Cloudflare Workers.
Persistencia 100% en localStorage. Compatible con Vercel + iframe Webflow.

## Stack
- React 18 + TypeScript
- Vite 5
- Recharts (gráficas)
- jsPDF (exportación PDF)
- localStorage (persistencia)

## Desarrollo local

```bash
npm install
npm run dev
```

## Build y deploy

```bash
npm run build
# genera /dist — sube a Vercel
```

## Configuración Vercel
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Variables de entorno (opcionales)
```
VITE_WISHPOND_API_KEY=
VITE_WISHPOND_API_SECRET=
VITE_WISHPOND_ACCOUNT_ID=
```
Si no se configuran, el EmailGate funciona en modo no-op local.

## Webflow iframe embed

```html
<iframe
  src="https://diario.trampoflow.com/"
  style="width:100%;border:0;display:block;"
  height="1200"
  loading="lazy"
  title="Diario Renace 45+">
</iframe>
```

## Dominio personalizado
Apuntar `diario.trampoflow.com` → Vercel (DNS CNAME).
Necesario para que localStorage funcione en Safari/iPhone dentro del iframe.

## trampoflow.com
