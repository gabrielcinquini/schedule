import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { getActiveRegisterPatientConsentTherm } from '@/services/therms'
import { registerOrUpdatePatientFormSchema } from '@/validations'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const body = await req.json()
  const parsedBody =
    await registerOrUpdatePatientFormSchema.safeParseAsync(body)

  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error })
  }

  const user = await getUserFromSession()

  const { fullName, cpf, phone, convenio } = parsedBody.data

  const activeConsentTherm = await getActiveRegisterPatientConsentTherm()

  await prismaClient.patient.update({
    where: {
      id,
    },
    data: {
      name: fullName,
      cpf,
      phone,
      convenio,
      userId: user.id,
      CPF_Consent_version: activeConsentTherm.version,
    },
  })

  return NextResponse.json(
    { message: 'Paciente atualizado com sucesso!' },
    { status: 201 },
  )
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
