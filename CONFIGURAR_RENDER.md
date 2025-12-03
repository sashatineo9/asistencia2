# 🚨 CONFIGURAR RENDER - PASO A PASO

## ⚠️ PROBLEMA ACTUAL

Render está usando `yarn start` y no ejecuta el build. Necesitas cambiar la configuración manualmente en Render Dashboard.

---

## ✅ SOLUCIÓN EN 3 PASOS

### PASO 1: Cambiar Build Command y Start Command

1. **Ve a Render Dashboard**: https://dashboard.render.com
2. **Abre tu servicio** `asistencia2-4e76`
3. **Click en "Settings"** (menú lateral izquierdo)
4. **Busca la sección "Build & Deploy"**
5. **CAMBIA estos valores:**

   **Build Command:**
   ```
   npm install && npm run build
   ```
   
   **Start Command:**
   ```
   npm start
   ```

6. **Haz click en "Save Changes"** (botón azul abajo)

### PASO 2: Agregar Variables de Entorno

1. **En el mismo Settings**, busca la sección **"Environment"** (o ve a la pestaña "Environment")
2. **Elimina estas variables si existen** (ya no se necesitan):
   - ❌ `GOOGLE_CLIENT_ID`
   - ❌ `GOOGLE_CLIENT_SECRET`

3. **Agrega estas 6 variables** (click en "Add Environment Variable" para cada una):

   **Variable 1:**
   - Key: `NODE_ENV`
   - Value: `production`
   - Click "Save"

   **Variable 2:**
   - Key: `NEXTAUTH_URL`
   - Value: `https://asistencia2-4e76.onrender.com`
   - Click "Save"

   **Variable 3:**
   - Key: `NEXTAUTH_SECRET`
   - Value: Genera uno ejecutando en tu terminal:
     ```bash
     openssl rand -base64 32
     ```
     Copia el resultado completo y pégalo aquí
   - Click "Save"

   **Variable 4:**
   - Key: `GOOGLE_SHEETS_SPREADSHEET_ID`
   - Value: El ID de tu Google Sheet (de la URL, entre `/d/` y `/edit`)
   - Click "Save"

   **Variable 5:**
   - Key: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Value: El email del service account (formato: `xxxxx@proyecto.iam.gserviceaccount.com`)
   - Click "Save"

   **Variable 6:**
   - Key: `GOOGLE_PRIVATE_KEY`
   - Value: La clave privada completa del JSON del service account
     - Debe empezar y terminar con comillas dobles: `"`
     - Debe incluir `\n` literalmente (no saltos de línea reales)
     - Ejemplo: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`
   - Click "Save"

### PASO 3: Hacer Deploy

1. **Ve a la pestaña "Events"** (o "Logs")
2. **Haz click en "Manual Deploy"** → **"Deploy latest commit"**
3. **Espera 5-10 minutos** mientras se ejecuta el build

---

## ✅ VERIFICACIÓN

Después del deploy, los logs deberían mostrar:

```
==> Installing Node version...
==> Running 'npm install'
==> Running 'npm run build'
==> Build completed
==> Running 'npm start'
✓ Ready in X.Xs
```

**NO deberías ver:**
```
==> Running 'yarn start'
Error: Could not find a production build
❌ Variables de entorno faltantes
```

---

## 🚨 SI AÚN NO FUNCIONA

### Opción A: Eliminar y Recrear el Servicio

1. **Elimina el servicio actual**:
   - Settings → Scroll hasta abajo → "Delete Service"

2. **Crea uno nuevo**:
   - New → Web Service
   - Conecta GitHub
   - Selecciona tu repositorio
   - **Configuración:**
     - Name: `asistencias-cpfp-6`
     - Runtime: **Node** (NO Python)
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Agrega todas las variables de entorno (Paso 2)
   - Create Web Service

### Opción B: Verificar que el Código Esté Actualizado

Asegúrate de que el código esté en GitHub:

```bash
git add .
git commit -m "Fix: Update auth to use credentials, remove Google OAuth"
git push origin main
```

---

## 📋 CHECKLIST FINAL

Antes de hacer deploy, verifica:

- [ ] Build Command = `npm install && npm run build`
- [ ] Start Command = `npm start`
- [ ] Runtime = `Node` (NO Python)
- [ ] `NODE_ENV` = `production`
- [ ] `NEXTAUTH_URL` = Tu URL exacta
- [ ] `NEXTAUTH_SECRET` = Generado con openssl
- [ ] `GOOGLE_SHEETS_SPREADSHEET_ID` = ID del Sheet
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` = Email del service account
- [ ] `GOOGLE_PRIVATE_KEY` = Clave privada con formato correcto
- [ ] `GOOGLE_CLIENT_ID` eliminada (si existía)
- [ ] `GOOGLE_CLIENT_SECRET` eliminada (si existía)

---

**El código está correcto. Solo necesitas cambiar la configuración en Render Dashboard siguiendo estos pasos.**

