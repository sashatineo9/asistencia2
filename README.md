# Sistema Integral de Gestión de Asistencia CPFP N°6

Sistema web multiplataforma para optimizar la carga de asistencia de alumnos del CPFP N°6, desarrollado con metodologías ágiles y herramientas tecnológicas modernas.

## 📋 Características

- ✅ **Autenticación segura** con roles diferenciados (Profesor/Administrador)
- ✅ **Gestión completa de cursos** y alumnos
- ✅ **Carga de asistencia diaria** por parte de profesores
- ✅ **Panel de administración** para gestión integral
- ✅ **Base de datos persistente** (SQLite para desarrollo, compatible con PostgreSQL)
- ✅ **Interfaz responsive** accesible desde cualquier dispositivo
- ✅ **API REST** bien estructurada

## 🏗️ Arquitectura

### Backend
- **Framework**: Flask (Python)
- **Base de Datos**: SQLAlchemy ORM (SQLite/PostgreSQL)
- **Autenticación**: JWT (JSON Web Tokens)
- **API**: RESTful

### Frontend
- **Tecnología**: HTML5, CSS3, JavaScript (Vanilla)
- **Diseño**: Responsive, accesible desde móviles, tablets y desktop

## 📁 Estructura del Proyecto

```
asistencia2/
├── backend.py              # API principal con Flask
├── models.py               # Modelos de base de datos (SQLAlchemy)
├── requirements.txt        # Dependencias de Python
├── login.html             # Página de inicio de sesión
├── dashboard_profesor.html # Panel del profesor
├── dashboard_admin.html    # Panel del administrador
├── admin.js               # Lógica JavaScript para administrador
├── index.html             # Redirección al login
├── .env.example           # Ejemplo de variables de entorno
├── render.yaml            # Configuración para Render
├── Procfile               # Configuración para despliegue
├── .gitignore             # Archivos a ignorar en Git
└── README.md              # Este archivo
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Git (para control de versiones)

### Instalación Local

1. **Clonar o descargar el proyecto**

2. **Crear entorno virtual (recomendado)**
   ```bash
   python -m venv venv
   ```

3. **Activar entorno virtual**
   
   En Windows (PowerShell):
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   En Linux/Mac:
   ```bash
   source venv/bin/activate
   ```

4. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configurar variables de entorno**
   
   Copiar el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` y configurar:
   - `DATABASE_URL`: URL de la base de datos (por defecto SQLite)
   - `JWT_SECRET_KEY`: Clave secreta para JWT (cambiar en producción)

6. **Inicializar base de datos**
   
   La base de datos se crea automáticamente al ejecutar el servidor por primera vez.
   Se creará un usuario administrador por defecto:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`

7. **Ejecutar el servidor**
   ```bash
   python backend.py
   ```
   
   El servidor estará disponible en `http://localhost:5000`

8. **Abrir la aplicación**
   
   Abrir `login.html` en el navegador o acceder a `http://localhost:5000` si se configura el servidor para servir archivos estáticos.

## 👥 Usuarios y Roles

### Administrador
- Gestión completa de cursos
- Gestión de alumnos
- Creación y gestión de usuarios
- Acceso a todos los cursos

### Profesor
- Visualización de cursos asignados
- Carga de asistencia diaria
- Consulta de reportes de asistencia

## 🔐 Credenciales por Defecto

Al iniciar el sistema por primera vez, se crea automáticamente un usuario administrador:

- **Usuario**: `admin`
- **Contraseña**: `admin123`

**⚠️ IMPORTANTE**: Cambiar estas credenciales en producción.

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Cursos
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Crear curso (solo admin)
- `GET /api/courses/<id>` - Obtener curso
- `PUT /api/courses/<id>` - Actualizar curso (solo admin)
- `DELETE /api/courses/<id>` - Eliminar curso (solo admin)

### Alumnos
- `GET /api/courses/<id>/students` - Listar alumnos de un curso
- `POST /api/courses/<id>/students` - Agregar alumno (solo admin)
- `PUT /api/students/<id>` - Actualizar alumno (solo admin)
- `DELETE /api/students/<id>` - Eliminar alumno (solo admin)

### Asistencia
- `GET /api/courses/<id>/attendance/<fecha>` - Obtener asistencia
- `POST /api/courses/<id>/attendance/<fecha>` - Guardar asistencia
- `GET /api/courses/<id>/attendance/report` - Reporte de asistencia

