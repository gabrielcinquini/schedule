'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
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
import { api } from '@/lib/api'
import { APP_ROUTES } from '@/routes/paths'
import { formatName, formatUsername } from '@/utils/utils'
import { registerUserFormSchema } from '@/validations/validations'

export const RegisterForm = () => {
  const methods = useForm<z.infer<typeof registerUserFormSchema>>({
    resolver: zodResolver(registerUserFormSchema),
  })
  const router = useRouter()

  const handleRegister = methods.handleSubmit(async (data) => {
    try {
      await api.post('/auth/register', data)
      toast.success('Registrado com sucesso!')
      router.push(APP_ROUTES.public.login)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      } else if (error instanceof Error) toast.error(error.message)
      else toast.error('An error occurred')
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <FormField
          control={methods.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="jonas"
                  onChange={(e) => {
                    formatUsername(e)
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <FormField
            control={methods.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John"
                    onChange={(e) => {
                      formatName(e)
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Doe"
                    onChange={(e) => {
                      formatName(e)
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="me@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirme sua senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4">
          <Button className="w-full" type="submit">
            Registrar
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
