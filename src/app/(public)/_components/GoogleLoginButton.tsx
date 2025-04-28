'use client'

import { RegisterConsent } from '@prisma/client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/routes/paths'
import { getActiveRegisterConsentTherm } from '@/services/therms'

import { ConsentDialog } from './ConsentDialog'

export function GoogleLoginButton() {
  const [activeConsent, setActiveConsent] = useState<RegisterConsent | null>(
    null,
  )

  const handleGoogleLogin = async () => {
    try {
      const activeConsentTerm = await getActiveRegisterConsentTherm()
      setActiveConsent(activeConsentTerm)
    } catch (error) {
      signIn('google', {
        callbackUrl: APP_ROUTES.private.schedule,
      })
    }
  }

  return (
    <>
      <Button
        className="w-full max-sm:text-sm"
        variant="secondary"
        onClick={handleGoogleLogin}
      >
        Entrar com Google
      </Button>

      {activeConsent && (
        <ConsentDialog
          consent={activeConsent}
          pendingLoginData={null}
          onClose={() => setActiveConsent(null)}
        />
      )}
    </>
  )
}
