import { ScheduleStatus } from '@prisma/client'
import { addMinutes, subMinutes } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { createScheduleSchema } from '@/validations/validations'

const getBrazilianDate = (date: Date) => {
  return new Date(
    date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
  )
}

export async function GET(req: NextRequest) {
  const user = await getUserFromSession()

  const status = req.nextUrl.searchParams.getAll('status[]') as ScheduleStatus[]
  const perPage = req.nextUrl.searchParams.get('perPage')
  const currentPage = req.nextUrl.searchParams.get('currentPage')
  const search = req.nextUrl.searchParams.get('search')

  const schedules = await prismaClient.schedule.findMany({
    where: {
      userId: user.id,
      name: {
        contains: search || undefined,
      },
      status: {
        in: status,
      },
    },
    include: {
      patient: true,
    },
    orderBy: { date: status.includes('PENDING') ? 'asc' : 'desc' },
    take: Number(perPage),
    skip: (Number(currentPage) - 1) * Number(perPage),
  })

  const now = new Date()

  const schedulesWithDateInfo = schedules.map((schedule) => {
    return {
      ...schedule,
      isPast: schedule.date < now,
      isToday:
        schedule.date.getDate() === now.getDate() &&
        schedule.date.getMonth() === now.getMonth() &&
        schedule.date.getFullYear() === now.getFullYear(),
    }
  })

  const totalSchedules = await prismaClient.schedule.count({
    where: {
      userId: user.id,
      name: {
        contains: search || undefined,
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

  const { date, value, patientId, name } = parsedBody.data

  const brazilianDate = getBrazilianDate(new Date(date))

  const startDate = subMinutes(brazilianDate, 39)
  const endDate = addMinutes(brazilianDate, 39)

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

  await prismaClient.schedule.create({
    data: {
      name,
      date: brazilianDate,
      value,
      status: 'PENDING',
      userId: user.id,
      patientId,
    },
  })

  return NextResponse.json(
    { message: 'Agendamento de consulta realizado com sucesso!' },
    { status: 201 },
  )
}
