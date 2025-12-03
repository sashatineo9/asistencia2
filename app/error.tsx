'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-blue">
      <div className="card max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary-600 mb-2">
          Error en la Aplicación
        </h1>
        <p className="text-gray-600 mb-6">
          Ha ocurrido un error. Por favor, verifica la configuración.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4 text-left">
            <p className="text-sm text-red-800 font-semibold mb-2">Detalles del error:</p>
            <p className="text-xs text-red-600 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="btn-primary w-full"
          >
            Intentar de Nuevo
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="btn-secondary w-full"
          >
            Ir al Login
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Si el problema persiste, verifica:</p>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>Variables de entorno configuradas</li>
            <li>Conexión a Google Sheets</li>
            <li>Credenciales de Google OAuth</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

