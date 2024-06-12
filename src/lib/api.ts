import axios from 'axios'
import { getServerSession } from 'next-auth'

import { prismaClient } from '@/database/client'

export const api = axios.create({
  baseURL: '/api',
})

export const getUserFromSession = async (password?: boolean) => {
  const session = await getServerSession()

  const userFromEmail = await prismaClient.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    select: {
      id: true,
      password,
    },
  })

  if (!userFromEmail) {
    throw new Error('Usuário não encontrado')
  }

  return userFromEmail
}
