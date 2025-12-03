# ✅ SOLUCIÓN FINAL - Error de Render

## 🎯 El Problema

Render ejecuta `gunicorn app:app` (Python) en lugar de `npm start` (Node.js).

## 🔧 SOLUCIÓN DEFINITIVA

### Opción A: Cambiar en Render Dashboard (MÁS RÁPIDO - 2 minutos)

1. **Abre Render Dashboard**: https://dashboard.render.com
2. **Selecciona tu servicio** `asistencias-cpfp-6`
3. **Ve a Settings** (menú izquierdo)
4. **Busca "Runtime"** - CÁMBIALO A: **`Node`** ⚠️
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`
7. **Save Changes**
8. **Manual Deploy** → Deploy latest commit

### Opción B: Eliminar y Recrear (Si A no funciona)

1. **Elimina el servicio** en Render
2. **Crea uno nuevo**:
   - New → Web Service
   - Conecta GitHub
   - **Runtime: Node** (NO Python)
   - Build: `npm install && npm run build`
   - Start: `npm start`
3. **Agrega variables de entorno**
4. **Create Web Service**

## 📋 Archivos que DEBEN estar en GitHub

✅ `package.json` (con engines especificados)
✅ `render.yaml` (con env: node)
✅ `.nvmrc` (versión de Node)
✅ Carpeta `app/`
✅ `next.config.js`

## ❌ Archivos que NO deben estar

❌ `Procfile`
❌ `requirements.txt`
❌ `app.yaml`
❌ `backend.py`
❌ `models.py`

## 🚀 Comandos para Limpiar GitHub

```bash
# Eliminar archivos Python si aún están en GitHub
git rm -f Procfile requirements.txt app.yaml backend.py models.py 2>/dev/null || true

# Asegurar que .gitignore esté actualizado
git add .gitignore

# Commit y push
git commit -m "Fix: Ensure Node.js deployment, remove Python files"
git push origin main
```

## ✅ Verificación Post-Deploy

Los logs en Render deben mostrar:
```
==> Detecting Node.js
==> Installing Node version 18.x.x
==> Running 'npm install'
==> Running 'npm run build'
==> Running 'npm start'
```

**NO debe aparecer:**
```
==> Detecting Python
==> Installing Python
==> Running 'gunicorn'
```

## 💡 Nota Importante

**Render Dashboard guarda la configuración del servicio.** Aunque el código esté correcto, si el servicio fue creado como Python, seguirá intentando ejecutar Python hasta que lo cambies manualmente en Settings.

---

**Sigue la Opción A primero. Es la más rápida y debería resolver el problema inmediatamente.**

