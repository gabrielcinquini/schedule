import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { registerPatientFormSchema } from '@/validations/validations'

export async function GET(req: NextRequest) {
  const user = await getUserFromSession()

  const perPage = req.nextUrl.searchParams.get('perPage')
  const currentPage = req.nextUrl.searchParams.get('currentPage')

  const patients = await prismaClient.patient.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [
      {
        name: 'asc',
      },
      {
        lastName: 'asc',
      },
    ],
    take: perPage ? Number(perPage) : undefined,
    skip: perPage ? (Number(currentPage) - 1) * Number(perPage) : undefined,
  })

  const totalPatients = await prismaClient.patient.count({
    where: {
      userId: user.id,
    },
  })

  return NextResponse.json({
    patients,
    totalPages: Math.ceil(totalPatients / Number(perPage)),
    totalCount: totalPatients,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsedBody = registerPatientFormSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error })
  }

  const user = await getUserFromSession()

  const { name, lastName, cpf, convenio } = parsedBody.data

  const patientRegistered = await prismaClient.patient.findFirst({
    where: {
      userId: user.id,
      cpf,
    },
  })

  if (patientRegistered) {
    return NextResponse.json(
      { message: 'Paciente já cadastrado' },
      { status: 400 },
    )
  }

  const activeCpfConsent = await prismaClient.cpfConsent.findFirstOrThrow({
    where: {
      isActive: true,
    },
  })

  await prismaClient.patient.create({
    data: {
      name,
      lastName,
      cpf,
      convenio,
      userId: user.id,
      CPF_Consent_version: activeCpfConsent.version,
    },
  })

  return NextResponse.json(
    { message: 'Paciente cadastrado com sucesso!' },
    { status: 201 },
  )
}
