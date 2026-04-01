import { getMe } from '@/modules/auth/auth.service'

/**
 * @description Obtener psicólogo autenticado
 * @route GET /api/auth/me
 */
export async function GET(request: Request) {
  return getMe(request)
}