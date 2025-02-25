import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()

  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401 }
    )
  }

  // Handle pro-only features
  if (session.user.subscription !== 'pro') {
    return new NextResponse(
      JSON.stringify({ error: 'Pro subscription required' }),
      { status: 403 }
    )
  }

  return NextResponse.json({ data: 'Protected data' })
}
