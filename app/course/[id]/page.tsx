'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Plus, UserMinus, Calendar, Users, CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface Course {
  id: string
  nombre: string
  año: string
  profesor: string
}

interface Student {
  id: string
  nombre: string
  dni: string
}

interface AttendanceRecord {
  studentId: string
  dni: string
  nombre: string
  asistencia: 'Presente' | 'Ausente'
}

export default function CoursePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, 'Presente' | 'Ausente'>>({})
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({ nombre: '', dni: '' })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && courseId) {
      fetchCourseData()
      fetchStudents()
      fetchAttendance()
    }
  }, [session, courseId, selectedDate])

  const fetchCourseData = async () => {
    try {
      const res = await fetch('/api/courses')
      if (res.ok) {
        const courses = await res.json()
        const found = courses.find((c: Course) => c.id === courseId)
        setCourse(found || null)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/students`)
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
        
        // Inicializar estado de asistencia
        const initialAttendance: Record<string, 'Presente' | 'Ausente'> = {}
        data.forEach((student: Student) => {
          initialAttendance[student.id] = 'Presente'
        })
        setAttendance(initialAttendance)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/attendance?date=${selectedDate}`)
      if (res.ok) {
        const data = await res.json()
        const attendanceMap: Record<string, 'Presente' | 'Ausente'> = {}
        data.forEach((att: any) => {
          const student = students.find((s) => s.dni === att.dni)
          if (student) {
            attendanceMap[student.id] = att.asistencia
          }
        })
        if (Object.keys(attendanceMap).length > 0) {
          setAttendance(attendanceMap)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/courses/${courseId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      })

      if (res.ok) {
        setNewStudent({ nombre: '', dni: '' })
        setShowAddStudent(false)
        fetchStudents()
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(errorData.error || 'Error al agregar el alumno. Verifica los datos.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al agregar el alumno.')
    }
  }

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm('¿Eliminar este alumno?')) return

    try {
      const res = await fetch(`/api/courses/${courseId}/students/${studentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      alert('No hay alumnos en este curso. Agrega alumnos primero.')
      return
    }

    setSaving(true)
    try {
      const attendanceList: AttendanceRecord[] = students.map((student) => ({
        studentId: student.id,
        dni: student.dni,
        nombre: student.nombre,
        asistencia: attendance[student.id] || 'Presente',
      }))

      const res = await fetch(`/api/courses/${courseId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          attendance: attendanceList,
        }),
      })

      if (res.ok) {
        // Mostrar mensaje de éxito más bonito
        const successMsg = document.createElement('div')
        successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-slide-up'
        successMsg.textContent = '✅ Asistencia guardada correctamente'
        document.body.appendChild(successMsg)
        setTimeout(() => {
          successMsg.remove()
        }, 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(errorData.error || 'Error al guardar la asistencia. Verifica tu configuración.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al guardar la asistencia.')
    } finally {
      setSaving(false)
    }
  }

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'Presente' ? 'Ausente' : 'Presente',
    }))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!session || !course) return null

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Navbar />

        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Volver a cursos
          </button>
          <h1 className="text-3xl font-bold text-primary-600 mb-2">{course.nombre}</h1>
          <p className="text-gray-600">Año: {course.año} | Profesor: {course.profesor}</p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-cute"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveAttendance}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar Asistencia'}
            </motion.button>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary-600 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Alumnos ({students.length})
            </h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/course/${courseId}/report`)}
                className="btn-secondary flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Ver Reporte
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddStudent(!showAddStudent)}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar Alumno
              </motion.button>
            </div>
          </div>

          {showAddStudent && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleAddStudent}
              className="mb-4 p-4 bg-pastel-pink rounded-2xl space-y-3"
            >
              <input
                type="text"
                required
                value={newStudent.nombre}
                onChange={(e) => setNewStudent({ ...newStudent, nombre: e.target.value })}
                className="input-cute"
                placeholder="Nombre del alumno"
              />
              <input
                type="text"
                required
                value={newStudent.dni}
                onChange={(e) => setNewStudent({ ...newStudent, dni: e.target.value })}
                className="input-cute"
                placeholder="DNI"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStudent(false)
                    setNewStudent({ nombre: '', dni: '' })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          )}

          <div className="space-y-2">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-pastel-lavender rounded-2xl hover:bg-pastel-purple transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-primary-700">{student.nombre}</p>
                  <p className="text-sm text-gray-600">DNI: {student.dni}</p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleAttendance(student.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                      attendance[student.id] === 'Presente'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {attendance[student.id] === 'Presente' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span>{attendance[student.id] || 'Presente'}</span>
                  </motion.button>
                  <button
                    onClick={() => handleRemoveStudent(student.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

