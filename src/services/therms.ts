import { prismaClient } from '@/database/client'

export const getActiveConsentTherm = async () => {
  return await prismaClient.cpfConsent.findFirstOrThrow({
    where: {
      isActive: true,
    },
  })
}
