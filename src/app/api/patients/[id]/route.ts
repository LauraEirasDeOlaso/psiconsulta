import { getPatientById, updatePatient, deletePatient } from '@/modules/patients/patients.service'

/**
 * @description Obtener un paciente por ID
 * @route GET /api/patients/[id]
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return getPatientById(request, id)
}

/**
 * @description Actualizar un paciente
 * @route PUT /api/patients/[id]
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return updatePatient(request, id)
}

/**
 * @description Eliminar un paciente
 * @route DELETE /api/patients/[id]
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return deletePatient(request, id)
}