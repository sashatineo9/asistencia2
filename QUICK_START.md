# ⚡ Inicio Super Rápido (5 minutos)

Si solo quieres probar el sistema rápidamente, sigue estos pasos:

## 1️⃣ Instalar

```bash
npm install
```

## 2️⃣ Configurar Google Cloud (3 minutos)

### A. Service Account
1. [Google Cloud Console](https://console.cloud.google.com/) → Nuevo proyecto
2. **APIs & Services** → **Credentials** → **Create Credentials** → **Service Account**
3. Crea y descarga el JSON
4. **APIs & Services** → **Library** → Habilita **Google Sheets API**

### B. OAuth Client
1. **Credentials** → **Create Credentials** → **OAuth client ID**
2. Configura consent screen (solo una vez)
3. Crea OAuth client (Web application)
4. Agrega: `http://localhost:3000` y `http://localhost:3000/api/auth/callback/google`

### C. Google Sheet
1. Crea un nuevo Sheet
2. Compártelo con el email del service account (del JSON)
3. Copia el ID del Sheet de la URL

## 3️⃣ Variables de Entorno

Crea `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-secret
GOOGLE_SHEETS_SPREADSHEET_ID=tu-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=email-del-json
GOOGLE_PRIVATE_KEY="clave-del-json-completa"
```

## 4️⃣ Ejecutar

```bash
npm run dev
```

Abre http://localhost:3000 y ¡listo! 🎉

---

**¿Necesitas más ayuda?** Lee [SETUP.md](SETUP.md) para una guía detallada.

