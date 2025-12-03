import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveAttendance, getAttendance } from '@/lib/googleSheets'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const attendance = await getAttendance(params.id, date)
    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al obtener asistencia' }, { status: 500 })
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
    const profesor = session.user?.name || 'Profesor'

    await saveAttendance(
      params.id,
      body.date,
      body.attendance,
      profesor
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al guardar asistencia' }, { status: 500 })
  }
}

