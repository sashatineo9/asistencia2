# 🔑 Cómo Generar NEXTAUTH_SECRET (Windows)

## Opción 1: Usar PowerShell (Recomendado)

1. Abre **PowerShell** (no CMD)
2. Ejecuta este comando:
   ```powershell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
   ```
3. Copia el resultado completo
4. Úsalo como valor de `NEXTAUTH_SECRET` en Render

## Opción 2: Usar Node.js

1. Abre tu terminal en la carpeta del proyecto
2. Ejecuta:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
3. Copia el resultado completo

## Opción 3: Generador Online

1. Ve a: https://generate-secret.vercel.app/32
2. Copia el resultado
3. Úsalo como valor de `NEXTAUTH_SECRET`

## Opción 4: Usar cualquier string largo

Puedes usar cualquier string largo y aleatorio, por ejemplo:
```
mi-secret-super-seguro-para-asistencias-cpfp-2024-xyz123abc456
```

**Nota**: Mientras sea largo (más de 32 caracteres) y único, funcionará.

---

**Recomendación**: Usa la **Opción 1 (PowerShell)** o **Opción 2 (Node.js)** - son las más seguras.

