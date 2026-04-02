"use client";

import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { theme } from "@/styles/theme";

/**
 * @description Página de citas del psicólogo
 */
export default function AppointmentsPage() {
  const { psychologist, isLoading: authLoading } = useAuth();
  const { appointments, isLoading } = useAppointments();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !psychologist) {
      router.push("/login");
    }
  }, [psychologist, authLoading, router]);

  if (authLoading || isLoading) {
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
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                background: "none",
                border: "none",
                color: theme.colors.textSecondary,
                fontSize: "13px",
                cursor: "pointer",
                marginBottom: theme.spacing.xs,
                fontFamily: theme.fonts.body,
              }}
            >
              ← Volver al panel
            </button>
            <h1 style={{
              fontFamily: theme.fonts.heading,
              fontSize: "28px",
              color: theme.colors.textPrimary,
            }}>
              Citas
            </h1>
          </div>
        </div>

        {/* Lista de citas */}
        <div style={{
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>
          {appointments.length === 0 ? (
            <div style={{
              padding: theme.spacing.xxl,
              textAlign: "center",
              color: theme.colors.textMuted,
            }}>
              No hay citas registradas
            </div>
          ) : (
            appointments.map((apt: any) => (
              <div key={apt.id} style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.lg,
                padding: theme.spacing.lg,
                borderBottom: `1px solid ${theme.colors.sand200}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: theme.colors.textPrimary }}>
                    {apt.patient.name}
                  </div>
                  <div style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                    {new Date(apt.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: theme.colors.sage400 }}>
                  {apt.amount}€
                </div>
                <div style={{
                  background: apt.paid ? theme.colors.sage100 : theme.colors.accent100,
                  color: apt.paid ? theme.colors.sage400 : theme.colors.accent400,
                  borderRadius: theme.borderRadius.full,
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}>
                  {apt.paid ? "Pagada" : "Pendiente"}
                </div>
                <div style={{
                  background: theme.colors.sand200,
                  borderRadius: theme.borderRadius.full,
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: theme.colors.textSecondary,
                }}>
                  {apt.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}