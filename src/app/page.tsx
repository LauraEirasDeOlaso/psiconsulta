"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/styles/theme";

/**
 * @description Página de inicio - redirige según estado de autenticación
 */
export default function HomePage() {
  const { psychologist, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (psychologist) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [psychologist, isLoading, router]);

  return (
    <main style={{
      minHeight: "100vh",
      background: theme.colors.background,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.fonts.body,
    }}>
      <p style={{ color: theme.colors.textSecondary }}>Cargando...</p>
    </main>
  );
}