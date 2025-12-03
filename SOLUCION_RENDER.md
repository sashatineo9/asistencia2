# 🔧 SOLUCIÓN INMEDIATA: Error de Render

## ⚠️ El Problema

Render está ejecutando `gunicorn app:app` (Python) en lugar de `npm start` (Node.js).

**Esto significa que el servicio en Render Dashboard todavía tiene la configuración antigua de Python guardada.**

## ✅ SOLUCIÓN PASO A PASO

### Opción 1: Cambiar Configuración en Render Dashboard (RECOMENDADO)

1. **Ve a Render Dashboard**
   - Abre https://dashboard.render.com
   - Inicia sesión

2. **Encuentra tu servicio**
   - Busca el servicio `asistencias-cpfp-6` (o el nombre que le diste)
   - Haz clic en él

3. **Ve a Settings (Configuración)**
   - En el menú lateral izquierdo, haz clic en **Settings**

4. **Cambia el Runtime**
   - Busca la sección **Environment**
   - Busca el campo **Runtime** o **Environment**
   - **CÁMBIALO de `Python` a `Node`**
   
5. **Cambia los comandos**
   - Busca **Build Command**
   - Cámbialo a: `npm install && npm run build`
   - Busca **Start Command**
   - Cámbialo a: `npm start`

6. **Guarda los cambios**
   - Haz clic en **Save Changes** (botón azul abajo)

7. **Haz un nuevo deploy**
   - Ve a la pestaña **Events** o **Logs**
   - Haz clic en **Manual Deploy** → **Deploy latest commit**
   - O simplemente espera a que Render detecte los cambios automáticamente

### Opción 2: Eliminar y Recrear el Servicio (Si la Opción 1 no funciona)

1. **Elimina el servicio actual**
   - En Render Dashboard, ve a tu servicio
   - Ve a **Settings**
   - Desplázate hasta abajo
   - Haz clic en **Delete Service**
   - Confirma la eliminación

2. **Crea un nuevo servicio**
   - Haz clic en **New** → **Web Service**
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `asistencia2`

3. **Configuración del nuevo servicio**
   - **Name**: `asistencias-cpfp-6`
   - **Region**: Elige la más cercana
   - **Branch**: `main` o `master` (la que uses)
   - **Root Directory**: (deja vacío)
   - **Runtime**: **SELECCIONA `Node`** ⚠️ IMPORTANTE
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Variables de entorno**
   - Agrega todas las variables de entorno necesarias:
     ```
     NODE_ENV=production
     NEXTAUTH_URL=https://tu-app.onrender.com
     NEXTAUTH_SECRET=tu-secret
     GOOGLE_CLIENT_ID=tu-client-id
     GOOGLE_CLIENT_SECRET=tu-secret
     GOOGLE_SHEETS_SPREADSHEET_ID=tu-sheet-id
     GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-email
     GOOGLE_PRIVATE_KEY="tu-clave-completa"
     ```

5. **Crea el servicio**
   - Haz clic en **Create Web Service**
   - Espera a que termine el build

## 🔍 Verificación

Después de hacer los cambios, los logs deberían mostrar:

```
==> Installing Node version...
==> Running 'npm install'
==> Running 'npm run build'
==> Running 'npm start'
```

**NO deberías ver:**
```
==> Installing Python version...
==> Running 'gunicorn'
```

## 📝 Notas Importantes

1. **Si usas `render.yaml`**: Render debería leerlo automáticamente, pero a veces la configuración en Dashboard tiene prioridad. Por eso es importante cambiarla manualmente.

2. **Archivos en GitHub**: Asegúrate de que estos archivos NO estén en tu repositorio:
   - ❌ `Procfile`
   - ❌ `requirements.txt`
   - ❌ `app.yaml`

3. **Archivos que SÍ deben estar**:
   - ✅ `package.json`
   - ✅ `render.yaml`
   - ✅ `next.config.js`

## 🚨 Si Aún No Funciona

1. **Verifica que los archivos estén eliminados de GitHub**:
   ```bash
   git rm Procfile requirements.txt app.yaml 2>/dev/null || true
   git commit -m "Remove Python configuration files"
   git push origin main
   ```

2. **Espera unos minutos** después de hacer los cambios en Render

3. **Revisa los logs** en Render Dashboard para ver qué está pasando

4. **Contacta a Render Support** si el problema persiste

---

**Después de seguir estos pasos, tu aplicación debería desplegarse correctamente con Node.js! 🎉**

