# 🚨 SOLUCIÓN DEFINITIVA - Render Dashboard

## ⚠️ PROBLEMAS ACTUALES

1. ❌ Render usa `yarn start` (debe ser `npm start`)
2. ❌ Falta `NEXTAUTH_SECRET` en variables de entorno
3. ❌ El build no se ejecuta

---

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Abrir Render Dashboard

1. Ve a: **https://dashboard.render.com**
2. Inicia sesión
3. En la lista de servicios, busca: **`asistencia2-4e76`**
4. **Haz clic en el nombre del servicio**

### PASO 2: Cambiar Build y Start Commands

1. En el menú lateral izquierdo, haz clic en: **"Settings"**
2. Desplázate hasta: **"Build & Deploy"**
3. Busca el campo: **"Build Command"**
   - **BORRA** todo lo que tenga
   - **ESCRIBE**: `npm install && npm run build`
4. Busca el campo: **"Start Command"**
   - **BORRA** todo lo que tenga
   - **ESCRIBE**: `npm start`
5. **IMPORTANTE**: Haz clic en el botón **"Save Changes"** (azul, abajo)

### PASO 3: Agregar Variables de Entorno

1. En la misma página de Settings, busca: **"Environment"** (o haz clic en la pestaña "Environment")
2. **ELIMINA estas variables si existen** (click en el ícono de basura 🗑️):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

3. **AGREGA estas 6 variables** (click en "Add Environment Variable" para cada una):

   **Variable 1: NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`
   - Click "Save"

   **Variable 2: NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://asistencia2-4e76.onrender.com`
   - Click "Save"

   **Variable 3: NEXTAUTH_SECRET** ⚠️ **IMPORTANTE**
   - Key: `NEXTAUTH_SECRET`
   - Value: Usa una de estas opciones:
     
     **Opción A - PowerShell (Windows):**
     ```powershell
     [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
     ```
     
     **Opción B - Node.js:**
     ```bash
     node generar-secret.js
     ```
     
     **Opción C - Online:**
     Ve a: https://generate-secret.vercel.app/32
     
     **Opción D - Manual:**
     Usa cualquier string largo, ejemplo:
     `mi-secret-super-seguro-para-asistencias-cpfp-2024-xyz123abc456def789ghi012`
   
   - Copia el resultado y pégalo en Value
   - Click "Save"

   **Variable 4: GOOGLE_SHEETS_SPREADSHEET_ID**
   - Key: `GOOGLE_SHEETS_SPREADSHEET_ID`
   - Value: ID de tu Google Sheet (de la URL, entre `/d/` y `/edit`)
   - Click "Save"

   **Variable 5: GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Key: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Value: Email del service account (del JSON)
   - Click "Save"

   **Variable 6: GOOGLE_PRIVATE_KEY**
   - Key: `GOOGLE_PRIVATE_KEY`
   - Value: Clave privada completa con formato:
     ```
     "-----BEGIN PRIVATE KEY-----\n...tu clave aquí...\n-----END PRIVATE KEY-----\n"
     ```
     (con comillas dobles y `\n` literalmente)
   - Click "Save"

### PASO 4: Hacer Deploy

1. Ve a la pestaña: **"Events"** (o "Logs")
2. Haz clic en: **"Manual Deploy"**
3. Selecciona: **"Deploy latest commit"**
4. **Espera 5-10 minutos**

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
[next-auth][error][NO_SECRET]
```

---

## 🚨 SI AÚN NO FUNCIONA

### Eliminar y Recrear el Servicio

1. **Elimina el servicio actual**:
   - Settings → Scroll hasta abajo → "Delete Service" → Confirma

2. **Crea uno nuevo**:
   - Dashboard → "New" → "Web Service"
   - Conecta GitHub
   - Selecciona tu repositorio
   - **Configuración:**
     - Name: `asistencias-cpfp-6`
     - Runtime: **Node** ⚠️ (NO Python)
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Agrega las 6 variables de entorno
   - "Create Web Service"

---

**El código está correcto. Solo necesitas cambiar la configuración en Render Dashboard siguiendo estos pasos exactamente.**

