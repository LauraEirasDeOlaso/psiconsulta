import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

/**
 * @description Registro de un nuevo psicólogo
 * @route POST /api/auth/register
 */
export async function POST(request: Request) {
  try {
    // Extraer datos del body
    const { email, password, name, subdomain } = await request.json()

    // Verificar si el email ya existe
    const existingEmail = await prisma.psychologist.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Verificar si el subdominio ya existe
    const existingSubdomain = await prisma.psychologist.findUnique({
      where: { subdomain }
    })

    if (existingSubdomain) {
      return NextResponse.json(
        { error: 'Este subdominio ya está en uso' },
        { status: 400 }
      )
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear psicólogo en la base de datos
    const psychologist = await prisma.psychologist.create({
      data: {
        email,
        password: hashedPassword,
        name,
        subdomain,
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        id: psychologist.id,
        email: psychologist.email,
        name: psychologist.name,
        subdomain: psychologist.subdomain,
      }
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}