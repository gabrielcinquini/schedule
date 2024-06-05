'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import axios, { AxiosError } from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormSchemaType,
} from '@/validations/validations'

export default function page() {
  const form = useForm<ForgotPasswordFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  const [visibility, setVisibility] = useState(false)

  const { user } = useMe()

  if (!user) return <p>Loading...</p>

  const handleChangeVisibility = () => {
    setVisibility((currentState) => !currentState)
  }

  const handleChangePassword = async (
    data: Omit<ForgotPasswordFormSchemaType, 'confirmPassword'>,
  ) => {
    try {
      data.id = user.id
      const res = await axios.post('/api/forgotPassword/', data)
      toast.success('Senha alterada com sucesso!')
      form.reset()
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Ocorreu algum erro inesperado')
      }
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Olá {user.name}</h1>
      <Form {...form}>
        <form
          className="mt-8 flex flex-col items-center gap-2"
          onSubmit={form.handleSubmit(handleChangePassword)}
        >
          <div className="relative">
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type={visibility ? 'text' : 'password'}
                      placeholder="Nova Senha"
                      onChange={field.onChange}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={handleChangeVisibility}
              className="absolute right-2 top-2"
            >
              {visibility ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirmar Senha"
                    onChange={field.onChange}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col gap-8">
            <Button
              type="submit"
              className="disabled:cursor-not-allowed disabled:opacity-50"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              Enviar
            </Button>
            <Button asChild variant={'secondary'}>
              <Link href="/home" className="flex w-full gap-2">
                <ArrowLeftIcon />
                Voltar
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
