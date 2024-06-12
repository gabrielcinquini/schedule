import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params

  const user = await getUserFromSession()

  const hasPermission = await prismaClient.patient.findFirst({
    where: {
      userId: user.id,
    },
  })

  if (!hasPermission) {
    return NextResponse.json(
      { message: 'Você não tem permissão para deletar esse paciente' },
      { status: 403 },
    )
  }

  const deletedPatient = await prismaClient.patient.delete({
    where: { id },
  })

  if (!deletedPatient) {
    return NextResponse.json(
      { message: 'Não foi possível deletar esse paciente' },
      { status: 400 },
    )
  }

  return NextResponse.json(
    { message: 'Paciente deletado com sucesso!' },
    { status: 200 },
  )
}
