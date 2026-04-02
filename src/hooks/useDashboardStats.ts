import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

/**
 * @description Hook para obtener estadísticas del dashboard
 */
export function useDashboardStats() {
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
    enabled: !!token,
  });

  return {
    stats: data,
    isLoading,
  };
}