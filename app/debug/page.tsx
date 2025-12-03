'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener variables de entorno desde el servidor
    fetch('/api/debug/env')
      .then(res => res.json())
      .then(data => {
        setEnvVars(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  const requiredVars = [
    'NODE_ENV',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_SHEETS_SPREADSHEET_ID',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
  ]

  const checkVar = (key: string) => {
    const value = envVars[key]
    if (!value) return { status: 'missing', display: '❌ FALTANTE' }
    if (key === 'NEXTAUTH_SECRET' || key === 'GOOGLE_PRIVATE_KEY') {
      return { status: 'present', display: `✅ Presente (${value.length} caracteres)` }
    }
    return { status: 'present', display: `✅ ${value}` }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 Diagnóstico de Variables de Entorno</h1>
          <p className="text-gray-600 mb-8">
            Esta página te ayuda a verificar qué variables de entorno están configuradas en Render.
          </p>

          <div className="space-y-6">
            {requiredVars.map(key => {
              const check = checkVar(key)
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    check.status === 'missing'
                      ? 'border-red-300 bg-red-50'
                      : 'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{key}</h3>
                      <p className="text-sm text-gray-600 mt-1">{check.display}</p>
                    </div>
                    {check.status === 'missing' && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                        REQUERIDA
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-2">📋 Instrucciones</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
              <li>Ve a Render Dashboard → Tu Servicio → Settings → Environment</li>
              <li>Agrega las variables marcadas como ❌ FALTANTE</li>
              <li>Para NEXTAUTH_SECRET, genera uno con PowerShell o usa: https://generate-secret.vercel.app/32</li>
              <li>Guarda los cambios y haz un nuevo deploy</li>
              <li>Recarga esta página para verificar</li>
            </ol>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