### Usuarios
- `GET /api/users` - Listar usuarios (solo admin)
- `POST /api/users` - Crear usuario (solo admin)

## 🌐 Despliegue en la Nube

### Despliegue en Render

1. **Crear cuenta en Render** (https://render.com)

2. **Conectar repositorio de GitHub**
   - Subir el código a GitHub
   - Conectar el repositorio en Render

3. **Crear servicio Web**
   - Tipo: Web Service
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT backend:app`

4. **Configurar variables de entorno**
   - `DATABASE_URL`: URL de base de datos (Render PostgreSQL o externa)
   - `JWT_SECRET_KEY`: Clave secreta segura
   - `FLASK_ENV`: `production`

5. **Desplegar**

### Base de Datos en Google Cloud SQL

Para usar Google Cloud SQL con Render, sigue estos pasos:

1. **Crear instancia de Cloud SQL** (PostgreSQL)
   - Consulta la guía completa en [GOOGLE_CLOUD_SETUP.md](GOOGLE_CLOUD_SETUP.md)
   - Configura usuario, contraseña y base de datos
   - Habilita conexiones públicas o privadas según tu necesidad

2. **Obtener la Connection String**
   - Formato: `postgresql://usuario:contraseña@host:puerto/nombre_bd`
   - Ejemplo: `postgresql://asistencia_user:password@34.123.45.67:5432/asistencia`

3. **Configurar en Render**
   - Ve a tu servicio en Render
   - Agrega la variable de entorno `DATABASE_URL` con la connection string
   - Reinicia el servicio

📖 **Guía detallada**: Ver [GOOGLE_CLOUD_SETUP.md](GOOGLE_CLOUD_SETUP.md) para instrucciones paso a paso.

### Base de Datos en Producción

Para producción, se recomienda usar PostgreSQL:

1. **Instalar psycopg2** (driver de PostgreSQL)
   ```bash
   pip install psycopg2-binary
   ```

2. **El `requirements.txt` ya incluye**:
   ```
   psycopg2-binary==2.9.9
   ```

3. **Configurar `DATABASE_URL`** con formato:
   ```
   postgresql://usuario:contraseña@host:puerto/nombre_bd
   ```

## 🧪 Pruebas

### Pruebas Manuales

1. **Autenticación**
   - Iniciar sesión con credenciales válidas
   - Verificar redirección según rol
   - Probar credenciales inválidas

2. **Gestión de Cursos (Admin)**
   - Crear nuevo curso
   - Asignar profesor
   - Editar curso
   - Eliminar curso

3. **Gestión de Alumnos (Admin)**
   - Agregar alumnos a un curso
   - Editar información de alumnos
   - Eliminar alumnos

4. **Carga de Asistencia (Profesor)**
   - Seleccionar curso
   - Cargar asistencia del día
   - Guardar cambios

## 📝 Metodología de Trabajo

Este proyecto utiliza metodología **Kanban** para la gestión del flujo de trabajo:

- **Visualización**: Tablero con columnas (Por hacer, En progreso, Completado)
- **Límites de trabajo**: Controlar tareas en progreso
- **Flujo continuo**: Enfoque en completar tareas de forma continua
- **Mejora continua**: Retrospectivas y ajustes

## 🛠️ Tecnologías Utilizadas

- **Backend**: Flask, SQLAlchemy, Flask-JWT-Extended
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Despliegue**: Render, Google Cloud Platform
- **Control de Versiones**: Git, GitHub
- **IA Asistente**: Gemini/Cursor

## 📄 Licencia

Este proyecto es parte de una práctica profesionalizante del CPFP N°6.

## 👨‍💻 Desarrollo

### Estructura de Base de Datos

- **users**: Usuarios del sistema (profesores y administradores)
- **courses**: Cursos
- **students**: Alumnos
- **attendances**: Registros de asistencia diaria

### Próximas Mejoras

- [ ] Exportación de reportes a PDF/Excel
- [ ] Notificaciones por email
- [ ] Dashboard con estadísticas
- [ ] Historial de cambios
- [ ] Recuperación de contraseña
- [ ] Integración con sistemas externos

## 📞 Soporte

Para consultas o problemas, contactar al equipo de desarrollo del CPFP N°6.

---

**Versión**: 1.0.0  
**Última actualización**: 2025
