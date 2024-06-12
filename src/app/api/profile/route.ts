import { compareSync, hashSync } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'
import { updateProfileFormSchema } from '@/validations/validations'

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const user = await getUserFromSession()
  const parsedBody = updateProfileFormSchema.safeParse(body)

  if (!parsedBody.success)
    return NextResponse.json({ message: 'Validation Error' }, { status: 404 })

  const { newPassword, confirmPassword } = parsedBody.data
  if (!newPassword || !confirmPassword)
    return NextResponse.json(
      { message: 'A senha deve ser inserida' },
      { status: 404 },
    )

  if (!user.password)
    return NextResponse.json(
      {
        message:
          'Você não tem permissão para alterar a senha, possivelmente você se cadastrou com o Google',
      },
      { status: 404 },
    )

  if (compareSync(newPassword, user.password))
    return NextResponse.json(
      {
        message: 'A senha não pode ser a mesma já cadastrada',
      },
      { status: 404 },
    )

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashSync(newPassword, 10),
    },
  })

  return NextResponse.json({ message: 'Perfil alterado com sucesso' })
}
