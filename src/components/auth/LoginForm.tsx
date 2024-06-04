'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { LoginUserType, loginUserFormSchema } from '@/validations/validations'
import Loader from '../Loader'

export const LoginForm = () => {
  const form = useForm<LoginUserType>({
    resolver: zodResolver(loginUserFormSchema),
  })
  const router = useRouter()

  const handleLogin = form.handleSubmit(async (data) => {
    const res = await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    })

    if (res?.error) return toast.error(res.error)

    router.push(APP_ROUTES.private.schedule)
  })

  return (
    <FormProvider {...form}>
      <form className="flex gap-4 flex-col w-full" onSubmit={handleLogin}>
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
                <Input type="password" placeholder="Insira a senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader />}
          Entrar
        </Button>
      </form>
    </FormProvider>
  )
}
