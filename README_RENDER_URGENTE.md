# 🚨 URGENTE: Configurar Render Dashboard

## El Problema

Render está usando `yarn start` cuando debería usar `npm start`, y no ejecuta el build.

## ⚡ SOLUCIÓN RÁPIDA (3 minutos)

### 1. Ve a Render Dashboard
https://dashboard.render.com → Tu servicio

### 2. Settings → Build & Deploy
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Save Changes**

### 3. Settings → Environment
Agrega estas variables:
- `NODE_ENV` = `production`
- `NEXTAUTH_URL` = `https://asistencia2-4e76.onrender.com`
- `NEXTAUTH_SECRET` = (genera con: `openssl rand -base64 32`)
- `GOOGLE_SHEETS_SPREADSHEET_ID` = (tu sheet ID)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = (email del service account)
- `GOOGLE_PRIVATE_KEY` = `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`

### 4. Events → Manual Deploy

---

**El código está correcto. Solo necesitas cambiar la configuración en Render Dashboard.**

Ver `GUIA_RENDER_PASO_A_PASO.md` para instrucciones detalladas.

