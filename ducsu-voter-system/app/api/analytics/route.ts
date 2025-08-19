import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get various analytics
    const [
      totalVoters,
      totalHalls,
      verifiedVoters,
      recentLogins,
      votersByHall,
      votersByDepartment
    ] = await Promise.all([
      prisma.voter.count(),
      prisma.hall.count(),
      prisma.voter.count({ where: { verified: true } }),
      prisma.auditLog.count({
        where: {
          action: 'LOGIN',
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      }),
      prisma.hall.findMany({
        select: {
          name: true,
          _count: {
            select: { voters: true }
          }
        }
      }),
      prisma.voter.groupBy({
        by: ['department'],
        _count: true,
        where: {
          department: { not: null }
        },
        orderBy: {
          _count: {
            department: 'desc'
          }
        },
        take: 10
      })
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        totalVoters,
        totalHalls,
        verifiedVoters,
        verificationRate: totalVoters > 0 ? (verifiedVoters / totalVoters * 100).toFixed(2) : 0,
        recentLogins,
        votersByHall: votersByHall.map(h => ({
          name: h.name,
          count: h._count.voters
        })),
        topDepartments: votersByDepartment.map(d => ({
          department: d.department,
          count: d._count
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
