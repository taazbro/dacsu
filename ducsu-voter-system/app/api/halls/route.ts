import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hallSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const halls = await prisma.hall.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { voters: true }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: halls
    })
  } catch (error) {
    console.error('Error fetching halls:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch halls' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = hallSchema.parse(body)
    
    const hall = await prisma.hall.create({
      data: validatedData
    })
    
    return NextResponse.json({
      success: true,
      data: hall
    })
  } catch (error) {
    console.error('Error creating hall:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create hall' },
      { status: 500 }
    )
  }
}
