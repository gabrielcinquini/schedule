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

  const { name, lastName, convenio } = parsedBody.data

  const patients = await prismaClient.patient.findMany({
    where: {
      name,
      lastName,
    },
  })

  const patientRegistered = patients.find(
    (patient) => patient.userId === user.id,
  )

  if (patientRegistered) {
    return NextResponse.json(
      { message: 'Paciente já cadastrado' },
      { status: 400 },
    )
  }

  await prismaClient.patient.create({
    data: {
      name,
      lastName,
      convenio,
      userId: user.id,
    },
  })

  return NextResponse.json(
    { message: 'Paciente cadastrado com sucesso!' },
    { status: 201 },
  )
}
