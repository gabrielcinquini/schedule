'use server'

import { endOfDay, startOfDay } from 'date-fns'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'

export const getAvailableDaysForSchedule = async () => {
  const user = await getUserFromSession()

  const schedules = await prismaClient.schedule.findMany({
    where: {
      userId: user.id,
      status: 'PENDING',
    },
  })

  return { schedules }
}

export const getSchedulesByDate = async (date: Date) => {
  const user = await getUserFromSession()

  const schedules = await prismaClient.schedule.findMany({
    where: {
      userId: user.id,
      status: 'PENDING',
      date: {
        gte: startOfDay(new Date(date)),
        lte: endOfDay(new Date(date)),
      },
    },
    include: {
      patient: true,
    },
  })

  return { schedules }
}
