"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { theme } from "@/styles/theme";
import { useDashboardStats } from "@/hooks/useDashboardStats";

/**
 * @description Panel principal del psicólogo
 */
export default function DashboardPage() {
  const { psychologist, logout, isLoading } = useAuth();
  const router = useRouter();
  const { stats } = useDashboardStats();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !psychologist) {
      router.push("/login");
    }
  }, [psychologist, isLoading, router]);

  if (isLoading) {
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

  return (
    <main style={{
      minHeight: "100vh",
      background: theme.colors.background,
      fontFamily: theme.fonts.body,
      padding: theme.spacing.xxl,
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.xxl,
        }}>
          <div>
            <h1 style={{
              fontFamily: theme.fonts.heading,
              fontSize: "28px",
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.xs,
            }}>
              Buenos días, {psychologist?.name} ☀️
            </h1>
            <p style={{ color: theme.colors.textSecondary, fontSize: "14px" }}>
              {psychologist?.subdomain}.psiconsulta.app
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: `1.5px solid ${theme.colors.sand300}`,
              borderRadius: theme.borderRadius.md,
              padding: "8px 20px",
              fontSize: "13px",
              color: theme.colors.textSecondary,
              cursor: "pointer",
              fontFamily: theme.fonts.body,
            }}
          >
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.xxl,
        }}>
          {[
            { label: "Pacientes", value: String(stats?.totalPatients ?? 0), icon: "👥", color: theme.colors.sage300 },
            { label: "Citas hoy", value: String(stats?.todayAppointments ?? 0), icon: "📅", color: theme.colors.accent400 },
            { label: "Este mes", value: `${stats?.monthlyRevenue ?? 0}€`, icon: "💶", color: theme.colors.sage400 },
            { label: "Pendiente", value: `${stats?.pendingRevenue ?? 0}€`, icon: "⏳", color: theme.colors.warning },
          ].map(stat => (
            <div key={stat.label} style={{
              background: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: "24px", marginBottom: theme.spacing.sm }}>{stat.icon}</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: theme.colors.textMuted }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Links rápidos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing.lg }}>
          {[
            { label: "Ver pacientes", href: "/dashboard/patients", icon: "👥" },
            { label: "Ver citas", href: "/dashboard/appointments", icon: "📅" },
          ].map(link => (
            <button
              key={link.label}
              onClick={() => router.push(link.href)}
              style={{
                background: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                border: `1.5px solid ${theme.colors.sand200}`,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: theme.fonts.body,
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: theme.spacing.sm }}>{link.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: theme.colors.textPrimary }}>{link.label}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}