'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CreateCourseModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CreateCourseModal({ onClose, onSuccess }: CreateCourseModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    año: '',
    profesor: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        onSuccess()
      } else {
        setError(data.error || 'Error al crear el curso. Verifica tu conexión y configuración.')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión. Verifica que el servidor esté funcionando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="card max-w-md w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary-600">Crear Curso</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Curso <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => {
                  setFormData({ ...formData, nombre: e.target.value })
                  setError(null)
                }}
                className="input-cute"
                placeholder="Ej: Matemática 1° A"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.año}
                onChange={(e) => {
                  setFormData({ ...formData, año: e.target.value })
                  setError(null)
                }}
                className="input-cute"
                placeholder="Ej: 2024"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesor Responsable <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.profesor}
                onChange={(e) => {
                  setFormData({ ...formData, profesor: e.target.value })
                  setError(null)
                }}
                className="input-cute"
                placeholder="Nombre del profesor"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

