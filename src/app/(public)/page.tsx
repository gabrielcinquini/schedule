'use client'

import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { APP_ROUTES } from '@/routes/paths'

import { GoogleLoginButton } from './_components/GoogleLoginButton'
import { LoginForm } from './_components/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center max-sm:container">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold max-sm:text-xl">
            Entrar
          </CardTitle>
          <CardDescription>
            Insira o usuário e a senha abaixo para entrar
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-2">
          <LoginForm />
          <Typography variant="small">OU</Typography>
          <GoogleLoginButton />
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
