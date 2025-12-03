'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns'
import { es } from 'date-fns/locale/es'

interface Course {
  id: string
  nombre: string
}

interface AttendanceDate {
  date: string
  courseId: string
  courseName: string
  total: number
  present: number
}

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [courses, setCourses] = useState<Course[]>([])
  const [attendanceDates, setAttendanceDates] = useState<AttendanceDate[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    if (courses.length > 0) {
      fetchAttendanceDates()
    }
  }, [courses, currentDate])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchAttendanceDates = async () => {
    if (courses.length === 0) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const allDates: AttendanceDate[] = []
      
      for (const course of courses) {
        const res = await fetch(`/api/courses/${course.id}/attendance-all`)
        if (res.ok) {
          const attendance = await res.json()
          const datesMap = new Map<string, { total: number; present: number }>()
          
          attendance.forEach((att: any) => {
            if (!datesMap.has(att.fecha)) {
              datesMap.set(att.fecha, { total: 0, present: 0 })
            }
            const data = datesMap.get(att.fecha)!
            data.total++
            if (att.asistencia === 'Presente') {
              data.present++
            }
          })
          
          datesMap.forEach((data, date) => {
            allDates.push({
              date,
              courseId: course.id,
              courseName: course.nombre,
              total: data.total,
              present: data.present,
            })
          })
        }
      }
      
      setAttendanceDates(allDates)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAttendanceForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return attendanceDates.filter((att) => att.date === dateStr)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
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

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary-600 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8" />
              Calendario de Asistencias
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-pastel-pink hover:bg-pastel-purple transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-primary-600" />
              </button>
              <h2 className="text-xl font-semibold text-primary-600 min-w-[200px] text-center capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-pastel-pink hover:bg-pastel-purple transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-primary-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center font-semibold text-primary-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayAttendance = getAttendanceForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())

              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`
                    min-h-[100px] p-2 rounded-2xl border-2 transition-all
                    ${!isCurrentMonth ? 'bg-gray-100 border-gray-200' : 'bg-white border-pastel-pink'}
                    ${isToday ? 'ring-2 ring-primary-400' : ''}
                    ${dayAttendance.length > 0 ? 'bg-pastel-mint border-primary-300' : ''}
                    hover:shadow-lg cursor-pointer
                  `}
                  onClick={() => {
                    if (dayAttendance.length > 0) {
                      // Mostrar detalles o navegar
                      router.push(`/calendar/${format(day, 'yyyy-MM-dd')}`)
                    }
                  }}
                >
                  <div className="text-sm font-semibold text-primary-600 mb-1">
                    {format(day, 'd')}
                  </div>
                  {dayAttendance.length > 0 && (
                    <div className="space-y-1">
                      {dayAttendance.map((att, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-primary-100 text-primary-700 rounded px-1 py-0.5 truncate"
                          title={att.courseName}
                        >
                          {att.courseName}: {att.present}/{att.total}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-primary-600 mb-4">Estadísticas del Mes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-pastel-pink rounded-2xl p-4">
              <p className="text-sm text-gray-600">Total de clases</p>
              <p className="text-2xl font-bold text-primary-600">
                {new Set(attendanceDates.map((a) => a.date)).size}
              </p>
            </div>
            <div className="bg-pastel-blue rounded-2xl p-4">
              <p className="text-sm text-gray-600">Cursos activos</p>
              <p className="text-2xl font-bold text-primary-600">{courses.length}</p>
            </div>
            <div className="bg-pastel-mint rounded-2xl p-4">
              <p className="text-sm text-gray-600">Días con asistencia</p>
              <p className="text-2xl font-bold text-primary-600">
                {attendanceDates.filter((a) =>
                  isSameMonth(parseISO(a.date), currentDate)
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

