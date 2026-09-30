import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

function getIdFromToken(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string }
  return decoded.id
}

/**
 * @description Eliminar un social link
 * @route DELETE /api/psychologist/social-links/[id]
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    getIdFromToken(request)
    const { id } = await params

    await prisma.socialLink.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar link' }, { status: 500 })
  }
}