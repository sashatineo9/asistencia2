import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, nombre } = body

    // Validaciones
    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Crear usuario
    const user = await createUser(email, password, nombre)

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear la cuenta' },
      { status: 500 }
    )
  }
}

