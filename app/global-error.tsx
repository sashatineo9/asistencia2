'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'linear-gradient(to bottom right, #FFD6E8, #F0E8FF, #D6E8FF)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF4D94', marginBottom: '1rem' }}>
              Error en la Aplicación
            </h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Ha ocurrido un error crítico. Por favor, verifica la configuración del servidor.
            </p>
            <button
              onClick={reset}
              style={{
                background: 'linear-gradient(to right, #FF80B3, #FF4D94)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Intentar de Nuevo
            </button>
            <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#999' }}>
              <p>Verifica las variables de entorno en Render Dashboard</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

