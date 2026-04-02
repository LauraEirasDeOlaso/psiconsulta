import { createAppointment, getAppointments } from '@/modules/appointments/appointments.service'

/**
 * @description Listar citas del psicólogo
 * @route GET /api/appointments
 */
export async function GET(request: Request) {
  return getAppointments(request)
}

/**
 * @description Crear una nueva cita
 * @route POST /api/appointments
 */
export async function POST(request: Request) {
  return createAppointment(request)
}