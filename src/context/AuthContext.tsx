"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

/**
 * @description Tipos del contexto de autenticación
 */
interface Psychologist {
  id: string;
  email: string;
  name: string;
  subdomain: string;
  bio: string | null;
  logo: string | null;
  price: number;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  website: string | null;
}

interface AuthContextType {
  psychologist: Psychologist | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * @description Proveedor del contexto de autenticación
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token guardado al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Obtener perfil del psicólogo autenticado
  async function fetchProfile(token: string) {
    try {
      const { data } = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPsychologist(data.data);
    } catch {
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  // Login
  async function login(email: string, password: string) {
    const { data } = await axios.post("/api/auth/login", { email, password });
    const { token, data: psychologist } = data;
    localStorage.setItem("token", token);
    setToken(token);
    setPsychologist(psychologist);
  }

  // Logout
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setPsychologist(null);
  }

  return (
    <AuthContext.Provider value={{ psychologist, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * @description Hook para consumir el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}