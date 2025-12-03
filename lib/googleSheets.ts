import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

// Inicializar cliente de Google Sheets
let sheets: any = null

function getSheetsClient() {
  if (sheets) return sheets

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!email || !privateKey) {
    throw new Error(
      'Google Sheets credentials not configured. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.'
    )
  }

  try {
    const auth = new JWT({
      email: email,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    sheets = google.sheets({ version: 'v4', auth })
    return sheets
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error)
    throw new Error('Failed to initialize Google Sheets client. Check your credentials.')
  }
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || ''

// Estructura de la hoja global
// Columnas: curso | alumno | dni | fecha | asistencia | profesor

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

interface Attendance {
  curso: string
  alumno: string
  dni: string
  fecha: string
  asistencia: 'Presente' | 'Ausente'
  profesor: string
}

// Obtener todas las filas de la hoja
async function getAllRows(sheetName: string = 'Asistencias'): Promise<any[][]> {
  try {
    const sheetsClient = getSheetsClient()
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:F`,
    })
    return response.data.values || []
  } catch (error) {
    console.error('Error obteniendo filas:', error)
    return []
  }
}

// Agregar fila a la hoja
async function appendRow(values: any[], sheetName: string = 'Asistencias') {
  try {
    const sheetsClient = getSheetsClient()
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:F`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    })
    return true
  } catch (error) {
    console.error('Error agregando fila:', error)
    return false
  }
}

// Actualizar fila específica
async function updateRow(
  rowIndex: number,
  values: any[],
  sheetName: string = 'Asistencias'
) {
  try {
    const sheetsClient = getSheetsClient()
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:F${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    })
    return true
  } catch (error) {
    console.error('Error actualizando fila:', error)
    return false
  }
}

// Eliminar fila
async function deleteRow(rowIndex: number, sheetName: string = 'Asistencias') {
  try {
    const sheetsClient = getSheetsClient()
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await getSheetId(sheetName),
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    })
    return true
  } catch (error) {
    console.error('Error eliminando fila:', error)
    return false
  }
}

// Obtener ID de la hoja
async function getSheetId(sheetName: string): Promise<number> {
  try {
    const sheetsClient = getSheetsClient()
    const response = await sheetsClient.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    const sheet = response.data.sheets?.find((s: any) => s.properties.title === sheetName)
    return sheet?.properties.sheetId || 0
  } catch (error) {
    console.error('Error obteniendo sheet ID:', error)
    return 0
  }
}

// Inicializar hoja si no existe
async function initializeSheet(sheetName: string = 'Asistencias') {
  try {
    const sheetsClient = getSheetsClient()
    const response = await sheetsClient.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    
    const sheetExists = response.data.sheets?.some(
      (s: any) => s.properties.title === sheetName
    )

    if (!sheetExists) {
      await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      })

      // Agregar encabezados
      await appendRow(['curso', 'alumno', 'dni', 'fecha', 'asistencia', 'profesor'], sheetName)
    } else {
      // Verificar si tiene encabezados
      const rows = await getAllRows(sheetName)
      if (rows.length === 0) {
        await appendRow(['curso', 'alumno', 'dni', 'fecha', 'asistencia', 'profesor'], sheetName)
      }
    }
  } catch (error) {
    console.error('Error inicializando hoja:', error)
  }
}

// CRUD de Cursos
export async function createCourse(data: Omit<Course, 'id'>) {
  await initializeSheet('Cursos')
  const courseId = `curso_${Date.now()}`
  await appendRow([courseId, data.nombre, data.año, data.profesor], 'Cursos')
  return { id: courseId, ...data }
}

export async function getCourses(): Promise<Course[]> {
  await initializeSheet('Cursos')
  const rows = await getAllRows('Cursos')
  if (rows.length === 0) return []
  
  return rows.slice(1).map((row, index) => ({
    id: row[0] || `curso_${index}`,
    nombre: row[1] || '',
    año: row[2] || '',
    profesor: row[3] || '',
  }))
}

export async function deleteCourse(courseId: string) {
  const rows = await getAllRows('Cursos')
  const rowIndex = rows.findIndex((row) => row[0] === courseId)
  if (rowIndex > 0) {
    await deleteRow(rowIndex + 1, 'Cursos')
  }
  
  // Eliminar todas las asistencias del curso
  await initializeSheet()
  const attendanceRows = await getAllRows()
  const rowsToDelete: number[] = []
  attendanceRows.forEach((row, index) => {
    if (row[0] === courseId && index > 0) {
      rowsToDelete.push(index + 1)
    }
  })
  
  // Eliminar en orden inverso para mantener índices correctos
  for (let i = rowsToDelete.length - 1; i >= 0; i--) {
    await deleteRow(rowsToDelete[i])
  }
  
  return true
}

