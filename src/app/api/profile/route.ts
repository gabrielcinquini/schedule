import { compareSync, hashSync } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { prismaClient } from '@/database/client'
import { updateProfileFormSchema } from '@/validations/validations'

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const session = await getServerSession()
  const parsedBody = updateProfileFormSchema.safeParse(body)

  if (!parsedBody.success)
    return NextResponse.json({ message: 'Validation Error' }, { status: 404 })

  const { newPassword, confirmPassword } = parsedBody.data
  if (!newPassword || !confirmPassword)
    return NextResponse.json(
      { message: 'A senha deve ser inserida' },
      { status: 404 },
    )

  const userFromEmail = await prismaClient.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    select: {
      id: true,
      password: true,
    },
  })

  if (!userFromEmail)
    return NextResponse.json(
      { message: 'Usuário não encontrado' },
      { status: 404 },
    )

  if (
    userFromEmail.password &&
    compareSync(newPassword, userFromEmail.password)
  )
    return NextResponse.json(
      {
        message: 'A senha não pode ser a mesma já cadastrada',
      },
      { status: 404 },
    )

  await prismaClient.user.update({
    where: {
      id: userFromEmail.id,
    },
    data: {
      password: hashSync(newPassword, 10),
    },
  })

  return NextResponse.json({ message: 'Perfil alterado com sucesso' })
}
