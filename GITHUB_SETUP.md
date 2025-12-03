# 📤 Cómo Subir el Proyecto a GitHub

Guía rápida para subir tu proyecto a GitHub y conectarlo con Render.

## 🚀 Pasos Rápidos

### 1. Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com)
2. Haz clic en el botón **+** (arriba derecha) → **New repository**
3. Completa:
   - **Repository name**: `asistencias-cpfp-6` (o el nombre que prefieras)
   - **Description**: Sistema de gestión de asistencias CPFP N°6
   - **Visibility**: Public o Private (tu elección)
   - **NO marques** "Initialize with README" (ya tenemos uno)
4. Haz clic en **Create repository**

### 2. Inicializar Git en tu proyecto

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Asistencias CPFP N°6"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU-USUARIO/asistencias-cpfp-6.git

# Cambiar a rama main
git branch -M main

# Subir el código
git push -u origin main
```

**💡 Tip**: Si GitHub te pide autenticación, puedes usar:
- Personal Access Token (recomendado)
- GitHub CLI
- SSH keys

### 3. Verificar que se subió correctamente

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. El README.md debería mostrarse en la página principal

## ✅ Checklist Antes de Subir

Asegúrate de que:

- [ ] ✅ El archivo `.env.local` NO está en el repositorio (está en `.gitignore`)
- [ ] ✅ Todos los archivos importantes están incluidos
- [ ] ✅ El README.md está actualizado
- [ ] ✅ No hay archivos sensibles (contraseñas, keys, etc.)

## 🔒 Seguridad

**IMPORTANTE**: Nunca subas archivos con información sensible:

- ❌ `.env` o `.env.local`
- ❌ Archivos JSON de service accounts
- ❌ Claves privadas
- ❌ Contraseñas

Estos archivos ya están en `.gitignore` y no se subirán automáticamente.

## 🔄 Actualizar el Repositorio

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

## 📝 Mensajes de Commit Recomendados

Usa mensajes descriptivos:

```bash
git commit -m "Agregar validación de formularios"
git commit -m "Mejorar manejo de errores en dashboard"
git commit -m "Corregir bug en calendario"
git commit -m "Actualizar documentación"
```

## 🐛 Si algo sale mal

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/asistencias-cpfp-6.git
```

### Error: "failed to push"
```bash
# Primero hacer pull
git pull origin main --allow-unrelated-histories
# Luego push
git push -u origin main
```

### Cambiar la URL del repositorio
```bash
git remote set-url origin https://github.com/TU-USUARIO/nuevo-nombre.git
```

## 🎯 Siguiente Paso

Una vez que tu código esté en GitHub, sigue la [Guía de Deploy](DEPLOY.md) para desplegarlo en Render.

---

**¿Necesitas ayuda?** Revisa la [documentación de GitHub](https://docs.github.com) o el [README principal](README.md).

