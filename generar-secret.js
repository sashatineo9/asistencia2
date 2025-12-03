// Script para generar NEXTAUTH_SECRET
// Ejecuta: node generar-secret.js

const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('base64');
console.log('\n✅ Tu NEXTAUTH_SECRET es:\n');
console.log(secret);
console.log('\n📋 Copia este valor y úsalo en Render Dashboard → Environment → NEXTAUTH_SECRET\n');