export async function updateCourse(courseId: string, data: Partial<Course>) {
  const rows = await getAllRows('Cursos')
  const rowIndex = rows.findIndex((row) => row[0] === courseId)
  if (rowIndex > 0) {
    const currentRow = rows[rowIndex]
    const updatedRow = [
      courseId,
      data.nombre ?? currentRow[1],
      data.año ?? currentRow[2],
      data.profesor ?? currentRow[3],
    ]
    await updateRow(rowIndex + 1, updatedRow, 'Cursos')
    return true
  }
  return false
}

// CRUD de Alumnos
export async function addStudent(courseId: string, student: Omit<Student, 'id'>) {
  await initializeSheet('Alumnos')
  const studentId = `alumno_${Date.now()}`
  await appendRow([studentId, courseId, student.nombre, student.dni], 'Alumnos')
  return { id: studentId, ...student }
}

export async function getStudents(courseId: string): Promise<Student[]> {
  await initializeSheet('Alumnos')
  const rows = await getAllRows('Alumnos')
  if (rows.length === 0) return []
  
  return rows
    .slice(1)
    .filter((row) => row[1] === courseId)
    .map((row) => ({
      id: row[0],
      nombre: row[2] || '',
      dni: row[3] || '',
    }))
}

export async function removeStudent(courseId: string, studentId: string) {
  const rows = await getAllRows('Alumnos')
  const rowIndex = rows.findIndex(
    (row) => row[0] === studentId && row[1] === courseId
  )
  if (rowIndex > 0) {
    await deleteRow(rowIndex + 1, 'Alumnos')
  }
  
  // Eliminar asistencias del alumno
  await initializeSheet()
  const attendanceRows = await getAllRows()
  const rowsToDelete: number[] = []
  attendanceRows.forEach((row, index) => {
    if (row[0] === courseId && row[2] === rows[rowIndex]?.[3] && index > 0) {
      rowsToDelete.push(index + 1)
    }
  })
  
  for (let i = rowsToDelete.length - 1; i >= 0; i--) {
    await deleteRow(rowsToDelete[i])
  }
  
  return true
}

// Gestión de Asistencias
export async function saveAttendance(
  courseId: string,
  date: string,
  attendanceList: { studentId: string; dni: string; nombre: string; asistencia: 'Presente' | 'Ausente' }[],
  profesor: string
) {
  await initializeSheet()
  
  // Eliminar asistencias existentes para esta fecha y curso
  const rows = await getAllRows()
  const rowsToDelete: number[] = []
  rows.forEach((row, index) => {
    if (row[0] === courseId && row[3] === date && index > 0) {
      rowsToDelete.push(index + 1)
    }
  })
  
  for (let i = rowsToDelete.length - 1; i >= 0; i--) {
    await deleteRow(rowsToDelete[i])
  }
  
  // Agregar nuevas asistencias
  for (const att of attendanceList) {
    await appendRow([
      courseId,
      att.nombre,
      att.dni,
      date,
      att.asistencia,
      profesor,
    ])
  }
  
  return true
}

export async function getAttendance(courseId: string, date: string): Promise<Attendance[]> {
  await initializeSheet()
  const rows = await getAllRows()
  if (rows.length === 0) return []
  
  return rows
    .slice(1)
    .filter((row) => row[0] === courseId && row[3] === date)
    .map((row) => ({
      curso: row[0],
      alumno: row[1],
      dni: row[2],
      fecha: row[3],
      asistencia: row[4] as 'Presente' | 'Ausente',
      profesor: row[5],
    }))
}

export async function getAllAttendance(courseId: string): Promise<Attendance[]> {
  await initializeSheet()
  const rows = await getAllRows()
  if (rows.length === 0) return []
  
  return rows
    .slice(1)
    .filter((row) => row[0] === courseId)
    .map((row) => ({
      curso: row[0],
      alumno: row[1],
      dni: row[2],
      fecha: row[3],
      asistencia: row[4] as 'Presente' | 'Ausente',
      profesor: row[5],
    }))
}

// Reportes
export interface ReportData {
  studentName: string
  dni: string
  totalClasses: number
  presentCount: number
  absentCount: number
  attendancePercentage: number
}

export async function getReport(courseId: string): Promise<ReportData[]> {
  const attendance = await getAllAttendance(courseId)
  const students = await getStudents(courseId)
  
  const report: ReportData[] = students.map((student) => {
    const studentAttendance = attendance.filter((att) => att.dni === student.dni)
    const totalClasses = new Set(studentAttendance.map((att) => att.fecha)).size
    const presentCount = studentAttendance.filter((att) => att.asistencia === 'Presente').length
    const absentCount = studentAttendance.filter((att) => att.asistencia === 'Ausente').length
    const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0
    
    return {
      studentName: student.nombre,
      dni: student.dni,
      totalClasses,
      presentCount,
      absentCount,
      attendancePercentage,
    }
  })
  
  return report.sort((a, b) => b.attendancePercentage - a.attendancePercentage)
}

