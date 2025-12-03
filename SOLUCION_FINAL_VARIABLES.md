# 🚨 SOLUCIÓN URGENTE: Variables de Entorno Faltantes

## ❌ El Error

Los logs muestran claramente:
```
❌ Variables de entorno faltantes: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL
[next-auth][error][NO_SECRET] Please define a 'secret' in production.
```

**Esto significa que las variables de entorno NO están configuradas en Render Dashboard.**

## ✅ SOLUCIÓN INMEDIATA (5 minutos)

### Paso 1: Ir a Render Dashboard

1. Ve a https://dashboard.render.com
2. Haz clic en tu servicio `asistencia2-4e76` (o el nombre que tenga)
3. En el menú lateral, haz clic en **Environment** (o **Settings** → **Environment**)

### Paso 2: Agregar TODAS las Variables de Entorno

Haz clic en **Add Environment Variable** y agrega cada una:

#### Variable 1: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Add**

#### Variable 2: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://asistencia2-4e76.onrender.com` (TU URL EXACTA)
- **Add**

#### Variable 3: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Genera uno con este comando (ejecuta en tu terminal):
  ```bash
  openssl rand -base64 32
  ```
  Copia el resultado y pégalo como valor
- **Add**

#### Variable 4: GOOGLE_CLIENT_ID
- **Key**: `GOOGLE_CLIENT_ID`
- **Value**: Tu Client ID de Google Cloud (formato: `xxxxx.apps.googleusercontent.com`)
- **Add**

#### Variable 5: GOOGLE_CLIENT_SECRET
- **Key**: `GOOGLE_CLIENT_SECRET`
- **Value**: Tu Client Secret de Google Cloud
- **Add**

#### Variable 6: GOOGLE_SHEETS_SPREADSHEET_ID
- **Key**: `GOOGLE_SHEETS_SPREADSHEET_ID`
- **Value**: El ID de tu Google Sheet (de la URL, entre `/d/` y `/edit`)
- **Add**

#### Variable 7: GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Key**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value**: El email del service account (formato: `xxxxx@proyecto.iam.gserviceaccount.com`)
- **Add**

#### Variable 8: GOOGLE_PRIVATE_KEY
- **Key**: `GOOGLE_PRIVATE_KEY`
- **Value**: La clave privada completa del JSON del service account
  - Debe incluir las comillas: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
  - Debe tener `\n` literalmente (no saltos de línea reales)
- **Add**

### Paso 3: Cambiar de Yarn a NPM

1. Ve a **Settings** → **Build & Deploy**
2. Busca **Build Command**
3. Cámbialo a: `npm ci && npm run build`
4. Busca **Start Command**
5. Cámbialo a: `npm start`
6. Haz clic en **Save Changes**

### Paso 4: Hacer Deploy

1. Ve a **Events** (o **Logs**)
2. Haz clic en **Manual Deploy** → **Deploy latest commit**
3. Espera 3-5 minutos

## 🔍 Verificación

Después del deploy, los logs deberían mostrar:
```
==> Running 'npm ci'
==> Running 'npm run build'
==> Running 'npm start'
✓ Ready in X.Xs
```

**NO deberías ver:**
```
❌ Variables de entorno faltantes
[next-auth][error][NO_SECRET]
==> Running 'yarn start'
```

## 📝 Notas Importantes

1. **NEXTAUTH_URL**: Debe ser EXACTAMENTE la URL de tu app (sin `/` al final)
2. **GOOGLE_PRIVATE_KEY**: Debe tener comillas dobles y `\n` literalmente
3. **NEXTAUTH_SECRET**: Debe ser un string largo (32+ caracteres)
4. Todas las variables son **case-sensitive** (mayúsculas/minúsculas importan)

## 🚨 Si No Tienes los Valores

### Generar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Obtener Google OAuth Credentials:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Busca tu **OAuth 2.0 Client ID**
4. Copia **Client ID** y **Client Secret**

### Obtener Service Account:
1. En Google Cloud Console → **Credentials**
2. Busca tu **Service Account**
3. Haz clic en él → **Keys** → Descarga el JSON
4. Del JSON, copia:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (con formato correcto)

### Obtener Spreadsheet ID:
1. Abre tu Google Sheet
2. Mira la URL: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
3. El ID es: `ABC123XYZ`

---

**Después de agregar todas las variables y cambiar a npm, tu aplicación debería funcionar correctamente! 🎉**

