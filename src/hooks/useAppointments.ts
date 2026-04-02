import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

/**
 * @description Hook para gestionar citas
 */
export function useAppointments() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const headers = { Authorization: `Bearer ${token}` };

  // Listar citas
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data } = await axios.get("/api/appointments", { headers });
      return data.data;
    },
    enabled: !!token,
  });

  // Crear cita
  const createAppointment = useMutation({
    mutationFn: async (appointment: {
      patientId: string;
      date: string;
      amount: number;
    }) => {
      const { data } = await axios.post("/api/appointments", appointment, { headers });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  // Actualizar cita
  const updateAppointment = useMutation({
    mutationFn: async ({ id, ...rest }: { id: string; status?: string; paid?: boolean }) => {
      const { data } = await axios.put(`/api/appointments/${id}`, rest, { headers });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  // Eliminar cita
  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/appointments/${id}`, { headers });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return {
    appointments: data ?? [],
    isLoading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}