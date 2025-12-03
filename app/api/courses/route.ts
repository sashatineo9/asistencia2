import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCourse, getCourses } from '@/lib/googleSheets'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const courses = await getCourses()
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const course = await createCourse({
      nombre: body.nombre,
      año: body.año,
      profesor: body.profesor || session.user?.name || 'Profesor',
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al crear curso' }, { status: 500 })
  }
}

