import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @description Registro de un nuevo psicólogo
 * @route POST /api/auth/register
 */
export async function registerPsychologist(request: Request) {
  try {
    // Extraer datos del body
    const { email, password, name, subdomain } = await request.json();

    // Verificar si el email ya existe
    const existingEmail = await prisma.psychologist.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 },
      );
    }

    // Verificar si el subdominio ya existe
    const existingSubdomain = await prisma.psychologist.findUnique({
      where: { subdomain },
    });

    if (existingSubdomain) {
      return NextResponse.json(
        { error: "Este subdominio ya está en uso" },
        { status: 400 },
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear psicólogo en la base de datos
    const psychologist = await prisma.psychologist.create({
      data: {
        email,
        password: hashedPassword,
        name,
        subdomain,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        data: {
          id: psychologist.id,
          email: psychologist.email,
          name: psychologist.name,
          subdomain: psychologist.subdomain,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * @description Login de un psicólogo
 * @route POST /api/auth/login
 */
export async function loginPsychologist(request: Request) {
  try {
    // Extraer datos del body
    const { email, password } = await request.json();

    // Buscar psicólogo por email
    const psychologist = await prisma.psychologist.findUnique({
      where: { email },
    });

    // Verificar si existe
    if (!psychologist) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, psychologist.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: psychologist.id,
        email: psychologist.email,
        subdomain: psychologist.subdomain,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return NextResponse.json({
      ok: true,
      token,
      data: {
        id: psychologist.id,
        email: psychologist.email,
        name: psychologist.name,
        subdomain: psychologist.subdomain,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * @description Obtiene los datos del psicólogo autenticado
 */
export async function getMe(request: Request) {
  try {
    // Extraer token del header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    // Decodificar token
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Buscar psicólogo en la base de datos
    const psychologist = await prisma.psychologist.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        subdomain: true,
        bio: true,
        logo: true,
        price: true,
        instagram: true,
        facebook: true,
        linkedin: true,
        website: true,
        createdAt: true,
      },
    });

    if (!psychologist) {
      return NextResponse.json(
        { error: "Psicólogo no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: psychologist,
    });
  } catch (error) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

/**
 * @description Actualiza el perfil del psicólogo autenticado
 */
export async function updateProfile(request: Request) {
  try {
    // Extraer token del header
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    // Decodificar token
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
      id: string
    }

    // Extraer datos del body
    const { name, bio, price, instagram, facebook, linkedin, website } =
      await request.json()

    // Actualizar psicólogo en la base de datos
    const psychologist = await prisma.psychologist.update({
      where: { id: decoded.id },
      data: {
        name,
        bio,
        price,
        instagram,
        facebook,
        linkedin,
        website,
      },
      select: {
        id: true,
        email: true,
        name: true,
        subdomain: true,
        bio: true,
        logo: true,
        price: true,
        instagram: true,
        facebook: true,
        linkedin: true,
        website: true,
      }
    })

    return NextResponse.json({
      ok: true,
      data: psychologist
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}
