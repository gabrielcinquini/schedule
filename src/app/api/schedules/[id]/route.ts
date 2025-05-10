import { getHours, getMinutes } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { updateScheduleSchema } from '@/validations/validations'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const deleteAllFuture =
    req.nextUrl.searchParams.get('deleteAllFuture') === 'true'

  const user = await getUserFromSession()

  const schedule = await prismaClient.schedule.findUnique({
    where: { id },
  })

  if (!schedule) {
    return NextResponse.json(
      { message: 'Agendamento não encontrado' },
      { status: 404 },
    )
  }

  if (schedule.userId !== user.id) {
    return NextResponse.json(
      { message: 'Você não tem permissão para deletar esse agendamento' },
      { status: 403 },
    )
  }

  if (deleteAllFuture) {
    const futureSchedules = await prismaClient.schedule.findMany({
      where: {
        patientId: schedule.patientId,
        date: {
          gt: schedule.date,
        },
      },
    })

    const matchingSchedules = futureSchedules.filter((s) => {
      return (
        getHours(schedule.date) === getHours(s.date) &&
        getMinutes(schedule.date) === getMinutes(s.date)
      )
    })

    await prismaClient.schedule.deleteMany({
      where: {
        OR: [
          { id: schedule.id },
          {
            id: {
              in: matchingSchedules.map((s) => s.id),
            },
          },
        ],
      },
    })

    return NextResponse.json(
      { message: 'Consultas deletadas com sucesso!' },
      { status: 200 },
    )
  }

  await prismaClient.schedule.delete({
    where: { id },
  })

  return NextResponse.json(
    { message: 'Consulta deletada com sucesso!' },
    { status: 200 },
  )
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  const body = await req.json()

  const parsedBody = updateScheduleSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error }, { status: 404 })
  }

  const { status, date } = parsedBody.data

  const user = await getUserFromSession()

  const hasPermission = await prismaClient.schedule.findFirst({
    where: {
      userId: user.id,
    },
  })

  if (!hasPermission) {
    return NextResponse.json(
      { message: 'Você não tem permissão para atualizar esse agendamento' },
      { status: 403 },
    )
  }

  if (status === 'COMPLETED' && date > new Date())
    return NextResponse.json(
      { message: 'Não é possível você já ter realizado essa consulta' },
      { status: 401 },
    )

  const orderUpdated = await prismaClient.schedule.update({
    where: { id },
    data: parsedBody.data,
  })

  if (!orderUpdated) {
    return NextResponse.json(
      { message: 'Não foi possível atualizar essa consulta' },
      { status: 400 },
    )
  }

  return NextResponse.json(
    { message: 'Consulta atualizada com sucesso!' },
    { status: 200 },
  )
}
