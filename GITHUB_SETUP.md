# Guía para Subir el Proyecto a GitHub

Esta guía te ayudará a subir tu proyecto a GitHub para poder usarlo en Render.

## 📋 Requisitos Previos

1. Cuenta de GitHub (crear en https://github.com)
2. Git instalado en tu sistema
3. Terminal o PowerShell abierto en la carpeta del proyecto

## 🚀 Pasos para Subir a GitHub

### Paso 1: Inicializar el Repositorio Git

Abre PowerShell o Terminal en la carpeta del proyecto y ejecuta:

```powershell
# Inicializar repositorio Git
git init

# Agregar todos los archivos al staging
git add .

# Crear el primer commit
git commit -m "Initial commit: Sistema de asistencia CPFP N°6"
```

### Paso 2: Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Configura el repositorio:
   - **Repository name**: `asistencia-cpfp6` (o el nombre que prefieras)
   - **Description**: "Sistema de gestión de asistencia para CPFP N°6"
   - **Visibility**: 
     - **Public**: Si quieres que sea público
     - **Private**: Si quieres que sea privado (recomendado)
   - **NO marques** "Initialize this repository with a README" (ya tenemos uno)
5. Haz clic en **"Create repository"**

### Paso 3: Conectar el Repositorio Local con GitHub

GitHub te mostrará comandos después de crear el repositorio. Ejecuta estos comandos (reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub):

```powershell
# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu usuario)
git remote add origin https://github.com/TU_USUARIO/asistencia-cpfp6.git

# Cambiar a la rama main (si es necesario)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

Si GitHub te pide autenticación:
- **Usuario**: Tu nombre de usuario de GitHub
- **Contraseña**: Usa un **Personal Access Token** (no tu contraseña normal)

### Paso 4: Crear Personal Access Token (si es necesario)

Si Git te pide autenticación y no tienes un token:

1. Ve a GitHub > **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
2. Haz clic en **"Generate new token"** > **"Generate new token (classic)"**
3. Configura:
   - **Note**: "Render deployment"
   - **Expiration**: Elige una fecha (o "No expiration")
   - **Scopes**: Marca `repo` (acceso completo a repositorios)
4. Haz clic en **"Generate token"**
5. **Copia el token** (solo se muestra una vez)
6. Úsalo como contraseña cuando Git te lo pida

## 🔄 Comandos Útiles para el Futuro

### Ver el estado del repositorio
```powershell
git status
```

### Agregar cambios
```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver el historial de commits
```powershell
git log
```

### Actualizar desde GitHub
```powershell
git pull
```

## 🔗 Conectar con Render

Una vez que el código esté en GitHub:

1. Ve a [Render](https://render.com) e inicia sesión
2. Haz clic en **"New +"** > **"Web Service"**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Selecciona el repositorio `asistencia-cpfp6`
5. Configura el servicio:
   - **Name**: `asistencia-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT backend:app`
6. En **Environment Variables**, agrega:
   - `DATABASE_URL`: La URL de tu base de datos (Google Cloud SQL o Render PostgreSQL)
   - `JWT_SECRET_KEY`: Genera una clave segura
   - `FLASK_ENV`: `production`
   - `PORT`: `10000` (Render lo configurará automáticamente)
7. Haz clic en **"Create Web Service"**

## ✅ Verificación

Después de subir a GitHub, verifica:

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. El README.md debería mostrarse en la página principal

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/asistencia-cpfp6.git
```

### Error: "failed to push some refs"
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error de autenticación
- Asegúrate de usar un Personal Access Token, no tu contraseña
- Verifica que el token tenga permisos de `repo`

## 📝 Notas Importantes

- **Nunca subas archivos `.env`** con contraseñas reales
- El archivo `.gitignore` ya está configurado para ignorar archivos sensibles
- Siempre haz commit antes de hacer push
- Usa mensajes de commit descriptivos

