import { NextResponse } from "next/server";

/**
 * @description Especificación OpenAPI de la API
 * @route GET /api/openapi
 */
export async function GET() {
  return NextResponse.json({
    openapi: "3.0.0",
    info: {
      title: "PsiConsulta API",
      version: "1.0.0",
      description:
        "API para la plataforma de gestión de consultas psicológicas",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/api/auth/register": {
        post: {
          summary: "Registro de psicólogo",
          tags: ["Auth"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "name", "subdomain"],
                  properties: {
                    email: { type: "string", example: "jose@gmail.com" },
                    password: { type: "string", example: "12345678" },
                    name: { type: "string", example: "José Martín" },
                    subdomain: { type: "string", example: "jose" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Psicólogo creado correctamente" },
            400: { description: "Email o subdominio ya en uso" },
            500: { description: "Error interno del servidor" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Login de psicólogo",
          tags: ["Auth"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "jose@gmail.com" },
                    password: { type: "string", example: "12345678" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login exitoso, devuelve token JWT" },
            401: { description: "Credenciales incorrectas" },
            500: { description: "Error interno del servidor" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          summary: "Obtener psicólogo autenticado",
          tags: ["Auth"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Datos del psicólogo autenticado" },
            401: { description: "No autorizado" },
          },
        },
      },
    },
  });
}
