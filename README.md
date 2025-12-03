# 🎓 Asistencias CPFP N°6

Sistema de gestión de asistencias para CPFP N°6. Mini-campus virtual simple, cute y 100% funcional desde internet.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## ✨ Características

- 🔐 **Autenticación con Google** usando NextAuth
- 📚 **Gestión completa de cursos** (crear, editar, eliminar)
- 👥 **Gestión de alumnos** por curso
- ✅ **Toma de asistencia** con interfaz intuitiva
- 📅 **Calendario visual** de asistencias
- 📊 **Reportes detallados** con estadísticas y exportación a CSV
- 💾 **Persistencia en Google Sheets** (sin necesidad de base de datos tradicional)
- 🎨 **Diseño cute y minimalista** con colores pastel
- 📱 **Responsive** - funciona en cualquier dispositivo

## 🚀 Inicio Rápido

### Opción 1: Setup Local (Recomendado para empezar)

Sigue la **[Guía de Setup Rápida](SETUP.md)** - Te llevará paso a paso en menos de 15 minutos.

### Opción 2: Deploy Directo

Si ya tienes todo configurado, sigue la **[Guía de Deploy](DEPLOY.md)** para subirlo a Render.

## 📋 Requisitos Previos

- ✅ Node.js 18+ y npm
- ✅ Cuenta de Google (para OAuth)
- ✅ Cuenta de Google Cloud Platform (gratis)
- ✅ Cuenta en Render (gratis, para deploy)

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: TailwindCSS
- **Autenticación**: NextAuth.js con Google OAuth
- **Base de Datos**: Google Sheets API v4
- **Estado Global**: Zustand
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Deploy**: Render + GitHub

## 📁 Estructura del Proyecto

```
asistencia2/
├── app/                    # Páginas y rutas
│   ├── api/                # API Routes
│   ├── calendar/           # Calendario de asistencias
│   ├── course/[id]/        # Gestión de curso
│   ├── dashboard/          # Dashboard principal
│   └── login/              # Página de login
├── components/             # Componentes React
├── lib/                    # Utilidades y configuraciones
│   ├── auth.ts             # Configuración NextAuth
│   └── googleSheets.ts     # Integración Google Sheets
├── store/                  # Estado global (Zustand)
├── types/                  # Tipos TypeScript
├── SETUP.md                # Guía de setup detallada
├── DEPLOY.md               # Guía de deploy
└── README.md               # Este archivo
```

## 📖 Documentación

- **[SETUP.md](SETUP.md)** - Guía paso a paso para configurar el proyecto localmente
- **[DEPLOY.md](DEPLOY.md)** - Guía completa para desplegar en Render
- **[env.example.txt](env.example.txt)** - Ejemplo de variables de entorno

## 🎯 Funcionalidades Principales

### 1. Autenticación
- Login seguro con Google OAuth
- Sesión persistente
- Protección de rutas

### 2. Gestión de Cursos
- Crear nuevos cursos
- Editar información de cursos
- Eliminar cursos (con confirmación)
- Ver lista de todos los cursos

### 3. Gestión de Alumnos
- Agregar alumnos a un curso
- Eliminar alumnos
- Ver lista de alumnos por curso

### 4. Toma de Asistencia
- Seleccionar fecha
- Marcar alumnos como Presente/Ausente
- Guardar asistencia en Google Sheets
- Ver asistencias guardadas anteriormente

### 5. Calendario
- Vista mensual de asistencias
- Días con asistencia marcados
- Estadísticas del mes
- Navegación entre meses

### 6. Reportes
- Porcentaje de asistencia por alumno
- Ranking de asistencias
- Estadísticas generales
- Exportación a CSV

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (http://localhost:3000)

# Producción
npm run build        # Construye la aplicación
npm start            # Inicia servidor de producción

# Utilidades
npm run lint         # Ejecuta el linter
```

## 🐛 Solución de Problemas

### Error: "No autorizado" al acceder a Google Sheets
- ✅ Verifica que el Sheet esté compartido con el service account
- ✅ Verifica que `GOOGLE_SERVICE_ACCOUNT_EMAIL` sea correcto
- ✅ Verifica que el service account tenga permisos de Editor

### Error: "Invalid credentials" en NextAuth
- ✅ Verifica que las URLs de redirección estén correctas en Google Cloud
- ✅ Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos
- ✅ Verifica que `NEXTAUTH_URL` coincida con tu dominio

### Error: "Spreadsheet not found"
- ✅ Verifica que `GOOGLE_SHEETS_SPREADSHEET_ID` sea correcto
- ✅ Verifica que el Sheet esté compartido con el service account
- ✅ Verifica que las APIs estén habilitadas en Google Cloud

### El build falla en Render
- ✅ Verifica que todas las variables de entorno estén configuradas
- ✅ Revisa los logs de build en Render para más detalles
- ✅ Asegúrate de que `package.json` tenga todas las dependencias

## 📝 Notas Importantes

- 🔒 El sistema crea automáticamente las hojas necesarias en Google Sheets
- 💾 Los datos se almacenan directamente en Google Sheets (no hay base de datos tradicional)
- 👥 El sistema es multi-usuario: cada profesor puede gestionar sus propios cursos
- 📅 Las asistencias se guardan con la fecha y el nombre del profesor que las tomó
- ⚠️ Al eliminar un curso, se eliminan también todos los alumnos y asistencias asociadas

## 🎨 Personalización

### Colores

Los colores se pueden personalizar en `tailwind.config.ts`:

```typescript
colors: {
  pastel: {
    pink: '#FFD6E8',
    blue: '#D6E8FF',
    purple: '#E8D6FF',
    // ... más colores
  }
}
```

### Estilos

Los estilos globales están en `app/globals.css`. Puedes modificar las clases utilitarias como `.btn-primary`, `.card`, etc.

## 🔄 Actualizaciones

Para actualizar el proyecto:

```bash
git pull origin main
npm install
npm run build
```

## 📄 Licencia

Este proyecto es parte de una práctica profesionalizante del CPFP N°6.

## 👨‍💻 Desarrollo

### Próximas Mejoras

- [ ] Importar alumnos desde CSV
- [ ] Notificaciones por email
- [ ] Dashboard con gráficos
- [ ] Historial de cambios
- [ ] Exportación a PDF
- [ ] Modo oscuro
- [ ] Búsqueda de alumnos
- [ ] Filtros avanzados en reportes

## 📞 Soporte

Si tienes problemas:

1. Revisa la [Guía de Setup](SETUP.md)
2. Revisa la [Guía de Deploy](DEPLOY.md)
3. Revisa la sección de "Solución de Problemas" arriba
4. Revisa los logs en la consola del navegador (F12)
5. Revisa los logs en Render Dashboard (si está desplegado)

---

**Versión**: 1.0.0  
**Última actualización**: 2025

**Desarrollado con ❤️ para CPFP N°6**
