'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Plus, BookOpen, Users, Calendar as CalendarIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import CreateCourseModal from '@/components/CreateCourseModal'

interface Course {
  id: string
  nombre: string
  año: string
  profesor: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchCourses()
    }
  }, [session])

  const fetchCourses = async () => {
    try {
      setError(null)
      const res = await fetch('/api/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || 'Error al cargar los cursos. Verifica tu configuración de Google Sheets.')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError('Error de conexión. Verifica que el servidor esté funcionando.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este curso? Esta acción también eliminará todos los alumnos y asistencias asociadas.')) return
    
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCourses(courses.filter((c) => c.id !== id))
      } else {
        alert('Error al eliminar el curso. Intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Error de conexión al eliminar el curso.')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-600">Mis Cursos</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Curso
          </motion.button>
        </div>

        {error && (
          <div className="card bg-red-50 border-2 border-red-200 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-semibold">Error al cargar cursos</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {courses.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No tienes cursos aún</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Crear tu primer curso
            </button>
          </motion.div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card cursor-pointer hover:scale-105 transition-transform"
                onClick={() => router.push(`/course/${course.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-primary-500" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCourse(course.id)
                    }}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
                <h3 className="text-xl font-bold text-primary-600 mb-2">
                  {course.nombre}
                </h3>
                <p className="text-gray-600 mb-2">Año: {course.año}</p>
                <p className="text-sm text-gray-500">Profesor: {course.profesor}</p>
                <div className="mt-4 flex items-center gap-2 text-primary-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Ver alumnos</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

        {showModal && (
          <CreateCourseModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              fetchCourses()
            }}
          />
        )}
      </div>
    </div>
  )
}

