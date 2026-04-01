import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @description Protege las rutas privadas verificando el token JWT
 */
export function proxy(request: NextRequest) {
  // Rutas que NO necesitan autenticación
  const publicRoutes = [
    "/api/auth/register",
    "/api/auth/login",
    "/api/docs",
    "/api/openapi",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Si es ruta pública dejamos pasar
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar token en el header
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

/**
 * @description Define qué rutas pasan por el middleware
 */
export const config = {
  matcher: "/api/:path*",
};
