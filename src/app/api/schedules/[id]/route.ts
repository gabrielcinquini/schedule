import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { updateScheduleSchema } from '@/validations/validations'

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params

  const user = await getUserFromSession()

  const hasPermission = await prismaClient.schedule.findFirst({
    where: {
      userId: user.id,
    },
  })

  if (!hasPermission) {
    return NextResponse.json(
      { message: 'Você não tem permissão para deletar esse agendamento' },
      { status: 403 },
    )
  }

  const orderDeleted = await prismaClient.schedule.delete({
    where: { id },
  })

  if (!orderDeleted) {
    return NextResponse.json(
      { message: 'Não foi possível deletar essa consulta' },
      { status: 400 },
    )
  }

  return NextResponse.json(
    { message: 'Consulta deletada com sucesso!' },
    { status: 200 },
  )
}

export async function PATCH(req: NextRequest, { params }: any) {
  const { id: scheduleId } = params

  const body = await req.json()
  const parsedBody = updateScheduleSchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error }, { status: 404 })
  }

  const { status, date } = parsedBody.data

  if (status === 'COMPLETED' && date > new Date())
    return NextResponse.json(
      { message: 'Não é possível você já ter realizado essa consulta' },
      { status: 401 },
    )

  if (status === 'COMPLETED' && date < new Date()) {
    const currentPatientSchedule = await prismaClient.schedule.findFirst({
      where: {
        id: scheduleId,
      },
      select: {
        patientId: true,
      },
    })

    await prismaClient.patient.update({
      where: {
        id: currentPatientSchedule?.patientId,
      },
      data: {
        lastConsult: date,
      },
    })
  }

  await prismaClient.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      status,
    },
  })

  return NextResponse.json({ message: 'Movido para serviços com sucesso' })
}
