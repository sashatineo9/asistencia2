# 🔧 Solución: Error "Application error: a server-side exception has occurred"

## ❌ El Problema

La aplicación muestra un error del servidor al cargar. Esto generalmente ocurre por:

1. **Variables de entorno faltantes o incorrectas**
2. **Error en la inicialización de Google Sheets**
3. **Error en NextAuth**
4. **Credenciales de Google mal configuradas**

## ✅ Solución Paso a Paso

### Paso 1: Verificar Variables de Entorno en Render

Ve a Render Dashboard → Tu Servicio → **Environment** y verifica que TODAS estas variables estén configuradas:

```
✅ NODE_ENV=production
✅ NEXTAUTH_URL=https://tu-app.onrender.com
✅ NEXTAUTH_SECRET=tu-secret-generado
✅ GOOGLE_CLIENT_ID=tu-client-id
✅ GOOGLE_CLIENT_SECRET=tu-client-secret
✅ GOOGLE_SHEETS_SPREADSHEET_ID=tu-spreadsheet-id
✅ GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
✅ GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave completa\n-----END PRIVATE KEY-----\n"
```

### Paso 2: Verificar Formato de GOOGLE_PRIVATE_KEY

**IMPORTANTE**: `GOOGLE_PRIVATE_KEY` debe tener este formato exacto:

```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

- Debe empezar y terminar con comillas dobles `"`
- Debe incluir `\n` literalmente (no saltos de línea reales)
- Debe incluir `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`

### Paso 3: Verificar NEXTAUTH_URL

La URL debe ser **exactamente** la URL de tu aplicación en Render:
- Ejemplo: `https://asistencias-cpfp-6.onrender.com`
- **NO** debe tener `/` al final
- **NO** debe tener `http://` (debe ser `https://`)

### Paso 4: Verificar Logs en Render

1. Ve a Render Dashboard → Tu Servicio → **Logs**
2. Busca errores que mencionen:
   - "Variables de entorno faltantes"
   - "Google Sheets credentials not configured"
   - "Failed to initialize"
   - "NEXTAUTH_SECRET"

### Paso 5: Verificar Google Cloud Configuration

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Verifica que:
   - El **OAuth Client** tenga la URL correcta en "Authorized redirect URIs"
   - El **Service Account** tenga permisos de Editor en el Google Sheet
   - Las **APIs** estén habilitadas (Google Sheets API, Google Drive API)

### Paso 6: Regenerar NEXTAUTH_SECRET

Si el error persiste, regenera el secret:

```bash
openssl rand -base64 32
```

Copia el resultado y actualízalo en Render Dashboard.

### Paso 7: Revisar el Google Sheet

1. Abre tu Google Sheet
2. Verifica que esté compartido con el email del Service Account
3. El Service Account debe tener permisos de **Editor**

## 🔍 Verificación Rápida

Ejecuta estos comandos localmente para verificar que todo funciona:

```bash
# Verificar que las variables estén en .env.local
cat .env.local

# Probar el build
npm run build

# Probar localmente
npm start
```

## 🐛 Errores Comunes y Soluciones

### Error: "Google Sheets credentials not configured"
- **Solución**: Verifica que `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY` estén configuradas

### Error: "NEXTAUTH_SECRET is missing"
- **Solución**: Agrega `NEXTAUTH_SECRET` en Render Dashboard

### Error: "Invalid redirect URI"
- **Solución**: Verifica que la URL en Google Cloud coincida exactamente con `NEXTAUTH_URL`

### Error: "Spreadsheet not found"
- **Solución**: Verifica que el Sheet esté compartido con el Service Account

## 📝 Checklist de Verificación

- [ ] Todas las variables de entorno están configuradas en Render
- [ ] `GOOGLE_PRIVATE_KEY` tiene el formato correcto (con comillas y `\n`)
- [ ] `NEXTAUTH_URL` es la URL correcta de Render (sin `/` al final)
- [ ] El Google Sheet está compartido con el Service Account
- [ ] Las APIs están habilitadas en Google Cloud
- [ ] El OAuth Client tiene las URLs correctas
- [ ] Los logs en Render no muestran errores de inicialización

## 🚀 Después de Corregir

1. **Guarda los cambios** en Render Dashboard
2. **Haz un nuevo deploy**:
   - Events → Manual Deploy → Deploy latest commit
3. **Espera 2-3 minutos** para que se reinicie
4. **Prueba la aplicación** nuevamente

---

**Si el problema persiste después de seguir estos pasos, revisa los logs en Render Dashboard para ver el error específico.**

