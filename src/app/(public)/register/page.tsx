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
import ModeToggle from '@/components/ui/mode-toggle'
import { Typography } from '@/components/ui/typography'
import { APP_ROUTES } from '@/routes/paths'

import { RegisterForm } from '../_components/RegisterForm'

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center max-sm:container">
      <div className="absolute top-12 max-sm:hidden">
        <ModeToggle />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold max-sm:text-xl">
              Registrar
            </CardTitle>
            <CardDescription>
              Ao registrar, você concorda com os nossos{' '}
              <Link
                className="inline-block text-sm underline"
                href={APP_ROUTES.therms.termsOfService}
              >
                Termos de Serviço
              </Link>
              &nbsp;e&nbsp;
              <Link
                className="inline-block text-sm underline"
                href={APP_ROUTES.therms.privacyPolicy}
              >
                Política de Privacidade
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>

          <CardFooter className="flex-col">
            <Typography variant="small">Já possui uma conta? </Typography>
            <Link
              className="inline-block text-sm underline"
              href={APP_ROUTES.public.login}
            >
              Entrar
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
