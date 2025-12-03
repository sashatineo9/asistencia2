'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Download, TrendingUp, TrendingDown, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import Papa from 'papaparse'

interface ReportData {
  studentName: string
  dni: string
  totalClasses: number
  presentCount: number
  absentCount: number
  attendancePercentage: number
}

export default function ReportPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [report, setReport] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMonth, setFilterMonth] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && courseId) {
      fetchReport()
    }
  }, [session, courseId])

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/report`)
      if (res.ok) {
        const data = await res.json()
        setReport(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvData = report.map((item) => ({
      Alumno: item.studentName,
      DNI: item.dni,
      'Total Clases': item.totalClasses,
      Presentes: item.presentCount,
      Ausentes: item.absentCount,
      'Porcentaje Asistencia': `${item.attendancePercentage.toFixed(2)}%`,
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `reporte-asistencias-${courseId}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!session) return null

  const averageAttendance =
    report.length > 0
      ? report.reduce((sum, r) => sum + r.attendancePercentage, 0) / report.length
      : 0

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Navbar />

        <div className="mb-6">
          <button
            onClick={() => router.push(`/course/${courseId}`)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Volver al curso
          </button>
          <h1 className="text-3xl font-bold text-primary-600 mb-2">Reporte de Asistencias</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-gradient-to-br from-pastel-pink to-pastel-lavender"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Promedio General</p>
                <p className="text-3xl font-bold text-primary-600">
                  {averageAttendance.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-primary-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-pastel-blue to-pastel-mint"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Alumnos</p>
                <p className="text-3xl font-bold text-primary-600">{report.length}</p>
              </div>
              <Users className="w-12 h-12 text-primary-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-pastel-purple to-pastel-pink"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clases</p>
                <p className="text-3xl font-bold text-primary-600">
                  {report.length > 0 ? report[0].totalClasses : 0}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-primary-400" />
            </div>
          </motion.div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary-600">Ranking de Asistencias</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-pastel-pink">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-600 rounded-tl-2xl">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-600">
                    Alumno
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-600">
                    DNI
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary-600">
                    Presentes
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary-600">
                    Ausentes
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary-600">
                    Total Clases
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary-600 rounded-tr-2xl">
                    % Asistencia
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.map((item, index) => (
                  <motion.tr
                    key={item.dni}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-pastel-pink hover:bg-pastel-lavender transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-700">
                      {item.studentName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.dni}</td>
                    <td className="px-4 py-3 text-sm text-center text-green-600 font-semibold">
                      {item.presentCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-red-600 font-semibold">
                      {item.absentCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">
                      {item.totalClasses}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              item.attendancePercentage >= 80
                                ? 'bg-green-500'
                                : item.attendancePercentage >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${item.attendancePercentage}%` }}
                          />
                        </div>
                        <span
                          className={`text-sm font-semibold min-w-[60px] ${
                            item.attendancePercentage >= 80
                              ? 'text-green-600'
                              : item.attendancePercentage >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {item.attendancePercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

