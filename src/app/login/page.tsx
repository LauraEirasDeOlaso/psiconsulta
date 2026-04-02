"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/styles/theme";

/**
 * @description Página de login del psicólogo
 */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: theme.colors.background,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.fonts.body,
    }}>
      <div style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xxl,
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: theme.spacing.xl }}>
          <h1 style={{
            fontFamily: theme.fonts.heading,
            fontSize: "28px",
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xs,
          }}>
            PsiConsulta
          </h1>
          <p style={{ color: theme.colors.textSecondary, fontSize: "14px" }}>
            Inicia sesión en tu panel profesional
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: theme.colors.textSecondary, display: "block", marginBottom: theme.spacing.xs }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jose@gmail.com"
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

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: theme.colors.textSecondary, display: "block", marginBottom: theme.spacing.xs }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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

          {error && (
            <p style={{ color: theme.colors.error, fontSize: "13px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? theme.colors.sage300 : theme.colors.sage400,
              color: theme.colors.white,
              border: "none",
              borderRadius: theme.borderRadius.md,
              padding: "14px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: theme.fonts.body,
              marginTop: theme.spacing.sm,
            }}
          >
            {isLoading ? "Iniciando sesión..." : "Entrar al panel →"}
          </button>
        </form>
      </div>
    </main>
  );
}