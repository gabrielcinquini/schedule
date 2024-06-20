import { NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'

export async function GET() {
  const therm = await prismaClient.cpfConsent.findFirstOrThrow({
    where: {
      isActive: true,
    },
  })

  return NextResponse.json(therm)
}
