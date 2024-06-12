import { ScheduleStatus } from '@prisma/client'
import { addMinutes, subMinutes } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { createScheduleSchema } from '@/validations/validations'

export async function GET(req: NextRequest) {
  const user = await getUserFromSession()
  const url = new URL(req.url)
  const status = url.searchParams.get('status') as ScheduleStatus

  const schedules = await prismaClient.schedule.findMany({
    where: {
      AND: [
        {
          userId: user.id,
        },
        {
          status,
        },
      ],
    },
    include: {
      patient: true,
    },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(schedules)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsedBody = createScheduleSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error }, { status: 404 })
  }

  const user = await getUserFromSession()

  const { date, value, patientId, name, lastName } = parsedBody.data

  const startDate = subMinutes(date, 39)
  const endDate = addMinutes(date, 39)

  const existingSchedule = await prismaClient.schedule.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
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
      lastName,
      date,
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
