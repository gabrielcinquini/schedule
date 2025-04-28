import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { registerThermLogin } from '@/validations/validations'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()

    const parsedBody = registerThermLogin.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json(parsedBody.error)
    }

    const { username, password, version } = parsedBody.data

    if (!username || !password || !version) {
      return NextResponse.json(
        { message: 'Dados incompletos' },
        { status: 400 },
      )
    }

    await prismaClient.user.update({
      where: {
        username,
      },
      data: {
        Register_Consent_version: version,
      },
    })

    return NextResponse.json(
      { message: 'Termo de consentimento atualizado com sucesso' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao concordar com o termo de consentimento' },
      { status: 500 },
    )
  }
}
