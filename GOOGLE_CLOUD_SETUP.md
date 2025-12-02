# Guía de Configuración de Google Cloud SQL

Esta guía te ayudará a crear y configurar una base de datos PostgreSQL en Google Cloud Platform para usar con tu aplicación de asistencia en Render.

## 📋 Requisitos Previos

1. Cuenta de Google Cloud Platform (GCP)
2. Proyecto creado en GCP
3. Facturación habilitada (Cloud SQL requiere facturación)

## 🚀 Pasos para Crear la Base de Datos

### Paso 1: Acceder a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto o crea uno nuevo

### Paso 2: Habilitar la API de Cloud SQL

1. Ve a **APIs & Services** > **Library**
2. Busca "Cloud SQL Admin API"
3. Haz clic en **Enable** (Habilitar)

### Paso 3: Crear Instancia de Cloud SQL

1. Ve a **SQL** en el menú lateral
2. Haz clic en **Create Instance** (Crear instancia)
3. Selecciona **PostgreSQL**
4. Configura la instancia:
   - **Instance ID**: `asistencia-db` (o el nombre que prefieras)
   - **Password**: Crea una contraseña segura (¡guárdala bien!)
   - **Database version**: PostgreSQL 15 (recomendado)
   - **Region**: Selecciona la región más cercana a ti
   - **Machine type**: 
     - Para desarrollo/pruebas: `db-f1-micro` (gratis con créditos)
     - Para producción: `db-n1-standard-1` o superior
   - **Storage**: 
     - Tipo: SSD
     - Capacidad: 10 GB mínimo
   - **Backup**: Activa las copias de seguridad automáticas
5. Haz clic en **Create** (Crear)

### Paso 4: Crear la Base de Datos

1. Una vez creada la instancia, haz clic en su nombre
2. Ve a la pestaña **Databases**
3. Haz clic en **Create Database**
4. Nombre: `asistencia` (o el que prefieras)
5. Haz clic en **Create**

### Paso 5: Crear Usuario de Base de Datos

1. En la misma página, ve a la pestaña **Users**
2. Haz clic en **Add user account**
3. Configura:
   - **Username**: `asistencia_user` (o el que prefieras)
   - **Password**: Crea una contraseña segura diferente a la del administrador
4. Haz clic en **Add**

### Paso 6: Configurar Conexión Pública (Para Render)

1. Ve a la pestaña **Connections**
2. En **Authorized networks**, haz clic en **Add network**
3. Para permitir conexiones desde cualquier IP (Render):
   - **Name**: `render-all`
   - **Network**: `0.0.0.0/0`
   - ⚠️ **Nota de seguridad**: Esto permite conexiones desde cualquier IP. Para mayor seguridad, puedes configurar el IP específico de Render más adelante.
4. Haz clic en **Done** y luego **Save**

### Paso 7: Obtener la Connection String

1. En la página de la instancia, ve a la pestaña **Overview**
2. Busca **Connection name**: Se verá algo como `proyecto:region:instancia`
3. Anota esta información:
   - **Host/IP**: Se muestra en "Public IP address" o "Private IP address"
   - **Port**: Por defecto es `5432`
   - **Database name**: El que creaste (ej: `asistencia`)
   - **Username**: El usuario que creaste (ej: `asistencia_user`)
   - **Password**: La contraseña que configuraste

### Paso 8: Formato de DATABASE_URL

La URL de conexión debe tener este formato:

```
postgresql://usuario:contraseña@host:puerto/nombre_bd
```

Ejemplo:
```
postgresql://asistencia_user:MiPassword123@34.123.45.67:5432/asistencia
```

## 🔐 Configurar en Render

1. Ve a tu servicio en Render
2. Ve a **Environment** (Variables de entorno)
3. Agrega o actualiza:
   - **Key**: `DATABASE_URL`
   - **Value**: La URL completa que obtuviste (ejemplo de arriba)
4. Guarda los cambios
5. Reinicia el servicio

## 🔒 Seguridad Adicional (Recomendado)

### Opción 1: Restringir IPs en Cloud SQL

1. En Cloud SQL, ve a **Connections**
2. En lugar de `0.0.0.0/0`, agrega solo las IPs de Render
3. Puedes encontrar las IPs de Render en su documentación o contactar soporte

### Opción 2: Usar Private IP (Más Seguro)

Si Render soporta conexiones privadas:
1. Configura una VPC en Google Cloud
2. Conecta Cloud SQL a la VPC
3. Usa la IP privada en lugar de la pública

## 🧪 Probar la Conexión

Puedes probar la conexión desde tu máquina local usando `psql`:

```bash
psql "postgresql://usuario:contraseña@host:puerto/nombre_bd"
```

O desde Python:

```python
import psycopg2

conn = psycopg2.connect(
    host="tu-host",
    port=5432,
    database="asistencia",
    user="asistencia_user",
    password="tu-password"
)
print("Conexión exitosa!")
conn.close()
```

## 💰 Costos

- **db-f1-micro**: Gratis durante los primeros 12 meses (con créditos gratuitos)
- **db-n1-standard-1**: Aproximadamente $25-50 USD/mes
- **Storage**: $0.17 USD/GB/mes
- **Backups**: Incluidos en el precio base

## 📝 Notas Importantes

1. **Guarda las contraseñas de forma segura**: Usa un gestor de contraseñas
2. **Habilita backups automáticos**: Esencial para producción
3. **Monitorea el uso**: Revisa regularmente los costos en la consola
4. **Actualiza regularmente**: Mantén PostgreSQL actualizado con parches de seguridad

## 🆘 Solución de Problemas

### Error: "Connection refused"
- Verifica que la IP esté autorizada en Cloud SQL
- Verifica que el firewall de GCP permita conexiones en el puerto 5432

### Error: "Authentication failed"
- Verifica usuario y contraseña
- Asegúrate de usar el usuario de base de datos, no el administrador de la instancia

### Error: "Database does not exist"
- Verifica que hayas creado la base de datos dentro de la instancia
- Verifica el nombre de la base de datos en la URL

## 📚 Recursos Adicionales

- [Documentación de Cloud SQL](https://cloud.google.com/sql/docs/postgres)
- [Precios de Cloud SQL](https://cloud.google.com/sql/pricing)
- [Mejores prácticas de seguridad](https://cloud.google.com/sql/docs/postgres/best-practices)

