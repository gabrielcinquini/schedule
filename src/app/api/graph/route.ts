import { ScheduleStatus } from '@prisma/client'
import { isSameYear } from 'date-fns'
import { NextRequest } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'

export async function GET(req: NextRequest) {
  const user = await getUserFromSession()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const patientId = searchParams.get('patientId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const sessionStatus = searchParams.getAll(
    'sessionStatus[]',
  ) as ScheduleStatus[]

  const start = startDate ? new Date(startDate) : undefined
  const end = endDate ? new Date(endDate) : undefined

  if (start) start.setHours(0, 0, 0, 0)
  if (end) end.setHours(23, 59, 59, 999)

  const schedules = await prismaClient.schedule.groupBy({
    by: ['date'],
    where: {
      userId: user.id,
      ...(start && end
        ? {
            date: {
              gte: start,
              lte: end,
            },
          }
        : {}),
      ...(patientId && patientId !== 'all' ? { patientId } : {}),
      ...(sessionStatus &&
        sessionStatus.length > 0 && { status: { in: sessionStatus } }),
    },
    _sum: {
      value: true,
    },
    _count: {
      id: true,
    },
  })

  const monthlyData = schedules.reduce(
    (acc, schedule) => {
      const date = new Date(schedule.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!acc[monthKey]) {
        acc[monthKey] = {
          date,
          totalValue: 0,
          totalSessions: 0,
        }
      }

      acc[monthKey].totalValue += schedule._sum.value || 0
      acc[monthKey].totalSessions += schedule._count.id

      return acc
    },
    {} as Record<
      string,
      { date: Date; totalValue: number; totalSessions: number }
    >,
  )

  const formattedData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b)) // garante ordem cronológica
    .map(([, data]) => {
      const shouldShowYear =
        startDate &&
        endDate &&
        !isSameYear(new Date(startDate), new Date(endDate))

      return {
        month: data.date.toLocaleString('pt-BR', {
          month: 'short',
          ...(shouldShowYear && { year: 'numeric' }),
        }),
        totalValue: data.totalValue,
        totalSessions: data.totalSessions,
      }
    })

  return Response.json(formattedData)
}
