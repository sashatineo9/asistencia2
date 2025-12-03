# 🚨 GUÍA PASO A PASO PARA CONFIGURAR RENDER

## ⚠️ PROBLEMA ACTUAL

Render está usando `yarn start` y no ejecuta el build. **DEBES cambiar la configuración manualmente en Render Dashboard.**

---

## 📋 PASO A PASO (Sigue exactamente estos pasos)

### PASO 1: Abrir Render Dashboard

1. Ve a: https://dashboard.render.com
2. Inicia sesión
3. En la lista de servicios, busca y haz clic en: **`asistencia2-4e76`** (o el nombre que tenga)

### PASO 2: Cambiar Build Command y Start Command

1. En el menú lateral izquierdo, haz clic en: **"Settings"**
2. Desplázate hasta la sección: **"Build & Deploy"**
3. Busca el campo: **"Build Command"**
4. **BORRA** lo que tenga y escribe exactamente:
   ```
   npm install && npm run build
   ```
5. Busca el campo: **"Start Command"**
6. **BORRA** lo que tenga y escribe exactamente:
   ```
   npm start
   ```
7. **IMPORTANTE**: Haz clic en el botón **"Save Changes"** (azul, abajo a la derecha)

### PASO 3: Verificar Runtime

1. En la misma página de Settings, busca: **"Environment"** o **"Runtime"**
2. Asegúrate de que diga: **"Node"** (NO Python)
3. Si dice "Python", cámbialo a "Node"

### PASO 4: Agregar Variables de Entorno

1. En Settings, busca la sección: **"Environment Variables"** (o haz clic en la pestaña "Environment")
2. **ELIMINA estas variables si existen** (click en el ícono de basura):
   - ❌ `GOOGLE_CLIENT_ID`
   - ❌ `GOOGLE_CLIENT_SECRET`

3. **AGREGA estas 6 variables** (click en "Add Environment Variable" para cada una):

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
   - Value: Genera uno usando una de estas opciones:
     
     **Opción A (PowerShell en Windows):**
     ```powershell
     [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
     ```
     
     **Opción B (Node.js):**
     ```bash
     node generar-secret.js
     ```
     (O ejecuta: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
     
     **Opción C (Online):**
     Ve a: https://generate-secret.vercel.app/32
     
     Copia TODO el resultado y pégalo en el campo Value
   - Click "Save"

   **Variable 4:**
   - Key: `GOOGLE_SHEETS_SPREADSHEET_ID`
   - Value: El ID de tu Google Sheet
     - Abre tu Google Sheet
     - Mira la URL: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
     - El ID es: `ABC123XYZ` (copia solo esa parte)
   - Click "Save"

   **Variable 5:**
   - Key: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Value: El email del service account
     - Está en el JSON que descargaste de Google Cloud
     - Formato: `xxxxx@proyecto.iam.gserviceaccount.com`
   - Click "Save"

   **Variable 6:**
   - Key: `GOOGLE_PRIVATE_KEY`
   - Value: La clave privada completa
     - Abre el JSON del service account
     - Copia el campo `private_key` COMPLETO
     - Debe incluir las comillas: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
     - Los `\n` deben ser literales (no saltos de línea reales)
   - Click "Save"

### PASO 5: Hacer Deploy

1. Ve a la pestaña: **"Events"** (o "Logs")
2. Haz clic en el botón: **"Manual Deploy"**
3. Selecciona: **"Deploy latest commit"**
4. **Espera 5-10 minutos** mientras se ejecuta el build

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
```

---

## 🚨 SI AÚN NO FUNCIONA

### Opción: Eliminar y Recrear el Servicio

1. **Elimina el servicio actual**:
   - Settings → Scroll hasta abajo → "Delete Service" → Confirma

2. **Crea uno nuevo**:
   - Dashboard → "New" → "Web Service"
   - Conecta GitHub (si no lo has hecho)
   - Selecciona tu repositorio
   - **Configuración:**
     - Name: `asistencias-cpfp-6`
     - Region: `Oregon (US West)` (o la más cercana)
     - Branch: `main` o `master`
     - Runtime: **Node** ⚠️ IMPORTANTE
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Agrega todas las 6 variables de entorno (Paso 4)
   - Click "Create Web Service"

---

## 📝 NOTAS IMPORTANTES

1. **NO uses yarn** - Solo npm
2. **El build DEBE ejecutarse** antes del start
3. **Todas las variables son obligatorias**
4. **GOOGLE_PRIVATE_KEY** debe tener comillas y `\n` literalmente

---

**Después de seguir estos pasos exactamente, tu aplicación debería funcionar! 🎉**

