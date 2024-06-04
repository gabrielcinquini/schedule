'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'

import { LoginForm } from '@/components/auth/LoginForm'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ModeToggle from '@/components/ui/mode-toggle'
import { Typography } from '@/components/ui/typography'
import { APP_ROUTES } from '@/routes/paths'

export default function LoginPage() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="absolute top-12">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>
            Insira o usuário e a senha abaixo para entrar
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center flex-col gap-2">
          <LoginForm />
          <Typography variant="small">OU</Typography>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() =>
              signIn('google', {
                callbackUrl: APP_ROUTES.private.schedule,
              })
            }
          >
            Entrar com Google
          </Button>
        </CardContent>

        <CardFooter className="flex-col">
          <Typography variant="small">Não possui uma conta?</Typography>
          <Link
            className="inline-block text-sm underline"
            href={APP_ROUTES.public.register}
          >
            Criar uma conta
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}