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
 * @description Crea un nuevo paciente
 * @route POST /api/patients
 */
export async function createPatient(request: Request) {
  try {
    const psychologistId = getPsychologistId(request)
    const { name, email } = await request.json()

    const existing = await prisma.patient.findFirst({
      where: { email, psychologistId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Este paciente ya existe' },
        { status: 400 }
      )
    }

    const patient = await prisma.patient.create({
      data: { name, email, psychologistId }
    })

    return NextResponse.json({ ok: true, data: patient }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear el paciente' },
      { status: 500 }
    )
  }
}

/**
 * @description Lista todos los pacientes del psicólogo autenticado
 * @route GET /api/patients
 */
export async function getPatients(request: Request) {
  try {
    const psychologistId = getPsychologistId(request)

    const patients = await prisma.patient.findMany({
      where: { psychologistId },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 1,
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ ok: true, data: patients })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener los pacientes' },
      { status: 500 }
    )
  }
}

/**
 * @description Obtiene un paciente por ID
 * @route GET /api/patients/[id]
 */
export async function getPatientById(request: Request, id: string) {
  try {
    const psychologistId = getPsychologistId(request)

    const patient = await prisma.patient.findFirst({
      where: { id, psychologistId },
      include: {
        appointments: {
          orderBy: { date: 'desc' }
        }
      }
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, data: patient })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el paciente' },
      { status: 500 }
    )
  }
}

/**
 * @description Actualiza un paciente
 * @route PUT /api/patients/[id]
 */
export async function updatePatient(request: Request, id: string) {
  try {
    const psychologistId = getPsychologistId(request)
    const { name, email } = await request.json()

    const patient = await prisma.patient.update({
      where: { id, psychologistId },
      data: { name, email }
    })

    return NextResponse.json({ ok: true, data: patient })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el paciente' },
      { status: 500 }
    )
  }
}

/**
 * @description Elimina un paciente
 * @route DELETE /api/patients/[id]
 */
export async function deletePatient(request: Request, id: string) {
  try {
    const psychologistId = getPsychologistId(request)

    await prisma.patient.delete({
      where: { id, psychologistId }
    })

    return NextResponse.json({ ok: true, message: 'Paciente eliminado correctamente' })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar el paciente' },
      { status: 500 }
    )
  }
}