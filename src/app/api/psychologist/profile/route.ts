import { getMe, updateProfile } from '@/modules/auth/auth.service'

/**
 * @description Obtener perfil del psicólogo autenticado
 * @route GET /api/psychologist/profile
 */
export async function GET(request: Request) {
  return getMe(request)
}

/**
 * @description Actualizar perfil del psicólogo autenticado
 * @route PUT /api/psychologist/profile
 */
export async function PUT(request: Request) {
  return updateProfile(request)
}