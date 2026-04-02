import { getDashboardStats } from '@/modules/dashboard/dashboard.service'

/**
 * @description Obtener estadísticas del dashboard
 * @route GET /api/dashboard/stats
 */
export async function GET(request: Request) {
  return getDashboardStats(request)
}