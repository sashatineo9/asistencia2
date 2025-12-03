# 🚨 LEE ESTO PRIMERO - SOLUCIÓN RÁPIDA

## El problema

Render Dashboard está usando configuración antigua:
- ❌ Usa `yarn start` (debe ser `npm start`)
- ❌ Falta `NEXTAUTH_SECRET`

## La solución (5 minutos)

### 1️⃣ Abre Render Dashboard

Ve a: **https://dashboard.render.com** → Tu servicio

### 2️⃣ Cambia los comandos

**Settings** → **Build & Deploy**:

```
Build Command: npm install && npm run build
Start Command: npm start
```

**⚠️ IMPORTANTE**: Click en **"Save Changes"** (botón azul abajo)

### 3️⃣ Agrega NEXTAUTH_SECRET

**Settings** → **Environment** → **Add Environment Variable**:

- **Key**: `NEXTAUTH_SECRET`
- **Value**: Genera uno con PowerShell:

```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

O usa este generador online: **https://generate-secret.vercel.app/32**

- Click **"Save"**

### 4️⃣ Verifica otras variables

Asegúrate de tener estas 6 variables:

- ✅ `NODE_ENV` = `production`
- ✅ `NEXTAUTH_URL` = `https://asistencia2-4e76.onrender.com` (tu URL)
- ✅ `NEXTAUTH_SECRET` = (el que acabas de generar)
- ✅ `GOOGLE_SHEETS_SPREADSHEET_ID` = (tu sheet ID)
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL` = (email del service account)
- ✅ `GOOGLE_PRIVATE_KEY` = (clave privada con formato correcto)

### 5️⃣ Haz deploy

**Events** → **Manual Deploy** → **Deploy latest commit**

---

## ✅ Verificación

Después del deploy, los logs deben mostrar:

```
==> Running 'npm install'
==> Running 'npm run build'
==> Running 'npm start'
```

**NO debe aparecer:**
- `==> Running 'yarn start'`
- `[next-auth][error][NO_SECRET]`

---

## 📚 Documentos detallados

- **`SOLUCION_DEFINITIVA.md`** - Guía completa paso a paso
- **`CHECKLIST_RENDER.md`** - Lista de verificación
- **`RESUMEN_URGENTE.txt`** - Resumen rápido

---

**El código está correcto. Solo necesitas cambiar la configuración en Render Dashboard.**

