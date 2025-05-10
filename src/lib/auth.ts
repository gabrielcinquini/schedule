import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compareSync } from 'bcryptjs'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { prismaClient } from '@/database/client'
import { APP_ROUTES } from '@/routes/paths'
import {
  getActiveRegisterConsentTherm,
  hasUserAgreedWithLatestRegisterTherm,
} from '@/services/therms'

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
        const user = await prismaClient.user.findUnique({
          where: {
            username: credentials?.username,
          },
          include: {
            Register_Consent: true,
          },
        })

        if (!credentials?.password) {
          throw new Error('Senha não informada')
        }

        if (!user || !compareSync(credentials.password, user.password!)) {
          throw new Error('Credenciais não encontradas')
        }

        const hasUserAgreedWithActiveRegisterTherm =
          await hasUserAgreedWithLatestRegisterTherm(user.id)

        if (!hasUserAgreedWithActiveRegisterTherm) {
          throw new Error('CONSENT_REQUIRED')
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
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const activeConsent = await getActiveRegisterConsentTherm()

        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          const newUser = await prismaClient.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image,
              Register_Consent_version: activeConsent.version,
            },
          })

          await prismaClient.account.create({
            data: {
              userId: newUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          })
        } else {
          await prismaClient.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              Register_Consent_version: activeConsent.version,
            },
          })
        }
      }
      return true
    },
    jwt({ token, user, account }) {
      if (account && user) token.user = user

      return token
    },

    session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
        }
      }
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
