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
      "/api/psychologist/profile": {
        get: {
          summary: "Obtener perfil del psicólogo",
          tags: ["Psychologist"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Perfil del psicólogo" },
            401: { description: "No autorizado" },
          },
        },
        put: {
          summary: "Actualizar perfil del psicólogo",
          tags: ["Psychologist"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "José Martín" },
                    bio: {
                      type: "string",
                      example: "Psicólogo clínico con 4 años de experiencia",
                    },
                    price: { type: "number", example: 65 },
                    instagram: { type: "string", example: "@josepsicologo" },
                    facebook: { type: "string", example: "josepsicologo" },
                    linkedin: { type: "string", example: "jose-martin" },
                    website: {
                      type: "string",
                      example: "https://josepsicologo.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Perfil actualizado correctamente" },
            401: { description: "No autorizado" },
            500: { description: "Error interno del servidor" },
          },
        },
      },
      "/api/appointments": {
        get: {
          summary: "Listar citas del psicólogo",
          tags: ["Appointments"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Lista de citas" },
            401: { description: "No autorizado" },
          },
        },
        post: {
          summary: "Crear una nueva cita",
          tags: ["Appointments"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["patientId", "date", "amount"],
                  properties: {
                    patientId: { type: "string", example: "cmnfw17l70000v8dn" },
                    date: {
                      type: "string",
                      example: "2026-04-10T09:00:00.000Z",
                    },
                    amount: { type: "number", example: 65 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Cita creada correctamente" },
            401: { description: "No autorizado" },
            500: { description: "Error interno del servidor" },
          },
        },
      },
      "/api/appointments/{id}": {
        get: {
          summary: "Obtener una cita por ID",
          tags: ["Appointments"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Cita encontrada" },
            404: { description: "Cita no encontrada" },
          },
        },
        put: {
          summary: "Actualizar una cita",
          tags: ["Appointments"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "confirmed" },
                    paid: { type: "boolean", example: true },
                    date: {
                      type: "string",
                      example: "2026-04-10T09:00:00.000Z",
                    },
                    amount: { type: "number", example: 65 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Cita actualizada correctamente" },
            401: { description: "No autorizado" },
          },
        },
        delete: {
          summary: "Eliminar una cita",
          tags: ["Appointments"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Cita eliminada correctamente" },
            401: { description: "No autorizado" },
          },
        },
      },
      "/api/patients": {
        get: {
          summary: "Listar pacientes del psicólogo",
          tags: ["Patients"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Lista de pacientes" },
            401: { description: "No autorizado" },
          },
        },
        post: {
          summary: "Crear un nuevo paciente",
          tags: ["Patients"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email"],
                  properties: {
                    name: { type: "string", example: "Laura Martínez" },
                    email: { type: "string", example: "laura@gmail.com" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Paciente creado correctamente" },
            400: { description: "Paciente ya existe" },
            500: { description: "Error interno del servidor" },
          },
        },
      },
      "/api/patients/{id}": {
        get: {
          summary: "Obtener un paciente por ID",
          tags: ["Patients"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Paciente encontrado" },
            404: { description: "Paciente no encontrado" },
          },
        },
        put: {
          summary: "Actualizar un paciente",
          tags: ["Patients"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Laura Martínez" },
                    email: { type: "string", example: "laura@gmail.com" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Paciente actualizado correctamente" },
            401: { description: "No autorizado" },
          },
        },
        delete: {
          summary: "Eliminar un paciente",
          tags: ["Patients"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Paciente eliminado correctamente" },
            401: { description: "No autorizado" },
          },
        },
      },
    },
  });
}
