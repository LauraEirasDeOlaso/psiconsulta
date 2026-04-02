"use client";

import { useAuth } from "@/context/AuthContext";
import { usePatients } from "@/hooks/usePatients";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { theme } from "@/styles/theme";

/**
 * @description Página de pacientes del psicólogo
 */
export default function PatientsPage() {
  const { psychologist, isLoading: authLoading } = useAuth();
  const { patients, isLoading, createPatient } = usePatients();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!authLoading && !psychologist) {
      router.push("/login");
    }
  }, [psychologist, authLoading, router]);

  async function handleCreatePatient(e: React.FormEvent) {
    e.preventDefault();
    await createPatient.mutateAsync({ name, email });
    setName("");
    setEmail("");
    setShowForm(false);
  }

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
              Pacientes
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: theme.colors.sage400,
              color: theme.colors.white,
              border: "none",
              borderRadius: theme.borderRadius.md,
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: theme.fonts.body,
            }}
          >
            + Nuevo paciente
          </button>
        </div>

        {/* Formulario nuevo paciente */}
        {showForm && (
          <form onSubmit={handleCreatePatient} style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.lg,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            display: "flex",
            gap: theme.spacing.md,
            alignItems: "flex-end",
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: theme.colors.textSecondary, display: "block", marginBottom: theme.spacing.xs }}>
                NOMBRE
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Laura Martínez"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: theme.borderRadius.md,
                  border: `1.5px solid ${theme.colors.sand300}`,
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: theme.fonts.body,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: theme.colors.textSecondary, display: "block", marginBottom: theme.spacing.xs }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="laura@gmail.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: theme.borderRadius.md,
                  border: `1.5px solid ${theme.colors.sand300}`,
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: theme.fonts.body,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={createPatient.isPending}
              style={{
                background: theme.colors.sage400,
                color: theme.colors.white,
                border: "none",
                borderRadius: theme.borderRadius.md,
                padding: "12px 24px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: theme.fonts.body,
                whiteSpace: "nowrap",
              }}
            >
              {createPatient.isPending ? "Guardando..." : "Guardar"}
            </button>
          </form>
        )}

        {/* Lista de pacientes */}
        <div style={{
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>
          {patients.length === 0 ? (
            <div style={{
              padding: theme.spacing.xxl,
              textAlign: "center",
              color: theme.colors.textMuted,
            }}>
              No hay pacientes registrados
            </div>
          ) : (
            patients.map((patient: any) => (
              <div key={patient.id} style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.lg,
                padding: theme.spacing.lg,
                borderBottom: `1px solid ${theme.colors.sand200}`,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: theme.colors.sage300,
                  color: theme.colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: theme.colors.textPrimary }}>
                    {patient.name}
                  </div>
                  <div style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                    {patient.email}
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                  {patient.appointments?.length ?? 0} citas
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}