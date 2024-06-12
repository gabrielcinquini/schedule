import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { registerPatientFormSchema } from '@/validations/validations'

export async function GET() {
  const user = await getUserFromSession()

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
  })

  return NextResponse.json(patients)
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
