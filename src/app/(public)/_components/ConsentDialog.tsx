'use client'

import { RegisterConsent } from '@prisma/client'
import router from 'next/router'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { api } from '@/lib'
import { APP_ROUTES } from '@/routes/paths'
import { RegisterUserType } from '@/validations/validations'

interface ConsentDialogProps {
  consent: RegisterConsent
  pendingLoginData: Pick<RegisterUserType, 'username' | 'password'> | null
  onClose: () => void
}

export function ConsentDialog({
  consent,
  pendingLoginData,
  onClose,
}: ConsentDialogProps) {
  const processedText = consent.consent_text.replace(/\\n\\n/g, '\n\n')

  const handleAcceptConsent = async () => {
    if (pendingLoginData) {
      const res = await api.patch(
        '/auth/update-consent',
        JSON.stringify({
          username: pendingLoginData.username,
          password: pendingLoginData.password,
          version: consent.version,
        }),
      )

      if (!res.data) {
        toast.error('Erro ao concordar o termo de consentimento')
        return
      }

      router.push(APP_ROUTES.private.schedule)
    } else {
      signIn('google', {
        callbackUrl: APP_ROUTES.private.schedule,
      })
    }
  }

  return (
    <AlertDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{consent.consent_title}</AlertDialogTitle>
          <AlertDialogDescription>
            Por favor, leia e concorde com o termo para continuar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          {processedText.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleAcceptConsent}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
