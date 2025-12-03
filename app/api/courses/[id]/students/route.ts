import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addStudent, getStudents } from '@/lib/googleSheets'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const students = await getStudents(params.id)
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al obtener alumnos' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const student = await addStudent(params.id, {
      nombre: body.nombre,
      dni: body.dni,
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al agregar alumno' }, { status: 500 })
  }
}

