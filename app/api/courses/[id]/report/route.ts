import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getReport } from '@/lib/googleSheets'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const report = await getReport(params.id)
    return NextResponse.json(report)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al obtener reporte' }, { status: 500 })
  }
}

