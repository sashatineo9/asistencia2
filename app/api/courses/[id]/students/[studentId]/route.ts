import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { removeStudent } from '@/lib/googleSheets'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await removeStudent(params.id, params.studentId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar alumno' }, { status: 500 })
  }
}

