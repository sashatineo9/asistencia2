# ✅ Checklist de Configuración

Usa esta lista para asegurarte de que todo esté configurado correctamente.

## 📋 Antes de Empezar

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Cuenta de Google creada
- [ ] Cuenta de Google Cloud Platform creada
- [ ] Cuenta de Render creada (para deploy)

## 🔧 Configuración Local

### Instalación
- [ ] Proyecto clonado/descargado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto se ejecuta sin errores (`npm run dev`)

### Google Cloud Platform
- [ ] Proyecto creado en Google Cloud
- [ ] Service Account creado
- [ ] JSON del Service Account descargado
- [ ] Google Sheets API habilitada
- [ ] Google Drive API habilitada (si es necesario)
- [ ] OAuth 2.0 Client creado
- [ ] Consent screen configurado
- [ ] URLs de redirección configuradas

### Google Sheet
- [ ] Sheet creado
- [ ] Sheet compartido con service account
- [ ] Permisos de Editor otorgados
- [ ] ID del Sheet copiado

### Variables de Entorno
- [ ] Archivo `.env.local` creado
- [ ] `NEXTAUTH_URL` configurado
- [ ] `NEXTAUTH_SECRET` generado
- [ ] `GOOGLE_CLIENT_ID` configurado
- [ ] `GOOGLE_CLIENT_SECRET` configurado
- [ ] `GOOGLE_SHEETS_SPREADSHEET_ID` configurado
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` configurado
- [ ] `GOOGLE_PRIVATE_KEY` configurado (con formato correcto)

## ✅ Pruebas Locales

### Funcionalidad Básica
- [ ] Login con Google funciona
- [ ] Dashboard se carga correctamente
- [ ] Puedo crear un curso
- [ ] Puedo agregar alumnos
- [ ] Puedo tomar asistencia
- [ ] La asistencia se guarda correctamente
- [ ] Puedo ver el calendario
- [ ] Puedo ver reportes
- [ ] Puedo exportar a CSV

### Validaciones
- [ ] Los formularios validan campos requeridos
- [ ] Los mensajes de error se muestran correctamente
- [ ] Las confirmaciones funcionan (eliminar curso, etc.)
- [ ] Los estados de carga se muestran

## 🌐 Deploy en Render

### Preparación
- [ ] Código subido a GitHub
- [ ] Repositorio público o privado configurado
- [ ] `.env.local` NO está en el repositorio

### Configuración en Render
- [ ] Servicio Web creado en Render
- [ ] Repositorio conectado
- [ ] Build command configurado: `npm install && npm run build`
- [ ] Start command configurado: `npm start`
- [ ] Todas las variables de entorno configuradas
- [ ] `NEXTAUTH_URL` actualizado con URL de Render

### Google Cloud (Producción)
- [ ] URLs de producción agregadas a OAuth Client
- [ ] Redirect URI de producción configurado

### Verificación Post-Deploy
- [ ] La aplicación carga en Render
- [ ] Login funciona en producción
- [ ] Puedo crear cursos en producción
- [ ] Las asistencias se guardan en producción
- [ ] No hay errores en los logs de Render

## 🐛 Solución de Problemas

Si algo no funciona, verifica:

- [ ] Los logs en la consola del navegador (F12)
- [ ] Los logs en Render Dashboard
- [ ] Que todas las variables de entorno estén correctas
- [ ] Que las APIs estén habilitadas en Google Cloud
- [ ] Que el Sheet esté compartido correctamente
- [ ] Que las URLs de redirección coincidan exactamente

## 📚 Documentación

- [ ] README.md leído
- [ ] SETUP.md seguido
- [ ] DEPLOY.md consultado (si aplica)
- [ ] QUICK_START.md revisado (si aplica)

---

**¿Todo marcado?** ¡Tu sistema debería estar funcionando perfectamente! 🎉

Si tienes problemas, revisa la sección de "Solución de Problemas" en el README.md.

