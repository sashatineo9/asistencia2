# 🔍 Solución de Debugging - Render Dashboard

## Si ya cambiaste la configuración y sigue sin funcionar

### Paso 1: Verificar Diagnóstico

1. Ve a tu aplicación en Render: `https://asistencia2-4e76.onrender.com/debug`
2. Esta página te mostrará **exactamente** qué variables están configuradas
3. Toma una captura de pantalla de lo que muestra

### Paso 2: Verificar en Render Dashboard

1. Ve a **Render Dashboard** → Tu Servicio → **Settings** → **Environment**
2. **Verifica que TODAS estas variables existan:**
   - `NODE_ENV` = `production`
   - `NEXTAUTH_URL` = `https://asistencia2-4e76.onrender.com`
   - `NEXTAUTH_SECRET` = (debe tener un valor)
   - `GOOGLE_SHEETS_SPREADSHEET_ID` = (debe tener un valor)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = (debe tener un valor)
   - `GOOGLE_PRIVATE_KEY` = (debe tener un valor)

3. **IMPORTANTE**: Si alguna variable tiene espacios extra o caracteres raros, **bórrala y créala de nuevo**

### Paso 3: Verificar Build y Start Commands

1. **Settings** → **Build & Deploy**
2. **Build Command** debe ser exactamente: `npm install && npm run build`
3. **Start Command** debe ser exactamente: `npm start`
4. **Runtime** debe ser: `Node` (NO Python)

### Paso 4: Eliminar Cache y Re-Deploy

1. **Settings** → Scroll hasta abajo → **Clear build cache**
2. Click en **"Clear cache"**
3. **Events** → **Manual Deploy** → **Deploy latest commit**
4. Espera 5-10 minutos

### Paso 5: Verificar Logs

Después del deploy, en **Logs**, deberías ver:

```
==> Installing Node version...
==> Running 'npm install'
==> Running 'npm run build'
==> Build completed
==> Running 'npm start'
```

**NO deberías ver:**
- `==> Running 'yarn start'`
- `Error: Could not find a production build`

---

## Problemas Comunes

### Problema 1: Render sigue usando yarn

**Solución:**
1. Elimina el servicio completamente
2. Crea uno nuevo desde cero
3. Al crear, asegúrate de seleccionar **Runtime: Node**
4. Configura Build Command y Start Command manualmente

### Problema 2: Variables no se guardan

**Solución:**
1. Borra todas las variables
2. Agrega una por una
3. Después de cada una, haz click en **"Save"**
4. Verifica que aparezcan en la lista

### Problema 3: NEXTAUTH_SECRET tiene formato incorrecto

**Solución:**
1. Genera uno nuevo con PowerShell:
   ```powershell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
   ```
2. Copia el resultado COMPLETO (sin espacios)
3. Pégalo en Render Dashboard
4. NO agregues comillas ni espacios extra

### Problema 4: GOOGLE_PRIVATE_KEY tiene formato incorrecto

**Solución:**
1. Debe incluir las comillas dobles y `\n` literalmente:
   ```
   "-----BEGIN PRIVATE KEY-----\n...tu clave aquí...\n-----END PRIVATE KEY-----\n"
   ```
2. Copia EXACTAMENTE como está en el JSON del service account
3. Si tiene `\n` en el JSON, mantenlos así (no los conviertas a saltos de línea reales)

---

## Si NADA funciona

### Opción Final: Recrear el Servicio

1. **Elimina el servicio actual:**
   - Settings → Scroll hasta abajo → **Delete Service** → Confirma

2. **Crea uno nuevo:**
   - Dashboard → **New** → **Web Service**
   - Conecta GitHub
   - Selecciona tu repositorio
   - **Configuración:**
     - Name: `asistencias-cpfp-6`
     - Runtime: **Node** ⚠️ (NO Python)
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Agrega las 6 variables de entorno ANTES de crear
   - **Create Web Service**

---

## Verificación Final

1. Ve a `/debug` en tu aplicación
2. Todas las variables deben mostrar ✅
3. La aplicación debe cargar sin errores
4. Debes poder hacer login

---

**Si después de todo esto sigue sin funcionar, comparte:**
- Captura de pantalla de `/debug`
- Captura de pantalla de Render Dashboard → Environment
- Últimos 50 líneas de los Logs de Render

