import { hashSync } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getActiveRegisterConsentTherm } from '@/services/therms'
import { registerUserFormSchema } from '@/validations/validations'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsedBody = registerUserFormSchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error)
  }

  const { username, password, fullname, email } = parsedBody.data

  const userExists = await prismaClient.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  })

  if (userExists) {
    return NextResponse.json(
      { message: 'Usuário já cadastrado' },
      { status: 401 },
    )
  }

  const activeRegisterConsent = await getActiveRegisterConsentTherm()

  await prismaClient.user.create({
    data: {
      username,
      email,
      password: hashSync(password, 10),
      name: fullname,
      Register_Consent_version: activeRegisterConsent.version,
    },
  })

  return NextResponse.json({ message: 'Usuário registrado com sucesso!' })
}
