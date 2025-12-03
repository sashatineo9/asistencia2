# 🚨 SOLUCIÓN URGENTE: Dos Problemas en Render

## ❌ Problema 1: Render usa Yarn en lugar de NPM

Los logs muestran:
```
==> Running 'yarn start'
```

**Solución**: Cambiar configuración en Render Dashboard

## ❌ Problema 2: Variables de Entorno Faltantes

Los logs muestran:
```
❌ Variables de entorno faltantes: NEXTAUTH_SECRET, NEXTAUTH_URL
[next-auth][error][NO_SECRET]
```

**Solución**: Agregar variables en Render Dashboard

---

## ✅ SOLUCIÓN COMPLETA (5 minutos)

### Paso 1: Ir a Render Dashboard

1. Ve a https://dashboard.render.com
2. Abre tu servicio `asistencia2-4e76`
3. Ve a **Settings** (menú lateral)

### Paso 2: Cambiar de Yarn a NPM

1. En Settings, busca la sección **Build & Deploy**
2. **Build Command**: Cámbialo a `npm ci && npm run build`
3. **Start Command**: Cámbialo a `npm start`
4. Haz clic en **Save Changes**

### Paso 3: Agregar Variables de Entorno

1. Ve a **Environment** (o Settings → Environment)
2. Haz clic en **Add Environment Variable**

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
- **Value**: Genera uno ejecutando en tu terminal:
  ```bash
  openssl rand -base64 32
  ```
  Copia el resultado y pégalo aquí
- **Add**

#### Variable 4: GOOGLE_SHEETS_SPREADSHEET_ID
- **Key**: `GOOGLE_SHEETS_SPREADSHEET_ID`
- **Value**: ID de tu Google Sheet
- **Add**

#### Variable 5: GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Key**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value**: Email del service account
- **Add**

#### Variable 6: GOOGLE_PRIVATE_KEY
- **Key**: `GOOGLE_PRIVATE_KEY`
- **Value**: Clave privada completa con formato:
  ```
  "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  ```
  (con comillas y \n literalmente)
- **Add**

### Paso 4: Eliminar Variables Antiguas (Si Existen)

Si ves estas variables, **ELIMÍNALAS** (ya no se necesitan):
- ❌ `GOOGLE_CLIENT_ID`
- ❌ `GOOGLE_CLIENT_SECRET`

### Paso 5: Hacer Deploy

1. Ve a **Events** (o **Logs**)
2. Haz clic en **Manual Deploy** → **Deploy latest commit**
3. Espera 3-5 minutos

## ✅ Verificación

Después del deploy, los logs deberían mostrar:
```
==> Running 'npm ci'
==> Running 'npm run build'
==> Running 'npm start'
✓ Ready in X.Xs
```

**NO deberías ver:**
```
==> Running 'yarn start'
❌ Variables de entorno faltantes
[next-auth][error][NO_SECRET]
```

## 📋 Checklist Final

- [ ] Build Command cambiado a: `npm ci && npm run build`
- [ ] Start Command cambiado a: `npm start`
- [ ] `NODE_ENV` = `production`
- [ ] `NEXTAUTH_URL` = Tu URL exacta de Render
- [ ] `NEXTAUTH_SECRET` = Generado con openssl
- [ ] `GOOGLE_SHEETS_SPREADSHEET_ID` = ID del Sheet
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` = Email del service account
- [ ] `GOOGLE_PRIVATE_KEY` = Clave privada con formato correcto
- [ ] Variables `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` eliminadas (si existían)

---

**Después de seguir estos pasos, tu aplicación debería funcionar correctamente! 🎉**

