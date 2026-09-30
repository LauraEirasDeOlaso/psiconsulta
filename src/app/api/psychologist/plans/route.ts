import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

function getIdFromToken(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string }
  return decoded.id
}

/**
 * @description Crear un plan
 * @route POST /api/psychologist/plans
 */
export async function POST(request: Request) {
  try {
    const id = getIdFromToken(request)
    const { name, price, description, features, highlighted, order } = await request.json()

    const plan = await prisma.plan.create({
      data: { name, price, description, features, highlighted, order, psychologistId: id },
    })

    return NextResponse.json({ ok: true, data: plan }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear plan' }, { status: 500 })
  }
}