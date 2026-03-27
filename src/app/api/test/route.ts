import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const psychologists = await prisma.psychologist.findMany()
    return NextResponse.json({ 
      ok: true, 
      data: psychologists,
      message: 'Conexión exitosa!' 
    })
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: String(error) 
    }, { status: 500 })
  }
}