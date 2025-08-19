import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ExcelJS from 'exceljs'

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
    if (session.user?.id) {
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
    }
    
    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Voters')
      
      // Add headers
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Name (Bengali)', key: 'nameBn', width: 30 },
        { header: 'Hall', key: 'hall', width: 25 },
        { header: 'Department', key: 'department', width: 20 },
        { header: 'Session', key: 'session', width: 12 },
        { header: 'Year', key: 'year', width: 10 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Verified', key: 'verified', width: 10 }
      ]
      
      // Add data
      voters.forEach(v => {
        worksheet.addRow({
          id: v.id,
          name: v.name,
          nameBn: v.nameBn,
          hall: v.hall.name,
          department: v.department,
          session: v.session,
          year: v.year,
          phone: v.phone,
          email: v.email,
          verified: v.verified ? 'Yes' : 'No'
        })
      })
      
      // Style the header row
      worksheet.getRow(1).font = { bold: true }
      
      const buffer = await workbook.xlsx.writeBuffer()
      
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
