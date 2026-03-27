export const theme = {
  colors: {
    // Fondos
    background: "#FAF7F0",
    surface: "#FFFFFF",
    surfaceAlt: "#F5EFE6",

    // Arena
    sand100: "#FAF7F0",
    sand200: "#F0E8D8",
    sand300: "#D4BC9A",
    sand400: "#B8976A",

    // Verde salvia
    sage100: "#EBF2EC",
    sage200: "#A8C4AB",
    sage300: "#6B8F71",
    sage400: "#3D5C42",

    // Acento cálido
    accent100: "#F5E6D8",
    accent400: "#C4845A",

    // Texto
    textPrimary: "#1E2420",
    textSecondary: "#7A8A7D",
    textMuted: "#A0A8A2",

    // Semánticos
    success: "#6AAE8A",
    warning: "#E07A30",
    error: "#E07070",
    white: "#FFFFFF",
  },

  fonts: {
    heading: "'Playfair Display', serif",
    body: "'DM Sans', sans-serif",
  },

  borderRadius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    full: "9999px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
} as const;

export type Theme = typeof theme;