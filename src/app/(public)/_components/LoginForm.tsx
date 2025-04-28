'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterConsent } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { APP_ROUTES } from '@/routes/paths'
import { getActiveRegisterConsentTherm } from '@/services/therms'
import { loginUserFormSchema, LoginUserType } from '@/validations/validations'

import Loader from '../../../components/Loader'
import { ConsentDialog } from './ConsentDialog'

export const LoginForm = () => {
  const form = useForm<LoginUserType>({
    resolver: zodResolver(loginUserFormSchema),
  })
  const router = useRouter()
  const [activeConsent, setActiveConsent] = useState<RegisterConsent | null>(
    null,
  )
  const [pendingLoginData, setPendingLoginData] =
    useState<LoginUserType | null>(null)

  const handleLogin = form.handleSubmit(async (data) => {
    const res = await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    })

    if (res?.error) {
      if (res.error === 'CONSENT_REQUIRED') {
        const activeConsentTerm = await getActiveRegisterConsentTherm()
        setActiveConsent(activeConsentTerm)
        setPendingLoginData(data)
        return
      }
      return toast.error(res.error)
    }

    router.push(APP_ROUTES.private.schedule)
  })

  return (
    <>
      <FormProvider {...form}>
        <form className="flex w-full flex-col gap-4" onSubmit={handleLogin}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input placeholder="Insira o usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Insira a senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full max-sm:text-sm"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader />}
            Entrar
          </Button>
        </form>
      </FormProvider>

      {activeConsent && (
        <ConsentDialog
          consent={activeConsent}
          pendingLoginData={pendingLoginData}
          onClose={() => setActiveConsent(null)}
        />
      )}
    </>
  )
}
