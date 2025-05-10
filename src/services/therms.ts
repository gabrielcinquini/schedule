'use server'

import { prismaClient } from '@/database/client'
import { getUserFromSession } from '@/lib'

export const getActiveRegisterPatientConsentTherm = async () => {
  return await prismaClient.cpfConsent.findFirstOrThrow({
    where: {
      isActive: true,
    },
  })
}

export const getActiveRegisterConsentTherm = async () => {
  return await prismaClient.registerConsent.findFirstOrThrow({
    where: {
      isActive: true,
    },
  })
}

export const hasUserAgreedWithLatestRegisterTherm = async (userId?: string) => {
  if (!userId) {
    const { id: userIdFromSession } = await getUserFromSession()
    userId = userIdFromSession
  }

  const latestTherm = await getActiveRegisterConsentTherm()

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { Register_Consent_version: true },
  })

  return user?.Register_Consent_version === latestTherm.version
}
