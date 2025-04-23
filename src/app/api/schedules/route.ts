import { ScheduleStatus } from '@prisma/client'
import {
  addMinutes,
  addMonths,
  addWeeks,
  differenceInMonths,
  differenceInWeeks,
  subMinutes,
} from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { zonedDate } from '@/utils/utils'
import {
  createScheduleSchema,
  ScheduleFrequencyEnum,
} from '@/validations/validations'

export async function GET(req: NextRequest) {
  const user = await getUserFromSession()

  const status = req.nextUrl.searchParams.getAll('status[]') as ScheduleStatus[]
  const perPage = req.nextUrl.searchParams.get('perPage')
  const currentPage = req.nextUrl.searchParams.get('currentPage')
  const search = req.nextUrl.searchParams.get('search')

  const schedules = await prismaClient.schedule.findMany({
    where: {
      userId: user.id,
      patient: {
        name: {
          contains: search || undefined,
        },
      },
      status: {
        in: status,
      },
    },
    include: {
      patient: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { date: status.includes('PENDING') ? 'asc' : 'desc' },
    take: Number(perPage),
    skip: (Number(currentPage) - 1) * Number(perPage),
  })

  const now = zonedDate(new Date())

  const schedulesWithDateInfo = schedules.map((schedule) => {
    const scheduleDate = zonedDate(schedule.date)
    return {
      ...schedule,
      isPast: scheduleDate < now,
      isToday:
        scheduleDate.getDate() === now.getDate() &&
        scheduleDate.getMonth() === now.getMonth() &&
        scheduleDate.getFullYear() === now.getFullYear(),
    }
  })

  const totalSchedules = await prismaClient.schedule.count({
    where: {
      userId: user.id,
      patient: {
        name: {
          contains: search || undefined,
        },
      },
      status: {
        in: status,
      },
    },
  })

  return NextResponse.json({
    schedules: schedulesWithDateInfo,
    totalPages: Math.ceil(totalSchedules / Number(perPage)),
    totalCount: totalSchedules,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsedBody = createScheduleSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error }, { status: 404 })
  }

  const user = await getUserFromSession()

  const { date, value, patientId, frequency } = parsedBody.data

  const startDate = subMinutes(date, 39)
  const endDate = addMinutes(date, 39)

  const existingSchedule = await prismaClient.schedule.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: 'PENDING',
    },
  })

  if (existingSchedule) {
    return NextResponse.json(
      { message: 'Já existe um agendamento para este horário.' },
      { status: 400 },
    )
  }

  const maxDate = addMonths(date, 6)
  const baseSchedule = {
    value,
    status: ScheduleStatus.PENDING,
    userId: user.id,
    patientId,
  }

  type ScheduleData = typeof baseSchedule & { date: Date }

  const schedules: ScheduleData[] = (() => {
    if (frequency === ScheduleFrequencyEnum.NONE) {
      return [{ ...baseSchedule, date }]
    }

    if (frequency === ScheduleFrequencyEnum.WEEKLY) {
      const weeks = differenceInWeeks(maxDate, date)
      return Array.from({ length: weeks + 1 }, (_, index) => ({
        ...baseSchedule,
        date: addWeeks(date, index),
      }))
    }

    if (frequency === ScheduleFrequencyEnum.MONTHLY) {
      const months = differenceInMonths(maxDate, date)
      return Array.from({ length: months + 1 }, (_, index) => ({
        ...baseSchedule,
        date: addMonths(date, index),
      }))
    }

    return []
  })()

  await prismaClient.schedule.createMany({
    data: schedules,
  })

  return NextResponse.json(
    { message: 'Agendamento de consulta realizado com sucesso!' },
    { status: 201 },
  )
}
