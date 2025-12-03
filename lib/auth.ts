import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyCredentials } from './users'
import crypto from 'crypto'

// Generar un secret válido si no está presente
// NextAuth requiere al menos 32 caracteres
function getOrGenerateSecret(): string {
  const envSecret = process.env.NEXTAUTH_SECRET
  
  // Si hay un secret válido en las variables de entorno, usarlo
  if (envSecret && envSecret.trim().length >= 32) {
    console.log('✅ NEXTAUTH_SECRET encontrado en variables de entorno')
    return envSecret.trim()
  }
  
  // Si no hay secret o es muy corto, generar uno determinístico
  // Usar un hash basado en NEXTAUTH_URL para que sea consistente entre reinicios
  const baseString = process.env.NEXTAUTH_URL || 'asistencias-cpfp-6-default'
  const generatedSecret = crypto
    .createHash('sha256')
    .update(baseString + 'asistencias-cpfp-6-secret-key-2024-production')
    .digest('base64')
  
  if (!envSecret) {
    console.warn('⚠️⚠️⚠️ NEXTAUTH_SECRET NO está configurado en Render Dashboard')
    console.warn('⚠️ Se está usando un secret generado automáticamente (NO es seguro para producción)')
    console.warn('⚠️ IMPORTANTE: Agrega NEXTAUTH_SECRET en Render Dashboard → Settings → Environment')
    console.warn('⚠️ Genera uno con: https://generate-secret.vercel.app/32')
  } else {
    console.warn('⚠️ NEXTAUTH_SECRET es muy corto (< 32 caracteres). Se está usando un secret generado.')
  }
  
  return generatedSecret
}

// Validar variables de entorno requeridas
const requiredEnvVars = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
}

// Verificar que todas las variables estén presentes
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  const errorMsg = `❌ Variables de entorno faltantes: ${missingVars.join(', ')}. Por favor, configura estas variables en Render Dashboard → Environment.`
  console.error(errorMsg)
  console.error('🔍 Variables actuales detectadas:')
  console.error('  NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Presente' : '❌ Faltante')
  console.error('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? `✅ ${process.env.NEXTAUTH_URL}` : '❌ Faltante')
  console.error('  NODE_ENV:', process.env.NODE_ENV || '❌ Faltante')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tu@email.com' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await verifyCredentials(credentials.email, credentials.password)
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          }
          return null
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: getOrGenerateSecret(),
  debug: process.env.NODE_ENV === 'development',
}
