import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * @description Obtiene el ID del psicólogo desde el token
 */
function getPsychologistId(request: Request): string {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string }
  return decoded.id
}

/**
 * @description Crea una nueva cita
 * @route POST /api/appointments
 */
export async function createAppointment(request: Request) {
  try {
    const psychologistId = getPsychologistId(request)
    const { patientId, date, amount } = await request.json()

    const appointment = await prisma.appointment.create({
      data: {
        psychologistId,
        patientId,
        date: new Date(date),
        amount,
      },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ ok: true, data: appointment }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear la cita' },
      { status: 500 }
    )
  }
}

/**
 * @description Lista todas las citas del psicólogo autenticado
 * @route GET /api/appointments
 */
export async function getAppointments(request: Request) {
  try {
    const psychologistId = getPsychologistId(request)

    const appointments = await prisma.appointment.findMany({
      where: { psychologistId },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json({ ok: true, data: appointments })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    )
  }
}

/**
 * @description Obtiene una cita por ID
 * @route GET /api/appointments/[id]
 */
export async function getAppointmentById(request: Request, id: string) {
  try {
    const psychologistId = getPsychologistId(request)

    const appointment = await prisma.appointment.findFirst({
      where: { id, psychologistId },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, data: appointment })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener la cita' },
      { status: 500 }
    )
  }
}

/**
 * @description Actualiza el estado de una cita
 * @route PUT /api/appointments/[id]
 */
export async function updateAppointment(request: Request, id: string) {
  try {
    const psychologistId = getPsychologistId(request)
    const { status, paid, date, amount } = await request.json()

    const appointment = await prisma.appointment.update({
      where: { id, psychologistId },
      data: { status, paid, date: date ? new Date(date) : undefined, amount },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ ok: true, data: appointment })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar la cita' },
      { status: 500 }
    )
  }
}

/**
 * @description Elimina una cita
 * @route DELETE /api/appointments/[id]
 */
export async function deleteAppointment(request: Request, id: string) {
  try {
    const psychologistId = getPsychologistId(request)

    await prisma.appointment.delete({
      where: { id, psychologistId }
    })

    return NextResponse.json({ ok: true, message: 'Cita eliminada correctamente' })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar la cita' },
      { status: 500 }
    )
  }
}