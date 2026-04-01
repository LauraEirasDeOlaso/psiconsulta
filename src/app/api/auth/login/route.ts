import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * @description Login de un psicólogo
 * @route POST /api/auth/login
 */
export async function POST(request: Request) {
  try {
    // Extraer datos del body
    const { email, password } = await request.json()

    // Buscar psicólogo por email
    const psychologist = await prisma.psychologist.findUnique({
      where: { email }
    })

    // Verificar si existe
    if (!psychologist) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, psychologist.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: psychologist.id,
        email: psychologist.email,
        subdomain: psychologist.subdomain,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      ok: true,
      token,
      data: {
        id: psychologist.id,
        email: psychologist.email,
        name: psychologist.name,
        subdomain: psychologist.subdomain,
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
