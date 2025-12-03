# ✅ Checklist: Configurar Render Dashboard

Usa esta lista para verificar que todo esté configurado correctamente.

## 📋 Build & Deploy

- [ ] **Build Command** = `npm install && npm run build`
- [ ] **Start Command** = `npm start`
- [ ] **Runtime** = `Node` (NO Python)
- [ ] Click en **"Save Changes"**

## 🔐 Variables de Entorno

- [ ] `NODE_ENV` = `production`
- [ ] `NEXTAUTH_URL` = `https://asistencia2-4e76.onrender.com` (tu URL exacta)
- [ ] `NEXTAUTH_SECRET` = (generado con PowerShell, Node.js o online)
- [ ] `GOOGLE_SHEETS_SPREADSHEET_ID` = (ID del Sheet)
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` = (email del service account)
- [ ] `GOOGLE_PRIVATE_KEY` = (clave privada con formato correcto)

## ❌ Variables Eliminadas

- [ ] `GOOGLE_CLIENT_ID` eliminada (si existía)
- [ ] `GOOGLE_CLIENT_SECRET` eliminada (si existía)

## 🚀 Deploy

- [ ] Click en "Manual Deploy" → "Deploy latest commit"
- [ ] Esperando 5-10 minutos

## ✅ Verificación Post-Deploy

- [ ] Los logs muestran: `==> Running 'npm install'`
- [ ] Los logs muestran: `==> Running 'npm run build'`
- [ ] Los logs muestran: `==> Running 'npm start'`
- [ ] Los logs NO muestran: `==> Running 'yarn start'`
- [ ] Los logs NO muestran: `[next-auth][error][NO_SECRET]`
- [ ] La aplicación carga sin errores

---

**Si todos los items están marcados, tu aplicación debería funcionar! 🎉**

