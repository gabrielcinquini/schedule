import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compareSync } from 'bcryptjs'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { prismaClient } from '@/database/client'
import { APP_ROUTES } from '@/routes/paths'

export const authConfigs: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        },
      },
    }),
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prismaClient.user.findFirst({
          where: {
            username: credentials?.username,
          },
        })

        if (!credentials?.password) {
          throw new Error('Senha não informada')
        }

        if (!user || !compareSync(credentials.password, user.password!)) {
          throw new Error('Credenciais não encontradas')
        }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user, account }) {
      if (account && user) token.user = user

      return token
    },

    session({ session }) {
      return session
    },
  },
  pages: {
    signIn: APP_ROUTES.public.login,
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const getServerSessionApp = () => getServerSession(authConfigs)
