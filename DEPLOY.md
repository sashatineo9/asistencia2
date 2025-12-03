# 🌐 Guía de Deploy en Render

Esta guía te ayudará a desplegar tu aplicación en Render paso a paso.

## 📋 Pre-requisitos

- ✅ Proyecto funcionando localmente
- ✅ Cuenta en [Render](https://render.com) (gratis)
- ✅ Código subido a GitHub

## ⚠️ IMPORTANTE: Configuración Correcta

**Asegúrate de que:**
- ✅ NO existe `Procfile` en el repositorio (o está eliminado)
- ✅ NO existe `requirements.txt` en el repositorio (o está eliminado)
- ✅ Existe `render.yaml` con configuración de Node.js
- ✅ Existe `package.json` con los scripts correctos

## 🚀 Pasos para Deploy

### Paso 1: Subir código a GitHub

```bash
# Si aún no tienes git inicializado
git init
git add .
git commit -m "Initial commit: Asistencias CPFP N°6"

# Conecta con tu repositorio de GitHub
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

**💡 Tip**: Si no tienes repositorio, créalo en [GitHub](https://github.com/new)

### Paso 2: Crear servicio en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en **New** → **Web Service**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Selecciona tu repositorio
5. **Render debería detectar automáticamente que es un proyecto Node.js**

   Si NO lo detecta automáticamente, configura manualmente:

   **Configuración básica:**
   - **Name**: `asistencias-cpfp-6` (o el nombre que prefieras)
   - **Region**: Elige la más cercana (ej: `Oregon (US West)`)
   - **Branch**: `main` (o `master` si usas esa rama)
   - **Root Directory**: (deja vacío)
   - **Runtime**: `Node` ⚠️ **IMPORTANTE: Debe ser Node, NO Python**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

6. **NO hagas clic en "Create Web Service" todavía**

### Paso 3: Configurar variables de entorno

Antes de crear el servicio, configura las variables de entorno:

1. En la sección **Environment Variables**, haz clic en **Add Environment Variable**
2. Agrega cada una de estas variables:

```
NODE_ENV=production
NEXTAUTH_URL=https://tu-app.onrender.com
NEXTAUTH_SECRET=tu-secret-generado
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_SHEETS_SPREADSHEET_ID=tu-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave completa\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANTE:**
- `NEXTAUTH_URL` debe ser la URL que Render te dará (ej: `https://asistencias-cpfp-6.onrender.com`)
- `GOOGLE_PRIVATE_KEY` debe incluir las comillas dobles y los `\n` literalmente
- Puedes copiar los valores de tu `.env.local` (excepto `NEXTAUTH_URL`)

### Paso 4: Usar render.yaml (Opcional pero Recomendado)

Si tienes `render.yaml` en tu repositorio, Render lo usará automáticamente. Esto simplifica el proceso.

**Si usas render.yaml:**
- Solo necesitas configurar las variables de entorno en Render Dashboard
- El build command y start command ya están en el archivo

### Paso 5: Actualizar OAuth en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Edita tu **OAuth 2.0 Client ID**
4. En **Authorized JavaScript origins**, agrega:
   - `https://tu-app.onrender.com`
5. En **Authorized redirect URIs**, agrega:
   - `https://tu-app.onrender.com/api/auth/callback/google`
6. **Save**

### Paso 6: Crear el servicio

1. Vuelve a Render
2. Haz clic en **Create Web Service**
3. Espera a que termine el build (puede tardar 5-10 minutos)
4. Una vez completado, tu app estará disponible en `https://tu-app.onrender.com`

### Paso 7: Verificar el deploy

1. Abre la URL de tu aplicación
2. Deberías ver la pantalla de login
3. Prueba iniciar sesión con Google
4. Verifica que puedas crear cursos y tomar asistencias

## 🔄 Actualizar la aplicación

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Render detectará automáticamente los cambios y hará un nuevo deploy.

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'app'"

**Causa**: Render está detectando archivos de Python y ejecutando Flask en lugar de Next.js.

**Solución**:
1. Elimina `Procfile` si existe
2. Elimina `requirements.txt` si existe
3. Asegúrate de que `render.yaml` especifica `env: node`
4. En Render Dashboard, verifica que **Runtime** sea `Node`, NO `Python`
5. Vuelve a hacer deploy

### El build falla
- Revisa los logs en Render
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `package.json` tenga todas las dependencias
- Verifica que no haya errores de TypeScript (`npm run build` localmente)

### Error 502 Bad Gateway
- Espera unos minutos, puede estar iniciando
- Revisa los logs para ver errores específicos
- Verifica que `NEXTAUTH_URL` sea correcta

### "Invalid redirect URI"
- Verifica que la URL en Google Cloud coincida exactamente con la de Render
- Verifica que `NEXTAUTH_URL` en Render sea correcta
- Asegúrate de que no haya espacios o caracteres extra

### La app no guarda datos
- Verifica que el Sheet esté compartido con el service account
- Revisa los logs de Render para errores de API
- Verifica que `GOOGLE_PRIVATE_KEY` tenga el formato correcto (con `\n`)

### Render detecta Python en lugar de Node.js

**Solución rápida**:
1. Elimina estos archivos del repositorio:
   - `Procfile`
   - `requirements.txt`
   - `app.yaml` (si existe)
2. Asegúrate de que existe `package.json`
3. Asegúrate de que `render.yaml` tiene `env: node`
4. Haz commit y push:
   ```bash
   git add .
   git commit -m "Remove Python files, ensure Node.js config"
   git push origin main
   ```
5. En Render Dashboard, edita el servicio y cambia **Runtime** a `Node`

## 💰 Plan Gratuito de Render

El plan gratuito incluye:
- ✅ 750 horas de ejecución por mes
- ✅ Sleep después de 15 minutos de inactividad
- ✅ SSL automático
- ✅ Deploy automático desde GitHub

**Nota**: La primera vez que accedas después de que la app "duerma", puede tardar unos segundos en despertar.

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs en Render Dashboard
2. La consola del navegador (F12)
3. El archivo `README.md` para más información
4. Esta guía de solución de problemas

---

**¿Todavía tienes problemas?** Asegúrate de haber eliminado todos los archivos de Python y que Render esté configurado para Node.js.
