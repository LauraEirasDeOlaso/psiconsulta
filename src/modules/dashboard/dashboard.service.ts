import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * @description Obtiene las estadísticas del dashboard del psicólogo
 * @route GET /api/dashboard/stats
 */
export async function getDashboardStats(request: Request) {
  try {
    // Extraer ID del psicólogo desde el token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string }
    const psychologistId = decoded.id

    // Fecha de hoy
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    // Inicio del mes
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Total pacientes
    const totalPatients = await prisma.patient.count({
      where: { psychologistId }
    })

    // Citas de hoy
    const todayAppointments = await prisma.appointment.count({
      where: {
        psychologistId,
        date: { gte: startOfDay, lte: endOfDay }
      }
    })

    // Ingresos del mes (citas pagadas)
    const monthlyRevenue = await prisma.appointment.aggregate({
      where: {
        psychologistId,
        paid: true,
        date: { gte: startOfMonth }
      },
      _sum: { amount: true }
    })

    // Cobros pendientes
    const pendingRevenue = await prisma.appointment.aggregate({
      where: {
        psychologistId,
        paid: false,
      },
      _sum: { amount: true }
    })

    return NextResponse.json({
      ok: true,
      data: {
        totalPatients,
        todayAppointments,
        monthlyRevenue: monthlyRevenue._sum.amount ?? 0,
        pendingRevenue: pendingRevenue._sum.amount ?? 0,
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}