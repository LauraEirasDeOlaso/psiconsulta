import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

/**
 * @description Hook para gestionar pacientes
 */
export function usePatients() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const headers = { Authorization: `Bearer ${token}` };

  // Listar pacientes
  const { data, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data } = await axios.get("/api/patients", { headers });
      return data.data;
    },
    enabled: !!token,
  });

  // Crear paciente
  const createPatient = useMutation({
    mutationFn: async (patient: { name: string; email: string }) => {
      const { data } = await axios.post("/api/patients", patient, { headers });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  // Eliminar paciente
  const deletePatient = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/patients/${id}`, { headers });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  return {
    patients: data ?? [],
    isLoading,
    createPatient,
    deletePatient,
  };
}