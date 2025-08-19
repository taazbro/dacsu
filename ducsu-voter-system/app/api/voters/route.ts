import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hall = searchParams.get('hall')
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const lang = searchParams.get('lang') || 'bn'
    
    // Load appropriate database based on language
    const dbFile = lang === 'en' ? 'voter_database_en.json' : 'voter_database_bn.json'
    const dataPath = path.join(process.cwd(), 'public', 'data', dbFile)
    
    let database
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      database = JSON.parse(data)
    } catch (error) {
      // Fallback to mock data if file doesn't exist
      database = { voters: [] }
    }
    
    let voters = database.voters || []
    
    // Filter by hall if specified
    if (hall) {
      voters = voters.filter((v: any) => v.hall.includes(hall))
    }
    
    // Search by query
    if (query) {
      const searchQuery = query.toLowerCase()
      voters = voters.filter((v: any) => 
        v.name.toLowerCase().includes(searchQuery) ||
        v.id.toLowerCase().includes(searchQuery) ||
        (v.department && v.department.toLowerCase().includes(searchQuery))
      )
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVoters = voters.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: {
        voters: paginatedVoters,
        total: voters.length,
        page,
        limit,
        totalPages: Math.ceil(voters.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching voters:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch voters' },
      { status: 500 }
    )
  }
}