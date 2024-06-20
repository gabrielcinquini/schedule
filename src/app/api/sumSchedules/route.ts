import { NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'

export async function GET() {
  const user = await getUserFromSession()

  const [
    aggregatePendingSchedules,
    aggregateCompletedSchedules,
    aggregateCanceledSchedules,
  ] = await prismaClient.$transaction([
    prismaClient.schedule.aggregate({
      _sum: {
        value: true,
      },
      where: {
        userId: user.id,
        status: 'PENDING',
      },
    }),
    prismaClient.schedule.aggregate({
      _sum: {
        value: true,
      },
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
    }),
    prismaClient.schedule.aggregate({
      _sum: {
        value: true,
      },
      where: {
        userId: user.id,
        status: 'CANCELED',
      },
    }),
  ])

  return NextResponse.json({
    pending: aggregatePendingSchedules._sum.value,
    completed: aggregateCompletedSchedules._sum.value,
    canceled: aggregateCanceledSchedules._sum.value,
  })
}
