# 🚀 Guía Rápida de Configuración

Esta guía te llevará paso a paso para tener el sistema funcionando en menos de 15 minutos.

## ⚡ Inicio Rápido (5 pasos)

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Configurar Google Cloud (10 minutos)

#### 2.1 Crear Service Account
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo (o usa uno existente)
3. **APIs & Services** → **Credentials** → **Create Credentials** → **Service Account**
4. Nombre: `asistencias-cpfp` → **Create and Continue** → **Done**
5. Click en el service account creado → **Keys** → **Add Key** → **Create new key** → **JSON**
6. **Descarga el archivo JSON** (lo necesitarás después)

#### 2.2 Habilitar APIs
1. **APIs & Services** → **Library**
2. Busca y habilita: **Google Sheets API**
3. Busca y habilita: **Google Drive API**

#### 2.3 Crear OAuth Client
1. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
2. Si te pide configurar consent screen:
   - **User Type**: External → **Create**
   - **App name**: Asistencias CPFP N°6
   - **User support email**: tu email
   - **Developer contact**: tu email
   - **Save and Continue** → **Save and Continue** → **Back to Dashboard**
3. **Create Credentials** → **OAuth client ID**
4. **Application type**: Web application
5. **Name**: Asistencias Web Client
6. **Authorized JavaScript origins**:
   - `http://localhost:3000`
7. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
8. **Create** → **Copia el Client ID y Client Secret**

#### 2.4 Crear Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea un nuevo Sheet
3. **Compartir** (botón superior derecho)
4. Agrega el email del service account (está en el JSON que descargaste, campo `client_email`)
5. Dale permisos de **Editor**
6. **Copia el ID del Sheet** de la URL:
   - URL ejemplo: `https://docs.google.com/spreadsheets/d/ABC123XYZ456/edit`
   - El ID es: `ABC123XYZ456`

### Paso 3: Configurar variables de entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```env
# 1. NextAuth (genera un secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera-uno-con-openssl-rand-base64-32

# 2. Google OAuth (del paso 2.3)
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# 3. Google Sheets (del paso 2.1 y 2.4)
GOOGLE_SHEETS_SPREADSHEET_ID=ABC123XYZ456
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCopia toda la clave privada del JSON\n-----END PRIVATE KEY-----\n"
```

**💡 Tips:**
- Para `NEXTAUTH_SECRET`: ejecuta `openssl rand -base64 32` en tu terminal
- Para `GOOGLE_PRIVATE_KEY`: abre el JSON descargado, copia el campo `private_key` completo (incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`)
- Mantén las comillas dobles y los `\n` en `GOOGLE_PRIVATE_KEY`

### Paso 4: Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y deberías ver la pantalla de login.

### Paso 5: Probar el sistema

1. Haz clic en "Iniciar sesión con Google"
2. Autoriza la aplicación
3. Crea tu primer curso
4. Agrega algunos alumnos
5. Toma una asistencia

## ✅ Verificación

Si todo está bien configurado, deberías poder:
- ✅ Iniciar sesión con Google
- ✅ Ver el dashboard
- ✅ Crear un curso
- ✅ Agregar alumnos
- ✅ Guardar asistencias

## 🐛 Problemas Comunes

### "No autorizado" al crear curso
- Verifica que el Sheet esté compartido con el service account
- Verifica que `GOOGLE_SERVICE_ACCOUNT_EMAIL` sea correcto

### "Invalid credentials" en login
- Verifica que las URLs de redirección estén correctas en Google Cloud
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos

### Error al guardar en Sheets
- Verifica que `GOOGLE_PRIVATE_KEY` tenga el formato correcto (con `\n`)
- Verifica que las APIs estén habilitadas

## 📦 Deploy en Render

Ver el archivo `DEPLOY.md` para instrucciones detalladas de deploy.

