import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyCredentials } from './users'

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
  
  // NO lanzar error en producción para permitir diagnóstico
  // NextAuth manejará el error de forma más elegante
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
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-change-in-production',
  debug: process.env.NODE_ENV === 'development',
}
