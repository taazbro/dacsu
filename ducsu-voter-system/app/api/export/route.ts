import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { format = 'json', hallIds, voterIds } = await request.json()
    
    let whereClause: any = {}
    if (hallIds?.length > 0) {
      whereClause.hallId = { in: hallIds }
    }
    if (voterIds?.length > 0) {
      whereClause.id = { in: voterIds }
    }
    
    const voters = await prisma.voter.findMany({
      where: whereClause,
      include: { hall: true }
    })
    
    // Log the export action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'EXPORT_DATA',
        details: {
          format,
          count: voters.length,
          hallIds,
          voterIds
        }
      }
    })
    
    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(
        voters.map(v => ({
          ID: v.id,
          Name: v.name,
          'Name (Bengali)': v.nameBn,
          Hall: v.hall.name,
          Department: v.department,
          Session: v.session,
          Year: v.year,
          Phone: v.phone,
          Email: v.email,
          Verified: v.verified ? 'Yes' : 'No'
        }))
      )
      
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Voters')
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=voters_export.xlsx'
        }
      })
    }
    
    if (format === 'csv') {
      const csv = [
        ['ID', 'Name', 'Name (Bengali)', 'Hall', 'Department', 'Session', 'Year', 'Phone', 'Email', 'Verified'],
        ...voters.map(v => [
          v.id,
          v.name,
          v.nameBn || '',
          v.hall.name,
          v.department || '',
          v.session || '',
          v.year || '',
          v.phone || '',
          v.email || '',
          v.verified ? 'Yes' : 'No'
        ])
      ].map(row => row.join(',')).join('\n')
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=voters_export.csv'
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: voters
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
