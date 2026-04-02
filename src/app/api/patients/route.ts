import { createPatient, getPatients } from '@/modules/patients/patients.service'

/**
 * @description Listar pacientes del psicólogo
 * @route GET /api/patients
 */
export async function GET(request: Request) {
  return getPatients(request)
}

/**
 * @description Crear un nuevo paciente
 * @route POST /api/patients
 */
export async function POST(request: Request) {
  return createPatient(request)
}