import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { getActiveRegisterPatientConsentTherm } from '@/services/therms'
import { registerPatientFormSchema } from '@/validations/validations'

export async function GET(req: NextRequest) {
  const user = await getUserFromSession()

  const perPage = req.nextUrl.searchParams.get('perPage')
  const currentPage = req.nextUrl.searchParams.get('currentPage')
  const search = req.nextUrl.searchParams.get('search')

  const patients = await prismaClient.patient.findMany({
    where: {
      userId: user.id,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            cpf: {
              contains: search,
            },
          },
        ],
      }),
    },
    orderBy: [
      {
        name: 'asc',
      },
    ],
    take: perPage ? Number(perPage) : undefined,
    skip: perPage ? (Number(currentPage) - 1) * Number(perPage) : undefined,
  })

  const totalPatients = await prismaClient.patient.count({
    where: {
      userId: user.id,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            cpf: {
              contains: search,
            },
          },
        ],
      }),
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

  const { fullName, cpf, convenio } = parsedBody.data

  if (cpf) {
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
  }

  const activeConsentTherm = await getActiveRegisterPatientConsentTherm()

  await prismaClient.patient.create({
    data: {
      name: fullName,
      cpf,
      convenio,
      userId: user.id,
      CPF_Consent_version: activeConsentTherm.version,
    },
  })

  return NextResponse.json(
    { message: 'Paciente cadastrado com sucesso!' },
    { status: 201 },
  )
}
