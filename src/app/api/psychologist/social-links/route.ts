import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

function getIdFromToken(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string }
  return decoded.id
}

/**
 * @description Crear un social link
 * @route POST /api/psychologist/social-links
 */
export async function POST(request: Request) {
  try {
    const id = getIdFromToken(request)
    const { platform, url } = await request.json()

    const link = await prisma.socialLink.create({
      data: { platform, url, psychologistId: id },
    })

    return NextResponse.json({ ok: true, data: link }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear link' }, { status: 500 })
  }
}