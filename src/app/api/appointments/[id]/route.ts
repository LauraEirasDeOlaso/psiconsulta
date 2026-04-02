import { getAppointmentById, updateAppointment, deleteAppointment } from '@/modules/appointments/appointments.service'

/**
 * @description Obtener una cita por ID
 * @route GET /api/appointments/[id]
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return getAppointmentById(request, id)
}

/**
 * @description Actualizar una cita
 * @route PUT /api/appointments/[id]
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return updateAppointment(request, id)
}

/**
 * @description Eliminar una cita
 * @route DELETE /api/appointments/[id]
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return deleteAppointment(request, id)
}