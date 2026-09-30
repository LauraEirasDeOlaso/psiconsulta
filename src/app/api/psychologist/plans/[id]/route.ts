import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

function getIdFromToken(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string }
  return decoded.id
}

/**
 * @description Actualizar un plan
 * @route PUT /api/psychologist/plans/[id]
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    getIdFromToken(request)
    const { id } = await params
    const { name, price, description, features, highlighted, order } = await request.json()

    const plan = await prisma.plan.update({
      where: { id },
      data: { name, price, description, features, highlighted, order },
    })

    return NextResponse.json({ ok: true, data: plan })
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar plan' }, { status: 500 })
  }
}

/**
 * @description Eliminar un plan
 * @route DELETE /api/psychologist/plans/[id]
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    getIdFromToken(request)
    const { id } = await params

    await prisma.plan.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar plan' }, { status: 500 })
  }
}