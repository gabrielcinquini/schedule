import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params

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
